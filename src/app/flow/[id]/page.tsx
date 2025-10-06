'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useState, useEffect, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  BackgroundVariant,
  Panel,
  useReactFlow,
  ReactFlowProvider,
  NodeTypes,
  ConnectionLineType,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ArrowLeft, Save, Play, Settings, Clock, History, Layers, Palette, Link, Zap, Mail, Wrench, Lightbulb, Calendar, Sunrise, Watch, AlertTriangle, CheckCircle, XCircle, Info } from 'lucide-react';
import { FlowService, FlowResponse } from '@/services/flowService';
import NodePalette from '@/components/NodePalette';
import CronJobManager from '@/components/CronJobManager';
import ExecutionHistory from '@/components/ExecutionHistory';
import WorkflowExecutor from '@/components/WorkflowExecutor';
import WorkflowNode from '@/components/WorkflowNode';
import StartNode from '@/components/nodes/StartNode';
import ConditionalEdge from '@/components/ConditionalEdge';
import ExecutionLogs from '@/components/ExecutionLogs';
import ExecutionProgress from '@/components/ExecutionProgress';
import { useExecutionSocket } from '@/hooks/useExecutionSocket';
import { TemplateModal } from '@/components/templates';
import { FlowTemplate } from '@/constants/flowTemplates';
import { SmartInput, FieldValue } from '@/components/workflow/reference';
import toast from 'react-hot-toast';

// Custom styles for selected nodes
const customStyles = `
  .react-flow__node.selected {
    outline: 3px solid #F59E0B;
    outline-offset: 0px;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3), 0 0 20px rgba(245, 158, 11, 0.4);
  }
  .react-flow__node {
    transition: box-shadow 0.15s ease, outline 0.15s ease;
  }
  .react-flow__node:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  body.resizing {
    cursor: col-resize !important;
    user-select: none;
  }
  body.resizing * {
    cursor: col-resize !important;
  }
  
  /* Edge Styling */
  .react-flow__edge-path {
    stroke-width: 2;
    transition: stroke-width 0.2s ease, stroke 0.2s ease;
  }
  .react-flow__edge:hover .react-flow__edge-path {
    stroke-width: 3;
  }
  .react-flow__edge.selected .react-flow__edge-path {
    stroke-width: 3;
    stroke: #F59E0B !important;
  }
  .react-flow__edge-text {
    font-size: 11px;
    font-weight: 500;
    fill: #64748b;
  }
  
  /* Conditional Branch Edges */
  .react-flow__edge.conditional .react-flow__edge-path {
    stroke-width: 2.5;
  }
  .react-flow__edge.conditional:hover .react-flow__edge-path {
    stroke-width: 3.5;
  }
  
  /* Connection Line Preview */
  .react-flow__connection-path {
    stroke: #6366F1 !important;
    stroke-width: 2;
    stroke-dasharray: 5, 5;
    animation: dash 0.5s linear infinite;
  }
  
  @keyframes dash {
    to {
      stroke-dashoffset: -10;
    }
  }
  
  /* Valid Drop Target Indicator */
  .react-flow__node.react-flow__node-valid-target {
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.4) !important;
    outline: 2px solid #22C55E !important;
  }
  
  .react-flow__node.react-flow__node-invalid-target {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.4) !important;
    outline: 2px solid #EF4444 !important;
  }
`;

// NodeConfigPanel component
interface NodeConfigPanelProps {
  nodeId: string;
  nodes: any[];
  setNodes: any;
  edges: any[];  // Add edges to check connections
}

function NodeConfigPanel({ nodeId, nodes, setNodes, edges }: NodeConfigPanelProps) {
  const selectedNode = nodes.find(node => node.id === nodeId);
  const [parameters, setParameters] = useState<Record<string, any>>({});
  
  // Initialize parameters from node data
  useEffect(() => {
    if (selectedNode?.data?.parameters) {
      setParameters(selectedNode.data.parameters);
    }
  }, [selectedNode?.id]);
  
  // Helper: Check if an input is connected
  const isInputConnected = (inputId: string) => {
    return edges.some(edge => 
      edge.target === nodeId && edge.targetHandle === inputId
    );
  };
  
  // Helper: Get source node for connected input
  const getConnectedSource = (inputId: string) => {
    const edge = edges.find(edge => 
      edge.target === nodeId && edge.targetHandle === inputId
    );
    if (!edge) return null;
    
    const sourceNode = nodes.find(n => n.id === edge.source);
    return sourceNode ? {
      nodeName: sourceNode.data.label,
      outputName: edge.sourceHandle || 'output'
    } : null;
  };
  
  if (!selectedNode) return null;

  const nodeData = selectedNode.data as any;

  const handleLabelChange = (newLabel: string) => {
    setNodes((nds: any[]) => 
      nds.map((node) => 
        node.id === nodeId 
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    );
  };

  const handleParameterChange = (paramName: string, value: any) => {
    const newParameters = { ...parameters, [paramName]: value };
    setParameters(newParameters);
    
    // Check if node has required fields configured
    const hasRequiredConfig = nodeData.inputs?.every((input: any) => {
      if (!input.required) return true;
      return newParameters[input.name] !== undefined && newParameters[input.name] !== '';
    }) ?? true;
    
    // Update node data with configured status
    setNodes((nds: any[]) => 
      nds.map((node) => 
        node.id === nodeId 
          ? { 
              ...node, 
              data: { 
                ...node.data, 
                parameters: newParameters,
                configured: hasRequiredConfig,
                status: hasRequiredConfig ? 'configured' : 'idle'
              } 
            }
          : node
      )
    );
  };

  const handleDeleteNode = () => {
    setNodes((nds: any[]) => nds.filter((node) => node.id !== nodeId));
  };

  const renderInputField = (input: any) => {
    const value = parameters[input.name] || input.defaultValue || '';
    const isConnected = isInputConnected(input.id);
    const connectedSource = isConnected ? getConnectedSource(input.id) : null;
    
    // If connected, show connection info instead of input field
    if (isConnected && connectedSource) {
      return (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-green-700 uppercase">Đã kết nối</span>
          </div>
          <div className="text-sm text-stone-700 bg-white rounded p-2 border border-green-200">
            <div className="flex items-center gap-2">
              <Link className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium">{connectedSource.nodeName}</div>
                <div className="text-xs text-stone-500">Output: {connectedSource.outputName}</div>
              </div>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <Lightbulb className="w-3 h-3" /> Trường này nhận dữ liệu từ node khác. Ngắt kết nối để nhập thủ công.
          </p>
        </div>
      );
    }
    
    // Special handler for cronExpression - with quick presets
    if (input.name === 'cronExpression' || input.id === 'cronExpression') {
      const presets = [
        { label: '9h sáng T2-6', value: '0 9 * * 1-5', icon: <Calendar className="w-3 h-3" /> },
        { label: '8h sáng hàng ngày', value: '0 8 * * *', icon: <Sunrise className="w-3 h-3" /> },
        { label: 'Mỗi giờ', value: '0 * * * *', icon: <Clock className="w-3 h-3" /> },
        { label: '12h trưa T2-6', value: '0 12 * * 1-5', icon: <Watch className="w-3 h-3" /> },
      ];

      return (
        <div className="space-y-3 bg-purple-50 p-3 rounded-lg border border-purple-200">
          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-stone-700 mb-2">
              <Zap className="w-3 h-3" /> Mẫu nhanh
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() => handleParameterChange(input.name, preset.value)}
                  className={`flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-colors text-left ${
                    value === preset.value
                      ? 'bg-purple-500 text-white'
                      : 'bg-white text-stone-700 border border-stone-300 hover:bg-purple-100'
                  }`}
                >
                  {preset.icon}
                  <div className="font-medium">{preset.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-stone-700 mb-1">
              <Zap className="w-3 h-3" /> Hoặc nhập thủ công
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) => handleParameterChange(input.name, e.target.value)}
              placeholder="Ví dụ: 0 9 * * 1-5"
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-stone-900 font-mono text-sm"
            />
          </div>

          {/* Helper */}
          <div className="bg-purple-100 p-2 rounded text-xs text-purple-900">
            � <strong>Mẹo:</strong> Cron format: [phút] [giờ] [ngày] [tháng] [thứ]<br/>
            • 0 9 * * 1-5 = 9h sáng thứ 2-6<br/>
            • 0 * * * * = Mỗi giờ
          </div>
        </div>
      );
    }
    
    // Determine input type based on the input's type
    switch (input.type.toLowerCase()) {
      case 'boolean':
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`param-${input.name}`}
              checked={value === true || value === 'true'}
              onChange={(e) => handleParameterChange(input.name, e.target.checked)}
              className="w-5 h-5 text-indigo-600 border-stone-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor={`param-${input.name}`} className="text-sm text-stone-700 cursor-pointer">
              {input.description || input.name}
            </label>
          </div>
        );
      
      case 'number':
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleParameterChange(input.name, e.target.value)}
            placeholder={`Nhập số...`}
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-stone-900"
          />
        );
      
      case 'array':
      case 'object':
        return (
          <textarea
            value={typeof value === 'string' ? value : JSON.stringify(value, null, 2)}
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleParameterChange(input.name, parsed);
              } catch {
                handleParameterChange(input.name, e.target.value);
              }
            }}
            placeholder={`Nhập JSON... ví dụ: {"key": "value"}`}
            rows={4}
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm text-stone-900"
          />
        );
      
      default: // string or any - USE SMART INPUT for text fields
        // Check if this is a field that should use SmartInput
        const useSmartInput = ['to', 'subject', 'body', 'message', 'content', 'text', 'url', 'path', 'email'].some(
          keyword => input.name.toLowerCase().includes(keyword)
        );

        if (useSmartInput) {
          // Convert old string value to FieldValue format
          const fieldValue: FieldValue[] = typeof value === 'string' && value
            ? [{ type: 'text', value }]
            : Array.isArray(value) 
              ? value 
              : [];

          // Determine field type based on input name
          let fieldType: 'email' | 'text' | 'number' | 'url' = 'text';
          if (input.name.toLowerCase().includes('email') || input.name.toLowerCase() === 'to') {
            fieldType = 'email';
          } else if (input.name.toLowerCase().includes('url') || input.name.toLowerCase().includes('link')) {
            fieldType = 'url';
          }

          return (
            <SmartInput
              label=""
              value={fieldValue}
              onChange={(newValue) => {
                // Convert FieldValue[] back to format for backend
                handleParameterChange(input.name, newValue);
              }}
              type="text-with-fields"
              fieldType={fieldType}
              currentNodeId={nodeId}
              nodes={nodes}
              edges={edges}
              placeholder={`Enter ${input.name}...`}
              multiline={input.name.toLowerCase().includes('body') || input.name.toLowerCase().includes('content') || input.name.toLowerCase().includes('message')}
            />
          );
        }

        // Fallback to regular input for other fields
        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleParameterChange(input.name, e.target.value)}
            placeholder={`Nhập ${input.name}...`}
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-stone-900"
          />
        );
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-stone-900">Cài Đặt Node</h3>
      
      {/* Node Info - Simplified */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-4 border border-indigo-200">
        <div className="flex items-center gap-2 mb-1">
          {nodeData?.category === 'trigger' ? (
            <Clock className="w-6 h-6 text-indigo-600" />
          ) : nodeData?.category === 'action' ? (
            <Mail className="w-6 h-6 text-indigo-600" />
          ) : (
            <Wrench className="w-6 h-6 text-indigo-600" />
          )}
          <span className="font-bold text-stone-900">{nodeData?.nodeType || 'Node'}</span>
        </div>
        <p className="text-sm text-stone-600">
          {nodeData?.description || 'Không có mô tả'}
        </p>
      </div>

      {/* Node Label */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Tên hiển thị
        </label>
        <input
          type="text"
          value={selectedNode.data.label || ''}
          onChange={(e) => handleLabelChange(e.target.value)}
          className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-stone-900"
          placeholder="Nhập tên node..."
        />
      </div>

      {/* Node Parameters - Editable Form Fields */}
      {nodeData?.inputs && nodeData.inputs.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Thông số
          </h4>
          <div className="space-y-3">
            {nodeData.inputs
              .filter((input: any) => input.id !== 'trigger' && input.name !== 'trigger') // Filter out trigger input
              .map((input: any, index: number) => (
              <div key={index} className="space-y-1">
                <label className="block text-sm font-medium text-stone-700">
                  {input.name}
                  {input.required && <span className="text-red-500 ml-1">*</span>}
                </label>
                {input.description && (
                  <p className="text-xs text-stone-500 mb-1">{input.description}</p>
                )}
                {renderInputField(input)}
                <div className="text-xs text-stone-400">
                  Loại: <span className="font-mono bg-stone-100 px-1 rounded">{input.type}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Node Outputs */}
      {nodeData?.outputs && nodeData.outputs.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-stone-700 mb-2">📤 Dữ liệu đầu ra</h4>
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <div className="space-y-2">
              {nodeData.outputs.map((output: any, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-green-900">{output.name}</div>
                    <div className="text-xs text-green-700 font-mono">{output.type}</div>
                    {output.description && (
                      <div className="text-xs text-green-600 mt-0.5">{output.description}</div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Actions */}
      <div className="border-t pt-4 space-y-2">
        <button
          onClick={() => {
            console.log('Cấu hình Node:', {
              id: nodeId,
              type: nodeData?.nodeType,
              label: selectedNode.data.label,
              parameters,
            });
            alert('Đã lưu cấu hình! Xem console để biết chi tiết.');
          }}
          className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Save className="w-4 h-4" />
          Lưu cấu hình
        </button>
        <button
          onClick={handleDeleteNode}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Delete Node
        </button>
      </div>
    </div>
  );
}

function getCategoryColorForConfig(category: string) {
  const colors = {
    trigger: '#8B5CF6',
    action: '#3B82F6', 
    logic: '#F59E0B',
    data: '#10B981',
    transform: '#EC4899',
  };
  return colors[category as keyof typeof colors] || '#6366F1';
}

// Start Node is automatically created on first load
const initialNodes: any[] = [];

const initialEdges: Edge[] = [];

// Helper: Convert FieldValue[] to backend-compatible format
function convertFieldValueToBackend(fieldValue: FieldValue[] | string | any): any {
  // If already a string or other type, return as-is
  if (typeof fieldValue === 'string' || typeof fieldValue === 'number' || typeof fieldValue === 'boolean') {
    return fieldValue;
  }
  
  // If not an array, return as-is
  if (!Array.isArray(fieldValue)) {
    return fieldValue;
  }
  
  // Convert FieldValue[] to backend format
  // For now, keep the full structure so backend can process it later
  // In Sprint 4, backend will handle reference resolution
  return fieldValue;
}

// Helper: Convert backend format to FieldValue[]
function convertBackendToFieldValue(backendValue: any): FieldValue[] | any {
  // If already FieldValue[] format (has 'type' property), return as-is
  if (Array.isArray(backendValue) && backendValue.length > 0 && backendValue[0].type) {
    return backendValue;
  }
  
  // If string, convert to FieldValue format
  if (typeof backendValue === 'string') {
    return backendValue ? [{ type: 'text', value: backendValue }] : [];
  }
  
  // Other types, return as-is
  return backendValue;
}

// Helper: Convert all node parameters before saving
function prepareNodesForBackend(nodes: any[]): any[] {
  return nodes.map(node => {
    if (!node.data.parameters) return node;
    
    const convertedParams: Record<string, any> = {};
    for (const [key, value] of Object.entries(node.data.parameters)) {
      convertedParams[key] = convertFieldValueToBackend(value);
    }
    
    return {
      ...node,
      data: {
        ...node.data,
        parameters: convertedParams,
      },
    };
  });
}

function FlowEditorContent() {
  const params = useParams();
  const router = useRouter();
  const flowId = (params?.id ?? '') as string;
  const { project } = useReactFlow();
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [flowData, setFlowData] = useState<FlowResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Flow status based on Start Node connections
  const [flowStatus, setFlowStatus] = useState<{
    isActive: boolean;
    hasStartConnection: boolean;
    firstNode: string | null;
  }>({
    isActive: false,
    hasStartConnection: false,
    firstNode: null,
  });
  
  // Sidebar state
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<'nodes' | 'config' | 'execute' | 'schedule' | 'history' | 'logs'>('nodes');
  const [sidebarWidth, setSidebarWidth] = useState(384); // 384px = w-96
  const [isResizing, setIsResizing] = useState(false);
  
  // Template state
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  
  // Node selection state
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  // Execution state
  const [currentExecutionId, setCurrentExecutionId] = useState<string | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // WebSocket connection for real-time updates
  const { 
    isConnected, 
    logs, 
    currentExecution, 
    progress,
    clearLogs 
  } = useExecutionSocket(
    currentExecutionId,
    (nodeId, status, data) => {
      // Update node status in canvas
      setNodes((nds) =>
        nds.map((node) =>
          node.id === nodeId
            ? {
                ...node,
                data: {
                  ...node.data,
                  status,
                  executionData: data,
                },
              }
            : node
        )
      );
    },
    isExecuting
  );

  // Register custom node types
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      workflow: WorkflowNode,
      startNode: StartNode,
    }),
    []
  );

  // Register custom edge types
  const edgeTypes = useMemo(
    () => ({
      conditional: ConditionalEdge,
    }),
    []
  );

  // Sidebar resize handlers
  const startResizing = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;
      
      const newWidth = window.innerWidth - e.clientX;
      // Limit width between 300px and 800px
      if (newWidth >= 300 && newWidth <= 800) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.body.classList.add('resizing');
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    } else {
      document.body.classList.remove('resizing');
    }

    return () => {
      document.body.classList.remove('resizing');
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing]);

  const loadFlowData = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await FlowService.getFlowById(flowId);
      setFlowData(data);
      
      if (data.reactFlowData) {
        try {
          const reactFlowState = JSON.parse(data.reactFlowData);
          let loadedNodes = [];
          let loadedEdges = [];
          
          if (reactFlowState.nodes && Array.isArray(reactFlowState.nodes)) {
            // Filter out old ReactFlow default nodes (type: 'input', 'output')
            loadedNodes = reactFlowState.nodes.filter((node: any) => 
              node.type !== 'input' && node.type !== 'output'
            );
            
            // Convert backend parameters to FieldValue format for SmartInput
            loadedNodes = loadedNodes.map((node: any) => {
              if (!node.data.parameters) return node;
              
              const convertedParams: Record<string, any> = {};
              for (const [key, value] of Object.entries(node.data.parameters)) {
                // Check if this param should use SmartInput
                const useSmartInput = ['to', 'subject', 'body', 'message', 'content', 'text', 'url', 'path', 'email'].some(
                  keyword => key.toLowerCase().includes(keyword)
                );
                
                if (useSmartInput) {
                  convertedParams[key] = convertBackendToFieldValue(value);
                } else {
                  convertedParams[key] = value;
                }
              }
              
              return {
                ...node,
                data: {
                  ...node.data,
                  parameters: convertedParams,
                },
              };
            });
          }
          if (reactFlowState.edges && Array.isArray(reactFlowState.edges)) {
            loadedEdges = reactFlowState.edges;
          }
          
          // Task 1.2: Auto-create Start Node if it doesn't exist
          const hasStartNode = loadedNodes.some((node: any) => node.type === 'startNode' || node.id === 'start-node');
          
          if (!hasStartNode) {
            console.log('📍 Auto-creating Start Node...');
            const startNode = {
              id: 'start-node',
              type: 'startNode',
              position: { x: 100, y: 250 },
              data: {
                label: 'Start',
                type: 'start',
                isProtected: true,
                configured: true,
                status: 'waiting',
                hasConnection: false,
              },
              deletable: false,
              draggable: true,
            };
            loadedNodes = [startNode, ...loadedNodes];
            toast.success('Start Node đã được tạo tự động');
          }
          
          setNodes(loadedNodes);
          setEdges(loadedEdges);
        } catch (error) {
          console.error('Failed to parse React Flow data:', error);
        }
      } else {
        // New flow - create Start Node
        console.log('📍 Creating Start Node for new flow...');
        const startNode = {
          id: 'start-node',
          type: 'startNode',
          position: { x: 100, y: 250 },
          data: {
            label: 'Start',
            type: 'start',
            isProtected: true,
            configured: true,
            status: 'waiting',
            hasConnection: false,
          },
          deletable: false,
          draggable: true,
        };
        setNodes([startNode]);
      }
    } catch (error) {
      toast.error('Failed to load flow data. Please try again.');
      console.error('Failed to load flow:', error);
    } finally {
      setIsLoading(false);
    }
  }, [flowId, setNodes, setEdges]);

  // Load flow data
  useEffect(() => {
    loadFlowData();
  }, [loadFlowData]);
  
  // Task 1.4: Track flow active status based on Start Node connections
  useEffect(() => {
    const startEdges = edges.filter(e => e.source === 'start-node');
    const hasConnection = startEdges.length > 0;
    const firstNode = hasConnection ? startEdges[0].target : null;
    
    setFlowStatus({
      isActive: hasConnection,
      hasStartConnection: hasConnection,
      firstNode: firstNode,
    });
    
    // Update Start Node's hasConnection status
    setNodes((nds) =>
      nds.map((node) =>
        node.id === 'start-node'
          ? {
              ...node,
              data: {
                ...node.data,
                hasConnection,
                status: hasConnection ? 'active' : 'waiting',
              },
            }
          : node
      )
    );
  }, [edges, setNodes]);

  // Auto-save flow data with debouncing
  useEffect(() => {
    // Don't save if still loading initial data
    if (isLoading) return;
    
    // Don't save if no changes (nodes and edges are empty or same as initial)
    if (nodes.length === 0 && edges.length === 0) return;
    
    // Don't save if flow data not loaded yet
    if (!flowData) return;
    
    const saveTimer = setTimeout(async () => {
      try {
        setIsSaving(true);
        
        // Prepare nodes for backend (convert FieldValue[] format)
        const nodesToSave = prepareNodesForBackend(nodes);
        
        const reactFlowState = {
          nodes: nodesToSave,
          edges,
        };
        
        // Send complete flow data with updated reactFlowData
        await FlowService.updateFlow(flowId, {
          id: flowData.id,
          userId: flowData.userId,
          name: flowData.name,
          description: flowData.description,
          isActive: flowData.isActive,
          createdAt: flowData.createdAt,
          updatedAt: flowData.updatedAt,
          reactFlowData: JSON.stringify(reactFlowState),
        });
        
        console.log('Auto-saved flow');
      } catch (error) {
        console.error('Failed to auto-save flow:', error);
      } finally {
        setIsSaving(false);
      }
    }, 180000); // Save 2 seconds after last change
    
    return () => clearTimeout(saveTimer);
  }, [nodes, edges, flowId, isLoading, flowData]);

  const onConnect = useCallback(
    (params: Connection | Edge) => {
      // Sprint 2 Day 15: Simplified validation for ExecutionData system
      
      // Rule 1: Prevent connections TO Start Node
      if (params.target === 'start-node') {
        toast.error('❌ Start node không thể nhận kết nối đầu vào!');
        return;
      }
      
      // Rule 2: Each node can only have ONE input connection
      // (Simplified: no need to check targetHandle - only 1 input per node)
      const existingEdge = edges.find(edge => edge.target === params.target);
      if (existingEdge) {
        toast.error('⚠️ Node này đã có input connection! Mỗi node chỉ nhận 1 connection.');
        return;
      }
      
      // Rule 3: Validate nodes exist
      const sourceNode = nodes.find(n => n.id === params.source);
      const targetNode = nodes.find(n => n.id === params.target);

      if (!sourceNode || !targetNode) {
        console.warn('Invalid connection: source or target node not found');
        return;
      }

      // Rule 4: Prevent duplicate connections
      const isDuplicate = edges.some(
        edge => edge.source === params.source && edge.target === params.target
      );
      if (isDuplicate) {
        toast.error('⚠️ Kết nối này đã tồn tại!');
        return;
      }

      // All ExecutionData connections are compatible (no type checking needed)
      
      // Create connection with styling
      const newEdge = {
        ...params,
        id: `e-${params.source}-${params.target}-${Date.now()}`,
        type: 'smoothstep',
        animated: true,
        style: {
          stroke: '#6366F1', // Indigo for ExecutionData
          strokeWidth: 2,
        },
        labelStyle: {
          fill: '#64748b',
          fontSize: 11,
          fontWeight: 500,
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
      
      // Visual feedback
      console.log('✅ Kết nối thành công (ExecutionData):', {
        from: sourceNode.data.label,
        to: targetNode.data.label,
      });
      toast.success(`✅ Kết nối thành công: ${sourceNode.data.label} → ${targetNode.data.label}`);
    },
    [setEdges, nodes, edges]
  );

  // Validate connection during drag (visual feedback)
  // Sprint 2 Day 15: Simplified for ExecutionData system
  const isValidConnection = useCallback(
    (connection: Connection) => {
      // Rule 1: Start Node cannot receive connections
      if (connection.target === 'start-node') {
        return false;
      }
      
      // Rule 2: Each node can only have ONE input connection
      // (Simplified: no need to check targetHandle - only 1 input per node)
      const existingEdge = edges.find(edge => edge.target === connection.target);
      if (existingEdge) {
        return false;
      }
      
      // Rule 3: Validate nodes exist
      const sourceNode = nodes.find(n => n.id === connection.source);
      const targetNode = nodes.find(n => n.id === connection.target);
      if (!sourceNode || !targetNode) {
        return false;
      }
      
      // Rule 4: Cannot connect to self
      if (connection.source === connection.target) {
        return false;
      }
      
      // All ExecutionData connections are compatible (no type checking needed)
      // Start Node has special 'any' type that connects to everything
      return true;
    },
    [nodes, edges]
  );

  // Node selection handlers
  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNodeId(node.id);
    setActiveTab('config');
  }, []);

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setActiveTab('nodes');
  }, []);

  // Handle selection changes efficiently
  const onSelectionChange = useCallback(({ nodes }: { nodes: any[] }) => {
    if (nodes.length > 0) {
      setSelectedNodeId(nodes[0].id);
      setActiveTab('config');
    }
  }, []);

  // Apply template to current flow
  const applyTemplate = useCallback(async (template: FlowTemplate) => {
    // Confirm with user if flow already has nodes (excluding Start Node)
    if (nodes.length > 1) {
      const confirmed = window.confirm(
        'Áp dụng template sẽ thay thế toàn bộ workflow hiện tại (trừ Start Node). Tiếp tục?'
      );
      if (!confirmed) {
        return;
      }
    }

    try {
      // Generate unique IDs for template nodes
      const timestamp = Date.now();
      const idMap: Record<string, string> = {};
      
      // Create new nodes with unique IDs
      const newNodes = template.nodes.map((node, index) => {
        const newId = node.id === 'start-node' 
          ? 'start-node'  // Keep Start Node ID
          : `${node.id}-${timestamp}-${index}`;
        idMap[node.id] = newId;
        
        return {
          ...node,
          id: newId,
        };
      });
      
      // Update edges with new node IDs
      const newEdges = template.edges.map((edge, index) => ({
        ...edge,
        id: `${edge.id}-${timestamp}-${index}`,
        source: idMap[edge.source],
        target: idMap[edge.target],
      }));
      
      // Apply to canvas
      setNodes(newNodes);
      setEdges(newEdges);
      
      // Success notification
      toast.success(`Đã áp dụng template: ${template.name}`);
      
      // Auto-save will trigger via useEffect
      console.log('Template applied, auto-save will run in 2 seconds...');
      
    } catch (error) {
      console.error('Failed to apply template:', error);
      toast.error('Lỗi khi áp dụng template');
    }
  }, [nodes, setNodes, setEdges]);

  // Handle selection changes when nodes are deselected
  const handleSelectionChange = useCallback(() => {
    if (selectedNodeId) {
      setSelectedNodeId(null);
    }
  }, [selectedNodeId]);

  // Drag & Drop Handlers
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeData = event.dataTransfer.getData('application/reactflow');
      if (!nodeData) return;

      try {
        const nodeInfo = JSON.parse(nodeData);
        
        // Use project to convert screen coordinates to flow coordinates
        const position = project({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode = {
          id: `${nodeInfo.type}-${Date.now()}`,
          type: 'workflow', // Use custom workflow node
          position,
          data: {
            label: nodeInfo.name,
            nodeType: nodeInfo.type,
            category: nodeInfo.category,
            description: nodeInfo.description,
            inputs: nodeInfo.inputs,
            outputs: nodeInfo.outputs,
            icon: nodeInfo.icon,
            status: 'idle', // Initial status
            configured: false, // Not configured yet
          },
          style: {
            background: getCategoryColor(nodeInfo.category),
          },
        };

        setNodes((nds) => nds.concat(newNode));
      } catch (error) {
        console.error('Failed to parse node data:', error);
        toast.error('Failed to add node. Invalid data.');
      }
    },
    [setNodes, project]
  );

  const getCategoryColor = useCallback((category: string) => {
    const colors = {
      trigger: '#8B5CF6',
      action: '#3B82F6',
      logic: '#F59E0B',
      data: '#10B981',
      transform: '#EC4899',
    };
    return colors[category as keyof typeof colors] || '#6366F1';
  }, []);

  const getDataTypeColor = useCallback((dataType: string) => {
    const colors = {
      string: '#3B82F6',    // Blue
      number: '#10B981',    // Green
      boolean: '#F59E0B',   // Orange
      object: '#8B5CF6',    // Purple
      array: '#EC4899',     // Pink
      any: '#6366F1',       // Indigo
    };
    return colors[dataType as keyof typeof colors] || '#64748b';
  }, []);

  const handleBack = () => {
    router.push('/dashboard');
  };

  const handleExecutionComplete = (executionId: string, success: boolean) => {
    if (success) {
      // Refresh history when execution completes
      setActiveTab('history');
    }
  };

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
          <p className="mt-4 text-white/70">Loading flow...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      {/* Inject custom styles */}
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />
      
      {/* Header */}
      <div className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={handleBack}
            className="flex items-center gap-2 text-stone-600 hover:text-black transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back</span>
          </button>
          <div className="border-l border-stone-300 h-6"></div>
          <div>
            <h1 className="text-xl font-bold text-black">{flowData?.name || 'Untitled Flow'}</h1>
            <p className="text-sm text-stone-600">{flowData?.description || 'No description'}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          {/* Task 1.4: Flow Active Status Indicator */}
          {flowStatus.isActive ? (
            <div className="flex items-center gap-2 px-4 py-2 bg-green-50 border-2 border-green-400 rounded-lg shadow-sm">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <div>
                <div className="text-sm font-bold text-green-800 flex items-center gap-1">
                  <CheckCircle className="w-4 h-4" /> Flow Active
                </div>
                <div className="text-xs text-green-600">
                  Kết nối: Start → {nodes.find(n => n.id === flowStatus.firstNode)?.data?.label || 'Node'}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2 bg-red-50 border-2 border-red-300 rounded-lg">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <div>
                <div className="text-sm font-bold text-red-800">Flow Inactive</div>
                <div className="text-xs text-red-600">Kết nối Start Node để active</div>
              </div>
            </div>
          )}
          
          {/* Auto-save status indicator */}
          {isSaving && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-200 rounded-md text-sm text-blue-700">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              Đang lưu...
            </div>
          )}
          {!isSaving && !isLoading && nodes.length > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 bg-green-50 border border-green-200 rounded-md text-sm text-green-700">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              Đã lưu
            </div>
          )}
          
          <button
            onClick={() => setShowSidebar(!showSidebar)}
            className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
              showSidebar 
                ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
                : 'bg-white border-stone-300 text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Layers className="w-4 h-4" />
            {showSidebar ? 'Hide' : 'Show'} Panel
          </button>
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 
              hover:from-orange-600 hover:to-orange-700 text-white rounded-md transition-all 
              shadow-md hover:shadow-lg"
          >
            <Palette className="w-5 h-5" />
            <span className="font-semibold">Templates</span>
          </button>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 text-stone-700 rounded-md hover:bg-stone-50 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* React Flow Canvas */}
        <div 
          className="flex-1 bg-stone-50"
          onDrop={onDrop}
          onDragOver={onDragOver}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={onNodeClick}
            onPaneClick={onPaneClick}
            onSelectionChange={onSelectionChange}
            isValidConnection={isValidConnection}
            connectionLineStyle={{
              stroke: '#6366F1',
              strokeWidth: 3,
              strokeDasharray: '5,5',
              animation: 'dash 0.5s linear infinite',
            }}
            connectionLineType={ConnectionLineType.SmoothStep}
            defaultEdgeOptions={{
              type: 'smoothstep',
              animated: true,
              style: {
                strokeWidth: 2,
              },
            }}
            fitView
            attributionPosition="bottom-left"
            selectNodesOnDrag={false}
            panOnDrag={[1, 2]}
            minZoom={0.5}
            maxZoom={2}
          >
            <Controls />
            <MiniMap 
              zoomable 
              pannable
              nodeColor={(node) => {
                if (node.type === 'input') return '#8B5CF6';
                if (node.type === 'output') return '#10B981';
                return '#6366F1';
              }}
            />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
            
            {/* Instructions Panel */}
            {!showSidebar && (
              <Panel position="top-left" className="bg-white/90 backdrop-blur-sm border border-stone-200 rounded-lg p-4 shadow-lg">
                <h3 className="font-semibold text-black mb-2">Getting Started</h3>
                <ul className="text-sm text-stone-600 space-y-1">
                  <li>• Drag to pan the canvas</li>
                  <li>• Scroll to zoom in/out</li>
                  <li>• Click and drag from node edges to connect</li>
                  <li>• Click "Show Panel" to add nodes</li>
                </ul>
              </Panel>
            )}
            
            {/* Drag & Drop Instructions */}
            {showSidebar && nodes.length === 1 && (
              <Panel position="top-center" className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <span className="text-3xl">👈</span>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">Drag nodes here!</h3>
                    <p className="text-sm text-blue-700">
                      Select a node from the sidebar and drag it to the canvas to start building your workflow
                    </p>
                  </div>
                </div>
              </Panel>
            )}
          </ReactFlow>
        </div>

        {/* Right Sidebar */}
        {showSidebar && (
          <div 
            className="bg-white border-l border-stone-200 flex flex-col relative"
            style={{ width: `${sidebarWidth}px` }}
          >
            {/* Resize Handle */}
            <div
              className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-indigo-400 active:bg-indigo-600 transition-colors group"
              onMouseDown={startResizing}
            >
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-stone-300 group-hover:bg-indigo-400 group-active:bg-indigo-600 transition-colors rounded-r" />
            </div>
            
            {/* Tabs */}
            <div className="border-b border-stone-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('nodes')}
                  className={`flex-1 px-3 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'nodes'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                      : 'text-stone-600 hover:text-black hover:bg-stone-50'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Nodes
                </button>
                <button
                  onClick={() => setActiveTab('config')}
                  disabled={!selectedNodeId}
                  className={`flex-1 px-3 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'config'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                      : selectedNodeId 
                        ? 'text-stone-600 hover:text-black hover:bg-stone-50'
                        : 'text-stone-400 cursor-not-allowed'
                  }`}
                >
                  <Settings className="w-4 h-4" />
                  Config
                </button>
                <button
                  onClick={() => setActiveTab('execute')}
                  className={`flex-1 px-2 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'execute'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                      : 'text-stone-600 hover:text-black hover:bg-stone-50'
                  }`}
                >
                  <Play className="w-4 h-4" />
                  Execute
                </button>
                <button
                  onClick={() => setActiveTab('schedule')}
                  className={`flex-1 px-2 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'schedule'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                      : 'text-stone-600 hover:text-black hover:bg-stone-50'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                  Schedule
                </button>
                <button
                  onClick={() => setActiveTab('history')}
                  className={`flex-1 px-2 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'history'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                      : 'text-stone-600 hover:text-black hover:bg-stone-50'
                  }`}
                >
                  <History className="w-4 h-4" />
                  History
                </button>
                <button
                  onClick={() => setActiveTab('logs')}
                  className={`flex-1 px-2 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 relative ${
                    activeTab === 'logs'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                      : 'text-stone-600 hover:text-black hover:bg-stone-50'
                  }`}
                >
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Logs
                  {logs.length > 0 && (
                    <span className="absolute top-1 right-1 w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                  )}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'nodes' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3 text-black">Available Nodes</h3>
                  <p className="text-sm text-stone-600 mb-4">
                    Drag nodes to the canvas to build your workflow
                  </p>
                  <NodePalette />
                </div>
              )}

              {activeTab === 'config' && (
                <div>
                  {selectedNodeId ? (
                    <NodeConfigPanel 
                      nodeId={selectedNodeId} 
                      nodes={nodes} 
                      setNodes={setNodes}
                      edges={edges}
                    />
                  ) : (
                    <div className="text-center py-8">
                      <Settings className="w-12 h-12 text-stone-400 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-stone-700 mb-2">No Node Selected</h3>
                      <p className="text-sm text-stone-600">
                        Click on a node in the canvas to configure its settings
                      </p>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'execute' && (
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-3">Execute Workflow</h3>
                    <p className="text-sm text-stone-600 mb-4">
                      Run this workflow immediately and see results
                    </p>
                  </div>

                  {/* Progress Indicator */}
                  {isExecuting && currentExecution && (
                    <ExecutionProgress
                      progress={progress}
                      currentExecution={currentExecution}
                      isRunning={isExecuting}
                    />
                  )}

                  <WorkflowExecutor 
                    flowId={flowId} 
                    userId={flowData?.userId || ''}
                    flowStatus={flowStatus}
                    onExecutionStart={(executionId) => {
                      setCurrentExecutionId(executionId);
                      setIsExecuting(true);
                      setActiveTab('logs'); // Auto-switch to logs tab
                    }}
                    onExecutionComplete={(executionId, success) => {
                      setIsExecuting(false);
                      handleExecutionComplete(executionId, success);
                    }}
                  />
                </div>
              )}

              {activeTab === 'schedule' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Schedule Workflow</h3>
                  <p className="text-sm text-stone-600 mb-4">
                    Create automated schedules with cron expressions
                  </p>
                  <CronJobManager flowId={flowId} />
                </div>
              )}

              {activeTab === 'history' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Execution History</h3>
                  <p className="text-sm text-stone-600 mb-4">
                    View past executions and their results
                  </p>
                  <ExecutionHistory flowId={flowId} limit={20} />
                </div>
              )}

              {activeTab === 'logs' && (
                <div className="h-full flex flex-col">
                  <div className="mb-4">
                    <h3 className="text-lg font-semibold mb-1">Execution Logs</h3>
                    <div className="flex items-center gap-2 text-sm">
                      <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
                      <span className="text-stone-600">
                        {isConnected ? 'Connected' : 'Disconnected'}
                      </span>
                      {isExecuting && (
                        <span className="text-blue-600 font-medium">• Executing...</span>
                      )}
                    </div>
                  </div>

                  {currentExecutionId ? (
                    <div className="flex-1 min-h-0">
                      <ExecutionLogs logs={logs} onClear={clearLogs} />
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full text-stone-400">
                      <svg className="w-16 h-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <p className="text-sm font-medium mb-1">No execution running</p>
                      <p className="text-xs">Execute a workflow to see logs here</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Template Modal */}
      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={applyTemplate}
      />
    </div>
  );
}

// Wrapper component with ReactFlowProvider
export default function FlowEditor() {
  return (
    <ReactFlowProvider>
      <FlowEditorContent />
    </ReactFlowProvider>
  );
}
