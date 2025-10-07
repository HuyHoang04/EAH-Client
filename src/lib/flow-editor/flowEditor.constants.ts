export const customStyles = `
  .react-flow__node.selected {
    outline: 3px solid #F59E0B;
    outline-offset: 0px;
    box-shadow: 0 0 0 3px rgba(245, 158, 11, 0.3), 0 0 20px rgba(245, 158, 11, 0.4);
  }
  .react-flow__node {
    transition: box-shadow 0.15s ease, outline 0.15s ease;
  }
  .react-flow__node:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
  body.resizing {
    cursor: col-resize !important;
    user-select: none;
  }
  body.resizing * {
    cursor: col-resize !important;
  }
  
  .react-flow__edge-path {
    stroke-width: 2;
    transition: stroke-width 0.2s ease, stroke 0.2s ease;
  }
  .react-flow__edge:hover .react-flow__edge-path {
    stroke-width: 3;
  }
  .react-flow__edge.selected .react-flow__edge-path {
    stroke-width: 3;
    stroke: #F59E0B !important;
  }
  .react-flow__edge-text {
    font-size: 11px;
    font-weight: 500;
    fill: #64748b;
  }
  
  .react-flow__edge.conditional .react-flow__edge-path {
    stroke-width: 2.5;
  }
  .react-flow__edge.conditional:hover .react-flow__edge-path {
    stroke-width: 3.5;
  }
  
  .react-flow__connection-path {
    stroke: #6366F1 !important;
    stroke-width: 2;
    stroke-dasharray: 5, 5;
    animation: dash 0.5s linear infinite;
  }
  
  @keyframes dash {
    to {
      stroke-dashoffset: -10;
    }
  }
  
  .react-flow__node.react-flow__node-valid-target {
    box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.4) !important;
    outline: 2px solid #22C55E !important;
  }
  
  .react-flow__node.react-flow__node-invalid-target {
    box-shadow: 0 0 0 3px rgba(239, 68, 68, 0.4) !important;
    outline: 2px solid #EF4444 !important;
  }
`;

export const initialNodes: any[] = [];

export const initialEdges: any[] = [];

export const getCategoryColor = (category: string) => {
  const colors: Record<string, string> = {
    trigger: '#8B5CF6',
    action: '#3B82F6',
    logic: '#F59E0B',
    data: '#10B981',
    transform: '#EC4899',
  };
  return colors[category] || '#6366F1';
};
