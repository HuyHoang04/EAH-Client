'use client';

import React from 'react';
import { FlowTemplate } from '@/constants/flowTemplates';
import { Circle, Link } from 'lucide-react';
import { getIconComponent } from '@/utils/iconMapper';

interface TemplateCardProps {
  template: FlowTemplate;
  onClick: () => void;
}

const difficultyColors = {
  beginner: 'bg-green-100 text-green-700 border-green-300',
  intermediate: 'bg-yellow-100 text-yellow-700 border-yellow-300',
  advanced: 'bg-red-100 text-red-700 border-red-300',
};

const categoryColors = {
  automation: 'bg-blue-100 text-blue-700',
  'data-processing': 'bg-purple-100 text-purple-700',
  notification: 'bg-orange-100 text-orange-700',
  integration: 'bg-green-100 text-green-700',
};

export default function TemplateCard({ template, onClick }: TemplateCardProps) {
  return (
    <div
      onClick={onClick}
      className="group relative bg-white rounded-xl border-2 border-black hover:border-blue-600 hover:shadow-lg transition-all duration-300 cursor-pointer overflow-hidden"
    >
      {/* Header */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="flex-shrink-0 w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              {(() => {
                const IconComponent = getIconComponent(template.icon);
                return <IconComponent className="w-6 h-6 text-blue-600" />;
              })()}
            </div>
            <div>
              <h3 className="font-bold text-black text-gray-900 group-hover:text-blue-600 transition-colors">
                {template.name}
              </h3>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-xs px-2 py-0.5 rounded-full ${categoryColors[template.category]}`}>
                  {template.category}
                </span>
              </div>
            </div>
          </div>
          
          {/* Difficulty Badge */}
          <div className={`px-3 py-1 rounded-full text-xs font-semibold border ${difficultyColors[template.difficulty]}`}>
            {template.difficulty}
          </div>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
          {template.description}
        </p>

        {/* Stats */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
          <div className="flex items-center gap-1">
            <Circle className="w-3 h-3 fill-blue-500 text-blue-500" />
            <span>{template.nodes.length} nodes</span>
          </div>
          <div className="flex items-center gap-1">
            <Link className="w-3 h-3" />
            <span>{template.edges.length} connections</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {template.tags.slice(0, 4).map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md"
            >
              #{tag}
            </span>
          ))}
          {template.tags.length > 4 && (
            <span className="text-xs px-2 py-1 bg-gray-100 text-gray-700 rounded-md">
              +{template.tags.length - 4}
            </span>
          )}
        </div>

        {/* Use Cases */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Use Cases:
          </p>
          <ul className="space-y-1">
            {template.useCases.slice(0, 2).map((useCase, index) => (
              <li key={index} className="text-xs text-gray-600 flex items-start gap-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>{useCase}</span>
              </li>
            ))}
            {template.useCases.length > 2 && (
              <li className="text-xs text-gray-500 italic">
                +{template.useCases.length - 2} more...
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Hover Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-blue-500/5 to-transparent 
        opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

      {/* Action Button (on hover) */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 
        transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
        <div className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white 
          rounded-lg font-semibold text-sm shadow-lg">
          <span>Sử dụng Template</span>
          <span>→</span>
        </div>
      </div>
    </div>
  );
}
