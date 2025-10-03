/**
 * Node Palette Component
 * Display available nodes that can be dragged to canvas
 */

'use client';

import { useEffect, useState } from 'react';
import { nodeRunnerService, NodeMetadata, getNodeCategoryColor } from '@/services/nodeRunnerService';

export default function NodePalette() {
  const [nodes, setNodes] = useState<NodeMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    loadNodes();
  }, []);

  const loadNodes = async () => {
    try {
      const { nodes: availableNodes } = await nodeRunnerService.getAvailableNodes();
      setNodes(availableNodes);
    } catch (error) {
      console.error('Failed to load nodes:', error);
    } finally {
      setLoading(false);
    }
  };

  const categories = ['all', 'trigger', 'action', 'logic', 'data', 'transform'];

  const filteredNodes = selectedCategory === 'all'
    ? nodes
    : nodes.filter(node => node.category === selectedCategory);

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  if (loading) {
    return (
      <div className="p-4">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50">
      {/* Header */}
      <div className="p-4 border-b bg-white">
        <h3 className="text-lg font-semibold text-gray-800">Nodes</h3>
        <p className="text-sm text-gray-500 mt-1">{nodes.length} available</p>
      </div>

      {/* Category Filter */}
      <div className="p-4 space-y-2">
        <label className="text-xs font-medium text-gray-600 uppercase">Category</label>
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-3 py-1 text-xs rounded-full font-medium transition-colors
                ${selectedCategory === category
                  ? 'bg-blue-600 text-white'
                  : 'bg-white text-gray-600 hover:bg-gray-100 border border-gray-200'
                }
              `}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Node List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {filteredNodes.length === 0 ? (
          <div className="text-center text-gray-400 py-8">
            <p>No nodes found</p>
          </div>
        ) : (
          filteredNodes.map((node) => (
            <div
              key={node.type}
              draggable
              onDragStart={(e) => onDragStart(e, node.type)}
              className="
                bg-white border border-gray-200 rounded-lg p-3
                cursor-move hover:shadow-md transition-shadow
                hover:border-blue-400
              "
            >
              <div className="flex items-start gap-3">
                {/* Category Badge */}
                <div className={`
                  ${getNodeCategoryColor(node.category)}
                  w-2 h-2 rounded-full mt-2 flex-shrink-0
                `} />

                <div className="flex-1 min-w-0">
                  {/* Node Name */}
                  <h4 className="font-medium text-gray-800 truncate">
                    {node.name}
                  </h4>

                  {/* Node Description */}
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                    {node.description}
                  </p>

                  {/* Node Type */}
                  <p className="text-xs text-gray-400 mt-1 font-mono">
                    {node.type}
                  </p>

                  {/* Inputs/Outputs Count */}
                  <div className="flex gap-3 mt-2">
                    <span className="text-xs text-gray-500">
                      📥 {node.inputs.length} inputs
                    </span>
                    <span className="text-xs text-gray-500">
                      📤 {node.outputs.length} outputs
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer Hint */}
      <div className="p-4 border-t bg-white">
        <p className="text-xs text-gray-500 text-center">
          💡 Drag & drop nodes to canvas
        </p>
      </div>
    </div>
  );
}
