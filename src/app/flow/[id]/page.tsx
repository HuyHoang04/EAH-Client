'use client';

import { useParams, useRouter } from 'next/navigation';
import { useCallback, useState, useEffect } from 'react';
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
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ArrowLeft, Save, Play, Settings, Clock, History, Layers } from 'lucide-react';
import { FlowService, FlowResponse } from '@/services/flowService';
import NodePalette from '@/components/NodePalette';
import CronJobManager from '@/components/CronJobManager';
import ExecutionHistory from '@/components/ExecutionHistory';
import WorkflowExecutor from '@/components/WorkflowExecutor';

const initialNodes = [
  {
    id: '1',
    type: 'input',
    data: { label: 'Start' },
    position: { x: 250, y: 25 },
  },
];

const initialEdges: Edge[] = [];

export default function FlowEditor() {
  const params = useParams();
  const router = useRouter();
  const flowId = (params?.id ?? '') as string;
  
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [flowData, setFlowData] = useState<FlowResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  // Sidebar state
  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<'nodes' | 'execute' | 'schedule' | 'history'>('nodes');

  // Load flow data
  useEffect(() => {
    loadFlowData();
  }, [flowId]);

  const loadFlowData = async () => {
    try {
      setIsLoading(true);
      const data = await FlowService.getFlowById(flowId);
      setFlowData(data);
    } catch (error) {
      console.error('Failed to load flow:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const onConnect = useCallback(
    (params: Connection | Edge) => setEdges((eds) => addEdge(params, eds)),
    [setEdges]
  );

  // Drag & Drop Handlers
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const nodeData = event.dataTransfer.getData('application/reactflow');

      if (!nodeData) return;

      const nodeInfo = JSON.parse(nodeData);
      const position = {
        x: event.clientX - reactFlowBounds.left - 75,
        y: event.clientY - reactFlowBounds.top - 25,
      };

      const newNode = {
        id: `${nodeInfo.type}-${Date.now()}`,
        type: 'default',
        position,
        data: {
          label: nodeInfo.name,
          nodeType: nodeInfo.type,
          category: nodeInfo.category,
          description: nodeInfo.description,
          inputs: nodeInfo.inputs,
          outputs: nodeInfo.outputs,
        },
        style: {
          background: getCategoryColor(nodeInfo.category),
          color: '#fff',
          border: '2px solid #fff',
          borderRadius: '8px',
          padding: '10px',
          minWidth: '150px',
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes]
  );

  const getCategoryColor = (category: string) => {
    const colors = {
      trigger: '#8B5CF6',
      action: '#3B82F6',
      logic: '#F59E0B',
      data: '#10B981',
      transform: '#EC4899',
    };
    return colors[category as keyof typeof colors] || '#6366F1';
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Save nodes and edges to backend
    setTimeout(() => {
      setIsSaving(false);
      alert('Flow saved successfully!');
    }, 1000);
  };

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
            className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 text-stone-700 rounded-md hover:bg-stone-50 transition-colors"
          >
            <Settings className="w-4 h-4" />
            Settings
          </button>
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md hover:from-indigo-600 hover:to-purple-600 transition-all shadow-md disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {isSaving ? 'Saving...' : 'Save'}
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
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
            attributionPosition="bottom-left"
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
          <div className="w-96 bg-white border-l border-stone-200 flex flex-col">
            {/* Tabs */}
            <div className="border-b border-stone-200">
              <div className="flex">
                <button
                  onClick={() => setActiveTab('nodes')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'nodes'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                      : 'text-stone-600 hover:text-black hover:bg-stone-50'
                  }`}
                >
                  <Layers className="w-4 h-4" />
                  Nodes
                </button>
                <button
                  onClick={() => setActiveTab('execute')}
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
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
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
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
                  className={`flex-1 px-4 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
                    activeTab === 'history'
                      ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50'
                      : 'text-stone-600 hover:text-black hover:bg-stone-50'
                  }`}
                >
                  <History className="w-4 h-4" />
                  History
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="flex-1 overflow-y-auto p-4">
              {activeTab === 'nodes' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Available Nodes</h3>
                  <p className="text-sm text-stone-600 mb-4">
                    Drag nodes to the canvas to build your workflow
                  </p>
                  <NodePalette />
                </div>
              )}

              {activeTab === 'execute' && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Execute Workflow</h3>
                  <p className="text-sm text-stone-600 mb-4">
                    Run this workflow immediately and see results
                  </p>
                  <WorkflowExecutor 
                    flowId={flowId} 
                    userId={flowData?.userId || ''} 
                    onExecutionComplete={handleExecutionComplete}
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
