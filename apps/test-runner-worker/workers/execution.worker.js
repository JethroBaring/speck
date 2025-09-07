require('dotenv').config();
const { Worker } = require('bullmq');
const IORedis = require('ioredis');
const apiService = require('../services/api.service');
const executionService = require('../services/execution.service');

const connection = new IORedis({ maxRetriesPerRequest: null });

const worker = new Worker('test-execution-queue', async (job) => {
  const { testCaseRunId } = job.data;

  try {
    await apiService.notifyTestCaseStarted(testCaseRunId);

    console.log(`Executing test case: ${testCaseRunId}`);
    console.log(`Job data:`, job.data);

    const result = await executionService.executeTestCase(job.data);

    console.log(`Test case result:`, result);

    await apiService.updateTestCaseResult(testCaseRunId, result);

    return result;
  } catch (error) {
    await apiService.updateTestCaseResult(testCaseRunId, {
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