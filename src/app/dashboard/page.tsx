'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FlowCardProps } from '@/components/features/dashboard/FlowCard';
import FlowCardGrid from '@/components/features/dashboard/FlowCardGrid';
import { CreateFlowDialog } from '@/components/features/dashboard/CreateFlowDialog';
import { FlowService, FlowResponse } from '@/services/flowService';
import { TemplateModal } from '@/components/features/templates';
import { FlowTemplate } from '@/constants/flowTemplates';
import { Search, Plus, Palette } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [flowCards, setFlowCards] = useState<FlowCardProps[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showTemplateModal, setShowTemplateModal] = useState(false);

  // Load flows from API
  useEffect(() => {
    loadFlows();
  }, []);

  const loadFlows = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const flows = await FlowService.getFlows();
      
      // Convert FlowResponse to FlowCardProps
      const cards: FlowCardProps[] = flows.map((flow: FlowResponse) => ({
        id: flow.id,
        title: flow.name,
        purpose: flow.description,
        state: flow.isActive ? "good" : "warning",
        activeHook: flow.isActive ? "Active" : "Inactive",
        dateCreated: new Date(flow.createdAt).toLocaleDateString('en-GB'),
        timeModified: new Date(flow.updatedAt).toLocaleString('en-GB')
      }));
      
      setFlowCards(cards);
    } catch (err: any) {
      console.error('Failed to load flows:', err);
      setError(err.message || 'Failed to load flows');
    } finally {
      setIsLoading(false);
    }
  };

  // Sample data for demo (removed - now loading from API)

  // Handler for when a new flow is created
  const handleFlowCreated = (newFlow: FlowResponse) => {
    // Reload flows after creating new one
    loadFlows();
  };

  // Create flow from template
  const createFlowFromTemplate = async (template: FlowTemplate) => {
    try {
      // Show loading toast
      const loadingToast = toast.loading('Đang tạo flow từ template...');

      // Create new flow with template data
      const newFlow = await FlowService.createFlow({
        name: template.name,
        description: template.description,
        reactFlowData: JSON.stringify({
          nodes: template.nodes,
          edges: template.edges,
        }),
      });

      // Dismiss loading toast
      toast.dismiss(loadingToast);

      // Success notification
      toast.success(`Đã tạo flow từ template: ${template.name}`);

      // Navigate to flow editor
      router.push(`/flow/${newFlow.id}`);

    } catch (error) {
      console.error('Failed to create flow from template:', error);
      toast.error('Lỗi khi tạo flow từ template');
    }
  };

  // Filter flow cards based on search query
  const filteredFlowCards = flowCards.filter(card => 
    card.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    card.purpose.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="relative z-10 container mx-auto px-4 custom-scrollbar py-8">
      {/* Header Section */}
      <div className="mb-12">
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">Work Flow</h1>
          <p className="text-xl text-white/80 font-medium">Manage and automate your teaching workflows</p>
        </div>

        {/* Search and Actions Bar */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="bg-white/10 backdrop-blur-lg border-2 border-white/20 rounded-2xl p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search bar */}
              <div className="flex-1 relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-6 pointer-events-none">
                  <Search className="w-6 h-6 text-blue-400" />
                </div>
                <input
                  type="search"
                  className="block w-full pl-16 pr-6 py-4 text-black font-medium bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl focus:outline-none focus:ring-4 focus:ring-blue-500/30 focus:border-blue-400 transition-all duration-300 placeholder-white/60 text-white"
                  placeholder="Search workflows, templates, and automation tools..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              {/* Action buttons */}
              <div className="flex gap-3">
                <CreateFlowDialog 
                  onFlowCreated={handleFlowCreated}
                  trigger={
                    <button className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-2 border-blue-400/30 px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105">
                      <Plus className="w-5 h-5" />
                      Create New
                    </button>
                  }
                />
                <button 
                  onClick={() => setShowTemplateModal(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-2 border-blue-400/30 px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
                >
                  <Palette className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(255,255,255,0.3) rgba(255,255,255,0.1);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255,255,255,0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255,255,255,0.3);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255,255,255,0.5);
        }
      `}</style>

      {/* Import FlowCardGrid component */}
      <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 shadow-2xl border-2 border-white/20">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">All Workflows</h2>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-white"></div>
            <p className="mt-4 text-white/70">Loading workflows...</p>
          </div>
        )}

        {/* Error state */}
        {error && !isLoading && (
          <div className="bg-red-500/20 border border-red-500/50 rounded-lg p-4 mb-4">
            <p className="text-red-200">Error: {error}</p>
            <button 
              onClick={loadFlows}
              className="mt-2 text-sm text-red-200 underline hover:text-white"
            >
              Try again
            </button>
          </div>
        )}

        {/* Flow card grid component */}
        {!isLoading && !error && (
          <div className="flow-card-container">
            <FlowCardGrid cards={filteredFlowCards} />
          </div>
        )}
      </div>

      {/* Template Modal */}
      <TemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={createFlowFromTemplate}
      />
    </div>
  );
}
