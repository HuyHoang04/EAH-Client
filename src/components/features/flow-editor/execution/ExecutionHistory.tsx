/**
 * Workflow Execution History Component
 * Display execution logs and results
 */

'use client';

import { useState, useEffect } from 'react';
import { nodeRunnerService, WorkflowExecution, formatExecutionStatus } from '@/services/nodeRunnerService';
import { RefreshCw, FileText, AlertTriangle, XCircle, Info, AlertCircle, Download, Search, Filter, X } from 'lucide-react';

interface ExecutionHistoryProps {
  flowId: string;
  limit?: number;
}

export default function ExecutionHistory({ flowId, limit = 20 }: ExecutionHistoryProps) {
  const [executions, setExecutions] = useState<WorkflowExecution[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedExecution, setSelectedExecution] = useState<WorkflowExecution | null>(null);

  useEffect(() => {
    loadExecutions();
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadExecutions, 10000);
    return () => clearInterval(interval);
  }, [flowId, limit]);

  const loadExecutions = async () => {
    try {
      const data = await nodeRunnerService.getExecutionHistory(flowId, limit);
      setExecutions(data);
    } catch (error) {
      console.error('Failed to load executions:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDuration = (start: string, end?: string) => {
    if (!end) return 'Running...';
    const duration = new Date(end).getTime() - new Date(start).getTime();
    if (duration < 1000) return `${duration}ms`;
    return `${(duration / 1000).toFixed(2)}s`;
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-black font-semibold">Execution History</h3>
        <button
          onClick={loadExecutions}
          className="px-3 py-1 text-sm border rounded hover:bg-gray-50 flex items-center gap-1"
          title="Refresh"
        >
          <RefreshCw className="w-4 h-4" /> Refresh
        </button>
      </div>

      {executions.length === 0 ? (
        <div className="text-center py-12 bg-white border rounded-lg">
          <p className="text-black">No executions yet</p>
          <p className="text-sm text-gray-500 mt-2">
            Execute this workflow to see results here
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {executions.map((execution) => {
            const statusInfo = formatExecutionStatus(execution.status);
            
            return (
              <div
                key={execution._id}
                className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedExecution(execution)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{statusInfo.icon}</span>
                      <div>
                        <h4 className={`font-medium ${statusInfo.color}`}>
                          {statusInfo.label}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {new Date(execution.startedAt).toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Duration:</span>
                        <span className="ml-2 font-medium">
                          {formatDuration(execution.startedAt, execution.endedAt)}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500">Execution ID:</span>
                        <span className="ml-2 font-mono text-xs">
                          {execution._id.slice(0, 8)}...
                        </span>
                      </div>
                    </div>

                    {execution.error && (
                      <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded">
                        <p className="text-sm text-red-600 flex items-center gap-2">
                          <XCircle className="w-4 h-4" /> {execution.error}
                        </p>
                      </div>
                    )}

                    {execution.logs && execution.logs.length > 0 && (
                      <div className="mt-3">
                        <p className="text-xs text-gray-500 flex items-center gap-1">
                          <FileText className="w-3 h-3" /> {execution.logs.length} log entries
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedExecution(execution);
                    }}
                    className="px-3 py-1 text-sm border rounded hover:bg-gray-50"
                  >
                    View Details →
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Execution Detail Dialog */}
      {selectedExecution && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          onClick={() => setSelectedExecution(null)}
        >
          <div
            className="bg-white rounded-lg max-w-4xl w-full max-h-[80vh] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold">Execution Details</h3>
                <button
                  onClick={() => setSelectedExecution(null)}
                  className="text-black hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-[60vh] space-y-6">
              {/* Status */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Status</h4>
                <div className="flex items-center gap-2">
                  <span className="text-2xl">
                    {formatExecutionStatus(selectedExecution.status).icon}
                  </span>
                  <span className={`font-medium ${formatExecutionStatus(selectedExecution.status).color}`}>
                    {formatExecutionStatus(selectedExecution.status).label}
                  </span>
                </div>
              </div>

              {/* Metadata */}
              <div>
                <h4 className="font-medium text-gray-700 mb-2">Metadata</h4>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-500">Execution ID:</span>
                      <p className="font-mono text-xs mt-1">{selectedExecution._id}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Flow ID:</span>
                      <p className="font-mono text-xs mt-1">{selectedExecution.flowId}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">User ID:</span>
                      <p className="font-mono text-xs mt-1">{selectedExecution.userId}</p>
                    </div>
                    <div>
                      <span className="text-gray-500">Duration:</span>
                      <p className="mt-1">
                        {formatDuration(selectedExecution.startedAt, selectedExecution.endedAt)}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500">Started:</span>
                      <p className="mt-1">{new Date(selectedExecution.startedAt).toLocaleString()}</p>
                    </div>
                    {selectedExecution.endedAt && (
                      <div>
                        <span className="text-gray-500">Ended:</span>
                        <p className="mt-1">{new Date(selectedExecution.endedAt).toLocaleString()}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Error */}
              {selectedExecution.error && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Error</h4>
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <pre className="text-sm text-red-600 whitespace-pre-wrap">
                      {selectedExecution.error}
                    </pre>
                  </div>
                </div>
              )}

              {/* Result */}
              {selectedExecution.result && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">Result</h4>
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <pre className="text-sm text-green-800 whitespace-pre-wrap overflow-x-auto">
                      {JSON.stringify(selectedExecution.result, null, 2)}
                    </pre>
                  </div>
                </div>
              )}

              {/* Logs */}
              {selectedExecution.logs && selectedExecution.logs.length > 0 && (
                <div>
                  <h4 className="font-medium text-gray-700 mb-2">
                    Execution Logs ({selectedExecution.logs.length})
                  </h4>
                  <div className="bg-gray-900 rounded-lg p-4 max-h-96 overflow-y-auto">
                    {selectedExecution.logs.map((log, index) => (
                      <div key={index} className="font-mono text-xs text-green-400 mb-1">
                        {log}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 border-t">
              <button
                onClick={() => setSelectedExecution(null)}
                className="w-full px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
