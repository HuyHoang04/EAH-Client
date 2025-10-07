'use client';

import React from 'react';
import { FlowTemplate } from '@/constants/flowTemplates';
import { FileText, Lightbulb, Tag, Link as LinkIcon, CheckCircle, Circle as CircleIcon } from 'lucide-react';
import { getIconComponent } from '@/utils/iconMapper';

interface TemplatePreviewProps {
  template: FlowTemplate;
  onUseTemplate: () => void;
  onClose: () => void;
}

const difficultyColors = {
  beginner: 'bg-green-500/20 text-green-300 border-green-500/30',
  intermediate: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  advanced: 'bg-red-500/20 text-red-300 border-red-500/30',
};

const categoryColors = {
  automation: 'bg-blue-500/10 text-blue-300',
  'data-processing': 'bg-purple-500/10 text-purple-300',
  notification: 'bg-orange-500/10 text-orange-300',
  integration: 'bg-green-500/10 text-green-300',
};

export default function TemplatePreview({ template, onUseTemplate, onClose }: TemplatePreviewProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="relative bg-stone-900 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] 
          overflow-hidden border border-stone-800">
          
          {/* Header */}
          <div className="border-b border-stone-800 px-8 py-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <span className="text-5xl">{template.icon}</span>
                <div>
                  <h2 className="text-2xl font-bold text-white mb-2">
                    {template.name}
                  </h2>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs px-3 py-1 rounded-full ${categoryColors[template.category]}`}>
                      {template.category}
                    </span>
                    <span className={`text-xs px-3 py-1 rounded-full border ${difficultyColors[template.difficulty]}`}>
                      {template.difficulty}
                    </span>
                  </div>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-stone-800 rounded-lg transition-colors"
              >
                <svg
                  className="w-6 h-6 text-stone-500 hover:text-white"
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
          <div className="overflow-y-auto max-h-[calc(90vh-250px)] p-8 space-y-6">
            {/* Description */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-2 flex items-center gap-2">
                <FileText className="w-5 h-5" /> Mô tả
              </h3>
              <p className="text-stone-400">{template.description}</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-800/50 rounded-lg p-4 border border-stone-700">
                <div className="text-2xl font-bold text-orange-500 mb-1">
                  {template.nodes.length}
                </div>
                <div className="text-sm text-stone-400">Nodes in workflow</div>
              </div>
              <div className="bg-stone-800/50 rounded-lg p-4 border border-stone-700">
                <div className="text-2xl font-bold text-orange-500 mb-1">
                  {template.edges.length}
                </div>
                <div className="text-sm text-stone-400">Connections</div>
              </div>
            </div>

            {/* Use Cases */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Lightbulb className="w-5 h-5" /> Use Cases
              </h3>
              <ul className="space-y-2">
                {template.useCases.map((useCase, index) => (
                  <li key={index} className="flex items-start gap-3 text-stone-400">
                    <CheckCircle className="w-4 h-4 text-orange-500 mt-0.5 flex-shrink-0" />
                    <span>{useCase}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Tags */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <Tag className="w-5 h-5" /> Tags
              </h3>
              <div className="flex flex-wrap gap-2">
                {template.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-stone-800 text-stone-300 rounded-full text-sm border border-stone-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            </div>

            {/* Workflow Structure */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-3 flex items-center gap-2">
                <LinkIcon className="w-5 h-5" /> Workflow Structure
              </h3>
              <div className="bg-stone-800/50 rounded-lg p-6 border border-stone-700">
                {/* Simplified visual representation */}
                <div className="space-y-3">
                  {template.nodes.map((node, index) => (
                    <div key={node.id} className="flex items-center gap-3">
                      <div className="flex-shrink-0 w-8 h-8 bg-orange-500/20 text-orange-400 
                        rounded-full flex items-center justify-center text-sm font-semibold border border-orange-500/30">
                        {index + 1}
                      </div>
                      <div className="flex-1 bg-stone-900 rounded-lg p-3 border border-stone-700">
                        <div className="flex items-center gap-2">
                          {(() => {
                            const IconComponent = getIconComponent(node.data.icon);
                            return <IconComponent className="w-5 h-5 text-blue-400" />;
                          })()}
                          <span className="font-medium text-white">{node.data.label}</span>
                          <span className="text-xs text-stone-500">
                            ({node.data.category})
                          </span>
                        </div>
                      </div>
                      {index < template.nodes.length - 1 && (
                        <div className="text-stone-600 text-xl">↓</div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="border-t border-stone-800 px-8 py-4 bg-stone-900/80 backdrop-blur">
            <div className="flex items-center justify-between">
              <div className="text-sm text-stone-500">
                Click "Sử dụng Template" để apply template này vào flow của bạn
              </div>
              <div className="flex gap-3">
                <button
                  onClick={onClose}
                  className="px-6 py-2 bg-stone-800 hover:bg-stone-700 text-white 
                    rounded-lg font-semibold transition-colors border border-stone-700"
                >
                  Hủy
                </button>
                <button
                  onClick={onUseTemplate}
                  className="px-6 py-2 bg-gradient-to-r from-orange-500 to-orange-600 
                    hover:from-orange-600 hover:to-orange-700 text-white rounded-lg 
                    font-semibold transition-all shadow-lg shadow-orange-500/30 
                    hover:shadow-orange-500/50"
                >
                  Sử dụng Template
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
