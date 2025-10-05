/**
 * Node Runner Service
 * Connects Next.js client to Node Runner API
 * Endpoints: http://localhost:3001/api
 */

import { api } from '@/utils/api';

export interface NodeMetadata {
  type: string;
  category: 'trigger' | 'action' | 'logic' | 'data' | 'transform';
  name: string;
  description: string;
  icon?: string;
  inputs: Array<{
    name: string;
    type: string;
    required: boolean;
    description?: string;
    default?: any;
  }>;
  outputs: Array<{
    name: string;
    type: string;
    description?: string;
  }>;
}

export interface CronJob {
  flowId: string;
  name: string;
  cronExpression: string;
  isActive: boolean;
  createdAt: string;
  lastRunAt?: string;
  nextRunAt?: string;
}

export interface WorkflowExecution {
  _id: string;
  flowId: string;
  userId: string;
  status: 'running' | 'completed' | 'failed';
  startedAt: string;
  endedAt?: string;
  result?: any;
  error?: string;
  logs: string[];
}

/**
 * Node Runner Service
 */
export const nodeRunnerService = {
  /**
   * Get all available node types
   */
  async getAvailableNodes(): Promise<{ nodes: NodeMetadata[]; count: number }> {
    const response = await api.get('/workflow/nodes');
    return response.data;
  },

  /**
   * Get metadata for specific node type
   */
  async getNodeMetadata(nodeType: string): Promise<NodeMetadata> {
    const response = await api.get(`/workflow/nodes/${nodeType}`);
    return response.data;
  },

  /**
   * Execute a workflow
   */
  async executeWorkflow(flow: any, userId: string): Promise<{
    success: boolean;
    executionId: string;
    data?: any;
    error?: string;
  }> {
    const response = await api.post('/workflow/execute', { flow, userId });
    return response.data;
  },

  /**
   * Execute workflow by ID (fetch from Flow Service)
   */
  async executeWorkflowById(flowId: string, userId: string): Promise<{
    success: boolean;
    executionId: string;
    data?: any;
    error?: string;
  }> {
    const response = await api.post(`/workflow/execute/${flowId}`, { userId });
    return response.data;
  },

  /**
   * Get execution history for a flow
   */
  async getExecutionHistory(flowId: string, limit: number = 10): Promise<WorkflowExecution[]> {
    const response = await api.get(`/workflow/executions/${flowId}?limit=${limit}`);
    return response.data;
  },

  /**
   * Get specific execution by ID
   */
  async getExecution(executionId: string): Promise<WorkflowExecution> {
    const response = await api.get(`/workflow/execution/${executionId}`);
    return response.data;
  },

  /**
   * Retry a failed execution
   */
  async retryExecution(
    executionId: string,
    fromNodeId?: string
  ): Promise<{
    success: boolean;
    executionId: string;
    data?: any;
    error?: string;
  }> {
    const response = await api.post(`/workflow/retry/${executionId}`, {
      fromNodeId,
    });
    return response.data;
  },

  /**
   * Test mock workflow
   */
  async testWorkflow(): Promise<any> {
    const response = await api.post('/workflow/test', {});
    return response.data;
  },

  // ========== CRON JOB MANAGEMENT ==========

  /**
   * Create a cron job for a flow
   */
  async createCronJob(data: {
    flowId: string;
    name: string;
    cronExpression: string;
  }): Promise<{ success: boolean; message: string }> {
    const response = await api.post('/automation/cron/add', data);
    return response.data;
  },

  /**
   * Get all cron jobs
   */
  async getAllCronJobs(): Promise<CronJob[]> {
    const response = await api.get('/automation/cron/jobs');
    return response.data;
  },

  /**
   * Get cron jobs for specific flow
   */
  async getCronJobsByFlowId(flowId: string): Promise<CronJob[]> {
    const response = await api.get(`/automation/cron/jobs/${flowId}`);
    return response.data;
  },

  /**
   * Delete a cron job
   */
  async deleteCronJob(flowId: string, name: string): Promise<{ success: boolean }> {
    const response = await api.delete('/automation/cron/delete', {
      data: { flowId, name }
    });
    return response.data;
  },

  /**
   * Toggle cron job (pause/resume)
   */
  async toggleCronJob(
    flowId: string,
    name: string,
    isActive: boolean
  ): Promise<{ success: boolean }> {
    const response = await api.put('/automation/cron/toggle', {
      flowId,
      name,
      isActive
    });
    return response.data;
  },

  /**
   * Get cron statistics
   */
  async getCronStats(): Promise<{
    total: number;
    active: number;
    inactive: number;
  }> {
    const response = await api.get('/automation/cron/stats');
    return response.data;
  },

  // ========== EMAIL TESTING ==========

  /**
   * Send test email
   */
  async sendTestEmail(data: {
    to: string;
    subject: string;
    text: string;
  }): Promise<{ success: boolean; messageId: string }> {
    const response = await api.post('/automation/email/test', data);
    return response.data;
  },

  /**
   * Send attendance email
   */
  async sendAttendanceEmail(data: {
    to: string;
    recipientName: string;
    className: string;
    attendanceLink: string;
    sessionDate: string;
    sessionTime: string;
  }): Promise<{ success: boolean; messageId: string }> {
    const response = await api.post('/automation/email/attendance', data);
    return response.data;
  },

  /**
   * Send bulk emails
   */
  async sendBulkEmails(emails: Array<{
    to: string;
    subject: string;
    text?: string;
    html?: string;
  }>): Promise<{
    total: number;
    sent: number;
    failed: number;
    results: Array<{ email: string; success: boolean; error?: string }>;
  }> {
    const response = await api.post('/automation/email/bulk', { emails });
    return response.data;
  }
};

/**
 * Helper: Parse cron expression to human-readable format
 */
export function parseCronExpression(expression: string): string {
  const patterns: { [key: string]: string } = {
    '* * * * *': 'Every minute',
    '0 * * * *': 'Every hour',
    '0 0 * * *': 'Daily at midnight',
    '0 8 * * *': 'Daily at 8:00 AM',
    '0 9 * * 1-5': 'Weekdays at 9:00 AM',
    '0 0 * * 0': 'Weekly on Sunday',
    '0 8,14 * * *': 'Daily at 8:00 AM and 2:00 PM',
    '*/15 * * * *': 'Every 15 minutes',
    '0 */2 * * *': 'Every 2 hours',
  };

  return patterns[expression] || expression;
}

/**
 * Helper: Validate cron expression
 */
export function validateCronExpression(expression: string): boolean {
  const parts = expression.split(' ');
  if (parts.length !== 5) return false;

  const patterns = [
    /^(\*|([0-9]|[1-5][0-9])(\/[0-9]+)?|([0-9]|[1-5][0-9])-([0-9]|[1-5][0-9]))$/, // minute
    /^(\*|([0-9]|1[0-9]|2[0-3])(\/[0-9]+)?|([0-9]|1[0-9]|2[0-3])-([0-9]|1[0-9]|2[0-3]))$/, // hour
    /^(\*|([1-9]|[12][0-9]|3[01])(\/[0-9]+)?|([1-9]|[12][0-9]|3[01])-([1-9]|[12][0-9]|3[01]))$/, // day
    /^(\*|([1-9]|1[0-2])(\/[0-9]+)?|([1-9]|1[0-2])-([1-9]|1[0-2]))$/, // month
    /^(\*|[0-6](\/[0-9]+)?|[0-6]-[0-6])$/, // day of week
  ];

  return parts.every((part, index) => patterns[index].test(part));
}

/**
 * Helper: Get node category color
 */
export function getNodeCategoryColor(category: string): string {
  const colors: { [key: string]: string } = {
    trigger: 'bg-blue-500',
    action: 'bg-green-500',
    logic: 'bg-purple-500',
    data: 'bg-yellow-500',
    transform: 'bg-orange-500',
  };
  return colors[category] || 'bg-gray-500';
}

/**
 * Helper: Format execution status
 */
export function formatExecutionStatus(status: string): {
  label: string;
  color: string;
  icon: string;
} {
  const statusMap: { [key: string]: { label: string; color: string; icon: string } } = {
    running: { label: 'Running', color: 'text-blue-600', icon: '⏳' },
    completed: { label: 'Completed', color: 'text-green-600', icon: '✅' },
    failed: { label: 'Failed', color: 'text-red-600', icon: '❌' },
  };
  return statusMap[status] || { label: status, color: 'text-gray-600', icon: '❓' };
}
