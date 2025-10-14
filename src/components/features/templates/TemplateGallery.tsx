'use client';

import React, { useState, useMemo } from 'react';
import { FlowTemplate, FLOW_TEMPLATES, getAllCategories } from '@/constants/flowTemplates';
import TemplateCard from './TemplateCard';
import { Palette, Search as SearchIcon, Link2, Star, Bot, BarChart3, Bell, Link, Circle, X, Search } from 'lucide-react';

interface TemplateGalleryProps {
  onSelectTemplate: (template: FlowTemplate) => void;
}

type CategoryType = 'all' | 'automation' | 'data-processing' | 'notification' | 'integration';
type DifficultyType = 'all' | 'beginner' | 'intermediate' | 'advanced';

const categoryLabels: Record<CategoryType, { label: string; icon: React.ReactNode }> = {
  all: { label: 'Tất cả', icon: <Star className="w-4 h-4" /> },
  automation: { label: 'Automation', icon: <Bot className="w-4 h-4" /> },
  'data-processing': { label: 'Data Processing', icon: <BarChart3 className="w-4 h-4" /> },
  notification: { label: 'Notification', icon: <Bell className="w-4 h-4" /> },
  integration: { label: 'Integration', icon: <Link className="w-4 h-4" /> },
};

const difficultyLabels: Record<DifficultyType, { label: string; color: string }> = {
  all: { label: 'Tất cả', color: 'text-black' },
  beginner: { label: 'Beginner', color: 'text-green-500' },
  intermediate: { label: 'Intermediate', color: 'text-yellow-500' },
  advanced: { label: 'Advanced', color: 'text-red-500' },
};

export default function TemplateGallery({ onSelectTemplate }: TemplateGalleryProps) {
  const [selectedCategory, setSelectedCategory] = useState<CategoryType>('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState<DifficultyType>('all');
  const [searchTerm, setSearchTerm] = useState('');

  // Filter templates
  const filteredTemplates = useMemo(() => {
    return FLOW_TEMPLATES.filter((template) => {
      const matchCategory = selectedCategory === 'all' || template.category === selectedCategory;
      const matchDifficulty = selectedDifficulty === 'all' || template.difficulty === selectedDifficulty;
      const matchSearch =
        searchTerm === '' ||
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.tags.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase()));

      return matchCategory && matchDifficulty && matchSearch;
    });
  }, [selectedCategory, selectedDifficulty, searchTerm]);

  return (
    <div className="w-full">
      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
          <input
            type="text"
            placeholder="Tìm template theo tên, mô tả, hoặc tag..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-stone-800 border border-stone-700 rounded-lg
              text-white placeholder:text-white focus:outline-none focus:ring-2 
              focus:ring-orange-500 focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-black
                hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Category Filter */}
          <div className="flex-1">
            <label className="block text-xs font-semibold text-black-500 uppercase tracking-wide mb-2">
              Category
            </label>
            <div className="flex flex-wrap gap-2">
              {(['all', ...getAllCategories()] as CategoryType[]).map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedCategory === category
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-stone-800 text-black400 hover:bg-stone-700 hover:text-white border border-stone-700'
                  }`}
                >
                  {categoryLabels[category].icon}
                  <span>{categoryLabels[category].label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Filter */}
          <div className="lg:w-80">
            <label className="block text-xs font-semibold text-black-500 uppercase tracking-wide mb-2">
              Difficulty
            </label>
            <div className="flex flex-wrap gap-2">
              {(['all', 'beginner', 'intermediate', 'advanced'] as DifficultyType[]).map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => setSelectedDifficulty(difficulty)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    selectedDifficulty === difficulty
                      ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/30'
                      : 'bg-stone-800 text-black hover:bg-stone-700 hover:text-white border border-stone-700'
                  }`}
                >
                  <Circle className={`w-3 h-3 fill-current ${difficultyLabels[difficulty].color}`} />
                  <span>{difficultyLabels[difficulty].label}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Results Count */}
      <div className="mb-4 text-sm text-black-500">
        Hiển thị <span className="text-orange-500 font-semibold">{filteredTemplates.length}</span> template
        {searchTerm && (
          <span> cho từ khóa "<span className="text-white">{searchTerm}</span>"</span>
        )}
      </div>

      {/* Template Grid */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <TemplateCard
              key={template.id}
              template={template}
              onClick={() => onSelectTemplate(template)}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl  font-semibold text-white mb-2">
            Không tìm thấy template
          </h3>
          <p className="text-black-500 mb-6">
            Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('all');
              setSelectedDifficulty('all');
            }}
            className="px-6 py-2 bg-orange-500 hover:bg-orange-600 text-white 
              rounded-lg font-semibold transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
}
