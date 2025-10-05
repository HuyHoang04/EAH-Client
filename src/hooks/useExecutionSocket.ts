import { useEffect, useState, useCallback, useRef } from 'react';
import { io, Socket } from 'socket.io-client';

/**
 * Execution Event Types (matching backend)
 */
export interface ExecutionStartedEvent {
  executionId: string;
  flowId: string;
  flowName: string;
  totalNodes: number;
  startedAt: string;
}

export interface NodeStartedEvent {
  executionId: string;
  nodeId: string;
  nodeType: string;
  nodeLabel: string;
  timestamp: string;
}

export interface NodeCompletedEvent {
  executionId: string;
  nodeId: string;
  success: boolean;
  output: any;
  duration: number;
  timestamp: string;
}

export interface NodeFailedEvent {
  executionId: string;
  nodeId: string;
  error: string;
  errorDetails: any;
  timestamp: string;
}

export interface LogMessageEvent {
  executionId: string;
  nodeId?: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  timestamp: string;
}

export interface ExecutionCompletedEvent {
  executionId: string;
  success: boolean;
  totalDuration: number;
  nodesExecuted: number;
  nodesFailed: number;
  completedAt: string;
}

export interface ExecutionFailedEvent {
  executionId: string;
  error: string;
  failedNodeId: string;
  timestamp: string;
}

export type ExecutionEvent =
  | ExecutionStartedEvent
  | NodeStartedEvent
  | NodeCompletedEvent
  | NodeFailedEvent
  | LogMessageEvent
  | ExecutionCompletedEvent
  | ExecutionFailedEvent;

/**
 * Hook to manage WebSocket connection for execution updates
 * 
 * @param executionId - The execution ID to subscribe to
 * @param onNodeStatusChange - Callback when node status changes
 * @param enabled - Whether to enable the WebSocket connection
 */
export function useExecutionSocket(
  executionId: string | null,
  onNodeStatusChange?: (nodeId: string, status: 'running' | 'success' | 'error', data?: any) => void,
  enabled: boolean = true,
) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [logs, setLogs] = useState<LogMessageEvent[]>([]);
  const [currentExecution, setCurrentExecution] = useState<ExecutionStartedEvent | null>(null);
  const [progress, setProgress] = useState({ completed: 0, total: 0 });
  
  const socketRef = useRef<Socket | null>(null);

  // Initialize socket connection
  useEffect(() => {
    if (!enabled || !executionId) {
      return;
    }

    console.log(`🔌 Connecting to WebSocket for execution: ${executionId}`);

    const newSocket = io('http://localhost:3001/execution', {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    socketRef.current = newSocket;

    newSocket.on('connect', () => {
      console.log('✅ WebSocket connected');
      setIsConnected(true);
      
      // Subscribe to execution updates
      newSocket.emit('subscribe', { executionId });
    });

    newSocket.on('disconnect', () => {
      console.log('❌ WebSocket disconnected');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('🔴 WebSocket connection error:', error);
      setIsConnected(false);
    });

    // Handle execution started
    newSocket.on('execution:started', (data: ExecutionStartedEvent) => {
      console.log('🚀 Execution started:', data);
      setCurrentExecution(data);
      setProgress({ completed: 0, total: data.totalNodes });
      setLogs([]); // Clear logs for new execution
    });

    // Handle node started
    newSocket.on('node:started', (data: NodeStartedEvent) => {
      console.log('🔵 Node started:', data);
      if (onNodeStatusChange) {
        onNodeStatusChange(data.nodeId, 'running');
      }
    });

    // Handle node completed
    newSocket.on('node:completed', (data: NodeCompletedEvent) => {
      console.log('✅ Node completed:', data);
      if (onNodeStatusChange) {
        onNodeStatusChange(data.nodeId, 'success', data.output);
      }
      setProgress(prev => ({ ...prev, completed: prev.completed + 1 }));
    });

    // Handle node failed
    newSocket.on('node:failed', (data: NodeFailedEvent) => {
      console.error('❌ Node failed:', data);
      if (onNodeStatusChange) {
        onNodeStatusChange(data.nodeId, 'error', { error: data.error, details: data.errorDetails });
      }
      setProgress(prev => ({ ...prev, completed: prev.completed + 1 }));
    });

    // Handle log messages
    newSocket.on('log', (data: LogMessageEvent) => {
      console.log(`📝 [${data.level.toUpperCase()}] ${data.message}`);
      setLogs(prev => [...prev, data]);
    });

    // Handle execution completed
    newSocket.on('execution:completed', (data: ExecutionCompletedEvent) => {
      console.log('🎉 Execution completed:', data);
      setProgress({ completed: data.nodesExecuted, total: data.nodesExecuted });
    });

    // Handle execution failed
    newSocket.on('execution:failed', (data: ExecutionFailedEvent) => {
      console.error('💥 Execution failed:', data);
    });

    setSocket(newSocket);

    // Cleanup on unmount
    return () => {
      console.log('🔌 Disconnecting WebSocket');
      if (executionId) {
        newSocket.emit('unsubscribe', { executionId });
      }
      newSocket.close();
      socketRef.current = null;
    };
  }, [executionId, enabled, onNodeStatusChange]);

  // Clear logs function
  const clearLogs = useCallback(() => {
    setLogs([]);
  }, []);

  // Get filtered logs
  const getFilteredLogs = useCallback((level?: 'info' | 'warn' | 'error') => {
    if (!level) return logs;
    return logs.filter(log => log.level === level);
  }, [logs]);

  // Get progress percentage
  const progressPercentage = progress.total > 0 
    ? Math.round((progress.completed / progress.total) * 100) 
    : 0;

  return {
    socket,
    isConnected,
    logs,
    currentExecution,
    progress: {
      ...progress,
      percentage: progressPercentage,
    },
    clearLogs,
    getFilteredLogs,
  };
}
