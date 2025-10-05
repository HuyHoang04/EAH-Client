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

  const onDragStart = (event: React.DragEvent, node: NodeMetadata) => {
    // Create complete node data object for drag & drop
    const dragData = {
      type: node.type,
      name: node.name,
      category: node.category,
      description: node.description,
      icon: node.icon,
      inputs: node.inputs,
      outputs: node.outputs
    };
    
    // Set JSON string instead of just node type
    event.dataTransfer.setData('application/reactflow', JSON.stringify(dragData));
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
              onDragStart={(e) => onDragStart(e, node)}
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

      {/* Connection Type Guide */}
      <div className="p-4 border-t bg-white space-y-3">
        <div>
          <h4 className="text-xs font-semibold text-gray-700 mb-2 uppercase">
            🔗 Connection Guide
          </h4>
          <p className="text-[10px] text-gray-500 mb-3">
            Màu sắc của connection points cho biết loại dữ liệu:
          </p>
          <div className="space-y-1.5">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#3B82F6' }}></div>
              <span className="text-xs text-gray-600">string - Văn bản</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#10B981' }}></div>
              <span className="text-xs text-gray-600">number - Số</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#F59E0B' }}></div>
              <span className="text-xs text-gray-600">boolean - True/False</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#8B5CF6' }}></div>
              <span className="text-xs text-gray-600">object - Đối tượng</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#EC4899' }}></div>
              <span className="text-xs text-gray-600">array - Mảng</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full" style={{ background: '#6366F1' }}></div>
              <span className="text-xs text-gray-600">any - Bất kỳ</span>
            </div>
          </div>
        </div>
        
        <div className="pt-2 border-t border-gray-100">
          <p className="text-[10px] text-gray-500">
            💡 <strong>Cách kết nối:</strong>
          </p>
          <ul className="text-[10px] text-gray-500 mt-1 space-y-0.5 ml-4">
            <li>• Kéo từ chấm tròn bên phải (output) 📤</li>
            <li>• Thả vào chấm tròn bên trái (input) 📥</li>
            <li>• Chỉ kết nối cùng màu hoặc màu tương thích</li>
            <li>• Hover vào chấm tròn để xem thông tin</li>
          </ul>
        </div>

        {/* Workflow Flow Example */}
        <div className="pt-3 border-t border-gray-100">
          <h4 className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
            🔄 <span>Workflow chạy như thế nào?</span>
          </h4>
          
          {/* Visual Flow Diagram */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg p-3 space-y-2">
            {/* Step 1 */}
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-purple-500 text-white text-[10px] font-bold flex items-center justify-center">
                1
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-gray-700 font-semibold">⏰ Trigger khởi động</p>
                <p className="text-[9px] text-gray-500">Cron/Webhook bắt đầu workflow</p>
              </div>
            </div>
            
            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="text-orange-500 text-xl">⬇️</div>
            </div>
            
            {/* Step 2 */}
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-orange-500 text-white text-[10px] font-bold flex items-center justify-center">
                2
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-gray-700 font-semibold">🔗 Trigger → Action</p>
                <p className="text-[9px] text-gray-500">Kết nối CAM trigger.output → action.trigger</p>
              </div>
            </div>
            
            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="text-orange-500 text-xl">⬇️</div>
            </div>
            
            {/* Step 3 */}
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                3
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-gray-700 font-semibold">📊 Truyền dữ liệu</p>
                <p className="text-[9px] text-gray-500">Data outputs (màu) → inputs tương ứng</p>
              </div>
            </div>
            
            {/* Arrow */}
            <div className="flex items-center justify-center">
              <div className="text-orange-500 text-xl">⬇️</div>
            </div>
            
            {/* Step 4 */}
            <div className="flex items-center gap-2">
              <div className="flex-shrink-0 w-5 h-5 rounded-full bg-green-500 text-white text-[10px] font-bold flex items-center justify-center">
                4
              </div>
              <div className="flex-1">
                <p className="text-[10px] text-gray-700 font-semibold">✅ Xử lý & tiếp tục</p>
                <p className="text-[9px] text-gray-500">Action chạy → trigger action tiếp theo</p>
              </div>
            </div>
          </div>
          
          {/* Example Flow */}
          <div className="mt-2 bg-white border border-gray-200 rounded p-2">
            <p className="text-[10px] text-gray-600 font-semibold mb-1">📝 Ví dụ:</p>
            <div className="text-[9px] text-gray-500 space-y-0.5">
              <p>⏰ <span className="font-mono bg-purple-100 px-1 rounded">CronTrigger</span> (9h sáng)</p>
              <p className="ml-3">↓ <span className="text-orange-500">trigger</span> →</p>
              <p>📧 <span className="font-mono bg-blue-100 px-1 rounded">SendEmail</span> (gửi report)</p>
              <p className="ml-3">↓ <span className="text-orange-500">trigger</span> →</p>
              <p>💾 <span className="font-mono bg-green-100 px-1 rounded">SaveToDB</span> (lưu log)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
