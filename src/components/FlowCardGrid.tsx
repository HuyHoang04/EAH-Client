'use client';

import React, { useState } from 'react';
import FlowCard, { FlowCardProps } from '@/components/FlowCard';

interface FlowCardGridProps {
  cards: FlowCardProps[];
}

const FlowCardGrid: React.FC<FlowCardGridProps> = ({ cards }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const cardsPerPage = 8; // 2 rows of 4 cards
  
  // Calculate pagination
  const indexOfLastCard = currentPage * cardsPerPage;
  const indexOfFirstCard = indexOfLastCard - cardsPerPage;
  const currentCards = cards.slice(indexOfFirstCard, indexOfLastCard);
  const totalPages = Math.ceil(cards.length / cardsPerPage);
  
  return (
    <div className="w-full custom-scrollbar">
      {/* Flow cards grid with responsive container and fixed height */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4 custom-scrollbar min-h-[450px] grid-rows-[auto] auto-rows-fr">
        {currentCards.map((card, index) => (
          <FlowCard 
            key={card.id || index}
            id={card.id}
            title={card.title}
            purpose={card.purpose}
            state={card.state as 'good' | 'warning' | 'error'}
            activeHook={card.activeHook}
            dateCreated={card.dateCreated}
            timeModified={card.timeModified}
          />
        ))}
        {/* Add placeholder invisible cards to maintain grid layout */}
        {currentCards.length > 0 && currentCards.length < cardsPerPage && 
          Array.from({ length: cardsPerPage - currentCards.length }).map((_, i) => (
            <div key={`placeholder-${i}`} className="opacity-0"></div>
          ))
        }
      </div>
      
      {/* Message when no cards - maintain height */}
      {currentCards.length === 0 && (
        <div className="text-center py-4 min-h-[450px] flex items-center justify-center">
          <p className="text-gray-500">No workflows found. Create a new one!</p>
        </div>
      )}
      
      {/* Pagination - smaller size with prev/next buttons */}
      <div className="flex justify-end mt-6">
        <div className="flex items-center space-x-1">
          {/* Previous button */}
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className={`w-7 h-7 text-sm rounded-full flex items-center justify-center transition-colors
              ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>
          
          {/* Page numbers */}
          {Array.from({ length: Math.max(1, totalPages) }, (_, i) => i + 1).map(pageNum => (
            <button 
              key={pageNum}
              onClick={() => setCurrentPage(pageNum)}
              className={`w-7 h-7 text-xs rounded-full flex items-center justify-center transition-colors ${
                pageNum === currentPage 
                  ? 'bg-[#111] text-white' 
                  : 'border border-gray-300 bg-white hover:bg-gray-50'
              }`}
            >
              {pageNum}
            </button>
          ))}
          
          {/* Next button */}
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages || 1))}
            disabled={currentPage === (totalPages || 1)}
            className={`w-7 h-7 text-sm rounded-full flex items-center justify-center transition-colors
              ${currentPage === (totalPages || 1) ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FlowCardGrid;
