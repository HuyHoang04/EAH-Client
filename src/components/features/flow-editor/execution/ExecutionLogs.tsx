'use client';

import { useState, useMemo, useRef, useEffect } from 'react';
import { FileText, RefreshCw, AlertTriangle, XCircle, Info, AlertCircle, Download, Search, Filter } from 'lucide-react';
import type { LogMessageEvent } from '@/hooks/useExecutionSocket';

interface ExecutionLogsProps {
  logs: LogMessageEvent[];
  onClear?: () => void;
}

export default function ExecutionLogs({ logs, onClear }: ExecutionLogsProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState<'all' | 'info' | 'warn' | 'error'>('all');
  const logsEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new logs arrive
  useEffect(() => {
    logsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Filter and search logs
  const filteredLogs = useMemo(() => {
    return logs.filter(log => {
      // Filter by level
      if (filterLevel !== 'all' && log.level !== filterLevel) {
        return false;
      }

      // Filter by search query
      if (searchQuery && !log.message.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      return true;
    });
  }, [logs, filterLevel, searchQuery]);

  // Export logs to file
  const handleExport = () => {
    const logText = logs.map(log => 
      `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.nodeId ? `[${log.nodeId}] ` : ''}${log.message}`
    ).join('\n');

    const blob = new Blob([logText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `execution-logs-${new Date().toISOString()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Get icon and color for log level
  const getLevelStyle = (level: string) => {
    switch (level) {
      case 'info':
        return {
          icon: Info,
          color: 'text-blue-600',
          bg: 'bg-blue-50',
          border: 'border-blue-200',
        };
      case 'warn':
        return {
          icon: AlertTriangle,
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
        };
      case 'error':
        return {
          icon: AlertCircle,
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
        };
      default:
        return {
          icon: Info,
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
        };
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border border-stone-200 shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-stone-200">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-50 rounded-lg">
            <Info className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h3 className="font-semibold text-black">Execution Logs</h3>
            <p className="text-xs text-black">{logs.length} messages</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            disabled={logs.length === 0}
            className="p-2 text-black hover:bg-stone-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            title="Export logs"
          >
            <Download className="w-4 h-4" />
          </button>
          {onClear && (
            <button
              onClick={onClear}
              disabled={logs.length === 0}
              className="p-2 text-black hover:bg-stone-100 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              title="Clear logs"
            >
              <XCircle className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 p-4 border-b border-stone-200 bg-stone-50">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-black" />
          <input
            type="text"
            placeholder="Search logs..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-black" />
          <div className="flex gap-2">
            {['all', 'info', 'warn', 'error'].map((level) => (
              <button
                key={level}
                onClick={() => setFilterLevel(level as any)}
                className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${
                  filterLevel === level
                    ? 'bg-blue-500 text-white'
                    : 'bg-white text-black hover:bg-stone-100 border border-stone-300'
                }`}
              >
                {level.charAt(0).toUpperCase() + level.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Logs List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2 font-mono text-sm">
        {filteredLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-black">
            <Info className="w-12 h-12 mb-2 opacity-50" />
            <p className="text-sm">
              {logs.length === 0 ? 'No logs yet' : 'No matching logs found'}
            </p>
          </div>
        ) : (
          filteredLogs.map((log, index) => {
            const style = getLevelStyle(log.level);
            const Icon = style.icon;
            
            return (
              <div
                key={index}
                className={`flex items-start gap-2 p-3 rounded-md border ${style.bg} ${style.border}`}
              >
                <Icon className={`w-4 h-4 mt-0.5 flex-shrink-0 ${style.color}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-xs font-semibold ${style.color}`}>
                      {log.level.toUpperCase()}
                    </span>
                    <span className="text-xs text-black">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </span>
                    {log.nodeId && (
                      <span className="text-xs px-2 py-0.5 bg-stone-200 text-black rounded">
                        {log.nodeId}
                      </span>
                    )}
                  </div>
                  <p className="text-black break-words">{log.message}</p>
                </div>
              </div>
            );
          })
        )}
        <div ref={logsEndRef} />
      </div>

      {/* Footer Stats */}
      <div className="flex items-center justify-between p-3 border-t border-stone-200 bg-stone-50 text-xs text-black">
        <div className="flex gap-4 text-sm text-black">
          <span className="flex items-center gap-1.5">
            <Info className="w-4 h-4" /> Info: <strong>{logs.filter(l => l.level === 'info').length}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> Warnings: <strong>{logs.filter(l => l.level === 'warn').length}</strong>
          </span>
          <span className="flex items-center gap-1.5">
            <XCircle className="w-4 h-4" /> Errors: <strong>{logs.filter(l => l.level === 'error').length}</strong>
          </span>
        </div>
        <span>
          Showing {filteredLogs.length} of {logs.length}
        </span>
      </div>
    </div>
  );
}
