import React, { useState } from 'react';
import { X, ChevronDown, ChevronRight, ReplyAll } from 'lucide-react';

interface LoopChipProps {
  nodeName: string;
  arrayPath: string;
  itemFields?: string[]; // Available fields in array items
  selectedField?: string; // Currently selected field to extract
  icon?: React.ReactNode;
  preview?: string;
  onRemove: () => void;
  onFieldChange?: (field: string) => void;
}

export function LoopChip({
  nodeName,
  arrayPath,
  itemFields = [],
  selectedField,
  icon,
  preview,
  onRemove,
  onFieldChange
}: LoopChipProps) {
  const [showFieldSelector, setShowFieldSelector] = useState(false);

  return (
    <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-400 rounded-full hover:scale-105 transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md relative">
      {/* Loop Icon */}
      <div className="w-5 h-5 text-purple-600 flex-shrink-0 animate-spin-slow">
        <ReplyAll size={16} />
      </div>
      
      {/* Content */}
      <div className="flex flex-col leading-tight">
        <span className="text-xs font-semibold text-purple-700 flex items-center gap-1">
          {nodeName}
          <span className="text-[10px] bg-purple-200 px-1 rounded">LOOP</span>
        </span>
        <span className="text-[10px] text-purple-600">
          → {arrayPath}
          {selectedField && (
            <span className="text-pink-600 font-semibold">
              [].{selectedField}
            </span>
          )}
        </span>
      </div>

      {/* Field Selector Toggle (if multiple fields available) */}
      {itemFields.length > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowFieldSelector(!showFieldSelector);
          }}
          className="w-5 h-5 flex items-center justify-center rounded-full bg-purple-500/10 text-purple-600 hover:bg-purple-500/20 flex-shrink-0"
          title="Select field to extract"
        >
          {showFieldSelector ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
        </button>
      )}
      
      {/* Preview */}
      {preview && (
        <span className="text-xs text-gray-600 max-w-[100px] truncate border-l border-purple-300 pl-2">
          {preview}
        </span>
      )}
      
      {/* Remove Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="w-5 h-5 flex items-center justify-center rounded-full bg-red-500/10 text-red-600 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white flex-shrink-0"
        title="Remove loop"
      >
        <X size={14} />
      </button>

      {/* Field Selector Dropdown */}
      {showFieldSelector && itemFields.length > 0 && (
        <div className="absolute top-full left-0 mt-1 bg-white border-2 border-purple-300 rounded-lg shadow-xl z-10 min-w-[200px]">
          <div className="p-2 border-b bg-purple-50">
            <span className="text-xs font-semibold text-purple-700">
              Extract field from each item:
            </span>
          </div>
          <div className="max-h-[200px] overflow-y-auto">
            {itemFields.map(field => (
              <button
                key={field}
                onClick={(e) => {
                  e.stopPropagation();
                  onFieldChange?.(field);
                  setShowFieldSelector(false);
                }}
                className={`w-full px-3 py-2 text-left text-sm hover:bg-purple-50 transition-colors flex items-center justify-between ${
                  selectedField === field ? 'bg-purple-100 font-semibold' : ''
                }`}
              >
                <span>{field}</span>
                {selectedField === field && (
                  <span className="text-purple-600">✓</span>
                )}
              </button>
            ))}
          </div>
          <div className="p-2 border-t bg-gray-50 text-[10px] text-gray-600">
             Will extract this field from each array item
          </div>
        </div>
      )}
    </div>
  );
}

export type { LoopChipProps };
