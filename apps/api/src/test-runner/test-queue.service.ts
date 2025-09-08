// src/test-runner/enhanced-test-queue.service.ts
import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bullmq';
import { RedisService } from "src/redis/redis.service";
import { TestSuiteRunStatus, TestCaseRunStatus, TestStepStatus } from "generated/prisma";
import { PrismaService } from "src/prisma/prisma.service";

export interface TestSuiteQueueData {
  testSuiteRunId: string;
  testSuiteId: string;
  environment: string;
  browser: string;
  version?: string;
}

export interface TestCaseQueueData {
  testCaseRunId: string;
  testCaseId: string;
  testSuiteRunId: string;
  testSuiteId: string;
  setupCacheKey?: string;
  environment: string;
  browser: string;
  retryAttempt?: number;
  code?: string;
}

export interface SetupQueueData {
  testSuiteId: string;
  testSuiteRunId: string;
  environment: string;
  browser: string;
  cacheKey: string;
}

@Injectable()
export class TestQueueService {
  private readonly logger = new Logger(TestQueueService.name);
  private jobTracker = new Map<string, string[]>(); // testSuiteRunId -> [jobIds]

  constructor(
    @InjectQueue('test-setup-queue') private setupQueue: Queue<SetupQueueData>,
    @InjectQueue('test-execution-queue') private executionQueue: Queue<TestCaseQueueData>,
    private prisma: PrismaService,
    private redisService: RedisService
  ) {}

  async runTestSuite(testSuiteId: string, options: {
    environment: string;
    browser: string;
    version?: string;
  }) {
    // 1. Create test suite run
    const testSuiteRun = await this.prisma.testSuiteRun.create({
      data: {
        testSuiteId,
        environment: options.environment,
        browser: options.browser,
        version: options.version,
        status: TestSuiteRunStatus.RUNNING,
      }
    });

    // Emit suite started event
    await this.redisService.publishTestSuiteEvent({
      type: 'suite-started',
      testSuiteRunId: testSuiteRun.id,
      data: {
        status: TestSuiteRunStatus.RUNNING,
        environment: options.environment,
        browser: options.browser,
      },
      timestamp: new Date().toISOString(),
    });

    try {
      // 2. Get all test cases under that test suite
      const testCases = await this.prisma.testCase.findMany({
        where: { testSuiteId },
        orderBy: { createdAt: 'asc' }
      });

      if (testCases.length === 0) {
        await this.prisma.testSuiteRun.update({
          where: { id: testSuiteRun.id },
          data: {
            status: TestSuiteRunStatus.FAILED,
            errorMessage: 'No test cases found',
            completedAt: new Date()
          }
        });
        return { testSuiteRunId: testSuiteRun.id, totalTestCases: 0, message: 'No test cases to execute' };
      }

      // 3. Create test case runs for all test cases
      const testCaseRuns = await Promise.all(
        testCases.map(testCase => 
          this.prisma.testCaseRun.create({
            data: {
              testCaseId: testCase.id,
              testSuiteRunId: testSuiteRun.id,
              status: TestCaseRunStatus.PENDING,
            },
            include: {
              testCase: true
            }
          })
        )
      );

      // Update total tests count
      await this.prisma.testSuiteRun.update({
        where: { id: testSuiteRun.id },
        data: { totalTests: testCases.length }
      });

      // 4. Check if setup is required and queue accordingly
      // const testSuite = await this.prisma.testSuites.findUnique({
      //   where: { id: testSuiteId },
      //   include: { setupSteps: true }
      // });

      // if (testSuite?.setupSteps?.length > 0) {
      //   await this.queueWithSetup(testSuiteRun.id, testCaseRuns, options);
      // } else {
        await this.queueDirectExecution(testSuiteRun.id, testCaseRuns, options);
      // }

      return {
        testSuiteRunId: testSuiteRun.id,
        totalTestCases: testCases.length,
        message: 'Test suite execution started'
      };

    } catch (error) {
      this.logger.error(`Failed to start test suite ${testSuiteId}:`, error);
      
      await this.prisma.testSuiteRun.update({
        where: { id: testSuiteRun.id },
        data: {
          status: TestSuiteRunStatus.FAILED,
          errorMessage: error.message,
          completedAt: new Date()
        }
      });

      // Emit error via Redis
      await this.redisService.publishTestSuiteEvent({
        type: 'setup-failed',
        testSuiteRunId: testSuiteRun.id,
        data: { error: error.message },
        timestamp: new Date().toISOString(),
      });
      throw error;
    }
  }

  private async queueWithSetup(
    testSuiteRunId: string,
    testCaseRuns: any[],
    options: { environment: string; browser: string; version?: string }
  ) {
    const testSuiteRun = await this.prisma.testSuiteRun.findUnique({
      where: { id: testSuiteRunId }
    });

    const cacheKey = `setup:${testSuiteRun?.testSuiteId}:${options.environment}:${options.browser}`;
    const jobIds: string[] = [];
    
    // Set setup status to pending
    await this.redisService.setSetupStatus(cacheKey, 'pending');
    
    // Queue setup first with high priority
    const setupJob = await this.setupQueue.add('run-setup', {
      testSuiteId: testSuiteRun?.testSuiteId!,
      testSuiteRunId,
      environment: options.environment,
      browser: options.browser,
      cacheKey
    }, {
      priority: 100,
      attempts: 2,
      backoff: { type: 'fixed', delay: 5000 }
    });

    jobIds.push(setupJob?.id?.toString()!);

    // Queue all test cases with dependency on setup
    const testCaseJobs = await Promise.all(
      testCaseRuns.map(async (testCaseRun, index) => {
        const job = await this.executionQueue.add('run-test-case', {
          testCaseRunId: testCaseRun.id,
          testCaseId: testCaseRun.testCaseId,
          testSuiteRunId,
          testSuiteId: testSuiteRun?.testSuiteId!,
          setupCacheKey: cacheKey,
          environment: options.environment,
          browser: options.browser
        }, {
          priority: 50,
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
          delay: 2000 + (index * 100), // Wait for setup + stagger
        });

        jobIds.push(job?.id?.toString()!);
        return job;
      })
    );

    // Track jobs for this test suite run
    this.jobTracker.set(testSuiteRunId, jobIds);

    this.logger.log(`Queued setup job ${setupJob?.id} and ${testCaseJobs.length} test case jobs for suite run ${testSuiteRunId}`);
  }

  private async queueDirectExecution(
    testSuiteRunId: string,
    testCaseRuns: any[],
    options: { environment: string; browser: string; version?: string }
  ) {
    const jobIds: string[] = [];

    const testCaseJobs = await Promise.all(
      testCaseRuns.map(async (testCaseRun, index) => {
        const job = await this.executionQueue.add('run-test-case', {
          testCaseRunId: testCaseRun.id,
          testCaseId: testCaseRun.testCaseId,
          testSuiteRunId,
          testSuiteId: testCaseRun?.testSuiteId!,
          environment: options.environment,
          browser: options.browser,
          code: testCaseRun.testCase.code
        }, {
          priority: 50,
          attempts: 3,
          backoff: { type: 'exponential', delay: 2000 },
          delay: index * 100
        });

        jobIds.push(job?.id?.toString()!);
        return job;
      })
    );

    this.jobTracker.set(testSuiteRunId, jobIds);
    this.logger.log(`Queued ${testCaseJobs.length} test case jobs for direct execution (suite run ${testSuiteRunId})`);
  }

  async cancelTestSuiteRunRealtime(testSuiteRunId: string) {
    this.logger.log(`Cancelling test suite run ${testSuiteRunId}`);

    // 1. Update database status
    const testSuiteRun = await this.prisma.testSuiteRun.update({
      where: { id: testSuiteRunId },
      data: {
        status: TestSuiteRunStatus.CANCELLED,
        completedAt: new Date()
      }
    });

    // 2. Update all pending/running test case runs
    await this.prisma.testCaseRun.updateMany({
      where: {
        testSuiteRunId,
        status: {
          in: [TestCaseRunStatus.RUNNING, TestCaseRunStatus.PASSED, TestCaseRunStatus.FAILED, TestCaseRunStatus.SKIPPED, TestCaseRunStatus.TIMEOUT, TestCaseRunStatus.ERROR, TestCaseRunStatus.PENDING]
        }
      },
      data: {
        status: TestCaseRunStatus.ERROR,
        completedAt: new Date(),
        errorMessage: 'Test suite was cancelled'
      }
    });

    // 3. Remove/cancel queued jobs
    const jobIds = this.jobTracker.get(testSuiteRunId) || [];
    await Promise.all([
      this.cancelQueuedJobs(this.setupQueue, jobIds),
      this.cancelQueuedJobs(this.executionQueue, jobIds)
    ]);

    // 4. Publish cancellation event to workers
    await this.redisService.publishCancellationEvent({
      type: 'cancel-suite',
      testSuiteRunId,
      timestamp: new Date().toISOString(),
    });

    // 5. Clean up setup cache
    const cacheKey = `setup:${testSuiteRun?.testSuiteId}:${testSuiteRun?.environment}:${testSuiteRun?.browser}`;
    await this.redisService.deleteSetupCache(cacheKey);

    // 6. Clean up job tracker
    this.jobTracker.delete(testSuiteRunId);

    // 7. Emit cancellation event
    await this.redisService.publishTestSuiteEvent({
      type: 'suite-cancelled',
      testSuiteRunId,
      data: {
        status: TestSuiteRunStatus.CANCELLED,
        cancelledAt: new Date().toISOString(),
      },
      timestamp: new Date().toISOString(),
    });

    return testSuiteRun;
  }

  async cancelTestCaseRealtime(testCaseRunId: string) {
    const testCaseRun = await this.prisma.testCaseRun.findUnique({
      where: { id: testCaseRunId }
    });

    if (!testCaseRun) {
      throw new Error('Test case run not found');
    }

    // Update status
    await this.prisma.testCaseRun.update({
      where: { id: testCaseRunId },
      data: {
        status: TestCaseRunStatus.ERROR,
        completedAt: new Date(),
        errorMessage: 'Test case was cancelled'
      }
    });

    // Find and cancel the specific job
    const jobs = await this.executionQueue.getJobs(['waiting', 'active', 'delayed']);
    const targetJob = jobs.find(job => job.data.testCaseRunId === testCaseRunId);
    
    if (targetJob) {
      await targetJob.remove();
    }

    // Publish cancellation event
    await this.redisService.publishCancellationEvent({
      type: 'cancel-test-case',
      testSuiteRunId: testCaseRun.testSuiteRunId,
      testCaseRunId,
      timestamp: new Date().toISOString(),
    });

    return testCaseRun;
  }

  private async cancelQueuedJobs(queue: Queue, jobIds: string[]) {
    const jobs = await queue.getJobs(['waiting', 'active', 'delayed']);
    const targetJobs = jobs.filter(job => jobIds.includes(job?.id?.toString()!));
    
    await Promise.all(targetJobs.map(job => job.remove()));
    this.logger.log(`Cancelled ${targetJobs.length} jobs from queue ${queue.name}`);
  }

  async getTestSuiteRunStatus(testSuiteRunId: string) {
    const testSuiteRun = await this.prisma.testSuiteRun.findUnique({
      where: { id: testSuiteRunId },
      include: {
        testCaseRuns: {
          include: {
            testCase: true
          }
        },
        testSuite: true
      }
    });

    if (!testSuiteRun) {
      return null;
    }

    const totalTestCases = testSuiteRun.testCaseRuns.length;
    const completedTestCases = testSuiteRun.testCaseRuns.filter(
      (run: any) => [TestCaseRunStatus.PASSED, TestCaseRunStatus.FAILED, TestCaseRunStatus.SKIPPED, TestCaseRunStatus.TIMEOUT, TestCaseRunStatus.ERROR, TestCaseRunStatus.PENDING].includes(run.status)
    ).length;

    return {
      testSuiteRunId: testSuiteRun.id,
      status: testSuiteRun.status,
      progress: {
        completed: completedTestCases,
        total: totalTestCases,
        percentage: totalTestCases > 0 ? Math.round((completedTestCases / totalTestCases) * 100) : 0
      },
      testCaseRuns: testSuiteRun.testCaseRuns.map(run => ({
        id: run.id,
        testCaseId: run.testCaseId,
        testCaseName: run.testCase.name,
        status: run.status,
        duration: run.duration,
        errorMessage: run.errorMessage,
        startedAt: run.startedAt,
        completedAt: run.completedAt
      })),
      startedAt: testSuiteRun.startedAt,
      completedAt: testSuiteRun.completedAt,
      createdAt: testSuiteRun.createdAt
    };
  }

  async retryTestCase(testCaseRunId: string) {
    // Get the test case run details
    const testCaseRun = await this.prisma.testCaseRun.findUnique({
      where: { id: testCaseRunId },
      include: {
        testCase: true,
        testSuiteRun: {
          include: {
            testSuite: true
          }
        }
      }
    });

    if (!testCaseRun) {
      throw new Error(`Test case run ${testCaseRunId} not found`);
    }

    // Reset the test case run status
    await this.prisma.testCaseRun.update({
      where: { id: testCaseRunId },
      data: {
        status: TestCaseRunStatus.PENDING,
        startedAt: new Date(),
        completedAt: null,
        duration: null,
        errorMessage: null,
        stackTrace: null,
        logs: null
      }
    });

    // Create new job data for retry
    // const retryAttempt = (testCaseRun.retryAttempt || 0) + 1;
    const jobData: TestCaseQueueData = {
      testCaseRunId: testCaseRunId,
      testCaseId: testCaseRun.testCaseId,
      testSuiteRunId: testCaseRun.testSuiteRunId,
      testSuiteId: testCaseRun.testSuiteRun.testSuiteId,
      environment: testCaseRun.testSuiteRun.environment || '',
      browser: testCaseRun.testSuiteRun.browser || '',
      retryAttempt: 0,
      code: testCaseRun.testCase.code
    };

    // Add job to execution queue
    const job = await this.executionQueue.add('execute-test-case', jobData, {
      priority: 1, // Higher priority for retries
      delay: 0,
      attempts: 1
    });

    this.logger.log(`Retrying test case ${testCaseRunId} with job ${job.id} (attempt ${0})`);
    
    return job;
  }

  async updateTestCaseRunResult(testCaseRunId: string, result: {
    status: TestCaseRunStatus;
    duration?: number;
    errorMessage?: string;
    stackTrace?: string;
    logs?: string;
    results?: any;
  }) {

    for(const r of result?.results || []) {
      await this.prisma.testStepResult.create({
        data: {
          testCaseRunId: testCaseRunId,
          stepNumber: r.step,
          stepName: r.command,
          screenshot: r.screenshotUrl,
          status: r.status,

          // Will be finalized in the future
          startedAt: new Date(),
          completedAt: new Date(),
          duration: 0,
          errorMessage: null,
          logs: null
        }
      });
    }

    // Update test case run
    const testCaseRun = await this.prisma.testCaseRun.update({
      where: { id: testCaseRunId },
      data: {
        status: Array.isArray(result.results) && result.results.length > 0 && result.results.every(r => r.status === TestStepStatus.PASSED)
          ? TestCaseRunStatus.PASSED
          : TestCaseRunStatus.FAILED,
        completedAt: new Date(),
        duration: result.duration,
        errorMessage: result.errorMessage,
        stackTrace: result.stackTrace,
        logs: result.logs
      },
      include: {
        testCase: true
      }
    });

    // Publish test case completion event
    await this.redisService.publishTestCaseEvent({
      type: 'test-case-completed',
      testCaseRunId,
      data: {
        status: result.status,
        duration: result.duration,
        errorMessage: result.errorMessage,
        stackTrace: result.stackTrace,
        logs: result.logs,
      },
      testSuiteRunId: testCaseRun?.testSuiteRunId!,
      timestamp: new Date().toISOString(),
    });

    const remaining = await this.prisma.testCaseRun.count({
      where: {
        testSuiteRunId: testCaseRun?.testSuiteRunId!,
        status: { in: [TestCaseRunStatus.RUNNING, TestCaseRunStatus.PENDING] },
      },
    });

    if (remaining === 0) {
      await this.prisma.testSuiteRun.update({
        where: { id: testCaseRun?.testSuiteRunId! },
        data: { status: TestSuiteRunStatus.COMPLETED, completedAt: new Date() },
      });
      console.log("testCaseRun?.testSuiteRunId!", testCaseRun?.testSuiteRunId!);
      await this.redisService.publishTestSuiteEvent({
        type: 'test-suite-completed',
        testSuiteRunId: testCaseRun?.testSuiteRunId!,
        data: { status: TestSuiteRunStatus.COMPLETED },
        timestamp: new Date().toISOString(),
      });
    }

    return {
      testCaseRun,
      testSuiteRun: null // Will be populated if needed
    };
  }

  async notifySetupCompleted(testSuiteRunId: string, cacheKey: string, setupData: any) {
    this.logger.log(`Setup completed for test suite run ${testSuiteRunId}`);
    
    // Store setup data in Redis cache
    await this.redisService.setSetupStatus(cacheKey, 'completed');
    await this.redisService.setSetupData(cacheKey, setupData);
    
    // Emit setup completed event via Redis
    await this.redisService.publishTestSuiteEvent({
      type: 'setup-completed',
      testSuiteRunId,
      data: { status: 'setup-completed' },
      timestamp: new Date().toISOString(),
    });
  }

  async notifySetupFailed(testSuiteRunId: string, cacheKey: string, error: string) {
    this.logger.error(`Setup failed for test suite run ${testSuiteRunId}: ${error}`);
    
    // Store setup failure in Redis cache
    await this.redisService.setSetupStatus(cacheKey, 'failed');
    await this.redisService.setSetupError(cacheKey, error);
    
    // Emit setup failed event via Redis
    await this.redisService.publishTestSuiteEvent({
      type: 'setup-failed',
      testSuiteRunId,
      data: { status: 'setup-failed', error },
      timestamp: new Date().toISOString(),
    });
  }

  async notifyTestCaseStarted(testCaseRunId: string) {
    const testCaseRun = await this.prisma.testCaseRun.update({
      where: { id: testCaseRunId },
      data: {
        status: TestCaseRunStatus.RUNNING,
        startedAt: new Date(),
      },
      include: {
        testCase: true,
        testSuiteRun: true
      }
    });

    // Emit test case started event via Redis
    await this.redisService.publishTestCaseEvent({
      type: 'test-case-started',
      testCaseRunId,
      data: {
        testSuiteRunId: testCaseRun.testSuiteRunId,
        testCaseName: testCaseRun.testCase.name,
      },
      testSuiteRunId: testCaseRun.testSuiteRunId,
      timestamp: new Date().toISOString(),
    });

    return testCaseRun;
  }

  async getWaitingJobs(start = 0, end = 10) {
    const jobs = await this.executionQueue.getWaiting(start, end);
    return {
      data: jobs.map(job => ({
        id: job.id,
        data: job.data,
        timestamp: job.timestamp,
      }))
    };
  }

  async getActiveJobs(start = 0, end = 10) {
    const jobs = await this.executionQueue.getActive(start, end);
    return {
      data: jobs.map(job => ({
        id: job.id,
        data: job.data,
        progress: job.progress,
        processedOn: job.processedOn,
      }))
    };
  }

  async getQueueStats() {
    const counts = await this.executionQueue.getJobCounts();
    return {
      execution: counts,
      setup: await this.setupQueue.getJobCounts(),
    };
  }
}

