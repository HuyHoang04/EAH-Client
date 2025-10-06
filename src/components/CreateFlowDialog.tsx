"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { FlowService, FlowResponse } from '@/services/flowService';
import { Plus, Workflow, X } from 'lucide-react';

interface CreateFlowDialogProps {
  onFlowCreated?: (flow: FlowResponse) => void;
  trigger?: React.ReactNode; // Allow custom trigger button
}

export function CreateFlowDialog({ onFlowCreated, trigger }: CreateFlowDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

  // Ensure component is mounted (client-side only)
  useEffect(() => {
    setMounted(true);
  }, []);

  const validateForm = () => {
    const newErrors = { name: "", description: "" };
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Flow name is required";
      isValid = false;
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      const flowData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
      };

      const response = await FlowService.createFlow(flowData);

      console.log("Flow created:", response);

      // Reset form
      setFormData({ name: "", description: "" });
      setOpen(false);

      // Callback để cập nhật danh sách flows
      if (onFlowCreated) {
        onFlowCreated(response);
      }
    } catch (error: any) {
      console.error("Failed to create flow:", error);
      // Có thể hiển thị error message ở đây
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error khi user bắt đầu nhập
    if (errors[field as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  return (
    <>
      {/* Trigger Button - Use custom trigger if provided */}
      {trigger ? (
        <div onClick={() => setOpen(true)}>
          {trigger}
        </div>
      ) : (
        <button 
          onClick={() => setOpen(true)}
          className="flex items-center gap-2 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white border-2 border-blue-400/30 px-6 py-3 rounded-xl transition-all duration-300 font-semibold shadow-lg hover:shadow-xl hover:scale-105"
        >
          <Plus className="w-5 h-5" />
          Create New
        </button>
      )}

      {/* Modal - Using Portal to render at body level */}
      {mounted && open && createPortal(
        <div className="fixed inset-0 z-[9999] overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/70 backdrop-blur-lg transition-opacity"
            onClick={() => setOpen(false)}
          />

          {/* Modal Container */}
          <div className="absolute inset-0 flex items-center justify-center p-6 sm:p-8 md:p-12">
            <div className="relative bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl w-full max-w-[550px] overflow-hidden border-2 border-white/20">
              {/* Header - Glass style with gradient accent */}
              <div className="bg-gradient-to-r from-blue-500/20 via-cyan-500/20 to-purple-500/20 backdrop-blur-md border-b-2 border-white/20 px-6 py-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-cyan-500/20 rounded-xl border-2 border-cyan-400/30">
                      <Workflow className="w-6 h-6 text-cyan-400" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-white">Create New Flow</h2>
                      <p className="text-white/70 text-sm mt-0.5 font-medium">
                        Tạo workflow mới để tự động hóa
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setOpen(false)}
                    className="p-2.5 hover:bg-white/20 rounded-xl transition-all duration-300 group border-2 border-white/10 hover:border-white/30"
                    aria-label="Close modal"
                  >
                    <X className="w-5 h-5 text-white/70 group-hover:text-white transition-colors" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <form onSubmit={handleSubmit} className="p-6">
                <div className="grid gap-6">
                  {/* Flow Name */}
                  <div className="space-y-2">
                    <label htmlFor="name" className="block text-sm font-semibold text-white">
                      Flow Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      placeholder="e.g., Attendance Tracker, Grade Calculator"
                      className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 ${errors.name ? 'border-red-400/50' : 'border-white/20'} placeholder-white/40 text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all duration-300`}
                    />
                    {errors.name && (
                      <p className="text-sm text-red-300 font-medium">{errors.name}</p>
                    )}
                  </div>

                  {/* Flow Description */}
                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-semibold text-white">
                      Description
                    </label>
                    <textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      placeholder="Describe what this flow does and when it should be triggered..."
                      rows={4}
                      className={`w-full px-4 py-3 bg-white/10 backdrop-blur-sm border-2 ${errors.description ? 'border-red-400/50' : 'border-white/20'} placeholder-white/40 text-white rounded-xl focus:outline-none focus:ring-4 focus:ring-cyan-500/30 focus:border-cyan-400 transition-all duration-300 resize-none`}
                    />
                    {errors.description && (
                      <p className="text-sm text-red-300 font-medium">{errors.description}</p>
                    )}
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex gap-3 mt-6">
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-white/10 backdrop-blur-sm border-2 border-white/20 rounded-xl text-white font-semibold hover:bg-white/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Creating...
                      </>
                    ) : (
                      <>
                        <Plus className="w-5 h-5" />
                        Create Flow
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>

          {/* Custom Scrollbar Styles - matching TemplateModal */}
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
        </div>,
        document.body
      )}
    </>
  );
}
