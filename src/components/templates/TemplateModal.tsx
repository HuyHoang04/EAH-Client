'use client';

import React from 'react';
import { FlowTemplate } from '@/constants/flowTemplates';
import TemplateGallery from './TemplateGallery';
import { Palette } from 'lucide-react';

interface TemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (template: FlowTemplate) => void;
}

export default function TemplateModal({ isOpen, onClose, onSelectTemplate }: TemplateModalProps) {
  if (!isOpen) return null;

  const handleSelectTemplate = (template: FlowTemplate) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-stone-900 rounded-2xl shadow-2xl w-full max-w-7xl max-h-[90vh] 
          overflow-hidden border border-stone-800">
          {/* Header */}
          <div className="sticky top-0 z-10 bg-gradient-to-b from-stone-900 via-stone-900 to-stone-900/95 
            border-b border-stone-800 px-8 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Palette className="w-7 h-7" /> Chọn Flow Template
                </h2>
                <p className="text-stone-400 mt-1">
                  Bắt đầu nhanh với các template có sẵn
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-stone-800 rounded-lg transition-colors group"
                aria-label="Close modal"
              >
                <svg
                  className="w-6 h-6 text-stone-500 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-120px)] p-8 custom-scrollbar">
            <TemplateGallery onSelectTemplate={handleSelectTemplate} />
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1c1917;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #57534e;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #78716c;
        }
      `}</style>
    </div>
  );
}
