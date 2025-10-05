'use client';

import React from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge } from 'reactflow';

interface ConditionalEdgeData {
  branchType?: 'true' | 'false';
}

export default function ConditionalEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: EdgeProps<ConditionalEdgeData>) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  // Determine styling based on branch type
  const branchType = data?.branchType;
  
  let strokeColor = '#94A3B8'; // Default gray
  let labelText = '';
  let labelBg = '#F1F5F9';
  let labelTextColor = '#64748B';
  
  if (branchType === 'true') {
    strokeColor = '#10B981'; // Green
    labelText = 'TRUE';
    labelBg = '#D1FAE5';
    labelTextColor = '#059669';
  } else if (branchType === 'false') {
    strokeColor = '#EF4444'; // Red
    labelText = 'FALSE';
    labelBg = '#FEE2E2';
    labelTextColor = '#DC2626';
  }

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd}
        style={{
          ...style,
          stroke: strokeColor,
          strokeWidth: 2,
        }}
      />
      
      {/* Edge Label */}
      {labelText && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: 'absolute',
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 10,
              fontWeight: 600,
              pointerEvents: 'all',
              backgroundColor: labelBg,
              color: labelTextColor,
              padding: '2px 8px',
              borderRadius: '6px',
              border: `1.5px solid ${strokeColor}`,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              zIndex: 1000,
            }}
            className="nodrag nopan"
          >
            {labelText}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  );
}
