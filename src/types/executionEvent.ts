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
