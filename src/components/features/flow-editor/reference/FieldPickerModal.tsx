import React, { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Node, Edge } from 'reactflow';
import { X, ChevronRight, ChevronDown, Search, Zap, Filter, Copy, Check, Clock, Trash2 } from 'lucide-react';
import { FieldReference, FieldType, isFieldCompatible, getFieldTypeName } from './types';
import { getRecentFieldsForNodes, saveRecentField, clearRecentFields, formatTimeAgo, RecentField } from '@/lib/recentFields';

interface FieldPickerModalProps {
  currentNodeId: string;
  nodes: Node[];
  edges: Edge[];
  fieldType?: FieldType;
  onSelect: (ref: FieldReference) => void;
  onClose: () => void;
}

interface NodeFieldData {
  [key: string]: unknown;
}

export function FieldPickerModal({
  currentNodeId,
  nodes,
  edges,
  fieldType,
  onSelect,
  onClose
}: FieldPickerModalProps) {
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [showAllFields, setShowAllFields] = useState(false); // Toggle for showing incompatible fields
  const [copiedPath, setCopiedPath] = useState<string | null>(null); // Track copied path for visual feedback
  const [recentFields, setRecentFields] = useState<RecentField[]>([]); // Recently used fields

  // Format preview based on value type
  const formatPreview = (value: unknown, typeName: string): string => {
    if (value === null) return '(null)';
    if (value === undefined) return '(undefined)';
    
    switch (typeName) {
      case 'string': {
        const str = String(value);
        if (str.length > 50) {
          return `"${str.substring(0, 47)}..."`;
        }
        return `"${str}"`;
      }
      
      case 'number':
        return value.toLocaleString();
      
      case 'boolean':
        return value ? '✓ true' : '✗ false';
      
      case 'array':
        if (Array.isArray(value)) {
          return `[${value.length} ${value.length === 1 ? 'item' : 'items'}]`;
        }
        return '[array]';
      
      case 'object': {
        if (typeof value === 'object' && value !== null) {
          const keys = Object.keys(value);
          if (keys.length === 0) return '{}';
          if (keys.length <= 3) {
            return `{${keys.join(', ')}}`;
          }
          return `{${keys.slice(0, 3).join(', ')}, +${keys.length - 3} more}`;
        }
        return '{}';
      }
      
      default: {
        const str = String(value);
        return str.length > 50 ? `${str.substring(0, 47)}...` : str;
      }
    }
  };

  // Copy path to clipboard
  const copyToClipboard = async (path: string, nodeName: string) => {
    const fullPath = `${nodeName}.${path}`;
    try {
      await navigator.clipboard.writeText(fullPath);
      setCopiedPath(fullPath);
      setTimeout(() => setCopiedPath(null), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  // Get all nodes that come before current node (traverse backwards)
  const previousNodes = useMemo(() => {
    const visited = new Set<string>();
    const result: Node[] = [];

    const traverse = (nodeId: string) => {
      if (visited.has(nodeId)) return;
      visited.add(nodeId);

      // Find edges that connect TO this node (incoming)
      const incomingEdges = edges.filter(e => e.target === nodeId);
      
      incomingEdges.forEach(edge => {
        const sourceNode = nodes.find(n => n.id === edge.source);
        if (sourceNode && sourceNode.id !== currentNodeId) {
          result.push(sourceNode);
          traverse(sourceNode.id);
        }
      });
    };

    traverse(currentNodeId);
    
    // Reverse to show in execution order (earliest first)
    return result.reverse();
  }, [currentNodeId, nodes, edges]);

  // Load recent fields on mount
  useEffect(() => {
    const availableNodeTypes = previousNodes.map(n => n.data.type || n.type);
    const recent = getRecentFieldsForNodes(availableNodeTypes, 5);
    setRecentFields(recent);
  }, [previousNodes]);

  // Enhanced onSelect that saves to recent history
  const handleFieldSelect = (ref: FieldReference) => {
    // Save to recent history
    const node = nodes.find(n => n.id === ref.nodeId);
    if (node) {
      saveRecentField(
        ref.nodeId,
        node.data.type || node.type || 'unknown',
        ref.nodeName,
        ref.fieldPath,
        ref.icon
      );
    }
    
    // Call original onSelect
    onSelect(ref);
  };

  // Clear recent history
  const handleClearRecent = () => {
    clearRecentFields();
    setRecentFields([]);
  };

  // Mock field data - In production, this would come from actual execution results
  const getNodeFields = (node: Node): NodeFieldData => {
    const nodeType = node.data.type || node.type;
    
    // Mock data based on node type
    const mockDataByType: Record<string, NodeFieldData> = {
      'trigger': {
        timestamp: new Date().toISOString(),
        userId: 'user-123',
        eventType: 'manual',
        metadata: {
          source: 'web',
          ipAddress: '192.168.1.1'
        }
      },
      'getStudents': {
        email: 'john@example.com',
        name: 'John Doe',
        score: 95,
        students: [
          { email: 'john@example.com', name: 'John', score: 95 },
          { email: 'jane@example.com', name: 'Jane', score: 88 }
        ],
        metadata: {
          total: 2,
          source: 'database'
        }
      },
      'httpRequest': {
        status: 200,
        statusText: 'OK',
        data: { 
          success: true,
          message: 'Request completed',
          results: ['item1', 'item2']
        },
        headers: {
          'content-type': 'application/json'
        }
      },
      'sendEmail': {
        success: true,
        messageId: 'msg-123',
        recipient: 'john@example.com'
      }
    };

    // Return mock data or node config
    return mockDataByType[nodeType] || node.data.config || {};
  };

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  const getFieldIcon = (value: unknown): string => {
    if (Array.isArray(value)) return '📚';
    if (typeof value === 'number') return '🔢';
    if (typeof value === 'boolean') return '✓';
    if (typeof value === 'object' && value !== null) return '📦';
    if (typeof value === 'string') {
      if (value.includes('@')) return '📧';
      if (value.startsWith('http')) return '🔗';
      if (value.match(/^\d{4}-\d{2}-\d{2}/)) return '📅';
    }
    return '📝';
  };

  // Breadcrumb component for showing nested path hierarchy
  const FieldPathBreadcrumb = ({ 
    nodeName, 
    path 
  }: { 
    nodeName: string; 
    path: string; 
  }) => {
    if (!path) return null;
    
    const parts = path.split('.');
    
    return (
      <div className="flex items-center gap-1 text-xs bg-blue-50 px-2 py-1 rounded-md border border-blue-200">
        <span className="font-semibold text-blue-700">{nodeName}</span>
        {parts.map((part, index) => (
          <React.Fragment key={index}>
            <ChevronRight className="w-3 h-3 text-blue-400" />
            <span className={index === parts.length - 1 ? 'font-semibold text-blue-800' : 'text-blue-600'}>
              {part}
            </span>
          </React.Fragment>
        ))}
      </div>
    );
  };

  const renderFieldTree = (
    obj: NodeFieldData, 
    parentPath: string = '', 
    node: Node,
    depth: number = 0
  ): React.ReactElement[] => {
    if (depth > 3) {
      return [
        <div key="max-depth" className="text-xs text-gray-400 ml-4 py-1">
          ... (nested too deep)
        </div>
      ];
    }

    return Object.entries(obj).map(([key, value]) => {
      const fieldPath = parentPath ? `${parentPath}.${key}` : key;
      const isExpandable = typeof value === 'object' && value !== null;
      const isExpanded = expandedNodes.has(`${node.id}.${fieldPath}`);
      const fieldIcon = getFieldIcon(value);
      const valueTypeName = getFieldTypeName(value);
      
      // Check field compatibility with target type
      const isCompatible = isFieldCompatible(value, key, fieldType);
      const shouldShow = showAllFields || isCompatible;

      // Search filter
      if (searchQuery && !fieldPath.toLowerCase().includes(searchQuery.toLowerCase())) {
        return null;
      }
      
      // Hide incompatible fields unless "Show All" is enabled
      if (!shouldShow) {
        return null;
      }

      return (
        <div key={fieldPath} className="ml-4">
          {/* Show breadcrumb for nested paths (depth > 1) */}
          {depth > 1 && parentPath && (
            <div className="ml-6 mb-1">
              <FieldPathBreadcrumb 
                nodeName={node.data.label || node.data.type} 
                path={fieldPath} 
              />
            </div>
          )}
          
          <div className={`flex items-center gap-2 py-1.5 hover:bg-blue-50 rounded px-2 group transition-colors ${
            !isCompatible ? 'opacity-50' : ''
          }`}>
            {/* Expand/Collapse for objects/arrays */}
            {isExpandable ? (
              <button
                onClick={() => toggleNode(`${node.id}.${fieldPath}`)}
                className="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700"
              >
                {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
              </button>
            ) : (
              <div className="w-4" />
            )}

            {/* Field icon */}
            <span className="text-base" title={valueTypeName}>
              {fieldIcon}
            </span>

            {/* Field name */}
            <span className="text-sm font-medium text-gray-700 flex-1">
              {key}
            </span>

            {/* Preview value - Enhanced with type-specific formatting */}
            {!isExpandable && (
              <span className="text-xs text-gray-600 truncate max-w-[200px] font-mono bg-gray-50 px-2 py-0.5 rounded" title={formatPreview(value, valueTypeName)}>
                {formatPreview(value, valueTypeName)}
              </span>
            )}

            {/* Type badge with compatibility indicator */}
            <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium ${
              isCompatible 
                ? 'text-green-700 bg-green-100' 
                : 'text-gray-400 bg-gray-100'
            }`}>
              {valueTypeName}
              {isCompatible && fieldType && fieldType !== 'any' && ' ✓'}
            </span>

            {/* Copy path button */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                copyToClipboard(fieldPath, node.data.label || node.data.type);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-600 transition-all"
              title={copiedPath === `${node.data.label || node.data.type}.${fieldPath}` ? 'Copied!' : 'Copy path'}
            >
              {copiedPath === `${node.data.label || node.data.type}.${fieldPath}` ? (
                <Check size={14} className="text-green-600" />
              ) : (
                <Copy size={14} />
              )}
            </button>

            {/* Add button */}
            <button
              onClick={() => {
                handleFieldSelect({
                  nodeId: node.id,
                  nodeName: node.data.label || node.data.type,
                  fieldPath,
                  icon: fieldIcon,
                  preview: !isExpandable ? formatPreview(value, valueTypeName) : undefined
                });
              }}
              className="opacity-0 group-hover:opacity-100 px-2 py-1 text-xs font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition-all shadow-sm"
              disabled={!isCompatible && !showAllFields}
            >
              Add
            </button>

            {/* Loop button for arrays */}
            {Array.isArray(value) && (
              <button
                onClick={() => {
                  // For now, just add the whole array path
                  // We'll enhance this with a submenu later
                  handleFieldSelect({
                    nodeId: node.id,
                    nodeName: node.data.label || node.data.type,
                    fieldPath: `${fieldPath}[]`, // Special notation for loop
                    icon: '🔄',
                    preview: `Loop through ${value.length} items`
                  });
                }}
                className="opacity-0 group-hover:opacity-100 px-2 py-1 text-xs font-medium text-white bg-purple-600 hover:bg-purple-700 rounded transition-all shadow-sm"
                title="Loop through all items"
              >
                🔄 Loop
              </button>
            )}
          </div>

          {/* Render nested fields */}
          {isExpandable && isExpanded && (
            <div className="ml-2 border-l-2 border-gray-200 pl-2">
              {Array.isArray(value) ? (
                <>
                  {/* Array quick actions */}
                  <div className="flex gap-2 my-2 ml-4">
                    <button
                      onClick={() => {
                        handleFieldSelect({
                          nodeId: node.id,
                          nodeName: node.data.label || node.data.type,
                          fieldPath: `${fieldPath}.0`,
                          icon: '🎯',
                          preview: 'First item in array'
                        });
                      }}
                      className="px-2 py-1 text-xs font-medium text-blue-700 bg-blue-50 hover:bg-blue-100 rounded border border-blue-200 transition-colors"
                    >
                      First Item
                    </button>
                    <button
                      onClick={() => {
                        handleFieldSelect({
                          nodeId: node.id,
                          nodeName: node.data.label || node.data.type,
                          fieldPath: `${fieldPath}.length`,
                          icon: '🔢',
                          preview: String(value.length)
                        });
                      }}
                      className="px-2 py-1 text-xs font-medium text-purple-700 bg-purple-50 hover:bg-purple-100 rounded border border-purple-200 transition-colors"
                    >
                      Length ({value.length})
                    </button>
                  </div>
                  
                  {/* Show array items */}
                  {value.slice(0, 5).map((item, idx) => (
                    <div key={idx} className="my-1">
                      <div className="flex items-center gap-2 py-1 px-2">
                        <span className="text-xs text-gray-500 font-mono">
                          [{idx}]
                        </span>
                        <span className="text-xs text-gray-600">
                          {typeof item === 'object' && item !== null 
                            ? `{${Object.keys(item).slice(0, 3).join(', ')}${Object.keys(item).length > 3 ? '...' : ''}}`
                            : String(item).substring(0, 50)
                          }
                        </span>
                      </div>
                      {typeof item === 'object' && item !== null ? (
                        renderFieldTree(item, `${fieldPath}[${idx}]`, node, depth + 1)
                      ) : (
                        <div className="ml-4 text-xs text-gray-600 py-1">
                          {String(item)}
                        </div>
                      )}
                    </div>
                  ))}
                  {value.length > 5 && (
                    <button
                      onClick={() => toggleNode(`${node.id}.${fieldPath}.showAll`)}
                      className="text-xs text-blue-600 hover:text-blue-700 ml-4 py-1 underline"
                    >
                      {expandedNodes.has(`${node.id}.${fieldPath}.showAll`) 
                        ? 'Show less' 
                        : `Show all ${value.length} items...`
                      }
                    </button>
                  )}
                </>
              ) : (
                typeof value === 'object' && value !== null ? renderFieldTree(value as NodeFieldData, fieldPath, node, depth + 1) : null
              )}
            </div>
          )}
        </div>
      );
    }).filter(Boolean) as React.ReactElement[];
  };

  const modal = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-3xl max-h-[85vh] bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-500 to-cyan-500 text-white p-5 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Zap size={24} />
              Select Data Field
            </h2>
            <p className="text-sm text-blue-100 mt-1">
              Choose data from previous steps in your workflow
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/20 transition-colors"
          >
            <X size={22} />
          </button>
        </div>

        {/* Search & Filter */}
        <div className="p-4 border-b bg-gray-50 space-y-3">
          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search fields..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-blue-400 outline-none transition-colors"
              autoFocus
            />
          </div>
          
          {/* Filter options */}
          {fieldType && fieldType !== 'any' && (
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-gray-500" />
                <span className="text-sm text-gray-600">
                  Filtering for: <span className="font-semibold text-blue-600">{fieldType}</span> type
                </span>
              </div>
              <button
                onClick={() => setShowAllFields(!showAllFields)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg border-2 transition-colors ${
                  showAllFields
                    ? 'bg-blue-50 border-blue-300 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                }`}
              >
                {showAllFields ? '✓ Show All Fields' : 'Show Compatible Only'}
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto flex-1 p-4">
          {/* Recently Used Fields Section */}
          {recentFields.length > 0 && !searchQuery && (
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <Clock size={16} className="text-purple-600" />
                  Recently Used
                </h3>
                <button
                  onClick={handleClearRecent}
                  className="text-xs text-gray-500 hover:text-red-600 flex items-center gap-1 transition-colors"
                  title="Clear history"
                >
                  <Trash2 size={12} />
                  Clear
                </button>
              </div>
              <div className="space-y-2">
                {recentFields.map((field, index) => {
                  // Find the node for this field
                  const node = previousNodes.find(n => 
                    (n.data.type || n.type) === field.nodeType
                  );
                  
                  if (!node) return null;
                  
                  const fieldIcon = field.icon || '📝';
                  
                  return (
                    <button
                      key={`${field.nodeType}-${field.fieldPath}-${index}`}
                      onClick={() => {
                        handleFieldSelect({
                          nodeId: node.id,
                          nodeName: field.nodeName,
                          fieldPath: field.fieldPath,
                          icon: fieldIcon,
                          preview: undefined
                        });
                      }}
                      className="w-full flex items-center justify-between p-3 rounded-lg border-2 border-purple-200 bg-purple-50 hover:bg-purple-100 hover:border-purple-300 transition-all group"
                    >
                      <div className="flex items-center gap-3 flex-1 min-w-0">
                        <span className="text-xl flex-shrink-0">{fieldIcon}</span>
                        <div className="flex-1 min-w-0 text-left">
                          <div className="text-sm font-medium text-gray-800 truncate">
                            {field.nodeName} → {field.fieldPath}
                          </div>
                          <div className="text-xs text-gray-500">
                            {formatTimeAgo(field.usedAt)}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-xs font-medium text-purple-700 bg-purple-200 px-2 py-1 rounded">
                          {field.count}x
                        </span>
                        <span className="text-xs text-purple-600 opacity-0 group-hover:opacity-100 transition-opacity">
                          Add →
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>
              <div className="mt-3 pt-3 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                  💡 Quick access to your most used fields
                </p>
              </div>
            </div>
          )}
          
          {previousNodes.length === 0 ? (
            <div className="text-center py-16 text-gray-400">
              <Zap size={48} className="mx-auto mb-4 opacity-30" />
              <p className="text-lg font-medium">No previous nodes found</p>
              <p className="text-sm mt-2">
                Connect this node to other nodes first to access their data
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {previousNodes.map(node => {
                const fields = getNodeFields(node);
                const fieldCount = Object.keys(fields).length;
                const isExpanded = expandedNodes.has(node.id);
                const nodeIcon = node.data.icon || '⚡';

                return (
                  <div 
                    key={node.id} 
                    className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-blue-300 transition-colors"
                  >
                    {/* Node Header */}
                    <button
                      onClick={() => toggleNode(node.id)}
                      className="w-full flex items-center gap-3 p-4 bg-gradient-to-r from-gray-50 to-gray-100 hover:from-blue-50 hover:to-cyan-50 transition-all"
                    >
                      {isExpanded ? (
                        <ChevronDown size={20} className="text-gray-600" />
                      ) : (
                        <ChevronRight size={20} className="text-gray-600" />
                      )}
                      <span className="text-2xl">{nodeIcon}</span>
                      <div className="flex-1 text-left">
                        <span className="font-semibold text-gray-800 block">
                          {node.data.label || node.data.type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {fieldCount} {fieldCount === 1 ? 'field' : 'fields'} available
                        </span>
                      </div>
                    </button>

                    {/* Node Fields */}
                    {isExpanded && (
                      <div className="p-3 bg-white max-h-[300px] overflow-y-auto">
                        {fieldCount > 0 ? (
                          <div>
                            {renderFieldTree(fields, '', node)}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-400 py-4 px-4 text-center">
                            No data available yet. This node hasn&apos;t been executed.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 border-t p-4 flex justify-between items-center">
          <div className="text-xs text-gray-500">
            💡 Click &quot;Add&quot; next to any field to use it in your configuration
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg transition-colors font-medium"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modal, document.body);
}
