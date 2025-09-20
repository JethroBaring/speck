import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';

interface ProjectTestsProgress {
  projectId: string;
  status: string;
  progress?: {
    completedSuites: number;
    totalSuites: number;
    completedTests: number;
    totalTests: number;
    percentage: number;
  };
  currentSuite?: {
    id: string;
    name?: string;
    status?: string;
  };
  timestamp: string;
}

interface WebSocketMessage {
  type: string;
  data: any;
  timestamp: string;
}

export function useProjectTestsWebSocket(projectId: string) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [progress, setProgress] = useState<ProjectTestsProgress>({
    projectId,
    status: '',
    progress: {
      completedSuites: 0,
      totalSuites: 0,
      completedTests: 0,
      totalTests: 0,
      percentage: 0,
    },
    timestamp: new Date().toISOString(),
  });
  const [suiteRuns, setSuiteRuns] = useState<any[]>([]);
  const [logs, setLogs] = useState<WebSocketMessage[]>([]);

  useEffect(() => {
    const newSocket = io('http://localhost:3000/test-runner', {
      transports: ['websocket'],
      autoConnect: false,
    });

    newSocket.on('connect', () => {
      if (!projectId) return;
      setIsConnected(true);
      newSocket.emit('join-project-tests', { projectId });
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false);
    });

    // Project-wide events
    newSocket.on('project-tests-started', (message: WebSocketMessage) => {
      setLogs(prev => [...prev, message]);
      setProgress(prev => ({ ...prev, ...message.data }));
    });

    newSocket.on('project-setup-completed', (message: WebSocketMessage) => {
      setLogs(prev => [...prev, message]);
    });

    newSocket.on('project-setup-failed', (message: WebSocketMessage) => {
      setLogs(prev => [...prev, message]);
      setProgress(prev => ({
        ...prev,
        projectId: prev?.projectId || projectId,
        status: 'FAILED',
        errorMessage: message.data?.error,
        timestamp: message.timestamp,
      } as any));
    });

    // Individual suite events within the project run
    newSocket.on('project-test-suite-started', (message: WebSocketMessage) => {
      setLogs(prev => [...prev, message]);
      setSuiteRuns(prev => prev.map(s =>
        s.id === message.data.testSuiteRunId
          ? { ...s, status: 'RUNNING', startedAt: message.timestamp }
          : s
      ));
    });

    newSocket.on('project-test-suite-completed', (message: WebSocketMessage) => {
      setLogs(prev => [...prev, message]);
      // Update aggregate progress if provided; otherwise increment estimates
      setProgress(prev => {
        const prevProg = prev.progress || { completedSuites: 0, totalSuites: 0, completedTests: 0, totalTests: 0, percentage: 0 };
        const newCompletedSuites = (message.data?.progress?.completedSuites ?? (prevProg.completedSuites + 1));
        const totalSuites = message.data?.progress?.totalSuites ?? prevProg.totalSuites;
        const completedTests = message.data?.progress?.completedTests ?? prevProg.completedTests;
        const totalTests = message.data?.progress?.totalTests ?? prevProg.totalTests;
        const percentage = totalSuites > 0 ? Math.round((newCompletedSuites / totalSuites) * 100) : prevProg.percentage;
        return {
          ...prev,
          ...message.data,
          progress: {
            ...prevProg,
            ...message.data?.progress,
            completedSuites: newCompletedSuites,
            totalSuites,
            completedTests,
            totalTests,
            percentage,
          },
        };
      });
      setSuiteRuns(prev => prev.map(s =>
        s.id === message.data.testSuiteRunId
          ? { ...s, status: message.data.status, completedAt: message.timestamp }
          : s
      ));
    });

    // Progress updates
    newSocket.on('project-progress-update', (message: WebSocketMessage) => {
      setProgress(prev => ({ ...prev, ...message.data }));
    });

    // Completion/cancellation
    newSocket.on('project-tests-completed', (message: WebSocketMessage) => {
      setLogs(prev => [...prev, message]);
      setProgress(prev => ({ ...prev, ...message.data }));
    });

    newSocket.on('project-tests-cancelled', (message: WebSocketMessage) => {
      setLogs(prev => [...prev, message]);
      setProgress(prev => ({
        ...prev,
        projectId: prev?.projectId || projectId,
        status: 'CANCELLED',
        timestamp: message.timestamp,
      }));
    });

    newSocket.on('project-test-suite-cancelled', (message: WebSocketMessage) => {
      setLogs(prev => [...prev, message]);
      setSuiteRuns(prev => prev.map(s =>
        s.id === message.data.testSuiteRunId
          ? { ...s, status: 'CANCELLED', completedAt: message.timestamp }
          : s
      ));
    });

    // Current status snapshot
    newSocket.on('project-tests-status', (message: WebSocketMessage) => {
      const data = message.data;
      // Expecting shape: { projectId, status, totalSuites, completedSuites, totalTests, completedTests, suiteRuns: [] }
      setProgress({
        projectId: data.projectId || projectId,
        status: data.status,
        progress: {
          completedSuites: data.completedSuites ?? 0,
          totalSuites: data.totalSuites ?? 0,
          completedTests: data.completedTests ?? 0,
          totalTests: data.totalTests ?? 0,
          percentage: (data.totalSuites ?? 0) > 0 ? Math.round(((data.completedSuites ?? 0) / (data.totalSuites ?? 0)) * 100) : 0,
        },
        timestamp: message.timestamp,
      });
      setSuiteRuns(data.suiteRuns || []);
    });

    // Errors
    newSocket.on('error', (message: WebSocketMessage) => {
      setLogs(prev => [...prev, { ...message, type: 'error' }]);
    });

    newSocket.on('cancel-error', (message: WebSocketMessage) => {
      setLogs(prev => [...prev, { ...message, type: 'cancel-error' }]);
    });

    newSocket.connect();
    setSocket(newSocket);

    return () => {
      newSocket.emit('leave-project-tests', { projectId });
      newSocket.disconnect();
    };
  }, [projectId]);

  // Controls
  const cancelProjectTests = () => {
    if (socket && isConnected) {
      socket.emit('cancel-project-tests', { projectId });
    }
  };

  const cancelSuiteInProject = (testSuiteRunId: string) => {
    if (socket && isConnected) {
      socket.emit('cancel-project-test-suite', { projectId, testSuiteRunId });
    }
  };

  const retrySuiteInProject = (testSuiteRunId: string) => {
    if (socket && isConnected) {
      socket.emit('retry-project-test-suite', { projectId, testSuiteRunId });
    }
  };

  return {
    socket,
    isConnected,
    progress,
    suiteRuns,
    logs,
    cancelProjectTests,
    cancelSuiteInProject,
    retrySuiteInProject,
  };
}


