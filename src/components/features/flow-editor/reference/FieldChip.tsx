import React from 'react';
import { X } from 'lucide-react';

interface FieldChipProps {
  nodeName: string;
  fieldPath: string;
  icon?: React.ReactNode;
  preview?: string;
  onRemove: () => void;
}

// Format preview value for better readability
const formatChipPreview = (preview: string): { text: string; title: string } => {
  // Remove quotes if already formatted
  const cleaned = preview.replace(/^"|"$/g, '');
  
  // Check for special formatting
  if (preview.startsWith('[') && preview.includes('item')) {
    // Array format: [X items]
    return { text: preview, title: preview };
  }
  
  if (preview.startsWith('{') && preview.includes(',')) {
    // Object format: {key1, key2, ...}
    return { text: preview, title: preview };
  }
  
  if (preview === '✓ true' || preview === '✗ false') {
    // Boolean
    return { text: preview, title: preview };
  }
  
  // Truncate long strings for chip display
  if (cleaned.length > 30) {
    return { 
      text: `${cleaned.substring(0, 27)}...`, 
      title: cleaned 
    };
  }
  
  return { text: cleaned, title: cleaned };
};

export function FieldChip({
  nodeName,
  fieldPath,
  icon,
  preview,
  onRemove
}: FieldChipProps) {
  const formattedPreview = preview ? formatChipPreview(preview) : null;
  
  return (
    <div 
      className="inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-blue-50 to-cyan-50 border-2 border-blue-400 rounded-full hover:scale-105 transition-all duration-200 cursor-pointer group shadow-sm hover:shadow-md"
      title={formattedPreview?.title || `${nodeName}.${fieldPath}`}
    >
      {/* Icon */}
      {icon && (
        <div className="w-5 h-5 text-blue-600 flex-shrink-0">
          {icon}
        </div>
      )}
      
      {/* Content */}
      <div className="flex flex-col leading-tight">
        <span className="text-xs font-semibold text-blue-700">
          {nodeName}
        </span>
        <span className="text-[10px] text-blue-600">
          → {fieldPath}
        </span>
      </div>
      
      {/* Preview */}
      {formattedPreview && (
        <span 
          className="text-xs text-gray-600 max-w-[120px] truncate border-l border-blue-300 pl-2 font-mono"
          title={formattedPreview.title}
        >
          {formattedPreview.text}
        </span>
      )}
      
      {/* Remove Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
        className="w-5 h-5 flex items-center justify-center rounded-full bg-red-500/10 text-red-600 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white flex-shrink-0"
        title="Remove field"
      >
        <X size={14} />
      </button>
    </div>
  );
}

// Export type for use in other components
export type { FieldChipProps };
