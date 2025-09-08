// src/redis/redis.service.ts
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';
import { TestWebSocketGateway } from '../test-runner/websocket/test-websocket.gateway';

export interface RedisTestEvent {
  type: 'suite-started' | 'setup-completed' | 'setup-failed' | 
        'test-case-started' | 'test-case-completed' | 'test-suite-completed' |
        'suite-cancelled' | 'test-case-cancelled';
  testSuiteRunId: string;
  testCaseRunId?: string;
  data: any;
  timestamp: string;
}

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private publisher: Redis;
  private subscriber: Redis;

  constructor() {
    const redisConfig = {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: parseInt(process.env.REDIS_DB || '0'),
      retryDelayOnFailover: 100,
      maxRetriesPerRequest: 3,
    };

    this.publisher = new Redis(redisConfig);
    this.subscriber = new Redis(redisConfig);
  }

  async onModuleInit() {
    // Subscribe to test runner channels
    await this.subscriber.subscribe(
      'test-suite-events',
      'test-case-events',
      'setup-events',
      'cancellation-events'
    );

    this.subscriber.on('message', this.handleRedisMessage.bind(this));
  }

  async onModuleDestroy() {
    await this.subscriber.disconnect();
    await this.publisher.disconnect();
  }

  private webSocketGateway: TestWebSocketGateway;

  setWebSocketGateway(gateway: TestWebSocketGateway) {
    this.webSocketGateway = gateway;
  }

  async publishTestSuiteEvent(event: RedisTestEvent) {
    await this.publisher.publish('test-suite-events', JSON.stringify(event));
  }

  async publishTestCaseEvent(event: RedisTestEvent) {
    await this.publisher.publish('test-case-events', JSON.stringify(event));
  }

  async publishSetupEvent(event: RedisTestEvent) {
    await this.publisher.publish('setup-events', JSON.stringify(event));
  }

  async publishCancellationEvent(event: {
    type: 'cancel-suite' | 'cancel-test-case';
    testSuiteRunId: string;
    testCaseRunId?: string;
    timestamp: string;
  }) {
    await this.publisher.publish('cancellation-events', JSON.stringify(event));
  }

  private async handleRedisMessage(channel: string, message: string) {
    if (!this.webSocketGateway) {
      console.warn('RedisService received message but WebSocketGateway is not wired. Channel:', channel);
      return;
    }

    try {
      const event = JSON.parse(message);

      switch (channel) {
        case 'test-suite-events':
          this.handleTestSuiteEvent(event);
          break;
        case 'test-case-events':
          this.handleTestCaseEvent(event);
          break;
        case 'setup-events':
          this.handleSetupEvent(event);
          break;
        case 'cancellation-events':
          // Cancellation events are handled by the queue service
          break;
      }
    } catch (error) {
      console.error('Error handling Redis message:', error);
    }
  }

  private handleTestSuiteEvent(event: RedisTestEvent) {
    const progressData = {
      testSuiteRunId: event.testSuiteRunId,
      status: event.data.status,
      progress: event.data.progress,
      timestamp: event.timestamp,
    };

    switch (event.type) {
      case 'suite-started':
        this.webSocketGateway.emitTestSuiteStarted(progressData);
        break;
      case 'test-suite-completed':
        console.log("testSuiteRunId", progressData.testSuiteRunId);
        this.webSocketGateway.emitTestSuiteCompleted(progressData);
        break;
      case 'suite-cancelled':
        // Handle suite cancellation
        break;
    }
  }

  private handleTestCaseEvent(event: RedisTestEvent) {
    const progressData = {
      testSuiteRunId: event.testSuiteRunId,
      testCaseRunId: event.testCaseRunId,
      status: event.data.status,
      progress: event.data.progress,
      testCase: event.data.testCase,
      timestamp: event.timestamp,
    };

    switch (event.type) {
      case 'test-case-started':
        this.webSocketGateway.emitTestCaseStarted(progressData);
        break;
      case 'test-case-completed':
        this.webSocketGateway.emitTestCaseCompleted(progressData);
        break;
    }
  }

  private handleSetupEvent(event: RedisTestEvent) {
    const progressData = {
      testSuiteRunId: event.testSuiteRunId,
      status: event.data.status,
      progress: event.data.progress,
      timestamp: event.timestamp,
    };

    switch (event.type) {
      case 'setup-completed':
        this.webSocketGateway.emitSetupCompleted(progressData);
        break;
      case 'setup-failed':
        this.webSocketGateway.emitSetupFailed(progressData);
        break;
    }
  }

  // Cache methods for setup data
  async cacheSetupData(cacheKey: string, data: any, ttlSeconds = 3600) {
    await this.publisher.setex(cacheKey, ttlSeconds, JSON.stringify(data));
  }

  async getSetupData(cacheKey: string) {
    const data = await this.publisher.get(cacheKey);
    return data ? JSON.parse(data) : null;
  }

  async deleteSetupCache(cacheKey: string) {
    await this.publisher.del(cacheKey);
  }

  async setSetupStatus(cacheKey: string, status: 'pending' | 'completed' | 'failed') {
    await this.publisher.setex(`${cacheKey}:status`, 300, status); // 5 min TTL
  }

  async getSetupStatus(cacheKey: string) {
    return await this.publisher.get(`${cacheKey}:status`);
  }

  async setSetupData(cacheKey: string, data: any) {
    await this.publisher.setex(`${cacheKey}:data`, 3600, JSON.stringify(data)); // 1 hour TTL
  }

  async setSetupError(cacheKey: string, error: string) {
    await this.publisher.setex(`${cacheKey}:error`, 3600, error); // 1 hour TTL
  }

  async getSetupError(cacheKey: string) {
    return await this.publisher.get(`${cacheKey}:error`);
  }

  async acquireLock(lockKey: string, ttlSeconds: number = 300): Promise<boolean> {
    // Use SET with NX and EX options for atomic lock acquisition
    const result = await this.publisher.set(lockKey, 'locked', 'EX', ttlSeconds, 'NX');
    return result === 'OK';
  }

  async releaseLock(lockKey: string): Promise<void> {
    await this.publisher.del(lockKey);
  }
}