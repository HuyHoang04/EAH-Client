"use client";

import React, { useCallback, useEffect } from "react";
import {
  Layers,
  Settings as SettingsIcon,
  Play,
  Clock,
  History,
} from "lucide-react";
import NodePalette from "@/components/features/flow-editor/components/NodePalette";
import NodeConfigPanel from "./NodeConfigPanel";
import CronJobManager from "@/components/features/flow-editor/scheduling/CronJobManager";
import ExecutionHistory from "@/components/features/flow-editor/execution/ExecutionHistory";
import WorkflowExecutor from "@/components/features/flow-editor/execution/WorkflowExecutor";
import ExecutionLogs from "@/components/features/flow-editor/execution/ExecutionLogs";
import ExecutionProgress from "@/components/features/flow-editor/execution/ExecutionProgress";

interface FlowEditorSidebarProps {
  showSidebar: boolean;
  sidebarWidth: number;
  activeTab: "nodes" | "config" | "execute" | "schedule" | "history" | "logs";
  selectedNodeId: string | null;
  nodes: any[];
  setNodes: any;
  edges: any[];
  flowId: string;
  userId: string;
  flowStatus: {
    isActive: boolean;
    hasStartConnection: boolean;
    firstNode: string | null;
  };
  isResizing: boolean;
  isExecuting: boolean;
  currentExecutionId: string | null;
  isConnected: boolean;
  logs: any[];
  currentExecution: any;
  progress: any;
  onSetActiveTab: (
    tab: "nodes" | "config" | "execute" | "schedule" | "history" | "logs"
  ) => void;
  onStartResizing: (e: React.MouseEvent) => void;
  onExecutionStart: (executionId: string) => void;
  onExecutionComplete: (executionId: string, success: boolean) => void;
  onClearLogs: () => void;
}

export default function FlowEditorSidebar({
  showSidebar,
  sidebarWidth,
  activeTab,
  selectedNodeId,
  nodes,
  setNodes,
  edges,
  flowId,
  userId,
  flowStatus,
  isResizing,
  isExecuting,
  currentExecutionId,
  isConnected,
  logs,
  currentExecution,
  progress,
  onSetActiveTab,
  onStartResizing,
  onExecutionStart,
  onExecutionComplete,
  onClearLogs,
}: FlowEditorSidebarProps) {
  if (!showSidebar) return null;

  return (
    <div
      className="bg-white border-l border-stone-200 flex flex-col relative"
      style={{ width: `${sidebarWidth}px` }}
    >
      {/* Resize Handle */}
      <div
        className="absolute left-0 top-0 bottom-0 w-1 cursor-col-resize hover:bg-indigo-400 active:bg-indigo-600 transition-colors group"
        onMouseDown={onStartResizing}
      >
        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-12 bg-stone-300 group-hover:bg-indigo-400 group-active:bg-indigo-600 transition-colors rounded-r" />
      </div>

      {/* Tabs */}
      <div className="border-b border-stone-200">
        <div className="flex">
          <button
            onClick={() => onSetActiveTab("nodes")}
            className={`flex-1 px-3 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === "nodes"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                : "text-black hover:text-black hover:bg-stone-50"
            }`}
          >
            <Layers className="w-4 h-4" />
            Nodes
          </button>
          <button
            onClick={() => onSetActiveTab("config")}
            disabled={!selectedNodeId}
            className={`flex-1 px-3 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === "config"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                : selectedNodeId
                ? "text-black hover:text-black hover:bg-stone-50"
                : "text-black cursor-not-allowed"
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            Config
          </button>
          <button
            onClick={() => onSetActiveTab("execute")}
            className={`flex-1 px-2 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === "execute"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                : "text-black hover:text-black hover:bg-stone-50"
            }`}
          >
            <Play className="w-4 h-4" />
            Execute
          </button>
          <button
            onClick={() => onSetActiveTab("schedule")}
            className={`flex-1 px-2 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === "schedule"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                : "text-black hover:text-black hover:bg-stone-50"
            }`}
          >
            <Clock className="w-4 h-4" />
            Schedule
          </button>
          <button
            onClick={() => onSetActiveTab("history")}
            className={`flex-1 px-2 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
              activeTab === "history"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                : "text-black hover:text-black hover:bg-stone-50"
            }`}
          >
            <History className="w-4 h-4" />
            History
          </button>
          <button
            onClick={() => onSetActiveTab("logs")}
            className={`flex-1 px-2 py-3 text-sm font-medium transition-colors flex items-center justify-center gap-2 relative ${
              activeTab === "logs"
                ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                : "text-black hover:text-black hover:bg-stone-50"
            }`}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
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
        {activeTab === "nodes" && (
          <div>
            <h3 className="text-lg font-semibold mb-3 text-black">
              Available Nodes
            </h3>
            <p className="text-sm text-black mb-4">
              Drag nodes to the canvas to build your workflow
            </p>
            <NodePalette />
          </div>
        )}

        {activeTab === "config" && (
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
                <SettingsIcon className="w-12 h-12 text-black mx-auto mb-3" />
                <h3 className="text-lg font-semibold text-black mb-2">
                  No Node Selected
                </h3>
                <p className="text-sm text-black">
                  Click on a node in the canvas to configure its settings
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === "execute" && (
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-3">Execute Workflow</h3>
              <p className="text-sm text-black mb-4">
                Run this workflow immediately and see results
              </p>
            </div>

            {isExecuting && currentExecution && (
              <ExecutionProgress
                progress={progress}
                currentExecution={currentExecution}
                isRunning={isExecuting}
              />
            )}

            <WorkflowExecutor
              flowId={flowId}
              userId={userId}
              flowStatus={flowStatus}
              onExecutionStart={onExecutionStart}
              onExecutionComplete={onExecutionComplete}
            />
          </div>
        )}

        {activeTab === "schedule" && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Schedule Workflow</h3>
            <p className="text-sm text-black mb-4">
              Create automated schedules with cron expressions
            </p>
            <CronJobManager flowId={flowId} />
          </div>
        )}

        {activeTab === "history" && (
          <div>
            <h3 className="text-lg font-semibold mb-3">Execution History</h3>
            <p className="text-sm text-black mb-4">
              View past executions and their results
            </p>
            <ExecutionHistory flowId={flowId} limit={20} />
          </div>
        )}

        {activeTab === "logs" && (
          <div className="h-full flex flex-col">
            <div className="mb-4">
              <h3 className="text-lg font-semibold mb-1">Execution Logs</h3>
              <div className="flex items-center gap-2 text-sm">
                <div
                  className={`w-2 h-2 rounded-full ${
                    isConnected ? "bg-green-500 animate-pulse" : "bg-gray-400"
                  }`}
                ></div>
                <span className="text-black">
                  {isConnected ? "Connected" : "Disconnected"}
                </span>
                {isExecuting && (
                  <span className="text-blue-600 font-medium">
                    • Executing...
                  </span>
                )}
              </div>
            </div>

            {currentExecutionId ? (
              <div className="flex-1 min-h-0">
                <ExecutionLogs logs={logs} onClear={onClearLogs} />
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-black">
                <svg
                  className="w-16 h-16 mb-4 opacity-50"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={1.5}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <p className="text-sm font-medium mb-1">No execution running</p>
                <p className="text-xs">Execute a workflow to see logs here</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
