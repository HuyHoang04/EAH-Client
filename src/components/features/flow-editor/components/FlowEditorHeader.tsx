'use client';

import React from 'react';
import { ArrowLeft, Settings, Layers, Palette, CheckCircle, Save } from 'lucide-react';
import { FlowResponse, FlowService } from '@/services/flowService';
import { useParams } from 'next/navigation';
import toast from 'react-hot-toast';

interface FlowEditorHeaderProps {
  flowData: FlowResponse | null;
  flowStatus: {
    isActive: boolean;
    hasStartConnection: boolean;
    firstNode: string | null;
  };
  nodes: any[];
  edges: any[];
  showSidebar: boolean;
  isSaving: boolean;
  isLoading: boolean;
  onBack: () => void;
  onToggleSidebar: () => void;
  onShowTemplates: () => void;
  onSave?: (isSaving: boolean) => void; // Callback để update trạng thái saving
}

export default function FlowEditorHeader({
  flowData,
  flowStatus,
  nodes,
  edges,
  showSidebar,
  isSaving,
  isLoading,
  onBack,
  onToggleSidebar,
  onShowTemplates,
  onSave,
}: FlowEditorHeaderProps) {
  const params = useParams();
  const flowId = (params?.id ?? "") as string;
  
  const saveFlow = async () => {
    if (!flowData || !onSave) return;
    
    try {
      onSave(true); // Bắt đầu saving
      
      // Tạo React Flow data object với format giống như logic load
      const reactFlowData = {
        nodes: nodes.filter(node => node.id), // Lọc bỏ nodes không hợp lệ
        edges: edges.filter(edge => edge.id && edge.source && edge.target), // Lọc bỏ edges không hợp lệ
      };
      
      console.log("Saving flow data:", {
        nodeCount: reactFlowData.nodes.length,
        edgeCount: reactFlowData.edges.length,
        flowId,
        reactFlowData
      });
      
      const response = await FlowService.updateFlow(flowId, {
        ...flowData, // Giữ tất cả dữ liệu cũ
        reactFlowData: JSON.stringify(reactFlowData),
      });
      
      console.log("Save response:", response);
      toast.success("Đã lưu thành công!");
    } catch (err) {
      console.error("Save flow error:", err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      toast.error("Lưu thất bại: " + errorMessage);
    } finally {
      onSave(false); // Kết thúc saving
    }
  };
  return (
    <div className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-black hover:text-black transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>
        <div className="border-l border-stone-300 h-6"></div>
        <div>
          <h1 className="text-xl font-bold text-black">{flowData?.name || 'Untitled Flow'}</h1>
          <p className="text-sm text-black">{flowData?.description || 'No description'}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
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
        
        <button
          onClick={saveFlow}
          disabled={isSaving || isLoading}
          className={`relative flex items-center justify-center px-2 py-2 rounded-md border border-stone-300 bg-white text-black hover:bg-stone-50 transition-colors ${isSaving ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          <span className="flex items-center gap-2">
            {isSaving ? (
              <svg className="animate-spin h-4 w-4 text-indigo-500" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
            ) : (
              <Save className='w-4 h-4' />
            )}
            <span className="font-medium">{isSaving ? "Saving..." : "Save Flow"}</span>
          </span>
        </button>
        
        <button
          onClick={onToggleSidebar}
          className={`flex items-center gap-2 px-4 py-2 border rounded-md transition-colors ${
            showSidebar 
              ? 'bg-indigo-50 border-indigo-300 text-indigo-700' 
              : 'bg-white border-stone-300 text-black hover:bg-stone-50'
          }`}
        >
          <Layers className="w-4 h-4" />
          {showSidebar ? 'Hide' : 'Show'} Panel
        </button>
        <button
          onClick={onShowTemplates}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-orange-600 
            hover:from-orange-600 hover:to-orange-700 text-white rounded-md transition-all 
            shadow-md hover:shadow-lg"
        >
          <Palette className="w-5 h-5" />
          <span className="font-semibold">Templates</span>
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-white border border-stone-300 text-black rounded-md hover:bg-stone-50 transition-colors"
        >
          <Settings className="w-4 h-4" />
          Settings
        </button>
      </div>
    </div>
  );
}
