// src/test-runner/test-runner.module.ts
import { Module } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TestQueueService } from './test-queue.service';
import { TestQueueController } from './test-queue.controller';
import { TestWebSocketGateway } from './websocket/test-websocket.gateway';
import { RedisService } from '../redis/redis.service';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  imports: [
    BullModule.forRoot({
      redis: {
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        password: process.env.REDIS_PASSWORD,
        db: parseInt(process.env.REDIS_DB || '0'),
      },
    }),
    BullModule.registerQueue(
      {
        name: 'test-setup-queue',
        defaultJobOptions: {
          removeOnComplete: 10,
          removeOnFail: 5,
        },
      },
      {
        name: 'test-execution-queue',
        defaultJobOptions: {
          removeOnComplete: 50,
          removeOnFail: 20,
        },
      }
    ),
  ],
  providers: [
    TestQueueService,
    TestWebSocketGateway,
    RedisService,
    PrismaService,
  ],
  controllers: [TestQueueController],
  exports: [TestQueueService, TestWebSocketGateway, RedisService],
})
export class TestRunnerModule {}