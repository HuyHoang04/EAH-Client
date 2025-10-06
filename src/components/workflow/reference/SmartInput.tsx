import React, { useState, KeyboardEvent } from 'react';
import { Node, Edge } from 'reactflow';
import { Plus, Type } from 'lucide-react';
import { FieldChip } from './FieldChip';
import { LoopChip } from './LoopChip';
import { FieldPickerModal } from './FieldPickerModal';
import { FieldValue, FieldReference, SmartInputConfig } from './types';

interface SmartInputProps extends SmartInputConfig {
  value: FieldValue[];
  onChange: (value: FieldValue[]) => void;
  currentNodeId: string;
  nodes: Node[];
  edges: Edge[];
}

export function SmartInput({
  label,
  value,
  onChange,
  type,
  fieldType,
  currentNodeId,
  nodes,
  edges,
  placeholder = 'Enter text or add field...',
  required = false,
  multiline = false
}: SmartInputProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [textInput, setTextInput] = useState('');

  const handleAddReference = (ref: FieldReference) => {
    if (type === 'single') {
      // Replace all with single reference
      onChange([{ type: 'reference', ...ref }]);
    } else {
      // Add to existing
      onChange([...value, { type: 'reference', ...ref }]);
    }
    setShowPicker(false);
  };

  const handleAddText = () => {
    if (textInput.trim()) {
      onChange([...value, { type: 'text', value: textInput.trim() }]);
      setTextInput('');
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleAddText();
    }
  };

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index));
  };

  const isEmpty = value.length === 0 && !textInput;

  return (
    <div className="space-y-2">
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Input Container */}
      <div className="min-h-[60px] p-3 bg-white border-2 border-gray-200 rounded-lg focus-within:border-blue-400 transition-colors">
        <div className="flex flex-wrap gap-2 items-start">
          {/* Render chips and text segments */}
          {value.map((item, idx) => {
            if (item.type === 'reference') {
              return (
                <FieldChip
                  key={`ref-${idx}`}
                  nodeId={item.nodeId}
                  nodeName={item.nodeName}
                  fieldPath={item.fieldPath}
                  icon={item.icon ? <span>{item.icon}</span> : undefined}
                  preview={item.preview}
                  onRemove={() => handleRemove(idx)}
                />
              );
            } else if (item.type === 'loop') {
              // Extract array path and field from fieldPath
              // Format: "students[]" or "students[].email"
              const match = item.fieldPath.match(/^(.+?)\[\](?:\.(.+))?$/);
              const arrayPath = match?.[1] || item.fieldPath;
              const selectedField = match?.[2];
              
              // Mock available fields - in production, get from actual data
              const availableFields = ['email', 'name', 'score', 'grade'];
              
              return (
                <LoopChip
                  key={`loop-${idx}`}
                  nodeId={item.nodeId}
                  nodeName={item.nodeName}
                  arrayPath={arrayPath}
                  itemFields={availableFields}
                  selectedField={selectedField}
                  icon={item.icon ? <span>{item.icon}</span> : undefined}
                  preview={item.preview}
                  onRemove={() => handleRemove(idx)}
                  onFieldChange={(field) => {
                    // Update the loop to include the selected field
                    const newValue = [...value];
                    newValue[idx] = {
                      ...item,
                      fieldPath: `${arrayPath}[].${field}`
                    };
                    onChange(newValue);
                  }}
                />
              );
            } else {
              // Text type
              return (
                <span 
                  key={`text-${idx}`} 
                  className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-800 rounded text-sm group"
                >
                  <Type size={12} className="text-gray-500" />
                  {item.type === 'text' ? item.value : ''}
                  <button
                    onClick={() => handleRemove(idx)}
                    className="opacity-0 group-hover:opacity-100 w-4 h-4 flex items-center justify-center rounded-full hover:bg-red-100 text-red-600 transition-all"
                  >
                    ×
                  </button>
                </span>
              );
            }
          })}

          {/* Text Input Area (for text-with-fields mode) */}
          {type === 'text-with-fields' && (
            multiline ? (
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleAddText}
                placeholder={isEmpty ? placeholder : ''}
                className="flex-1 min-w-[150px] min-h-[24px] outline-none bg-transparent resize-none"
                rows={2}
              />
            ) : (
              <input
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                onKeyDown={handleKeyDown}
                onBlur={handleAddText}
                placeholder={isEmpty ? placeholder : 'Type here...'}
                className="flex-1 min-w-[150px] outline-none bg-transparent"
              />
            )
          )}

          {/* Add Field Button */}
          <button
            onClick={() => setShowPicker(true)}
            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
            title="Add field from previous steps"
          >
            <Plus size={14} />
            <span>Field</span>
          </button>
        </div>
      </div>

      {/* Help Text */}
      {type === 'text-with-fields' && (
        <p className="text-xs text-gray-500">
          💡 Type text directly or click "+ Field" to insert data from previous steps
        </p>
      )}

      {/* Field Picker Modal */}
      {showPicker && (
        <FieldPickerModal
          currentNodeId={currentNodeId}
          nodes={nodes}
          edges={edges}
          fieldType={fieldType}
          onSelect={handleAddReference}
          onClose={() => setShowPicker(false)}
        />
      )}
    </div>
  );
}

// Re-export types for convenience
export type { FieldValue, FieldReference, SmartInputConfig };
