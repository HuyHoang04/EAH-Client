"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { FlowService, FlowResponse } from '@/services/flowService';
import { Plus, Workflow } from 'lucide-react';

interface CreateFlowDialogProps {
  onFlowCreated?: (flow: FlowResponse) => void;
}

export function CreateFlowDialog({ onFlowCreated }: CreateFlowDialogProps) {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    description: "",
  });

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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-6 py-3 rounded-md hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 font-medium shadow-md hover:shadow-lg">
          <Plus className="w-5 h-5" />
          Create New
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[550px] bg-white border border-stone-200 shadow-lg">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-3 bg-black rounded-lg">
              <Workflow className="w-6 h-6 text-white" />
            </div>
            <DialogTitle className="text-2xl font-bold text-black">Create New Flow</DialogTitle>
          </div>
          <DialogDescription className="text-stone-600 text-base">
            Create a new workflow to automate your teaching processes. Give it a meaningful name and description.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-6 py-6">
            {/* Flow Name */}
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Flow Name
              </label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="e.g., Attendance Tracker, Grade Calculator"
                className={`w-full px-3 py-2 border ${errors.name ? 'border-red-300' : 'border-stone-300'} placeholder-stone-400 text-black rounded-md focus:outline-none focus:ring-stone-500 focus:border-stone-500 sm:text-sm`}
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Flow Description */}
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Describe what this flow does and when it should be triggered..."
                rows={4}
                className={`w-full px-3 py-2 border ${errors.description ? 'border-red-300' : 'border-stone-300'} placeholder-stone-400 text-black rounded-md focus:outline-none focus:ring-stone-500 focus:border-stone-500 sm:text-sm resize-none`}
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description}</p>
              )}
            </div>
          </div>
          
          <DialogFooter className="gap-3 sm:gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-4 py-2 border border-stone-300 rounded-md shadow-sm bg-white text-sm font-medium text-stone-700 hover:bg-stone-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-md hover:from-indigo-600 hover:to-purple-600 transition-all duration-300 text-sm font-medium shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Create Flow
                </>
              )}
            </button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
