'use client';

import React from 'react';
import { ArrowLeft, Settings, Layers, Palette, CheckCircle } from 'lucide-react';
import { FlowResponse } from '@/services/flowService';

interface FlowEditorHeaderProps {
  flowData: FlowResponse | null;
  flowStatus: {
    isActive: boolean;
    hasStartConnection: boolean;
    firstNode: string | null;
  };
  nodes: any[];
  showSidebar: boolean;
  isSaving: boolean;
  isLoading: boolean;
  onBack: () => void;
  onToggleSidebar: () => void;
  onShowTemplates: () => void;
}

export default function FlowEditorHeader({
  flowData,
  flowStatus,
  nodes,
  showSidebar,
  isSaving,
  isLoading,
  onBack,
  onToggleSidebar,
  onShowTemplates,
}: FlowEditorHeaderProps) {
  return (
    <div className="bg-white border-b border-stone-200 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
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
          onClick={onToggleSidebar}
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
          onClick={onShowTemplates}
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
  );
}
