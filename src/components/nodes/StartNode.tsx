/**
 * Start Node Component
 * Special node that serves as the entry point for workflow execution
 * - Cannot be deleted
 * - Cannot have inputs (only outputs)
 * - Shows connection status
 * - Indicates if flow is active
 */

'use client';

import { memo } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Play, Link2, Unlink } from 'lucide-react';

interface StartNodeData {
  label: string;
  type: 'start';
  isProtected: boolean;
  status: 'waiting' | 'active';
  hasConnection?: boolean;
}

function StartNode({ data, selected }: NodeProps<StartNodeData>) {
  const isActive = data.status === 'active' || data.hasConnection;

  return (
    <div
      className={`
        relative bg-gradient-to-br from-green-50 to-emerald-50 
        rounded-2xl shadow-lg border-2 
        ${isActive ? 'border-green-500' : 'border-green-300'}
        ${selected ? 'ring-4 ring-green-300' : ''}
        transition-all duration-200
        min-w-[200px]
      `}
    >
      {/* Header */}
      <div className="px-4 py-3 border-b border-green-200 bg-gradient-to-r from-green-500 to-emerald-500">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center
              ${isActive ? 'bg-white animate-pulse' : 'bg-green-100'}
              transition-all duration-300
            `}>
              <Play className={`w-5 h-5 ${isActive ? 'text-green-600' : 'text-green-500'}`} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">{data.label}</h3>
              <p className="text-xs text-green-100">Entry Point</p>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className={`
            px-2 py-1 rounded-full text-xs font-semibold
            ${isActive 
              ? 'bg-white text-green-600' 
              : 'bg-green-100 text-green-700'
            }
          `}>
            {isActive ? '🟢 Active' : '🔴 Inactive'}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="px-4 py-4">
        {/* Connection Status */}
        <div className={`
          flex items-center gap-3 p-3 rounded-lg border-2
          ${isActive 
            ? 'bg-green-50 border-green-300' 
            : 'bg-gray-50 border-gray-300'
          }
          transition-all duration-200
        `}>
          {isActive ? (
            <>
              <Link2 className="w-5 h-5 text-green-600 animate-pulse" />
              <div>
                <p className="text-sm font-semibold text-green-700">Đã kết nối</p>
                <p className="text-xs text-green-600">Flow đã sẵn sàng thực thi</p>
              </div>
            </>
          ) : (
            <>
              <Unlink className="w-5 h-5 text-gray-500" />
              <div>
                <p className="text-sm font-semibold text-gray-700">Chưa kết nối</p>
                <p className="text-xs text-gray-600">Kết nối node để kích hoạt flow</p>
              </div>
            </>
          )}
        </div>

        {/* Info Box */}
        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex gap-2">
            <span className="text-lg">💡</span>
            <div className="text-xs text-blue-700">
              <p className="font-semibold mb-1">Start Node là điểm bắt đầu</p>
              <ul className="space-y-1 list-disc list-inside">
                <li>Không thể xóa node này</li>
                <li>Chỉ có thể kết nối đi (không nhận vào)</li>
                <li>Flow chỉ chạy khi có kết nối từ Start</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Protected Badge */}
      <div className="absolute -top-3 -left-3 bg-yellow-400 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
        🔒 Protected
      </div>

      {/* Output Handle - Only on the right */}
      <Handle
        type="source"
        position={Position.Right}
        id="output"
        className={`
          !w-4 !h-4 !rounded-full !border-2
          ${isActive 
            ? '!bg-green-500 !border-green-700' 
            : '!bg-green-300 !border-green-500'
          }
          transition-all duration-200
          hover:!w-5 hover:!h-5
        `}
        style={{ right: -8 }}
      />
    </div>
  );
}

export default memo(StartNode);
