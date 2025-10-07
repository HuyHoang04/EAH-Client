import { FlowResponse } from '@/services/flowService';

export interface FlowStatus {
  isActive: boolean;
  hasStartConnection: boolean;
  firstNode: string | null;
}

export interface FlowEditorState {
  flowData: FlowResponse | null;
  isLoading: boolean;
  isSaving: boolean;
  flowStatus: FlowStatus;
  showSidebar: boolean;
  activeTab: 'nodes' | 'config' | 'execute' | 'schedule' | 'history' | 'logs';
  sidebarWidth: number;
  isResizing: boolean;
  selectedNodeId: string | null;
  currentExecutionId: string | null;
  isExecuting: boolean;
  showTemplateModal: boolean;
}
