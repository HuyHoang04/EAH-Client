'use client';

import React, { memo } from 'react';
import { Handle, Position, NodeProps, useReactFlow } from 'reactflow';
import { Copy, Trash2 } from 'lucide-react';

interface WorkflowNodeData {
  label: string;
  nodeType: string;
  category: string;
  description: string;
  inputs?: Array<{
    id: string;
    name: string;
    type: string;
    required?: boolean;
  }>;
  outputs?: Array<{
    id: string;
    name: string;
    type: string;
  }>;
  icon?: string;
  status?: 'idle' | 'configured' | 'running' | 'success' | 'error';
  configured?: boolean;
  executionTime?: number;
}

function WorkflowNode({ data, selected, id }: NodeProps<WorkflowNodeData>) {
  const { deleteElements, setNodes } = useReactFlow();
  const hasInputs = data.inputs && data.inputs.length > 0;
  const hasOutputs = data.outputs && data.outputs.length > 0;

  // Debug logging
  console.log('WorkflowNode render:', {
    label: data.label,
    hasInputs,
    hasOutputs,
    inputs: data.inputs,
    outputs: data.outputs,
    nodeId: data.nodeType,
    fullData: data
  });

  // Check if handles are being rendered in DOM
  React.useEffect(() => {
    console.log(`Node ${data.label} mounted. Inputs: ${data.inputs?.length || 0}, Outputs: ${data.outputs?.length || 0}`);
    console.log('Has fallback handles:', !hasInputs || !hasOutputs);
  }, [data.label, data.inputs, data.outputs, hasInputs, hasOutputs]);

  // Filter out config-only fields from connection handles
  // Only Start Node has no connection inputs
  // All other nodes (including trigger) can receive connections
  const connectionInputs = data.inputs || [];
  
  // Special case: If node explicitly has no inputs defined, create a default 'trigger' input
  // This allows Start Node to connect to nodes that don't have explicit input definitions
  const effectiveInputs = connectionInputs.length === 0 && data.category !== 'start'
    ? [{
        id: 'trigger',
        name: 'Trigger',
        type: 'any',
        required: false,
      }]
    : connectionInputs;

  const hasConnectionInputs = effectiveInputs.length > 0;

  // Get emoji icon based on category
  const getIcon = () => {
    if (data.icon) return data.icon;
    const icons = {
      trigger: '⏰',
      action: '📧',
      logic: '🔧',
      data: '📊',
      transform: '🔄',
    };
    return icons[data.category as keyof typeof icons] || '🔵';
  };

  // Get status badge
  const getStatusBadge = () => {
    const status = data.status || 'idle';
    
    const badges = {
      idle: { text: '', color: '', show: false },
      configured: { text: '✓', color: 'bg-green-500', show: true },
      running: { text: '⏳', color: 'bg-blue-500 animate-pulse', show: true },
      success: { text: '✓', color: 'bg-green-500', show: true },
      error: { text: '❌', color: 'bg-red-500 animate-pulse', show: true },
      failed: { text: '❌', color: 'bg-red-500 animate-pulse', show: true }, // Added for failed state
    };
    
    return badges[status as keyof typeof badges] || badges.idle;
  };

  // Node actions
  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    deleteElements({ nodes: [{ id }] });
  };

  const handleDuplicate = (e: React.MouseEvent) => {
    e.stopPropagation();
    setNodes((nodes) => {
      const nodeToDuplicate = nodes.find(n => n.id === id);
      if (!nodeToDuplicate) return nodes;
      
      const newNode = {
        ...nodeToDuplicate,
        id: `${nodeToDuplicate.type}-${Date.now()}`,
        position: {
          x: nodeToDuplicate.position.x + 20,
          y: nodeToDuplicate.position.y + 20,
        },
        selected: false,
      };
      
      return [...nodes, newNode];
    });
  };

  const statusBadge = getStatusBadge();

  return (
    <div className="relative group">
      {/* Mini Toolbar - Show on hover */}
      <div className="absolute -top-10 left-0 right-0 flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-50">
        <button
          onClick={handleDuplicate}
          className="bg-white border border-gray-300 rounded-md p-1.5 shadow-md hover:bg-gray-50 hover:border-indigo-400 transition-all"
          title="Duplicate node"
        >
          <Copy className="w-3.5 h-3.5 text-gray-600" />
        </button>
        <button
          onClick={handleDelete}
          className="bg-white border border-gray-300 rounded-md p-1.5 shadow-md hover:bg-red-50 hover:border-red-400 transition-all"
          title="Delete node"
        >
          <Trash2 className="w-3.5 h-3.5 text-gray-600 hover:text-red-500" />
        </button>
      </div>

      {/* Fallback Target Handle - Always show at least one input */}
      {!hasConnectionInputs && (
        <Handle
          type="target"
          position={Position.Left}
          title="Kết nối vào đây (bất kỳ loại dữ liệu nào)"
          style={{
            top: '50%',
            background: '#6366F1',
            width: 16,
            height: 16,
            border: '3px solid white',
            boxShadow: '0 2px 8px rgba(99,102,241,0.4)',
            cursor: 'crosshair',
          }}
          className="transition-all hover:scale-125 hover:shadow-lg hover:shadow-indigo-500/50"
        />
      )}

      {/* Input Handles */}
      {hasConnectionInputs && effectiveInputs!.map((input, index) => {
        const topPosition = `${((index + 1) / (effectiveInputs!.length + 1)) * 100}%`;
        const handleColor = getTypeColor(input.type);
        
        return (
          <div 
            key={`input-${input.id}`}
            className="absolute group/input"
            style={{
              left: -8,
              top: topPosition,
              transform: 'translateY(-50%)',
            }}
          >
            <Handle
              type="target"
              position={Position.Left}
              id={input.id}
              title={`${input.name} (${input.type})${input.required ? ' - Bắt buộc' : ''}`}
              style={{
                background: handleColor,
                width: 16,
                height: 16,
                border: '3px solid white',
                boxShadow: `0 2px 8px ${handleColor}40`,
                cursor: 'crosshair',
                position: 'static',
              }}
              className="transition-all hover:scale-125 hover:shadow-lg"
            />
            {/* Tooltip - only show on hover this specific handle */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-full mr-3 opacity-0 group-hover/input:opacity-100 transition-opacity duration-200 pointer-events-none"
              style={{ zIndex: 1000 }}
            >
              <div 
                className="bg-stone-800 text-white px-3 py-1.5 rounded-md shadow-xl text-xs font-medium whitespace-nowrap"
                style={{
                  borderLeft: `4px solid ${handleColor}`,
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">➡️</span>
                  <span className="text-green-400 font-bold text-[9px]">NHẬN</span>
                  <span className="font-semibold">{input.name}</span>
                  {input.required && <span className="text-red-400 text-sm">*</span>}
                </div>
                <div className="text-[10px] text-stone-300 mt-0.5" style={{ color: handleColor }}>
                  Loại: {input.type}
                </div>
              </div>
            </div>
          </div>
        );
      })}

      {/* Node Body */}
      <div className={`
        min-w-[240px] px-6 py-4 rounded-lg shadow-lg
        transition-all duration-200
        ${selected ? 'ring-2 ring-orange-400 ring-offset-2' : ''}
        ${data.status === 'error' ? 'ring-2 ring-red-400' : ''}
        ${data.status === 'running' ? 'ring-2 ring-blue-400 animate-pulse' : ''}
      `}>
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl">{getIcon()}</span>
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-base text-white truncate">
              {data.label}
            </div>
            <div className="text-xs text-white/70 uppercase tracking-wide flex items-center gap-1.5">
              <span>{data.category}</span>
              {data.configured && data.status !== 'running' && data.status !== 'error' && (
                <span className="inline-flex items-center gap-0.5 bg-green-500/20 text-green-300 px-1.5 py-0.5 rounded text-[8px] font-semibold">
                  <span>✓</span>
                  <span>Config</span>
                </span>
              )}
              {!data.configured && data.status !== 'running' && data.status !== 'error' && (
                <span className="inline-flex items-center gap-0.5 bg-orange-500/20 text-orange-300 px-1.5 py-0.5 rounded text-[8px] font-semibold">
                  <span>⚠</span>
                  <span>Config</span>
                </span>
              )}
            </div>
          </div>
        </div>
        
        {/* Execution Time - Show when running or completed */}
        {data.executionTime && data.status === 'success' && (
          <div className="mt-1 text-[9px] text-green-300 bg-green-500/10 px-2 py-0.5 rounded">
            ⚡ Hoàn thành trong {data.executionTime}ms
          </div>
        )}
        {data.status === 'error' && (
          <div className="mt-1 text-[9px] text-red-300 bg-red-500/10 px-2 py-0.5 rounded">
            ❌ Lỗi thực thi
          </div>
        )}
        
        {/* Input/Output Indicators */}
        <div className="flex items-center justify-between text-[10px] text-white/60 mt-2">
          <span className="flex items-center gap-1">
            <span className="text-green-400">➡️</span>
            <span>{data.inputs?.length || 0} nhận</span>
          </span>
          <span className="flex items-center gap-1">
            <span className="text-orange-400">➡️</span>
            <span>{data.outputs?.length || 0} gửi</span>
          </span>
        </div>
      </div>

      {/* Fallback Source Handle - Always show at least one output */}
      {!hasOutputs && (
        <Handle
          type="source"
          position={Position.Right}
          title="Kéo từ đây để kết nối (bất kỳ loại dữ liệu nào)"
          style={{
            top: '50%',
            background: '#10B981',
            width: 8,
            height: 8,
            border: '1px white',
            boxShadow: '0 2px 8px rgba(16,185,129,0.4)',
            cursor: 'crosshair',
          }}
          className="transition-all hover:scale-120 hover:shadow-lg hover:shadow-green-500/50"
        />
      )}

      {/* Output Handles */}
      {hasOutputs && data.outputs!.map((output, index) => {
        const topPosition = `${((index + 1) / (data.outputs!.length + 1)) * 100}%`;
        const handleColor = getTypeColor(output.type);
        
        return (
          <div 
            key={`output-${output.id}`}
            className="absolute group/output"
            style={{
              right: -8,
              top: topPosition,
              transform: 'translateY(-50%)',
            }}
          >
            <Handle
              type="source"
              position={Position.Right}
              id={output.id}
              title={`Kéo từ ${output.name} (${output.type}) để kết nối`}
              style={{
                background: handleColor,
                width: 16,
                height: 16,
                border: '3px solid white',
                boxShadow: `0 2px 8px ${handleColor}40`,
                cursor: 'crosshair',
                position: 'static',
              }}
              className="transition-all hover:scale-125 hover:shadow-lg"
            />
            {/* Tooltip - only show on hover this specific handle */}
            <div 
              className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full ml-3 opacity-0 group-hover/output:opacity-100 transition-opacity duration-200 pointer-events-none"
              style={{ zIndex: 1000 }}
            >
              <div 
                className="bg-stone-800 text-white px-3 py-1.5 rounded-md shadow-xl text-xs font-medium whitespace-nowrap"
                style={{
                  borderRight: `4px solid ${handleColor}`,
                }}
              >
                <div className="flex items-center gap-1.5">
                  <span className="text-lg">➡️</span>
                  <span className="text-orange-400 font-bold text-[9px]">GỬI</span>
                  <span className="font-semibold">{output.name}</span>
                </div>
                <div className="text-[10px] text-stone-300 mt-0.5" style={{ color: handleColor }}>
                  Loại: {output.type}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Helper function for type colors
function getTypeColor(type: string): string {
  const colors: Record<string, string> = {
    string: '#3B82F6',    // Blue
    number: '#10B981',    // Green
    boolean: '#F59E0B',   // Orange
    object: '#8B5CF6',    // Purple
    array: '#EC4899',     // Pink
    any: '#6366F1',       // Indigo
  };
  return colors[type] || '#64748b';
}

export default memo(WorkflowNode);
