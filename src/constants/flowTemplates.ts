/**
 * Flow Templates
 * Pre-built workflow templates for common use cases
 */

import { Node, Edge } from 'reactflow';

export interface FlowTemplate {
  id: string;
  name: string;
  description: string;
  category: 'automation' | 'data-processing' | 'notification' | 'integration';
  icon: string;
  thumbnail?: string;
  nodes: Node[];
  edges: Edge[];
  tags: string[];
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  useCases: string[];
}

export const FLOW_TEMPLATES: FlowTemplate[] = [
  // ============================================
  // 1. EMAIL AUTOMATION (Beginner)
  // ============================================
  {
    id: 'email-automation-basic',
    name: 'Email Automation',
    description: 'Tự động gửi email theo lịch hàng ngày. Phù hợp cho thông báo định kỳ, reminder, hoặc newsletter.',
    category: 'automation',
    icon: 'mail',
    difficulty: 'beginner',
    tags: ['email', 'notification', 'automation', 'schedule'],
    useCases: [
      'Gửi email thông báo hàng ngày',
      'Reminder cho sự kiện',
      'Newsletter tự động'
    ],
    nodes: [
      {
        id: 'start-node',
        type: 'startNode',
        position: { x: 100, y: 250 },
        data: {
          label: 'Start',
          category: 'start',
          description: 'Entry point của workflow'
        }
      },
      {
        id: 'schedule-1',
        type: 'workflow',
        position: { x: 350, y: 250 },
        data: {
          label: 'Daily Schedule',
          nodeType: 'schedule',
          category: 'trigger',
          description: 'Trigger workflow vào 9h sáng hàng ngày',
          icon: 'clock',
          inputs: [
            { id: 'trigger', name: 'Trigger', type: 'any', required: false }
          ],
          outputs: [
            { id: 'output', name: 'Output', type: 'any' }
          ],
          configured: false
        }
      },
      {
        id: 'email-1',
        type: 'workflow',
        position: { x: 650, y: 250 },
        data: {
          label: 'Send Email',
          nodeType: 'sendEmail',
          category: 'action',
          description: 'Gửi email với nội dung được config',
          icon: 'mail',
          inputs: [
            { id: 'input', name: 'Data', type: 'any', required: true }
          ],
          outputs: [
            { id: 'output', name: 'Result', type: 'object' }
          ],
          configured: false
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'start-node',
        target: 'schedule-1',
        sourceHandle: 'start-output',
        targetHandle: 'trigger'
      },
      {
        id: 'e2',
        source: 'schedule-1',
        target: 'email-1',
        sourceHandle: 'output',
        targetHandle: 'input'
      }
    ]
  },

  // ============================================
  // 2. DATA PROCESSING (Intermediate)
  // ============================================
  {
    id: 'data-processing-etl',
    name: 'Data Processing Pipeline',
    description: 'Lấy dữ liệu từ nguồn, xử lý và transform, rồi lưu vào database. Phù hợp cho ETL workflows.',
    category: 'data-processing',
    icon: 'bar-chart-3',
    difficulty: 'intermediate',
    tags: ['data', 'etl', 'transform', 'database'],
    useCases: [
      'Import dữ liệu từ API',
      'Data transformation pipeline',
      'Sync data giữa các hệ thống'
    ],
    nodes: [
      {
        id: 'start-node',
        type: 'startNode',
        position: { x: 100, y: 300 },
        data: {
          label: 'Start',
          category: 'start',
          description: 'Entry point của workflow'
        }
      },
      {
        id: 'http-1',
        type: 'workflow',
        position: { x: 350, y: 300 },
        data: {
          label: 'Fetch API Data',
          nodeType: 'httpRequest',
          category: 'action',
          description: 'Lấy dữ liệu từ REST API',
          icon: 'globe',
          inputs: [
            { id: 'trigger', name: 'Trigger', type: 'any', required: false }
          ],
          outputs: [
            { id: 'output', name: 'Response', type: 'object' }
          ],
          configured: false
        }
      },
      {
        id: 'transform-1',
        type: 'workflow',
        position: { x: 650, y: 300 },
        data: {
          label: 'Transform Data',
          nodeType: 'dataTransform',
          category: 'transform',
          description: 'Transform và format dữ liệu',
          icon: 'refresh-cw',
          inputs: [
            { id: 'input', name: 'Raw Data', type: 'object', required: true }
          ],
          outputs: [
            { id: 'output', name: 'Transformed', type: 'object' }
          ],
          configured: false
        }
      },
      {
        id: 'db-1',
        type: 'workflow',
        position: { x: 950, y: 300 },
        data: {
          label: 'Save to Database',
          nodeType: 'databaseInsert',
          category: 'action',
          description: 'Lưu dữ liệu vào database',
          icon: 'save',
          inputs: [
            { id: 'input', name: 'Data', type: 'object', required: true }
          ],
          outputs: [
            { id: 'output', name: 'Result', type: 'object' }
          ],
          configured: false
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'start-node',
        target: 'http-1',
        sourceHandle: 'start-output',
        targetHandle: 'trigger'
      },
      {
        id: 'e2',
        source: 'http-1',
        target: 'transform-1',
        sourceHandle: 'output',
        targetHandle: 'input'
      },
      {
        id: 'e3',
        source: 'transform-1',
        target: 'db-1',
        sourceHandle: 'output',
        targetHandle: 'input'
      }
    ]
  },

  // ============================================
  // 3. CONDITIONAL WORKFLOW (Advanced)
  // ============================================
  {
    id: 'conditional-notification',
    name: 'Conditional Notification',
    description: 'Kiểm tra điều kiện và gửi thông báo khác nhau dựa trên kết quả. Sử dụng logic branching.',
    category: 'automation',
    icon: 'git-branch',
    difficulty: 'advanced',
    tags: ['conditional', 'logic', 'notification', 'branching'],
    useCases: [
      'Alert dựa trên threshold',
      'Workflow với nhiều nhánh',
      'Decision-based automation'
    ],
    nodes: [
      {
        id: 'start-node',
        type: 'startNode',
        position: { x: 100, y: 300 },
        data: {
          label: 'Start',
          category: 'start',
          description: 'Entry point của workflow'
        }
      },
      {
        id: 'data-1',
        type: 'workflow',
        position: { x: 350, y: 300 },
        data: {
          label: 'Get Data',
          nodeType: 'dataFetch',
          category: 'data',
          description: 'Lấy dữ liệu cần kiểm tra',
          icon: 'download',
          inputs: [
            { id: 'trigger', name: 'Trigger', type: 'any', required: false }
          ],
          outputs: [
            { id: 'output', name: 'Data', type: 'object' }
          ],
          configured: false
        }
      },
      {
        id: 'condition-1',
        type: 'workflow',
        position: { x: 650, y: 300 },
        data: {
          label: 'Check Condition',
          nodeType: 'ifElse',
          category: 'logic',
          description: 'Kiểm tra điều kiện if/else',
          icon: 'help-circle',
          inputs: [
            { id: 'input', name: 'Data', type: 'object', required: true }
          ],
          outputs: [
            { id: 'true', name: 'True', type: 'any' },
            { id: 'false', name: 'False', type: 'any' }
          ],
          configured: false
        }
      },
      {
        id: 'email-success',
        type: 'workflow',
        position: { x: 950, y: 200 },
        data: {
          label: 'Send Success Email',
          nodeType: 'sendEmail',
          category: 'action',
          description: 'Gửi email khi điều kiện TRUE',
          icon: 'check-circle',
          inputs: [
            { id: 'input', name: 'Data', type: 'any', required: true }
          ],
          outputs: [
            { id: 'output', name: 'Result', type: 'object' }
          ],
          configured: false
        }
      },
      {
        id: 'email-fail',
        type: 'workflow',
        position: { x: 950, y: 400 },
        data: {
          label: 'Send Alert Email',
          nodeType: 'sendEmail',
          category: 'action',
          description: 'Gửi email cảnh báo khi FALSE',
          icon: 'alert-triangle',
          inputs: [
            { id: 'input', name: 'Data', type: 'any', required: true }
          ],
          outputs: [
            { id: 'output', name: 'Result', type: 'object' }
          ],
          configured: false
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'start-node',
        target: 'data-1',
        sourceHandle: 'start-output',
        targetHandle: 'trigger'
      },
      {
        id: 'e2',
        source: 'data-1',
        target: 'condition-1',
        sourceHandle: 'output',
        targetHandle: 'input'
      },
      {
        id: 'e3-true',
        source: 'condition-1',
        target: 'email-success',
        sourceHandle: 'true',
        targetHandle: 'input',
        type: 'conditional',
        data: { condition: 'true' }
      },
      {
        id: 'e4-false',
        source: 'condition-1',
        target: 'email-fail',
        sourceHandle: 'false',
        targetHandle: 'input',
        type: 'conditional',
        data: { condition: 'false' }
      }
    ]
  },

  // ============================================
  // 4. SCHEDULED REPORT (Intermediate)
  // ============================================
  {
    id: 'scheduled-report',
    name: 'Scheduled Report Generation',
    description: 'Tự động tạo report định kỳ từ database và gửi qua email. Phù hợp cho báo cáo hàng tuần/tháng.',
    category: 'automation',
    icon: 'trending-up',
    difficulty: 'intermediate',
    tags: ['report', 'schedule', 'email', 'database'],
    useCases: [
      'Weekly sales report',
      'Monthly analytics report',
      'Automated business reports'
    ],
    nodes: [
      {
        id: 'start-node',
        type: 'startNode',
        position: { x: 100, y: 250 },
        data: {
          label: 'Start',
          category: 'start',
          description: 'Entry point của workflow'
        }
      },
      {
        id: 'schedule-1',
        type: 'workflow',
        position: { x: 350, y: 250 },
        data: {
          label: 'Weekly Schedule',
          nodeType: 'schedule',
          category: 'trigger',
          description: 'Trigger mỗi thứ 2 lúc 8h sáng',
          icon: 'calendar',
          inputs: [
            { id: 'trigger', name: 'Trigger', type: 'any', required: false }
          ],
          outputs: [
            { id: 'output', name: 'Output', type: 'any' }
          ],
          configured: false
        }
      },
      {
        id: 'db-query',
        type: 'workflow',
        position: { x: 650, y: 250 },
        data: {
          label: 'Query Database',
          nodeType: 'databaseQuery',
          category: 'data',
          description: 'Lấy dữ liệu từ database',
          icon: 'search',
          inputs: [
            { id: 'input', name: 'Trigger', type: 'any', required: true }
          ],
          outputs: [
            { id: 'output', name: 'Data', type: 'array' }
          ],
          configured: false
        }
      },
      {
        id: 'generate-report',
        type: 'workflow',
        position: { x: 950, y: 250 },
        data: {
          label: 'Generate Report',
          nodeType: 'reportGenerator',
          category: 'transform',
          description: 'Tạo file report (PDF/Excel)',
          icon: 'bar-chart',
          inputs: [
            { id: 'input', name: 'Data', type: 'array', required: true }
          ],
          outputs: [
            { id: 'output', name: 'Report', type: 'file' }
          ],
          configured: false
        }
      },
      {
        id: 'send-email',
        type: 'workflow',
        position: { x: 1250, y: 250 },
        data: {
          label: 'Email Report',
          nodeType: 'sendEmail',
          category: 'action',
          description: 'Gửi report qua email',
          icon: 'mail',
          inputs: [
            { id: 'input', name: 'Attachment', type: 'file', required: true }
          ],
          outputs: [
            { id: 'output', name: 'Result', type: 'object' }
          ],
          configured: false
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'start-node',
        target: 'schedule-1',
        sourceHandle: 'start-output',
        targetHandle: 'trigger'
      },
      {
        id: 'e2',
        source: 'schedule-1',
        target: 'db-query',
        sourceHandle: 'output',
        targetHandle: 'input'
      },
      {
        id: 'e3',
        source: 'db-query',
        target: 'generate-report',
        sourceHandle: 'output',
        targetHandle: 'input'
      },
      {
        id: 'e4',
        source: 'generate-report',
        target: 'send-email',
        sourceHandle: 'output',
        targetHandle: 'input'
      }
    ]
  },

  // ============================================
  // 5. WEBHOOK INTEGRATION (Intermediate)
  // ============================================
  {
    id: 'webhook-integration',
    name: 'Webhook Integration',
    description: 'Nhận webhook từ external service và xử lý dữ liệu. Phù hợp cho integration với third-party apps.',
    category: 'integration',
    icon: 'link',
    difficulty: 'intermediate',
    tags: ['webhook', 'integration', 'api', 'real-time'],
    useCases: [
      'GitHub webhook integration',
      'Payment gateway notifications',
      'Third-party event handling'
    ],
    nodes: [
      {
        id: 'start-node',
        type: 'startNode',
        position: { x: 100, y: 250 },
        data: {
          label: 'Start',
          category: 'start',
          description: 'Entry point của workflow'
        }
      },
      {
        id: 'webhook-1',
        type: 'workflow',
        position: { x: 350, y: 250 },
        data: {
          label: 'Webhook Trigger',
          nodeType: 'webhook',
          category: 'trigger',
          description: 'Nhận webhook từ external service',
          icon: 'inbox',
          inputs: [
            { id: 'trigger', name: 'Trigger', type: 'any', required: false }
          ],
          outputs: [
            { id: 'output', name: 'Webhook Data', type: 'object' }
          ],
          configured: false
        }
      },
      {
        id: 'validate-1',
        type: 'workflow',
        position: { x: 650, y: 250 },
        data: {
          label: 'Validate Data',
          nodeType: 'dataValidation',
          category: 'logic',
          description: 'Validate webhook payload',
          icon: 'check',
          inputs: [
            { id: 'input', name: 'Data', type: 'object', required: true }
          ],
          outputs: [
            { id: 'output', name: 'Valid Data', type: 'object' }
          ],
          configured: false
        }
      },
      {
        id: 'process-1',
        type: 'workflow',
        position: { x: 950, y: 250 },
        data: {
          label: 'Process Event',
          nodeType: 'eventProcessor',
          category: 'action',
          description: 'Xử lý event từ webhook',
          icon: 'settings',
          inputs: [
            { id: 'input', name: 'Event', type: 'object', required: true }
          ],
          outputs: [
            { id: 'output', name: 'Result', type: 'object' }
          ],
          configured: false
        }
      }
    ],
    edges: [
      {
        id: 'e1',
        source: 'start-node',
        target: 'webhook-1',
        sourceHandle: 'start-output',
        targetHandle: 'trigger'
      },
      {
        id: 'e2',
        source: 'webhook-1',
        target: 'validate-1',
        sourceHandle: 'output',
        targetHandle: 'input'
      },
      {
        id: 'e3',
        source: 'validate-1',
        target: 'process-1',
        sourceHandle: 'output',
        targetHandle: 'input'
      }
    ]
  }
];

/**
 * Helper functions
 */

// Get templates by category
export const getTemplatesByCategory = (category: FlowTemplate['category']) => {
  return FLOW_TEMPLATES.filter(t => t.category === category);
};

// Get templates by difficulty
export const getTemplatesByDifficulty = (difficulty: FlowTemplate['difficulty']) => {
  return FLOW_TEMPLATES.filter(t => t.difficulty === difficulty);
};

// Get templates by tag
export const getTemplatesByTag = (tag: string) => {
  return FLOW_TEMPLATES.filter(t => t.tags.includes(tag));
};

// Search templates
export const searchTemplates = (query: string) => {
  const lowerQuery = query.toLowerCase();
  return FLOW_TEMPLATES.filter(t =>
    t.name.toLowerCase().includes(lowerQuery) ||
    t.description.toLowerCase().includes(lowerQuery) ||
    t.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
};

// Get all unique tags
export const getAllTags = () => {
  const tagsSet = new Set<string>();
  FLOW_TEMPLATES.forEach(t => t.tags.forEach(tag => tagsSet.add(tag)));
  return Array.from(tagsSet).sort();
};

// Get all categories
export const getAllCategories = () => {
  return ['automation', 'data-processing', 'notification', 'integration'] as const;
};
