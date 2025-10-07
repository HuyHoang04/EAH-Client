"use client";

import { useParams, useRouter } from "next/navigation";
import { useCallback, useState, useEffect, useMemo } from "react";
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
} from "reactflow";
import "reactflow/dist/style.css";
import { FlowService, FlowResponse } from "@/services/flowService";
import WorkflowNode from "@/components/features/flow-editor/components/WorkflowNode";
import StartNode from "@/components/features/flow-editor/components/nodes/StartNode";
import ConditionalEdge from "@/components/features/flow-editor/components/ConditionalEdge";
import { useExecutionSocket } from "@/hooks/useExecutionSocket";
import { TemplateModal } from "@/components/features/templates";
import { FlowTemplate } from "@/constants/flowTemplates";
import FlowEditorHeader from "@/components/features/flow-editor/components/FlowEditorHeader";
import FlowEditorSidebar from "@/components/features/flow-editor/components/FlowEditorSidebar";
import {
  customStyles,
  initialNodes,
  initialEdges,
  getCategoryColor,
} from "@/lib/flow-editor/flowEditor.constants";
import {
  prepareNodesForBackend,
  convertParametersFromBackend,
} from "@/lib/flow-editor/flowHelpers";
import { FlowStatus } from "@/lib/flow-editor/flowEditor.types";
import toast from "react-hot-toast";

function FlowEditorContent() {
  const params = useParams();
  const router = useRouter();
  const flowId = (params?.id ?? "") as string;
  const { project } = useReactFlow();

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [flowData, setFlowData] = useState<FlowResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const [flowStatus, setFlowStatus] = useState<FlowStatus>({
    isActive: false,
    hasStartConnection: false,
    firstNode: null,
  });

  const [showSidebar, setShowSidebar] = useState(true);
  const [activeTab, setActiveTab] = useState<
    "nodes" | "config" | "execute" | "schedule" | "history" | "logs"
  >("nodes");
  const [sidebarWidth, setSidebarWidth] = useState(384);
  const [isResizing, setIsResizing] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [currentExecutionId, setCurrentExecutionId] = useState<string | null>(
    null
  );
  const [isExecuting, setIsExecuting] = useState(false);

// WebSocket for execution updates
  const { isConnected, logs, currentExecution, progress, clearLogs } =
    useExecutionSocket(
      currentExecutionId,
      (nodeId, status, data) => {
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
// Define node and edge types
  const nodeTypes: NodeTypes = useMemo(
    () => ({
      workflow: WorkflowNode,
      startNode: StartNode,
    }),
    []
  );
// Define custom edge types 
  const edgeTypes = useMemo(
    () => ({
      conditional: ConditionalEdge,
    }),
    []
  );

  const startResizing = useCallback((e: React.MouseEvent) => {
    setIsResizing(true);
    e.preventDefault();
  }, []);

// Handle mouse move and up events for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing) return;

      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 300 && newWidth <= 800) {
        setSidebarWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    if (isResizing) {
      document.body.classList.add("resizing");
      document.addEventListener("mousemove", handleMouseMove);
      document.addEventListener("mouseup", handleMouseUp);
    } else {
      document.body.classList.remove("resizing");
    }

    return () => {
      document.body.classList.remove("resizing");
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, [isResizing]);

  // Load flow data from backend callback
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
            loadedNodes = reactFlowState.nodes.filter(
              (node: any) => node.type !== "input" && node.type !== "output"
            );

            loadedNodes = convertParametersFromBackend(loadedNodes);
          }
          if (reactFlowState.edges && Array.isArray(reactFlowState.edges)) {
            loadedEdges = reactFlowState.edges;
          }

          const hasStartNode = loadedNodes.some(
            (node: any) => node.type === "startNode" || node.id === "start-node"
          );

          if (!hasStartNode) {
            const startNode = {
              id: "start-node",
              type: "startNode",
              position: { x: 100, y: 250 },
              data: {
                label: "Start",
                type: "start",
                isProtected: true,
                configured: true,
                status: "waiting",
                hasConnection: false,
              },
              deletable: false,
              draggable: true,
            };
            loadedNodes = [startNode, ...loadedNodes];
            toast.success("Start Node đã được tạo tự động");
          }

          setNodes(loadedNodes);
          setEdges(loadedEdges);
        } catch (error) {
          console.error("Failed to parse React Flow data:", error);
        }
      } else {
        const startNode = {
          id: "start-node",
          type: "startNode",
          position: { x: 100, y: 250 },
          data: {
            label: "Start",
            type: "start",
            isProtected: true,
            configured: true,
            status: "waiting",
            hasConnection: false,
          },
          deletable: false,
          draggable: true,
        };
        setNodes([startNode]);
      }
    } catch (error) {
      toast.error("Failed to load flow data. Please try again.");
      console.error("Failed to load flow:", error);
    } finally {
      setIsLoading(false);
    }
  }, [flowId, setNodes, setEdges]);

  // Load flow data from backend callback
  useEffect(() => {
    loadFlowData();
  }, [loadFlowData]);

  // Update flow status based on edges
  useEffect(() => {
    const startEdges = edges.filter((e) => e.source === "start-node");
    const hasConnection = startEdges.length > 0;
    const firstNode = hasConnection ? startEdges[0].target : null;

    setFlowStatus({
      isActive: hasConnection,
      hasStartConnection: hasConnection,
      firstNode: firstNode,
    });

    setNodes((nds) =>
      nds.map((node) =>
        node.id === "start-node"
          ? {
              ...node,
              data: {
                ...node.data,
                hasConnection,
                status: hasConnection ? "active" : "waiting",
              },
            }
          : node
      )
    );
  }, [edges, setNodes]);

  // Auto-save flow to backend every 3 minutes
  useEffect(() => {
    if (isLoading) return;
    if (nodes.length === 0 && edges.length === 0) return;
    if (!flowData) return;

    const saveTimer = setTimeout(async () => {
      try {
        setIsSaving(true);

        const nodesToSave = prepareNodesForBackend(nodes);

        const reactFlowState = {
          nodes: nodesToSave,
          edges,
        };

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

        console.log("Auto-saved flow");
      } catch (error) {
        console.error("Failed to auto-save flow:", error);
      } finally {
        setIsSaving(false);
      }
    }, 180000);

    return () => clearTimeout(saveTimer);
  }, [nodes, edges, flowId, isLoading, flowData]);

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params: Connection | Edge) => {
      if (params.target === "start-node") {
        toast.error("Start node không thể nhận kết nối đầu vào!");
        return;
      }
      // Check if target node already has an incoming connection
      const existingEdge = edges.find((edge) => edge.target === params.target);
      if (existingEdge) {
        toast.error(
          "Node này đã có input connection! Mỗi node chỉ nhận 1 connection."
        );
        return;
      }

      // Validate source and target nodes
      const sourceNode = nodes.find((n) => n.id === params.source);
      const targetNode = nodes.find((n) => n.id === params.target);
      if (!sourceNode || !targetNode) {
        console.warn("Invalid connection: source or target node not found");
        return;
      }

      // Prevent self-connections
      const isDuplicate = edges.some(
        (edge) => edge.source === params.source && edge.target === params.target
      );
      if (isDuplicate) {
        toast.error("Kết nối này đã tồn tại!");
        return;
      }

      // Create new edge with custom styles
      const newEdge = {
        ...params,
        id: `e-${params.source}-${params.target}-${Date.now()}`,
        type: "smoothstep",
        animated: true,
        style: {
          stroke: "#6366F1",
          strokeWidth: 2,
        },
        labelStyle: {
          fill: "#64748b",
          fontSize: 11,
          fontWeight: 500,
        },
      };

      setEdges((eds) => addEdge(newEdge, eds));
      toast.success(
        `Kết nối thành công: ${sourceNode.data.label} → ${targetNode.data.label}`
      );
    },
    [setEdges, nodes, edges]
  );

  const isValidConnection = useCallback(
    (connection: Connection) => {
      if (connection.target === "start-node") {
        return false;
      }

      const existingEdge = edges.find(
        (edge) => edge.target === connection.target
      );
      if (existingEdge) {
        return false;
      }

      const sourceNode = nodes.find((n) => n.id === connection.source);
      const targetNode = nodes.find((n) => n.id === connection.target);
      if (!sourceNode || !targetNode) {
        return false;
      }

      if (connection.source === connection.target) {
        return false;
      }

      return true;
    },
    [nodes, edges]
  );
// Handle node click to show config panel
  const onNodeClick = useCallback((event: React.MouseEvent, node: any) => {
    setSelectedNodeId(node.id);
    setActiveTab("config");
  }, []);
  
// Handle pane click to deselect nodes
  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
    setActiveTab("nodes");
  }, []);

  const onSelectionChange = useCallback(({ nodes }: { nodes: any[] }) => {
    if (nodes.length > 0) {
      setSelectedNodeId(nodes[0].id);
      setActiveTab("config");
    }
  }, []);

  // Apply selected template to the flow
  const applyTemplate = useCallback(
    async (template: FlowTemplate) => {
      if (nodes.length > 1) {
        const confirmed = window.confirm(
          "Áp dụng template sẽ thay thế toàn bộ workflow hiện tại. Tiếp tục?"
        );
        if (!confirmed) {
          return;
        }
      }

      try {
        const timestamp = Date.now();
        const idMap: Record<string, string> = {};

        const newNodes = template.nodes.map((node, index) => {
          const newId =
            node.id === "start-node"
              ? "start-node"
              : `${node.id}-${timestamp}-${index}`;
          idMap[node.id] = newId;

          return {
            ...node,
            id: newId,
          };
        });

        const newEdges = template.edges.map((edge, index) => ({
          ...edge,
          id: `${edge.id}-${timestamp}-${index}`,
          source: idMap[edge.source],
          target: idMap[edge.target],
        }));

        setNodes(newNodes);
        setEdges(newEdges);

        toast.success(`Đã áp dụng template: ${template.name}`);
      } catch (error) {
        console.error("Failed to apply template:", error);
        toast.error("Lỗi khi áp dụng template");
      }
    },
    [nodes, setNodes, setEdges]
  );

  // Handle drag and drop from sidebar
  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = "move";
  }, []);

  // Handle drop event to add new node
  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const nodeData = event.dataTransfer.getData("application/reactflow");
      if (!nodeData) return;

      try {
        const nodeInfo = JSON.parse(nodeData);

        const position = project({
          x: event.clientX,
          y: event.clientY,
        });

        const newNode = {
          id: `${nodeInfo.type}-${Date.now()}`,
          type: "workflow",
          position,
          data: {
            label: nodeInfo.name,
            nodeType: nodeInfo.type,
            category: nodeInfo.category,
            description: nodeInfo.description,
            inputs: nodeInfo.inputs,
            outputs: nodeInfo.outputs,
            icon: nodeInfo.icon,
            status: "idle",
            configured: false,
          },
          style: {
            background: getCategoryColor(nodeInfo.category),
          },
        };

        setNodes((nds) => nds.concat(newNode));
      } catch (error) {
        console.error("Failed to parse node data:", error);
        toast.error("Failed to add node. Invalid data.");
      }
    },
    [setNodes, project]
  );

  // Handle back to dashboard
  const handleBack = () => {
    router.push("/dashboard");
  };
  
  // Handle execution complete
  const handleExecutionComplete = (executionId: string, success: boolean) => {
    if (success) {
      setActiveTab("history");
    }
  };

  // Show loading state while fetching flow data
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
      <style dangerouslySetInnerHTML={{ __html: customStyles }} />

      <FlowEditorHeader
        flowData={flowData}
        flowStatus={flowStatus}
        nodes={nodes}
        showSidebar={showSidebar}
        isSaving={isSaving}
        isLoading={isLoading}
        onBack={handleBack}
        onToggleSidebar={() => setShowSidebar(!showSidebar)}
        onShowTemplates={() => setShowTemplateModal(true)}
      />

      <div className="flex-1 flex overflow-hidden">
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
              stroke: "#6366F1",
              strokeWidth: 3,
              strokeDasharray: "5,5",
              animation: "dash 0.5s linear infinite",
            }}
            connectionLineType={ConnectionLineType.SmoothStep}
            defaultEdgeOptions={{
              type: "smoothstep",
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
                if (node.type === "input") return "#8B5CF6";
                if (node.type === "output") return "#10B981";
                return "#6366F1";
              }}
            />
            <Background variant={BackgroundVariant.Dots} gap={12} size={1} />

            {!showSidebar && (
              <Panel
                position="top-left"
                className="bg-white/90 backdrop-blur-sm border border-stone-200 rounded-lg p-4 shadow-lg"
              >
                <h3 className="font-semibold text-black mb-2">
                  Getting Started
                </h3>
                <ul className="text-sm text-stone-600 space-y-1">
                  <li>Drag to pan the canvas</li>
                  <li>Scroll to zoom in/out</li>
                  <li>Click and drag from node edges to connect</li>
                  <li>Click "Show Panel" to add nodes</li>
                </ul>
              </Panel>
            )}

            {showSidebar && nodes.length === 1 && (
              <Panel
                position="top-center"
                className="bg-blue-50 border-2 border-blue-300 rounded-lg p-4 shadow-lg"
              >
                <div className="flex items-center gap-3">
                  <span className="text-3xl">👈</span>
                  <div>
                    <h3 className="font-semibold text-blue-900 mb-1">
                      Drag nodes here!
                    </h3>
                    <p className="text-sm text-blue-700">
                      Select a node from the sidebar and drag it to the canvas
                      to start building your workflow
                    </p>
                  </div>
                </div>
              </Panel>
            )}
          </ReactFlow>
        </div>

        <FlowEditorSidebar
          showSidebar={showSidebar}
          sidebarWidth={sidebarWidth}
          activeTab={activeTab}
          selectedNodeId={selectedNodeId}
          nodes={nodes}
          setNodes={setNodes}
          edges={edges}
          flowId={flowId}
          userId={flowData?.userId || ""}
          flowStatus={flowStatus}
          isResizing={isResizing}
          isExecuting={isExecuting}
          currentExecutionId={currentExecutionId}
          isConnected={isConnected}
          logs={logs}
          currentExecution={currentExecution}
          progress={progress}
          onSetActiveTab={setActiveTab}
          onStartResizing={startResizing}
          onExecutionStart={(executionId) => {
            setCurrentExecutionId(executionId);
            setIsExecuting(true);
            setActiveTab("logs");
          }}
          onExecutionComplete={(executionId, success) => {
            setIsExecuting(false);
            handleExecutionComplete(executionId, success);
          }}
          onClearLogs={clearLogs}
        />
      </div>

      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={applyTemplate}
      />
    </div>
  );
}

export default function FlowEditor() {
  return (
    <ReactFlowProvider>
      <FlowEditorContent />
    </ReactFlowProvider>
  );
}
