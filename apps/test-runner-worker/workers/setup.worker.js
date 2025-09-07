const { Worker } = require('bullmq');
const IORedis = require('ioredis');

const connection = new IORedis({ maxRetriesPerRequest: null });

const worker = new Worker('test-setup-queue', async (job) => {
  console.log(`🚀 Worker processing job ${job.id}`);
  console.log(`📝 Job data:`, job.data);
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