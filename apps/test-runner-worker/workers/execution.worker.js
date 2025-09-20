require('dotenv').config();
const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const websocketService = require('../services/websocket.service');
const executionService = require('../services/execution.service');

const connection = new IORedis({ maxRetriesPerRequest: null });

const worker = new Worker('test-execution-queue', async (job) => {
  const { testCaseRunId, testSuiteRunId } = job.data;

  try {
    await websocketService.notifyTestCaseStarted(testCaseRunId, testSuiteRunId);

    console.log(`Executing test case: ${testCaseRunId}`);
    console.log(`Job data:`, job.data);

    const result = await executionService.executeTestCase(job.data);

    console.log(`Test case result:`, result);

    await websocketService.updateTestCaseResult(testCaseRunId, testSuiteRunId, result);

    return result;
  } catch (error) {
    await websocketService.updateTestCaseResult(testCaseRunId, testSuiteRunId, {
      success: false,
      error: error.message,
      duration: Date.now() - job.timestamp,
    });
    throw error;
  }
}, {
  connection,
});

worker.on('ready', () => {
  console.log(`🚀 Worker is ready and listening for jobs`);
});

worker.on('error', (err) => {
  console.error(`💥 Worker error:`, err);
});

worker.on('completed', (job, result) => {
  console.log(`✅ Job ${job.id} completed successfully`);
});

worker.on('failed', (job, err) => {
  console.error(`❌ Job ${job.id} failed:`, err.message);
});