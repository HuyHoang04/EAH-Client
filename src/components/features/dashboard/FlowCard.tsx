'use client';

import React from 'react';
import { useRouter } from 'next/navigation';

// Interface for the flow card props
export interface FlowCardProps {
  id?: string;
  title: string;
  purpose: string;
  state: 'good' | 'warning' | 'error';
  activeHook: string;
  dateCreated: string;
  timeModified: string;
}

// Flow Card Component
const FlowCard: React.FC<FlowCardProps> = ({
  id,
  title,
  purpose,
  state,
  activeHook,
  dateCreated,
  timeModified
}) => {
  const router = useRouter();

  const handleClick = () => {
    if (id) {
      router.push(`/flow/${id}`);
    }
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white rounded-xl p-6 border-2 border-black hover:border-blue-600 hover:shadow-lg transition-all duration-200 flex flex-col h-[280px] group cursor-pointer"
    >
      <div className="flex items-center mb-4">
        <div className="w-10 h-10 bg-black rounded-xl flex items-center justify-center mr-4">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <div>
          <h3 className="font-semibold text-black text-lg group-hover:text-blue-600 transition-colors">{title}</h3>
          <div className={`text-sm font-medium capitalize mt-1 ${
            state === 'good' ? 'text-blue-600' : 'text-red-600'
          }`}>
            {state}
          </div>
        </div>
      </div>

      <p className="text-black mb-4 flex-grow text-sm leading-relaxed">{purpose}</p>

      <div className="space-y-3 text-sm border-t-2 border-black pt-4">
        <div className="flex justify-between items-center">
          <span className="font-medium text-black">Active Hook:</span>
          <span className="text-black bg-blue-50 px-2 py-1 rounded-md font-medium border border-blue-200">{activeHook}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium text-black">Created:</span>
          <span className="text-black">{dateCreated}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="font-medium text-black">Modified:</span>
          <span className="text-black">{timeModified}</span>
        </div>
      </div>
    </div>
  );
};

export default FlowCard;
