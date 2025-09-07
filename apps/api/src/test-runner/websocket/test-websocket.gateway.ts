// src/test-runner/websocket/test-websocket.gateway.ts
import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable, Logger } from '@nestjs/common';
import { TestQueueService } from '../test-queue.service';

export interface WebSocketMessage {
  type: string;
  data: any;
}

export interface TestProgressData {
  testSuiteRunId: string;
  testCaseRunId?: string;
  status: string;
  progress?: {
    completed: number;
    total: number;
    percentage: number;
  };
  testCase?: {
    name: string;
    duration?: number;
    errorMessage?: string;
  };
  timestamp: string;
}

@Injectable()
@WebSocketGateway({
  cors: {
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true,
  },
  namespace: '/test-runner',
})
export class TestWebSocketGateway 
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(TestWebSocketGateway.name);

  constructor(private testQueueService: TestQueueService) {}

  afterInit(server: Server) {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-test-suite-run')
  async handleJoinTestSuiteRun(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { testSuiteRunId: string }
  ) {
    const room = `test-suite-${data.testSuiteRunId}`;
    await client.join(room);
    
    this.logger.log(`Client ${client.id} joined room ${room}`);
    
    // Send current status to the newly joined client
    const status = await this.testQueueService.getTestSuiteRunStatus(data.testSuiteRunId);
    if (status) {
      client.emit('test-suite-status', {
        type: 'current-status',
        data: status,
        timestamp: new Date().toISOString(),
      });
    }

    client.emit('joined-room', {
      type: 'room-joined',
      data: { testSuiteRunId: data.testSuiteRunId, room },
      timestamp: new Date().toISOString(),
    });
  }

  @SubscribeMessage('leave-test-suite-run')
  async handleLeaveTestSuiteRun(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { testSuiteRunId: string }
  ) {
    const room = `test-suite-${data.testSuiteRunId}`;
    await client.leave(room);
    this.logger.log(`Client ${client.id} left room ${room}`);
  }

  @SubscribeMessage('cancel-test-suite')
  async handleCancelTestSuite(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { testSuiteRunId: string }
  ) {
    try {
      await this.testQueueService.cancelTestSuiteRunRealtime(data.testSuiteRunId);
      
      // Broadcast to all clients in the room
      this.server.to(`test-suite-${data.testSuiteRunId}`).emit('test-suite-cancelled', {
        type: 'suite-cancelled',
        data: {
          testSuiteRunId: data.testSuiteRunId,
          cancelledBy: client.id,
        },
        timestamp: new Date().toISOString(),
      });

      client.emit('cancel-success', {
        type: 'cancel-success',
        data: { testSuiteRunId: data.testSuiteRunId },
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      client.emit('cancel-error', {
        type: 'cancel-error',
        data: {
          testSuiteRunId: data.testSuiteRunId,
          error: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  @SubscribeMessage('cancel-test-case')
  async handleCancelTestCase(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { testCaseRunId: string; testSuiteRunId: string }
  ) {
    try {
      await this.testQueueService.cancelTestCaseRealtime(data.testCaseRunId);
      
      this.server.to(`test-suite-${data.testSuiteRunId}`).emit('test-case-cancelled', {
        type: 'test-case-cancelled',
        data: {
          testCaseRunId: data.testCaseRunId,
          testSuiteRunId: data.testSuiteRunId,
          cancelledBy: client.id,
        },
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      client.emit('cancel-error', {
        type: 'cancel-error',
        data: {
          testCaseRunId: data.testCaseRunId,
          error: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  @SubscribeMessage('retry-test-case')
  async handleRetryTestCase(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { testCaseRunId: string; testSuiteRunId: string }
  ) {
    try {
      const job = await this.testQueueService.retryTestCase(data.testCaseRunId);
      
      this.server.to(`test-suite-${data.testSuiteRunId}`).emit('test-case-retried', {
        type: 'test-case-retried',
        data: {
          testCaseRunId: data.testCaseRunId,
          testSuiteRunId: data.testSuiteRunId,
          jobId: job.id,
          retriedBy: client.id,
        },
        timestamp: new Date().toISOString(),
      });

    } catch (error) {
      client.emit('retry-error', {
        type: 'retry-error',
        data: {
          testCaseRunId: data.testCaseRunId,
          error: error.message,
        },
        timestamp: new Date().toISOString(),
      });
    }
  }

  // Methods called by the queue service to emit events
  emitTestSuiteStarted(data: TestProgressData) {
    this.server.to(`test-suite-${data.testSuiteRunId}`).emit('test-suite-started', {
      type: 'suite-started',
      data,
      timestamp: new Date().toISOString(),
    });
  }

  emitSetupCompleted(data: TestProgressData) {
    this.server.to(`test-suite-${data.testSuiteRunId}`).emit('setup-completed', {
      type: 'setup-completed',
      data,
      timestamp: new Date().toISOString(),
    });
  }

  emitSetupFailed(data: TestProgressData) {
    this.server.to(`test-suite-${data.testSuiteRunId}`).emit('setup-failed', {
      type: 'setup-failed',
      data,
      timestamp: new Date().toISOString(),
    });
  }

  emitTestCaseStarted(data: TestProgressData) {
    this.server.to(`test-suite-${data.testSuiteRunId}`).emit('test-case-started', {
      type: 'test-case-started',
      data,
      timestamp: new Date().toISOString(),
    });
  }

  emitTestCaseCompleted(data: TestProgressData) {
    this.server.to(`test-suite-${data.testSuiteRunId}`).emit('test-case-completed', {
      type: 'test-case-completed',
      data,
      timestamp: new Date().toISOString(),
    });
  }

  emitTestSuiteCompleted(data: TestProgressData) {
    this.server.to(`test-suite-${data.testSuiteRunId}`).emit('test-suite-completed', {
      type: 'suite-completed',
      data,
      timestamp: new Date().toISOString(),
    });
  }

  emitProgressUpdate(data: TestProgressData) {
    this.server.to(`test-suite-${data.testSuiteRunId}`).emit('progress-update', {
      type: 'progress-update',
      data,
      timestamp: new Date().toISOString(),
    });
  }

  emitError(testSuiteRunId: string, error: any) {
    this.server.to(`test-suite-${testSuiteRunId}`).emit('error', {
      type: 'error',
      data: {
        testSuiteRunId,
        error: error.message || error,
      },
      timestamp: new Date().toISOString(),
    });
  }
}