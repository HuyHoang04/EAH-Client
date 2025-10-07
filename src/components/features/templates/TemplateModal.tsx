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
      {/* Backdrop - darker for better contrast */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-lg transition-opacity"
        onClick={onClose}
      />

      {/* Modal Container - Glass morphism matching dashboard */}
      <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8 md:p-12">
        <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-6xl max-h-[85vh] overflow-hidden border-2 border-white/20">
          {/* Header - Glass style with gradient accent */}
          <div className="sticky top-0 z-10 bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-purple-500/20 backdrop-blur-md border-b-2 border-white/20 px-6 py-5">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Palette className="w-7 h-7 text-cyan-400" /> Chọn Flow Template
                </h2>
                <p className="text-white/70 text-sm mt-1 font-medium">
                  Bắt đầu nhanh với các template có sẵn
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2.5 hover:bg-white/20 rounded-xl transition-all duration-300 group border-2 border-white/10 hover:border-white/30"
                aria-label="Close modal"
              >
                <svg
                  className="w-5 h-5 text-white/70 group-hover:text-white transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2.5}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* Content - Glass background with subtle gradient */}
          <div className="overflow-y-auto max-h-[calc(85vh-110px)] p-6 custom-scrollbar bg-gradient-to-b from-transparent via-black/5 to-black/10">
            <TemplateGallery onSelectTemplate={handleSelectTemplate} />
          </div>
        </div>
      </div>

      {/* Custom Scrollbar Styles - matching dashboard */}
      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
      `}</style>
    </div>
  );
}
