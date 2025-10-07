// Shared types for reference system

export type FieldValue = 
  | { type: 'text'; value: string }
  | { 
      type: 'reference'; 
      nodeId: string; 
      nodeName: string; 
      fieldPath: string; 
      icon?: string;
      preview?: string;
    }
  | {
      type: 'loop';
      nodeId: string;
      nodeName: string;
      fieldPath: string; // Format: "students[]" or "students[].email"
      icon?: string;
      preview?: string;
    };

export interface FieldReference {
  nodeId: string;
  nodeName: string;
  fieldPath: string;
  icon?: string;
  preview?: string;
}

export type InputType = 'single' | 'multiple' | 'text-with-fields';
export type FieldType = 'email' | 'text' | 'string' | 'number' | 'url' | 'date' | 'boolean' | 'array' | 'object' | 'any';

export interface SmartInputConfig {
  label: string;
  placeholder?: string;
  type: InputType;
  fieldType?: FieldType;
  required?: boolean;
  multiline?: boolean;
}

// Helper to check if a field value is compatible with target type
export function isFieldCompatible(fieldValue: any, fieldName: string, targetType?: FieldType): boolean {
  // If no target type specified, all fields are compatible
  if (!targetType || targetType === 'any') return true;
  
  const valueType = Array.isArray(fieldValue) ? 'array' : typeof fieldValue;
  
  switch (targetType) {
    case 'email':
      // Email fields: string type + contains "email" in name
      return valueType === 'string' && fieldName.toLowerCase().includes('email');
    
    case 'text':
    case 'string':
      // Text fields: any string
      return valueType === 'string';
    
    case 'number':
      // Number fields: number or numeric string
      return valueType === 'number' || 
             (valueType === 'string' && !isNaN(Number(fieldValue)));
    
    case 'url':
      // URL fields: string starting with http
      return valueType === 'string' && 
             (String(fieldValue).startsWith('http') || fieldName.toLowerCase().includes('url'));
    
    case 'date':
      // Date fields: string matching date pattern or contains "date"/"time"
      return (valueType === 'string' && !!String(fieldValue).match(/^\d{4}-\d{2}-\d{2}/)) ||
             !!fieldName.toLowerCase().match(/(date|time|created|updated)/);
    
    case 'boolean':
      // Boolean fields
      return valueType === 'boolean';
    
    case 'array':
      // Array fields
      return Array.isArray(fieldValue);
    
    case 'object':
      // Object fields (not array)
      return valueType === 'object' && !Array.isArray(fieldValue) && fieldValue !== null;
    
    default:
      return true;
  }
}

// Get a human-readable type name
export function getFieldTypeName(value: any): string {
  if (value === null) return 'null';
  if (value === undefined) return 'undefined';
  if (Array.isArray(value)) return 'array';
  return typeof value;
}
