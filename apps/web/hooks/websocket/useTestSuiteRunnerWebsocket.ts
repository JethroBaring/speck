import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface TestSuiteRunnerProgress {
  testSuiteRunId: string;
  status: string;
  progress?: {
    completed: number;
    total: number;
    percentage: number;
  };
  timestamp: string;
}

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export function useTestSuiteRunnerWebSocket(testSuiteRunId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [progress, setProgress] = useState<TestSuiteRunnerProgress>({
    testSuiteRunId: testSuiteRunId,
    status: '',
    progress: {
      completed: 0,
      total: 0,
      percentage: 0,
    },
    timestamp: new Date().toISOString(),
  });
  const [testCaseRuns, setTestCaseRuns] = useState<any[]>([]);

  useEffect(() => {
    // Initialize socket connection
    const newSocket = io('http://localhost:3000/test-runner', {
      transports: ['websocket'],
      autoConnect: false,
    });

    // Connection event handlers
    newSocket.on('connect', () => {
      if (testSuiteRunId === '') {
        console.log('WebSocket connected but no testSuiteRunId provided');
        return;
      }
      console.log('Connected to test runner WebSocket with testSuiteRunId:', testSuiteRunId);
      setIsConnected(true);

      // Join the test suite room
      console.log('Emitting join-test-suite-run with:', { testSuiteRunId });
      newSocket.emit('join-test-suite-run', { testSuiteRunId });
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from test runner WebSocket');
      setIsConnected(false);
    });

    // Test suite events
    newSocket.on('test-suite-started', (message: WebSocketMessage) => {
      console.log('Test suite started:', message);
      // Clear previous test case runs when starting a new test suite
      setTestCaseRuns([]);
      setProgress(prev => ({
        ...prev,
        ...message.data,
        status: 'RUNNING',
        timestamp: message.timestamp
      }));
    });

    newSocket.on('setup-completed', (message: WebSocketMessage) => {
      // console.log('Setup completed:', message);
      // setLogs(prev => [...prev, message]);
    });

    newSocket.on('setup-failed', (message: WebSocketMessage) => {
      // console.error('Setup failed:', message);
      // setLogs(prev => [...prev, message]);
      // setProgress(prev => ({
      //   ...prev,
      //   testSuiteRunId: prev?.testSuiteRunId || testSuiteRunId,
      //   status: 'FAILED',
      //   errorMessage: message.data.error,
      //   timestamp: message.timestamp
      // }));
    });

    // Test case events
    newSocket.on('test-case-started', (message: WebSocketMessage) => {
      console.log('Test case started:', message);
      setTestCaseRuns((prev) => {
        // Check if test case run already exists to avoid duplicates
        const existingIndex = prev.findIndex(tc => tc.testCaseRunId === message.data.testCaseRunId);
        if (existingIndex >= 0) {
          // Update existing test case run
          const updated = [...prev];
          updated[existingIndex] = { ...updated[existingIndex], ...message.data, status: 'running', stepResults: updated[existingIndex].stepResults || [] };
          return updated;
        }
        // Add new test case run
        return [...prev, { ...message.data, status: 'running', stepResults: [] }];
      });
    });

    newSocket.on('test-case-completed', (message: WebSocketMessage) => {
      console.log('Test case completed:', message);
      setProgress(prev => {
        const prevProgress = prev.progress || { completed: 0, total: 0, percentage: 0 };
        let newCompleted = prevProgress.completed;

        if (message.data.status === 'PASSED' || message.data.status === 'FAILED' || message.data.status === 'SKIPPED') {
          newCompleted = prevProgress.completed + 1;
        }
        const total = prevProgress.total || (message.data.progress?.total ?? 0);
        const percentage = total > 0 ? Math.round((newCompleted / total) * 100) : 0;
        return {
          ...prev,
          ...message.data,
          progress: {
            ...prevProgress,
            ...message.data.progress,
            completed: newCompleted,
            total,
            percentage,
          }
        };
      });
      setTestCaseRuns(prev => prev.map(tc =>
        tc.testCaseRunId === message.data.testCaseRunId
          ? {
            ...tc,
            status: message.data.status,
            completedAt: message.timestamp,
            duration: message.data.testCase?.duration,
            errorMessage: message.data.testCase?.errorMessage
          }
          : tc
      ));
    });

    // Progress updates
    newSocket.on('progress-update', (message: WebSocketMessage) => {
      setProgress(prev => ({ ...prev, ...message.data }));
    });

    // Suite completion
    newSocket.on('test-suite-completed', (message: WebSocketMessage) => {
      console.log('Test suite completed:', message);
      setProgress(prev => ({ ...prev, ...message.data }));
    });

    // Cancellation events
    newSocket.on('test-suite-cancelled', (message: WebSocketMessage) => {
      // console.log('Test suite cancelled:', message);
      // setProgress(prev => ({
      //   ...prev,
      //   testSuiteRunId: prev?.testSuiteRunId || testSuiteRunId,
      //   status: 'CANCELLED',
      //   timestamp: message.timestamp
      // }));
    });

    newSocket.on('test-case-cancelled', (message: WebSocketMessage) => {
      // console.log('Test case cancelled:', message);
      // setTestCaseRuns(prev => prev.map(tc =>
      //   tc.id === message.data.testCaseRunId
      //     ? { ...tc, status: 'CANCELLED', completedAt: message.timestamp }
      //     : tc
      // ));
    });

    // Current status response
    newSocket.on('test-suite-status', (message: WebSocketMessage) => {
      // console.log('Current test suite status:', message);
      // const suiteData = message.data;
      // setProgress({
      //   testSuiteRunId: suiteData.id,
      //   status: suiteData.status,
      //   progress: {
      //     completed: suiteData.passedTests + suiteData.failedTests + suiteData.skippedTests,
      //     total: suiteData.totalTests,
      //     percentage: Math.round(((suiteData.passedTests + suiteData.failedTests + suiteData.skippedTests) / suiteData.totalTests) * 100) || 0,
      //   },
      //   timestamp: message.timestamp,
      // });
      // setTestCaseRuns(suiteData.testCaseRuns || []);
    });

    newSocket.on('test-step-started', (message: WebSocketMessage) => {
      const { testCaseRunId, testStep } = message.data;
      console.log('Test step started:', message);
      setTestCaseRuns((prev) => prev.map(testCase => {
        if (testCase.testCaseRunId === testCaseRunId) {
          const stepResults = testCase.stepResults || [];
          const existingStepIndex = stepResults.findIndex((step: any) =>
            step.step === testStep.step || step.stepNumber === testStep.stepNumber
          );

          let updatedStepResults;
          if (existingStepIndex >= 0) {
            // Update existing step
            updatedStepResults = [...stepResults];
            updatedStepResults[existingStepIndex] = {
              ...updatedStepResults[existingStepIndex],
              ...testStep,
              status: 'running',
              screenshot: updatedStepResults[existingStepIndex].screenshot || null
            };
          } else {
            // Add new step
            updatedStepResults = [...stepResults, { ...testStep, status: 'running', screenshot: null }];
          }

          return {
            ...testCase,
            stepResults: updatedStepResults
          };
        }
        return testCase;
      }));
    });

    newSocket.on('test-step-completed', (message: WebSocketMessage) => {
      const { testCaseRunId, testStep } = message.data;
      console.log('Test step completed:', message);

      setTestCaseRuns(prev => prev.map(testCase => {
        if (testCase.testCaseRunId === testCaseRunId) {
          const updatedStepResults = testCase.stepResults.map((step: any) => {
            if (step.step === testStep.step || step.stepNumber === testStep.stepNumber) {
              return { ...step, ...testStep, screenshot: testStep.screenshot || step.screenshot || null };
            }
            return step;
          });

          return {
            ...testCase,
            stepResults: updatedStepResults
          };
        }
        return testCase;
      }));
    });

    // Error handling
    newSocket.on('error', (message: WebSocketMessage) => {
      console.error('WebSocket error:', message);

    });

    newSocket.on('cancel-error', (message: WebSocketMessage) => {
      console.error('Cancel error:', message);

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
    testCaseRuns,
    cancelTestSuite,
    cancelTestCase,
    retryTestCase,
  };
}
