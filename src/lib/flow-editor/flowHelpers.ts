import { FieldValue } from '@/components/features/flow-editor/reference';

export function convertFieldValueToBackend(fieldValue: FieldValue[] | string | any): any {
  if (typeof fieldValue === 'string' || typeof fieldValue === 'number' || typeof fieldValue === 'boolean') {
    return fieldValue;
  }
  
  if (!Array.isArray(fieldValue)) {
    return fieldValue;
  }
  
  return fieldValue;
}

export function convertBackendToFieldValue(backendValue: any): FieldValue[] | any {
  if (Array.isArray(backendValue) && backendValue.length > 0 && backendValue[0].type) {
    return backendValue;
  }
  
  if (typeof backendValue === 'string') {
    return backendValue ? [{ type: 'text', value: backendValue }] : [];
  }
  
  return backendValue;
}

export function prepareNodesForBackend(nodes: any[]): any[] {
  return nodes.map(node => {
    if (!node.data.parameters) return node;
    
    const convertedParams: Record<string, any> = {};
    for (const [key, value] of Object.entries(node.data.parameters)) {
      convertedParams[key] = convertFieldValueToBackend(value);
    }
    
    return {
      ...node,
      data: {
        ...node.data,
        parameters: convertedParams,
      },
    };
  });
}

export function convertParametersFromBackend(nodes: any[]): any[] {
  return nodes.map((node: any) => {
    if (!node.data.parameters) return node;
    
    const convertedParams: Record<string, any> = {};
    for (const [key, value] of Object.entries(node.data.parameters)) {
      const useSmartInput = ['to', 'subject', 'body', 'message', 'content', 'text', 'url', 'path', 'email'].some(
        keyword => key.toLowerCase().includes(keyword)
      );
      
      if (useSmartInput) {
        convertedParams[key] = convertBackendToFieldValue(value);
      } else {
        convertedParams[key] = value;
      }
    }
    
    return {
      ...node,
      data: {
        ...node.data,
        parameters: convertedParams,
      },
    };
  });
}
