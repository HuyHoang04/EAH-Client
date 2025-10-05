/**
 * Error Details Panel Component
 * Displays comprehensive error information with retry options
 */

'use client';

import { useState } from 'react';
import { X, Copy, AlertTriangle, XCircle, ChevronDown, ChevronRight, MapPin } from 'lucide-react';

export interface ExecutionError {
  nodeId: string;
  nodeName: string;
  message: string;
  stack?: string;
  timestamp: Date;
  input?: any;
  severity: 'error' | 'critical';
}

interface ErrorDetailsPanelProps {
  error: ExecutionError;
  onClose?: () => void;
  onRetry?: () => void;
  onJumpToNode?: (nodeId: string) => void;
}

export default function ErrorDetailsPanel({
  error,
  onClose,
  onRetry,
  onJumpToNode,
}: ErrorDetailsPanelProps) {
  const [showStack, setShowStack] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    const errorText = `
Error in Node: ${error.nodeName} (${error.nodeId})
Timestamp: ${error.timestamp.toLocaleString()}
Severity: ${error.severity.toUpperCase()}

Message:
${error.message}

${error.stack ? `Stack Trace:\n${error.stack}` : ''}

${error.input ? `Input Data:\n${JSON.stringify(error.input, null, 2)}` : ''}
    `.trim();

    navigator.clipboard.writeText(errorText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className={`p-5 border-b ${
          error.severity === 'critical' 
            ? 'bg-red-50 border-red-200' 
            : 'bg-orange-50 border-orange-200'
        }`}>
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {error.severity === 'critical' ? (
                <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              ) : (
                <AlertTriangle className="w-6 h-6 text-orange-600 flex-shrink-0 mt-1" />
              )}
              
              <div>
                <h3 className={`text-lg font-semibold ${
                  error.severity === 'critical' ? 'text-red-800' : 'text-orange-800'
                }`}>
                  Execution Error
                </h3>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-sm font-medium text-gray-700">
                    Node: {error.nodeName}
                  </span>
                  <span className={`px-2 py-0.5 text-xs font-semibold rounded ${
                    error.severity === 'critical'
                      ? 'bg-red-200 text-red-800'
                      : 'bg-orange-200 text-orange-800'
                  }`}>
                    {error.severity.toUpperCase()}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  {error.timestamp.toLocaleString()}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors p-1"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body - Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {/* Error Message */}
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-2">Error Message</h4>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 font-mono text-sm whitespace-pre-wrap break-words">
                {error.message}
              </p>
            </div>
          </div>

          {/* Stack Trace */}
          {error.stack && (
            <div>
              <button
                onClick={() => setShowStack(!showStack)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors mb-2"
              >
                {showStack ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                Stack Trace
              </button>
              
              {showStack && (
                <div className="bg-gray-900 text-gray-100 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs font-mono whitespace-pre-wrap break-words">
                    {error.stack}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Input Data */}
          {error.input && (
            <div>
              <button
                onClick={() => setShowInput(!showInput)}
                className="flex items-center gap-2 text-sm font-semibold text-gray-700 hover:text-gray-900 transition-colors mb-2"
              >
                {showInput ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
                Input Data
              </button>
              
              {showInput && (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 overflow-x-auto">
                  <pre className="text-xs font-mono text-gray-700">
                    {JSON.stringify(error.input, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}

          {/* Suggested Actions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">💡 Suggested Actions</h4>
            <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
              <li>Check the error message for specific issues</li>
              <li>Review the node configuration and input data</li>
              <li>Verify network connectivity (if applicable)</li>
              <li>Try retrying the execution</li>
            </ul>
          </div>
        </div>

        {/* Footer - Actions */}
        <div className="border-t bg-gray-50 p-4 flex flex-wrap gap-2">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all ${
              copied
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied!' : 'Copy Error'}
          </button>

          {onJumpToNode && (
            <button
              onClick={() => onJumpToNode(error.nodeId)}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
            >
              <MapPin className="w-4 h-4" />
              Jump to Node
            </button>
          )}

          {onRetry && (
            <button
              onClick={onRetry}
              className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg font-medium hover:bg-amber-700 transition-colors ml-auto"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Retry Execution
            </button>
          )}

          {onClose && !onRetry && (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-lg font-medium hover:bg-gray-700 transition-colors ml-auto"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
