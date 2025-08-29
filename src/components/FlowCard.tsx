'use client';

import React from 'react';

// Interface for the flow card props
export interface FlowCardProps {
  title: string;
  purpose: string;
  state: 'good' | 'warning' | 'error';
  activeHook: string;
  dateCreated: string;
  timeModified: string;
}

// Flow Card Component
const FlowCard: React.FC<FlowCardProps> = ({
  title,
  purpose,
  state,
  activeHook,
  dateCreated,
  timeModified
}) => {
  return (
    <div className="bg-white rounded-lg p-4 shadow-md hover:shadow-lg transition-shadow border border-gray-100 flex flex-col h-[220px]">
      <div className="flex items-center mb-2">
        <div className="w-7 h-7 bg-[#111] rounded-full flex items-center justify-center mr-3">
          <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 3L4.5 8.5L2 6" stroke="black" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        <div className="font-semibold text-gray-800">{title}</div>
      </div>
      <p className="text-sm mb-2 text-gray-600">{purpose}</p>
      <div className="mt-1">
        <div className="text-sm mb-1.5 flex justify-between">
          <span className="font-medium text-gray-700">State:</span>
          <span className={`font-medium ${state === 'good' ? 'text-green-500' : state === 'warning' ? 'text-yellow-500' : 'text-red-500'}`}>{state}</span>
        </div>
        <div className="text-sm mb-1.5 flex justify-between">
          <span className="font-medium text-gray-700">Active-hook:</span>
          <span className="text-gray-600">{activeHook}</span>
        </div>
        <div className="text-sm mb-1.5 flex justify-between">
          <span className="font-medium text-gray-700">Date created:</span>
          <span className="text-gray-600">{dateCreated}</span>
        </div>
        <div className="text-sm flex justify-between">
          <span className="font-medium text-gray-700">Time modify:</span>
          <span className="text-gray-600">{timeModified}</span>
        </div>
      </div>
    </div>
  );
};

export default FlowCard;
