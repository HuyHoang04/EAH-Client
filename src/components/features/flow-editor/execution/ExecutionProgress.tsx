'use client';

import { Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

interface ExecutionProgressProps {
  progress: {
    completed: number;
    total: number;
    percentage: number;
  };
  currentExecution?: {
    flowName: string;
    startedAt: string;
  } | null;
  isRunning?: boolean;
}

export default function ExecutionProgress({ 
  progress, 
  currentExecution,
  isRunning = false 
}: ExecutionProgressProps) {
  // Calculate elapsed time
  const getElapsedTime = () => {
    if (!currentExecution) return '0s';
    
    const start = new Date(currentExecution.startedAt).getTime();
    const now = Date.now();
    const elapsed = Math.floor((now - start) / 1000);
    
    if (elapsed < 60) return `${elapsed}s`;
    if (elapsed < 3600) return `${Math.floor(elapsed / 60)}m ${elapsed % 60}s`;
    return `${Math.floor(elapsed / 3600)}h ${Math.floor((elapsed % 3600) / 60)}m`;
  };

  return (
    <div className="bg-white rounded-lg border border-stone-200 shadow-sm p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          {isRunning ? (
            <Loader2 className="w-5 h-5 text-blue-600 animate-spin" />
          ) : progress.percentage === 100 ? (
            <CheckCircle2 className="w-5 h-5 text-green-600" />
          ) : (
            <XCircle className="w-5 h-5 text-red-600" />
          )}
          <h3 className="font-semibold text-black">
            {isRunning ? 'Executing...' : progress.percentage === 100 ? 'Completed' : 'Failed'}
          </h3>
        </div>

        {currentExecution && (
          <div className="flex items-center gap-2 text-sm text-black">
            <Clock className="w-4 h-4" />
            <span>{getElapsedTime()}</span>
          </div>
        )}
      </div>

      {/* Workflow Name */}
      {currentExecution && (
        <p className="text-sm text-black mb-3">
          {currentExecution.flowName}
        </p>
      )}

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-black mb-2">
          <span>Progress</span>
          <span className="font-mono font-semibold">
            {progress.completed} / {progress.total} nodes
          </span>
        </div>
        <div className="h-3 bg-stone-200 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-500 ease-out ${
              isRunning
                ? 'bg-gradient-to-r from-blue-500 to-indigo-500'
                : progress.percentage === 100
                ? 'bg-gradient-to-r from-green-500 to-emerald-500'
                : 'bg-gradient-to-r from-red-500 to-pink-500'
            }`}
            style={{ width: `${progress.percentage}%` }}
          />
        </div>
        <div className="text-center mt-1">
          <span className="text-lg font-bold text-black">
            {progress.percentage}%
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 pt-3 border-t border-stone-200">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">
            {progress.total}
          </div>
          <div className="text-xs text-black">Total</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {progress.completed}
          </div>
          <div className="text-xs text-black">Completed</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-black">
            {progress.total - progress.completed}
          </div>
          <div className="text-xs text-black">Remaining</div>
        </div>
      </div>
    </div>
  );
}
