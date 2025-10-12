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
        id: 'cronTrigger-1',
        type: 'workflow',
        position: { x: 100, y: 250 },
        data: {
          label: 'Daily Schedule',
          nodeType: 'cronTrigger',
          category: 'trigger',
          description: 'Trigger workflow vào 9h sáng hàng ngày',
          icon: '⏰',
          status: 'idle',
          configured: false,
          inputs: [
            {
              id: 'trigger',
              name: 'trigger',
              type: 'any',
              required: false,
              description: 'Input from previous node'
            },
            {
              id: 'cronExpression',
              name: 'cronExpression',
              type: 'string',
              required: false,
              description: 'Cron expression (e.g., "0 9 * * 1-5" for 9am weekdays)',
              defaultValue: '0 9 * * *',
              isConfig: true
            },
            {
              id: 'timezone',
              name: 'timezone',
              type: 'string',
              required: false,
              description: 'Timezone for cron schedule',
              defaultValue: 'Asia/Ho_Chi_Minh',
              isConfig: true
            }
          ],
          outputs: [
            {
              id: 'result',
              name: 'result',
              type: 'any',
              description: 'Cron trigger data'
            }
          ],
          parameters: {}
        },
        style: { background: '#8B5CF6' },
        width: 240,
        height: 95
      },
      {
        id: 'sendEmail-1',
        type: 'workflow',
        position: { x: 450, y: 250 },
        data: {
          label: 'Send Email',
          nodeType: 'sendEmail',
          category: 'action',
          description: 'Gửi email với nội dung được config',
          icon: '📧',
          status: 'idle',
          configured: false,
          inputs: [
            {
              id: 'trigger',
              name: 'trigger',
              type: 'any',
              required: false,
              description: 'Input from previous node'
            },
            {
              id: 'to',
              name: 'to',
              type: 'string',
              required: true,
              description: 'Email recipient address',
              isConfig: true
            },
            {
              id: 'subject',
              name: 'subject',
              type: 'string',
              required: true,
              description: 'Email subject',
              isConfig: true
            },
            {
              id: 'body',
              name: 'body',
              type: 'string',
              required: true,
              description: 'Email body (HTML supported)',
              isConfig: true
            },
            {
              id: 'recipientName',
              name: 'recipientName',
              type: 'string',
              required: false,
              description: 'Recipient name (optional)',
              isConfig: true
            }
          ],
          outputs: [
            {
              id: 'result',
              name: 'result',
              type: 'any',
              description: 'Email send result'
            }
          ],
          parameters: {}
        },
        style: { background: '#3B82F6' },
        width: 240,
        height: 95
      }
    ],
    edges: [
      {
        id: 'e-cronTrigger-1-sendEmail-1',
        source: 'cronTrigger-1',
        target: 'sendEmail-1',
        sourceHandle: 'result',
        targetHandle: 'trigger',
        type: 'smoothstep',
        style: { stroke: '#6366F1', strokeWidth: 2 },
        animated: true,
        selected: false,
        labelStyle: { fill: '#64748b', fontSize: 11, fontWeight: 500 }
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
        position: { x: 100, y: 250 },
        data: {
          label: 'Start',
          category: 'start',
          description: 'Entry point của workflow'
        }
      },
      {
        id: 'httpRequest-1',
        type: 'workflow',
        position: { x: 100, y: 300 },
        data: {
          label: 'Fetch API Data',
          nodeType: 'httpRequest',
          category: 'action',
          description: 'Lấy dữ liệu từ REST API',
          icon: '🌐',
          status: 'idle',
          configured: false,
          inputs: [
            {
              id: 'trigger',
              name: 'trigger',
              type: 'any',
              required: false,
              description: 'Input from previous node'
            },
            {
              id: 'url',
              name: 'url',
              type: 'string',
              required: true,
              description: 'API endpoint URL',
              isConfig: true
            },
            {
              id: 'method',
              name: 'method',
              type: 'string',
              required: true,
              description: 'HTTP method (GET, POST, etc.)',
              defaultValue: 'GET',
              isConfig: true
            }
          ],
          outputs: [
            {
              id: 'result',
              name: 'result',
              type: 'object',
              description: 'HTTP response data'
            }
          ],
          parameters: {}
        },
        style: { background: '#10B981' },
        width: 240,
        height: 95
      },
      {
        id: 'dataTransform-1',
        type: 'workflow',
        position: { x: 450, y: 300 },
        data: {
          label: 'Transform Data',
          nodeType: 'dataTransform',
          category: 'transform',
          description: 'Transform và format dữ liệu',
          icon: '🔄',
          status: 'idle',
          configured: false,
          inputs: [
            {
              id: 'trigger',
              name: 'trigger',
              type: 'any',
              required: false,
              description: 'Input from previous node'
            },
            {
              id: 'data',
              name: 'data',
              type: 'object',
              required: true,
              description: 'Raw data to be transformed',
              isConfig: true
            },
            {
              id: 'transformScript',
              name: 'transformScript',
              type: 'string',
              required: true,
              description: 'JavaScript transformation code',
              isConfig: true
            }
          ],
          outputs: [
            {
              id: 'result',
              name: 'result',
              type: 'object',
              description: 'Transformed data'
            }
          ],
          parameters: {}
        },
        style: { background: '#F59E0B' },
        width: 240,
        height: 95
      },
      {
        id: 'databaseInsert-1',
        type: 'workflow',
        position: { x: 800, y: 300 },
        data: {
          label: 'Save to Database',
          nodeType: 'databaseInsert',
          category: 'action',
          description: 'Lưu dữ liệu vào database',
          icon: '💾',
          status: 'idle',
          configured: false,
          inputs: [
            {
              id: 'trigger',
              name: 'trigger',
              type: 'any',
              required: false,
              description: 'Input from previous node'
            },
            {
              id: 'data',
              name: 'data',
              type: 'object',
              required: true,
              description: 'Data to be saved',
              isConfig: true
            },
            {
              id: 'table',
              name: 'table',
              type: 'string',
              required: true,
              description: 'Database table name',
              isConfig: true
            }
          ],
          outputs: [
            {
              id: 'result',
              name: 'result',
              type: 'object',
              description: 'Insert operation result'
            }
          ],
          parameters: {}
        },
        style: { background: '#8B5CF6' },
        width: 240,
        height: 95
      }
    ],
    edges: [
      {
        id: 'e-httpRequest-1-dataTransform-1',
        source: 'httpRequest-1',
        target: 'dataTransform-1',
        sourceHandle: 'result',
        targetHandle: 'trigger',
        type: 'smoothstep',
        style: { stroke: '#6366F1', strokeWidth: 2 },
        animated: true,
        selected: false,
        labelStyle: { fill: '#64748b', fontSize: 11, fontWeight: 500 }
      },
      {
        id: 'e-dataTransform-1-databaseInsert-1',
        source: 'dataTransform-1',
        target: 'databaseInsert-1',
        sourceHandle: 'result',
        targetHandle: 'trigger',
        type: 'smoothstep',
        style: { stroke: '#6366F1', strokeWidth: 2 },
        animated: true,
        selected: false,
        labelStyle: { fill: '#64748b', fontSize: 11, fontWeight: 500 }
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
        position: { x: 100, y: 250 },
        data: {
          label: 'Start',
          category: 'start',
          description: 'Entry point của workflow'
        }
      },
      {
        id: 'dataFetch-1',
        type: 'workflow',
        position: { x: 100, y: 300 },
        data: {
          label: 'Get Data',
          nodeType: 'dataFetch',
          category: 'data',
          description: 'Lấy dữ liệu cần kiểm tra',
          icon: '📥',
          status: 'idle',
          configured: false,
          inputs: [
            {
              id: 'trigger',
              name: 'trigger',
              type: 'any',
              required: false,
              description: 'Input from previous node'
            },
            {
              id: 'source',
              name: 'source',
              type: 'string',
              required: true,
              description: 'Data source',
              isConfig: true
            }
          ],
          outputs: [
            {
              id: 'result',
              name: 'result',
              type: 'object',
              description: 'Fetched data'
            }
          ],
          parameters: {}
        },
        style: { background: '#10B981' },
        width: 240,
        height: 95
      },
      {
        id: 'ifElse-1',
        type: 'workflow',
        position: { x: 450, y: 300 },
        data: {
          label: 'Check Condition',
          nodeType: 'ifElse',
          category: 'logic',
          description: 'Kiểm tra điều kiện if/else',
          icon: '❓',
          status: 'idle',
          configured: false,
          inputs: [
            {
              id: 'trigger',
              name: 'trigger',
              type: 'any',
              required: false,
              description: 'Input from previous node'
            },
            {
              id: 'condition',
              name: 'condition',
              type: 'string',
              required: true,
              description: 'Condition expression to evaluate',
              isConfig: true
            }
          ],
          outputs: [
            {
              id: 'true',
              name: 'true',
              type: 'any',
              description: 'Output when condition is true'
            },
            {
              id: 'false',
              name: 'false',
              type: 'any',
              description: 'Output when condition is false'
            }
          ],
          parameters: {}
        },
        style: { background: '#F59E0B' },
        width: 240,
        height: 95
      },
      {
        id: 'sendEmail-success',
        type: 'workflow',
        position: { x: 800, y: 200 },
        data: {
          label: 'Send Success Email',
          nodeType: 'sendEmail',
          category: 'action',
          description: 'Gửi email khi điều kiện TRUE',
          icon: '✅',
          status: 'idle',
          configured: false,
          inputs: [
            {
              id: 'trigger',
              name: 'trigger',
              type: 'any',
              required: false,
              description: 'Input from previous node'
            },
            {
              id: 'to',
              name: 'to',
              type: 'string',
              required: true,
              description: 'Email recipient address',
              isConfig: true
            },
            {
              id: 'subject',
              name: 'subject',
              type: 'string',
              required: true,
              description: 'Email subject',
              isConfig: true
            },
            {
              id: 'body',
              name: 'body',
              type: 'string',
              required: true,
              description: 'Email body',
              isConfig: true
            }
          ],
          outputs: [
            {
              id: 'result',
              name: 'result',
              type: 'any',
              description: 'Email send result'
            }
          ],
          parameters: {}
        },
        style: { background: '#10B981' },
        width: 240,
        height: 95
      },
      {
        id: 'sendEmail-fail',
        type: 'workflow',
        position: { x: 800, y: 400 },
        data: {
          label: 'Send Alert Email',
          nodeType: 'sendEmail',
          category: 'action',
          description: 'Gửi email cảnh báo khi FALSE',
          icon: '⚠️',
          status: 'idle',
          configured: false,
          inputs: [
            {
              id: 'trigger',
              name: 'trigger',
              type: 'any',
              required: false,
              description: 'Input from previous node'
            },
            {
              id: 'to',
              name: 'to',
              type: 'string',
              required: true,
              description: 'Email recipient address',
              isConfig: true
            },
            {
              id: 'subject',
              name: 'subject',
              type: 'string',
              required: true,
              description: 'Email subject',
              isConfig: true
            },
            {
              id: 'body',
              name: 'body',
              type: 'string',
              required: true,
              description: 'Email body',
              isConfig: true
            }
          ],
          outputs: [
            {
              id: 'result',
              name: 'result',
              type: 'any',
              description: 'Email send result'
            }
          ],
          parameters: {}
        },
        style: { background: '#EF4444' },
        width: 240,
        height: 95
      }
    ],
    edges: [
      {
        id: 'e-dataFetch-1-ifElse-1',
        source: 'dataFetch-1',
        target: 'ifElse-1',
        sourceHandle: 'result',
        targetHandle: 'trigger',
        type: 'smoothstep',
        style: { stroke: '#6366F1', strokeWidth: 2 },
        animated: true,
        selected: false,
        labelStyle: { fill: '#64748b', fontSize: 11, fontWeight: 500 }
      },
      {
        id: 'e-ifElse-1-sendEmail-success',
        source: 'ifElse-1',
        target: 'sendEmail-success',
        sourceHandle: 'true',
        targetHandle: 'trigger',
        type: 'smoothstep',
        style: { stroke: '#10B981', strokeWidth: 2 },
        animated: true,
        selected: false,
        label: 'True',
        labelStyle: { fill: '#10B981', fontSize: 11, fontWeight: 500 }
      },
      {
        id: 'e-ifElse-1-sendEmail-fail',
        source: 'ifElse-1',
        target: 'sendEmail-fail',
        sourceHandle: 'false',
        targetHandle: 'trigger',
        type: 'smoothstep',
        style: { stroke: '#EF4444', strokeWidth: 2 },
        animated: true,
        selected: false,
        label: 'False',
        labelStyle: { fill: '#EF4444', fontSize: 11, fontWeight: 500 }
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
        id: 'cronTrigger-1',
        type: 'workflow',
        position: { x: 100, y: 250 },
        data: {
          label: 'Weekly Schedule',
          nodeType: 'cronTrigger',
          category: 'trigger',
          description: 'Trigger mỗi thứ 2 lúc 8h sáng',
          icon: '📅',
          status: 'idle',
          configured: false,
          inputs: [
            {
              id: 'trigger',
              name: 'trigger',
              type: 'any',
              required: false,
              description: 'Input from previous node'
            },
            {
              id: 'cronExpression',
              name: 'cronExpression',
              type: 'string',
              required: false,
              description: 'Cron expression',
              defaultValue: '0 8 * * 1',
              isConfig: true
            }
          ],
          outputs: [
            {
              id: 'result',
              name: 'result',
              type: 'any',
              description: 'Trigger data'
            }
          ],
          parameters: {}
        },
        style: { background: '#8B5CF6' },
        width: 240,
        height: 95
      },
      {
        id: 'databaseQuery-1',
        type: 'workflow',
        position: { x: 450, y: 250 },
        data: {
          label: 'Query Database',
          nodeType: 'databaseQuery',
          category: 'data',
          description: 'Lấy dữ liệu từ database',
          icon: '🔍',
          status: 'idle',
          configured: false,
          inputs: [
            {
              id: 'trigger',
              name: 'trigger',
              type: 'any',
              required: false,
              description: 'Input from previous node'
            },
            {
              id: 'query',
              name: 'query',
              type: 'string',
              required: true,
              description: 'SQL query',
              isConfig: true
            }
          ],
          outputs: [
            {
              id: 'result',
              name: 'result',
              type: 'array',
              description: 'Query results'
            }
          ],
          parameters: {}
        },
        style: { background: '#10B981' },
        width: 240,
        height: 95
      },
      {
        id: 'generateQRCode-1',
        type: 'workflow',
        position: { x: 800, y: 250 },
        data: {
          label: 'Generate QR Code',
          nodeType: 'generateQRCode',
          category: 'action',
          description: 'Generate QR code from data',
          icon: '📱',
          status: 'idle',
          configured: false,
          inputs: [
            {
              id: 'trigger',
              name: 'trigger',
              type: 'any',
              required: false,
              description: 'Input from previous node'
            },
            {
              id: 'text',
              name: 'text',
              type: 'string',
              required: true,
              description: 'Text or URL to encode',
              isConfig: true
            },
            {
              id: 'size',
              name: 'size',
              type: 'number',
              required: false,
              description: 'QR code size in pixels',
              defaultValue: 300,
              isConfig: true
            }
          ],
          outputs: [
            {
              id: 'result',
              name: 'result',
              type: 'any',
              description: 'QR code data'
            }
          ],
          parameters: {}
        },
        style: { background: '#8B5CF6' },
        width: 240,
        height: 95
      },
      {
        id: 'sendEmail-1',
        type: 'workflow',
        position: { x: 1150, y: 250 },
        data: {
          label: 'Email Report',
          nodeType: 'sendEmail',
          category: 'action',
          description: 'Gửi report qua email',
          icon: '📧',
          status: 'idle',
          configured: false,
          inputs: [
            {
              id: 'trigger',
              name: 'trigger',
              type: 'any',
              required: false,
              description: 'Input from previous node'
            },
            {
              id: 'to',
              name: 'to',
              type: 'string',
              required: true,
              description: 'Email recipient',
              isConfig: true
            },
            {
              id: 'subject',
              name: 'subject',
              type: 'string',
              required: true,
              description: 'Email subject',
              isConfig: true
            },
            {
              id: 'body',
              name: 'body',
              type: 'string',
              required: true,
              description: 'Email body',
              isConfig: true
            }
          ],
          outputs: [
            {
              id: 'result',
              name: 'result',
              type: 'any',
              description: 'Email result'
            }
          ],
          parameters: {}
        },
        style: { background: '#3B82F6' },
        width: 240,
        height: 95
      }
    ],
    edges: [
      {
        id: 'e-cronTrigger-1-databaseQuery-1',
        source: 'cronTrigger-1',
        target: 'databaseQuery-1',
        sourceHandle: 'result',
        targetHandle: 'trigger',
        type: 'smoothstep',
        style: { stroke: '#6366F1', strokeWidth: 2 },
        animated: true,
        selected: false,
        labelStyle: { fill: '#64748b', fontSize: 11, fontWeight: 500 }
      },
      {
        id: 'e-databaseQuery-1-generateQRCode-1',
        source: 'databaseQuery-1',
        target: 'generateQRCode-1',
        sourceHandle: 'result',
        targetHandle: 'trigger',
        type: 'smoothstep',
        style: { stroke: '#6366F1', strokeWidth: 2 },
        animated: true,
        selected: false,
        labelStyle: { fill: '#64748b', fontSize: 11, fontWeight: 500 }
      },
      {
        id: 'e-generateQRCode-1-sendEmail-1',
        source: 'generateQRCode-1',
        target: 'sendEmail-1',
        sourceHandle: 'result',
        targetHandle: 'trigger',
        type: 'smoothstep',
        style: { stroke: '#6366F1', strokeWidth: 2 },
        animated: true,
        selected: false,
        labelStyle: { fill: '#64748b', fontSize: 11, fontWeight: 500 }
      }
    ]
  },
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