// src/test-runner/enhanced-test-queue.controller.ts
import { Public } from "@mguay/nestjs-better-auth";
import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Query
} from '@nestjs/common';
import { TestCaseRunStatus } from 'generated/prisma';
import { TestQueueService } from './test-queue.service';

@Controller('test-runner')
export class TestQueueController {
  constructor(private readonly testQueueService: TestQueueService) {}

  @Post('run-suite/:testSuiteId')
  @Public()
  async runTestSuite(
    @Param('testSuiteId') testSuiteId: string,
    @Body()
    body: {
      environment: string;
      browser: string;
      version?: string;
    },
  ) {
    return await this.testQueueService.runTestSuite(testSuiteId, body);
  }

  @Put('cancel-suite-run/:testSuiteRunId')
  async cancelTestSuiteRun(@Param('testSuiteRunId') testSuiteRunId: string) {
    const result =
      await this.testQueueService.cancelTestSuiteRunRealtime(testSuiteRunId);
    return {
      message: 'Test suite run cancelled',
      testSuiteRun: result,
    };
  }

  @Put('cancel-test-case/:testCaseRunId')
  async cancelTestCase(@Param('testCaseRunId') testCaseRunId: string) {
    const result =
      await this.testQueueService.cancelTestCaseRealtime(testCaseRunId);
    return {
      message: 'Test case cancelled',
      testCaseRun: result,
    };
  }

  @Post('retry-test-case/:testCaseRunId')
  async retryTestCase(@Param('testCaseRunId') testCaseRunId: string) {
    const job = await this.testQueueService.retryTestCase(testCaseRunId);
    return {
      jobId: job.id,
      message: 'Test case queued for retry',
    };
  }

  @Get('suite-run/:testSuiteRunId/status')
  async getTestSuiteRunStatus(@Param('testSuiteRunId') testSuiteRunId: string) {
    const status =
      await this.testQueueService.getTestSuiteRunStatus(testSuiteRunId);

    if (!status) {
      return { message: 'Test suite run not found' };
    }

    return {
      ...status,
      summary: {
        totalTests: status.progress.total,
        passedTests: status.progress.completed,
        failedTests: status.progress.total - status.progress.completed,
        skippedTests: 0,
        // skippedTests: status.progress.total - status.progress.completed - status.progress.failed,
        runningTests: status.testCaseRuns.filter(
          (run) => run.status === TestCaseRunStatus.RUNNING,
        ).length,
        pendingTests: status.testCaseRuns.filter(
          (run) => run.status === TestCaseRunStatus.PENDING,
        ).length,
        // completedTests: status.progress.completed + status.progress.failed + status.progress.skipped,
        completedTests: 0,
        // progressPercentage: status.progress.total > 0
        //   ? Math.round(((status.progress.completed + status.progress.failed + status.progress.skipped) / status.progress.total) * 100)
        //   : 0,
        progressPercentage: 0,
        duration: status.completedAt
          ? new Date(status.completedAt).getTime() -
            new Date(status.startedAt).getTime()
          : new Date().getTime() - new Date(status.startedAt).getTime(),
      },
    };
  }

  // Worker endpoints (called by workers to report progress)
  @Post('worker/setup-completed')
  async notifySetupCompleted(
    @Body() body: { testSuiteRunId: string; cacheKey: string; setupData: any },
  ) {
    await this.testQueueService.notifySetupCompleted(
      body.testSuiteRunId,
      body.cacheKey,
      body.setupData,
    );
    return { message: 'Setup completion recorded' };
  }

  @Post('worker/setup-failed')
  async notifySetupFailed(
    @Body() body: { testSuiteRunId: string; cacheKey: string; error: string },
  ) {
    await this.testQueueService.notifySetupFailed(
      body.testSuiteRunId,
      body.cacheKey,
      body.error,
    );
    return { message: 'Setup failure recorded' };
  }

  @Post('worker/test-case-started')
  @Public()
  async notifyTestCaseStarted(@Body() body: { testCaseRunId: string }) {
    const result = await this.testQueueService.notifyTestCaseStarted(
      body.testCaseRunId,
    );
    return {
      message: 'Test case start recorded',
      testCaseRun: result,
    };
  }

  @Put('worker/test-case-completed')
  @Public()
  async updateTestCaseResult(
    @Body()
    body: {
      testCaseRunId: string;
      status: TestCaseRunStatus;
      duration?: number;
      errorMessage?: string;
      stackTrace?: string;
      logs?: string;
      results?: any;
    },
  ) {
    const result = await this.testQueueService.updateTestCaseRunResult(
      body.testCaseRunId,
      {
        status: body.status as any,
        duration: body.duration,
        errorMessage: body.errorMessage,
        stackTrace: body.stackTrace,
        logs: body.logs,
        results: body.results,
      },
    );

    return {
      message: 'Test case result updated',
      testCaseRun: result.testCaseRun,
      testSuiteRun: result.testSuiteRun,
    };
  }

  // Worker endpoints for job polling
  @Get('queue/jobs/waiting')
  @Public()
  async getWaitingJobs(
    @Query('start') start = 0,
    @Query('end') end = 10
  ) {
    return await this.testQueueService.getWaitingJobs(Number(start), Number(end));
  }

  @Get('queue/jobs/active')
  @Public()
  async getActiveJobs(
    @Query('start') start = 0,
    @Query('end') end = 10
  ) {
    return await this.testQueueService.getActiveJobs(Number(start), Number(end));
  }

  // Admin/monitoring endpoints
  @Get('queue/stats')
  @Public()
  async getQueueStats() {
    return await this.testQueueService.getQueueStats();
  }

  // @Get('active-runs')
  // async getActiveTestSuiteRuns(
  //   @Query('limit') limit = 10,
  //   @Query('offset') offset = 0
  // ) {
  //   // Get currently running test suite runs with progress
  //   return { message: 'Active test suite runs - implement with Prisma query' };
  // }

  // @Get('recent-runs')
  // async getRecentTestSuiteRuns(
  //   @Query('limit') limit = 20,
  //   @Query('offset') offset = 0,
  //   @Query('status') status?: string
  // ) {
  //   // Get recent test suite runs with summary
  //   return { message: 'Recent test suite runs - implement with Prisma query' };
  // }

  // @Get('test-case-run/:testCaseRunId/details')
  // async getTestCaseRunDetails(@Param('testCaseRunId') testCaseRunId: string) {
  //   // Get detailed test case run info including step results
  //   return { message: 'Test case run details - implement with step results query' };
  // }

  // // Health check for the test runner system
  // @Get('health')
  // async healthCheck() {
  //   const queueStats = await this.testQueueService.getQueueStats();
  //   const activeJobs = await this.testQueueService.getActiveJobs();

  //   return {
  //     status: 'healthy',
  //     timestamp: new Date().toISOString(),
  //     queues: queueStats,
  //     activeJobs: {
  //       setup: activeJobs.setup.length,
  //       execution: activeJobs.execution.length
  //     }
  //   };
  // }
}
