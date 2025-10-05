/**
 * Workflow Executor Component
 * Execute workflows manually with real-time status
 */

'use client';

import { useState } from 'react';
import { nodeRunnerService } from '@/services/nodeRunnerService';

interface WorkflowExecutorProps {
  flowId: string;
  userId: string;
  flowStatus?: {
    isActive: boolean;
    hasStartConnection: boolean;
    firstNode: string | null;
  };
  onExecutionStart?: (executionId: string) => void;
  onExecutionComplete?: (executionId: string, success: boolean) => void;
}

export default function WorkflowExecutor({ 
  flowId, 
  userId,
  flowStatus,
  onExecutionStart,
  onExecutionComplete 
}: WorkflowExecutorProps) {
  const [executing, setExecuting] = useState(false);
  const [executionResult, setExecutionResult] = useState<{
    success: boolean;
    executionId?: string;
    data?: any;
    error?: string;
  } | null>(null);

  const handleExecute = async () => {
    // Task 1.5: Validate flow is active before execution
    if (flowStatus && !flowStatus.isActive) {
      setExecutionResult({
        success: false,
        error: '⚠️ Flow chưa active! Vui lòng kết nối Start Node với ít nhất một node để có thể thực thi workflow.',
      });
      return;
    }
    
    setExecuting(true);
    setExecutionResult(null);

    try {
      const result = await nodeRunnerService.executeWorkflowById(flowId, userId);
      setExecutionResult(result);
      
      // Notify parent of execution start (with executionId)
      if (onExecutionStart && result.executionId) {
        onExecutionStart(result.executionId);
      }
      
      if (onExecutionComplete) {
        onExecutionComplete(result.executionId, result.success);
      }
    } catch (error: any) {
      setExecutionResult({
        success: false,
        error: error.message || 'Failed to execute workflow'
      });
      
      if (onExecutionComplete) {
        onExecutionComplete('', false);
      }
    } finally {
      setExecuting(false);
    }
  };

  const handleRetry = async (fromNodeId?: string) => {
    if (!executionResult?.executionId) return;

    setExecuting(true);

    try {
      const result = await nodeRunnerService.retryExecution(
        executionResult.executionId,
        fromNodeId
      );
      setExecutionResult(result);
      
      // Notify parent of execution start
      if (onExecutionStart && result.executionId) {
        onExecutionStart(result.executionId);
      }
      
      if (onExecutionComplete) {
        onExecutionComplete(result.executionId, result.success);
      }
    } catch (error: any) {
      setExecutionResult({
        success: false,
        error: error.message || 'Failed to retry execution'
      });
      
      if (onExecutionComplete) {
        onExecutionComplete('', false);
      }
    } finally {
      setExecuting(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Task 1.5: Flow Status Warning */}
      {flowStatus && !flowStatus.isActive && (
        <div className="bg-amber-50 border-2 border-amber-300 rounded-lg p-4 animate-fade-in">
          <div className="flex items-start gap-3">
            <span className="text-2xl">⚠️</span>
            <div>
              <h4 className="font-semibold text-amber-800 mb-1">Flow Chưa Active</h4>
              <p className="text-sm text-amber-700">
                Workflow này chưa có kết nối từ <strong>Start Node</strong>. 
                Hãy kết nối Start Node với node đầu tiên để có thể thực thi.
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Execute Button */}
      <button
        onClick={handleExecute}
        disabled={executing || (flowStatus && !flowStatus.isActive)}
        className={`
          w-full px-6 py-3 rounded-lg font-medium text-white
          transition-all duration-200 flex items-center justify-center gap-2
          ${executing || (flowStatus && !flowStatus.isActive)
            ? 'bg-gray-400 cursor-not-allowed' 
            : 'bg-blue-600 hover:bg-blue-700 active:scale-95'
          }
        `}
      >
        {executing ? (
          <>
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
              <circle 
                className="opacity-25" 
                cx="12" 
                cy="12" 
                r="10" 
                stroke="currentColor" 
                strokeWidth="4"
                fill="none"
              />
              <path 
                className="opacity-75" 
                fill="currentColor" 
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            <span>Executing Workflow...</span>
          </>
        ) : flowStatus && !flowStatus.isActive ? (
          <>
            <span>🔴</span>
            <span>Flow Inactive - Cannot Execute</span>
          </>
        ) : (
          <>
            <span>▶️</span>
            <span>Execute Workflow</span>
          </>
        )}
      </button>

      {/* Execution Result */}
      {executionResult && (
        <div className={`
          p-4 rounded-lg border-2 animate-fade-in
          ${executionResult.success 
            ? 'bg-green-50 border-green-300' 
            : 'bg-red-50 border-red-300'
          }
        `}>
          <div className="flex items-start gap-3">
            <span className="text-2xl">
              {executionResult.success ? '✅' : '❌'}
            </span>
            
            <div className="flex-1">
              <h4 className={`font-semibold mb-2 ${
                executionResult.success ? 'text-green-800' : 'text-red-800'
              }`}>
                {executionResult.success 
                  ? 'Workflow Executed Successfully' 
                  : 'Execution Failed'
                }
              </h4>

              {executionResult.executionId && (
                <div className="text-sm mb-2">
                  <span className="text-gray-600">Execution ID:</span>
                  <code className="ml-2 px-2 py-1 bg-white rounded text-xs font-mono">
                    {executionResult.executionId}
                  </code>
                </div>
              )}

              {executionResult.error && (
                <div className="mt-2 p-3 bg-red-100 rounded border border-red-200">
                  <p className="text-sm text-red-700 font-medium mb-1">Error:</p>
                  <pre className="text-xs text-red-600 whitespace-pre-wrap">
                    {executionResult.error}
                  </pre>
                </div>
              )}

              {executionResult.data && (
                <div className="mt-2 p-3 bg-white rounded border border-green-200">
                  <p className="text-sm text-green-700 font-medium mb-1">Result:</p>
                  <pre className="text-xs text-gray-700 whitespace-pre-wrap overflow-x-auto max-h-64">
                    {JSON.stringify(executionResult.data, null, 2)}
                  </pre>
                </div>
              )}

              {/* Retry Buttons - Show only on failure */}
              {!executionResult.success && !executing && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleRetry()}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    <span>Retry Workflow</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Help Text */}
      {!executing && !executionResult && (
        <div className="text-sm text-gray-500 bg-gray-50 p-3 rounded">
          <p className="font-medium mb-1">💡 About Execution:</p>
          <ul className="list-disc list-inside space-y-1 text-xs">
            <li>This will execute the workflow immediately</li>
            <li>Results will be saved to execution history</li>
            <li>Check execution logs for detailed information</li>
            <li>Errors will be displayed here if execution fails</li>
          </ul>
        </div>
      )}
    </div>
  );
}
