const MAIN_API_URL = process.env.MAIN_API_URL || "http://localhost:3000";
const IORedis = require('ioredis');
const { Queue } = require('bullmq');

class WebsocketService {
  constructor() {
    this.baseUrl = MAIN_API_URL;
    this.redis = new IORedis({
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
    });

    // BullMQ queue for database updates
    this.databaseQueue = new Queue('database-updates-queue', {
      connection: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0'),
      }
    });
  }

  async _request(path, { method = 'GET', body } = {}) {
    const url = `${this.baseUrl}/test-runner${path}`;
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: body ? JSON.stringify(body) : undefined,
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) {
      const message = data?.message || `Request failed: ${res.status} ${res.statusText}`;
      const err = new Error(message);
      err.status = res.status;
      err.data = data;
      throw err;
    }

    return data;
  }

  async notifyTestCaseStarted(testCaseRunId, testSuiteRunId) {
    const timestamp = new Date().toISOString();
    
    // Immediate WebSocket notification for UI
    await this.redis.publish('test-case-events', JSON.stringify({
      type: 'test-case-started',
      testSuiteRunId,
      testCaseRunId,
      data: {
        status: 'RUNNING'
      },
      timestamp,
    }));

    // Reliable database update via BullMQ
    await this.databaseQueue.add('update-test-case-started', {
      type: 'update-test-case-started',
      testCaseRunId,
      testSuiteRunId,
      startedAt: timestamp,
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
  }

  async updateTestCaseResult(testCaseRunId, testSuiteRunId, result) {
    const timestamp = new Date().toISOString();
    
    // Immediate WebSocket notification for UI
    await this.redis.publish('test-case-events', JSON.stringify({
      type: 'test-case-completed',
      testSuiteRunId,
      testCaseRunId,
      data: {
        status: result.success ? 'PASSED' : 'FAILED',
        duration: result.duration,
        error: result.error
      },
      timestamp,
    }));

    // Reliable database update via BullMQ
    await this.databaseQueue.add('update-test-case-completed', {
      type: 'update-test-case-completed',
      testCaseRunId,
      testSuiteRunId,
      result: {
        status: result.success ? 'PASSED' : 'FAILED',
        duration: result.duration,
        errorMessage: result.error,
        results: result.results
      }
    }, {
      attempts: 3,
      backoff: { type: 'exponential', delay: 2000 },
    });
  }

  async notifyTestStepStarted(testCaseRunId, testSuiteRunId, stepNumber) {
    // Publish directly to Redis instead of API endpoint
    const event = {
      type: 'test-step-started',
      testSuiteRunId,
      testCaseRunId,
      data: {
        stepNumber,
        status: 'RUNNING'
      },
      timestamp: new Date().toISOString(),
    };
    
    await this.redis.publish('test-step-events', JSON.stringify(event));
  }
  
  async notifyTestStepCompleted(testCaseRunId, testSuiteRunId, stepNumber, result) {
    // Publish directly to Redis instead of API endpoint
    const event = {
      type: 'test-step-completed',
      testSuiteRunId,
      testCaseRunId,
      data: {
        stepNumber,
        status: result?.error ? 'FAILED' : 'PASSED',
        error: result?.error || null
      },
      timestamp: new Date().toISOString(),
    };
    
    await this.redis.publish('test-step-events', JSON.stringify(event));
  }

  async notifySetupCompleted(testSuiteRunId, cacheKey, setupData) {
    return this._request('/worker/setup-completed', {
      method: 'POST',
      body: { testSuiteRunId, cacheKey, setupData },
    });
  }

  async notifySetupFailed(testSuiteRunId, cacheKey, error) {
    return this._request('/worker/setup-failed', {
      method: 'POST',
      body: { testSuiteRunId, cacheKey, error },
    });
  }
}

module.exports = new WebsocketService();
