import { useEffect, useState, useRef } from 'react';
import io, { Socket } from 'socket.io-client';
import { useToastStore } from '@/stores/useToastStore';

interface TestProgress {
  testSuiteRunId: string;
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

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export function useTestRunnerWebSocket(testSuiteRunId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [progress, setProgress] = useState<TestProgress | null>(null);
  const [testCases, setTestCases] = useState<any[]>([]);
  const [logs, setLogs] = useState<WebSocketMessage[]>([]);
  const toast = useToastStore();

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3000/test-runner', {
      transports: ['websocket'],
      autoConnect: false,
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      if (testSuiteRunId === '') return;
      console.log('Connected to test runner WebSocket');
      setIsConnected(true);
      
      // Join the test suite room
      newSocket.emit('join-test-suite-run', { testSuiteRunId });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from test runner WebSocket');
      setIsConnected(false);
    });

    // Test suite events
    newSocket.on('test-suite-started', (message: WebSocketMessage) => {
      console.log('Test suite started:', message);
      setLogs(prev => [...prev, message]);
      setProgress(prev => ({ ...prev, ...message.data }));
    });

    newSocket.on('setup-completed', (message: WebSocketMessage) => {
      console.log('Setup completed:', message);
      setLogs(prev => [...prev, message]);
    });

    newSocket.on('setup-failed', (message: WebSocketMessage) => {
      console.error('Setup failed:', message);
      setLogs(prev => [...prev, message]);
      setProgress(prev => ({ 
        ...prev, 
        testSuiteRunId: prev?.testSuiteRunId || testSuiteRunId,
        status: 'FAILED',
        errorMessage: message.data.error,
        timestamp: message.timestamp
      }));
    });

    // Test case events
    newSocket.on('test-case-started', (message: WebSocketMessage) => {
      console.log('Test case started:', message);
      setLogs(prev => [...prev, message]);
      
      setTestCases(prev => prev.map(tc => 
        tc.id === message.data.testCaseRunId 
          ? { ...tc, status: 'RUNNING', startedAt: message.timestamp }
          : tc
      ));
    });

    newSocket.on('test-case-completed', (message: WebSocketMessage) => {
      console.log('Test case completed:', message);
      setLogs(prev => [...prev, message]);
      
      setTestCases(prev => prev.map(tc => 
        tc.id === message.data.testCaseRunId 
          ? { 
              ...tc, 
              status: message.data.status,
              completedAt: message.timestamp,
              duration: message.data.testCase?.duration,
              errorMessage: message.data.testCase?.errorMessage
            }
          : tc
      ));
      toast.addToast({
        title: 'Test case completed',
        message: 'Test case completed',
        type: 'success',
      });
    });

    // Progress updates
    newSocket.on('progress-update', (message: WebSocketMessage) => {
      setProgress(prev => ({ ...prev, ...message.data }));
    });

    // Suite completion
    newSocket.on('test-suite-completed', (message: WebSocketMessage) => {
      console.log('Test suite completed:', message);
      setLogs(prev => [...prev, message]);
      setProgress(prev => ({ ...prev, ...message.data }));
      toast.addToast({
        title: 'Test suite completed',
        message: 'Test suite completed',
        type: 'success',
      });
    });

    // Cancellation events
    newSocket.on('test-suite-cancelled', (message: WebSocketMessage) => {
      console.log('Test suite cancelled:', message);
      setLogs(prev => [...prev, message]);
      setProgress(prev => ({ 
        ...prev, 
        testSuiteRunId: prev?.testSuiteRunId || testSuiteRunId,
        status: 'CANCELLED',
        timestamp: message.timestamp
      }));
    });

    newSocket.on('test-case-cancelled', (message: WebSocketMessage) => {
      console.log('Test case cancelled:', message);
      setLogs(prev => [...prev, message]);
      
      setTestCases(prev => prev.map(tc => 
        tc.id === message.data.testCaseRunId 
          ? { ...tc, status: 'CANCELLED', completedAt: message.timestamp }
          : tc
      ));
    });

    // Current status response
    newSocket.on('test-suite-status', (message: WebSocketMessage) => {
      console.log('Current test suite status:', message);
      const suiteData = message.data;
      setProgress({
        testSuiteRunId: suiteData.id,
        status: suiteData.status,
        progress: {
          completed: suiteData.passedTests + suiteData.failedTests + suiteData.skippedTests,
          total: suiteData.totalTests,
          percentage: Math.round(((suiteData.passedTests + suiteData.failedTests + suiteData.skippedTests) / suiteData.totalTests) * 100) || 0,
        },
        timestamp: message.timestamp,
      });
      setTestCases(suiteData.testCaseRuns || []);
    });

    // Error handling
    newSocket.on('error', (message: WebSocketMessage) => {
      console.error('WebSocket error:', message);
      setLogs(prev => [...prev, { ...message, type: 'error' }]);
    });

    newSocket.on('cancel-error', (message: WebSocketMessage) => {
      console.error('Cancel error:', message);
      setLogs(prev => [...prev, { ...message, type: 'cancel-error' }]);
    });

    // Connect the socket
    newSocket.connect();
    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      newSocket.emit('leave-test-suite-run', { testSuiteRunId });
      newSocket.disconnect();
    };
  }, [testSuiteRunId]);

  // Control functions
  const cancelTestSuite = () => {
    if (socket && isConnected) {
      socket.emit('cancel-test-suite', { testSuiteRunId });
    }
  };

  const cancelTestCase = (testCaseRunId: string) => {
    if (socket && isConnected) {
      socket.emit('cancel-test-case', { 
        testCaseRunId, 
        testSuiteRunId 
      });
    }
  };

  const retryTestCase = (testCaseRunId: string) => {
    if (socket && isConnected) {
      socket.emit('retry-test-case', { 
        testCaseRunId, 
        testSuiteRunId 
      });
    }
  };

  return {
    socket,
    isConnected,
    progress,
    testCases,
    logs,
    cancelTestSuite,
    cancelTestCase,
    retryTestCase,
  };
}