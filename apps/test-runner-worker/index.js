require('dotenv').config();
const express = require('express');
const path = require('path');
const executionWorker = require('./workers/execution.worker');
const databaseWorker = require('./workers/database.worker');

const app = express();
const PORT = process.env.PORT || 7860;

// Middleware
app.use(express.json());
app.use('/screenshots', express.static('screenshots'));

// Health check endpoint (required for Hugging Face)
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    service: 'test-runner-worker'
  });
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Test Runner Worker is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      screenshots: '/screenshots'
    }
  });
});

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Test Runner Worker started on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
});

// Workers are automatically started when imported
console.log('🚀 Starting BullMQ Workers...');

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down workers...');
  await executionWorker.close();
  await databaseWorker.close();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down workers...');
  await executionWorker.close();
  await databaseWorker.close();
  process.exit(0);
});
