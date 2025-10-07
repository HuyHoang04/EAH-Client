"use client";

import React, { useState, useEffect } from "react";
import {
  Settings,
  Link,
  Lightbulb,
  Zap,
  Clock,
  Calendar,
  Sunrise,
  Watch,
  Mail,
  Wrench,
  Save,
} from "lucide-react";
import { SmartInput, FieldValue } from "@/components/features/flow-editor/reference";

interface NodeConfigPanelProps {
  nodeId: string;
  nodes: any[];
  setNodes: any;
  edges: any[];
}

export default function NodeConfigPanel({
  nodeId,
  nodes,
  setNodes,
  edges,
}: NodeConfigPanelProps) {
  const selectedNode = nodes.find((node) => node.id === nodeId);
  const [parameters, setParameters] = useState<Record<string, any>>({});

  useEffect(() => {
    if (selectedNode?.data?.parameters) {
      setParameters(selectedNode.data.parameters);
    }
  }, [selectedNode?.id]);

  const isInputConnected = (inputId: string) => {
    return edges.some(
      (edge) => edge.target === nodeId && edge.targetHandle === inputId
    );
  };

  const getConnectedSource = (inputId: string) => {
    const edge = edges.find(
      (edge) => edge.target === nodeId && edge.targetHandle === inputId
    );
    if (!edge) return null;

    const sourceNode = nodes.find((n) => n.id === edge.source);
    return sourceNode
      ? {
          nodeName: sourceNode.data.label,
          outputName: edge.sourceHandle || "output",
        }
      : null;
  };

  if (!selectedNode) return null;

  const nodeData = selectedNode.data as any;

  const handleLabelChange = (newLabel: string) => {
    setNodes((nds: any[]) =>
      nds.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, label: newLabel } }
          : node
      )
    );
  };

  const handleParameterChange = (paramName: string, value: any) => {
    const newParameters = { ...parameters, [paramName]: value };
    setParameters(newParameters);

    const hasRequiredConfig =
      nodeData.inputs?.every((input: any) => {
        if (!input.required) return true;
        return (
          newParameters[input.name] !== undefined &&
          newParameters[input.name] !== ""
        );
      }) ?? true;

    setNodes((nds: any[]) =>
      nds.map((node) =>
        node.id === nodeId
          ? {
              ...node,
              data: {
                ...node.data,
                parameters: newParameters,
                configured: hasRequiredConfig,
                status: hasRequiredConfig ? "configured" : "idle",
              },
            }
          : node
      )
    );
  };

  const handleDeleteNode = () => {
    setNodes((nds: any[]) => nds.filter((node) => node.id !== nodeId));
  };

  const renderInputField = (input: any) => {
    const value = parameters[input.name] || input.defaultValue || "";
    const isConnected = isInputConnected(input.id);
    const connectedSource = isConnected ? getConnectedSource(input.id) : null;

    if (isConnected && connectedSource) {
      return (
        <div className="bg-green-50 border-2 border-green-300 rounded-lg p-3">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-xs font-semibold text-green-700 uppercase">
              Đã kết nối
            </span>
          </div>
          <div className="text-sm text-stone-700 bg-white rounded p-2 border border-green-200">
            <div className="flex items-center gap-2">
              <Link className="w-5 h-5 text-green-600" />
              <div>
                <div className="font-medium">{connectedSource.nodeName}</div>
                <div className="text-xs text-stone-500">
                  Output: {connectedSource.outputName}
                </div>
              </div>
            </div>
          </div>
          <p className="text-xs text-green-600 mt-2 flex items-center gap-1">
            <Lightbulb className="w-3 h-3" /> Trường này nhận dữ liệu từ node
            khác. Ngắt kết nối để nhập thủ công.
          </p>
        </div>
      );
    }

    if (input.name === "cronExpression" || input.id === "cronExpression") {
      const presets = [
        {
          label: "9h sáng T2-6",
          value: "0 9 * * 1-5",
          icon: <Calendar className="w-3 h-3" />,
        },
        {
          label: "8h sáng hàng ngày",
          value: "0 8 * * *",
          icon: <Sunrise className="w-3 h-3" />,
        },
        {
          label: "Mỗi giờ",
          value: "0 * * * *",
          icon: <Clock className="w-3 h-3" />,
        },
        {
          label: "12h trưa T2-6",
          value: "0 12 * * 1-5",
          icon: <Watch className="w-3 h-3" />,
        },
      ];

      return (
        <div className="space-y-3 bg-purple-50 p-3 rounded-lg border border-purple-200">
          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-stone-700 mb-2">
              <Zap className="w-3 h-3" /> Mẫu nhanh
            </label>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <button
                  key={preset.value}
                  type="button"
                  onClick={() =>
                    handleParameterChange(input.name, preset.value)
                  }
                  className={`flex items-center gap-2 px-3 py-2 text-xs rounded-md transition-colors text-left ${
                    value === preset.value
                      ? "bg-purple-500 text-white"
                      : "bg-white text-stone-700 border border-stone-300 hover:bg-purple-100"
                  }`}
                >
                  {preset.icon}
                  <div className="font-medium">{preset.label}</div>
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="flex items-center gap-1 text-xs font-medium text-stone-700 mb-1">
              <Zap className="w-3 h-3" /> Hoặc nhập thủ công
            </label>
            <input
              type="text"
              value={value}
              onChange={(e) =>
                handleParameterChange(input.name, e.target.value)
              }
              placeholder="Ví dụ: 0 9 * * 1-5"
              className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 text-stone-900 font-mono text-sm"
            />
          </div>

          <div className="bg-purple-100 p-2 rounded text-xs text-purple-900">
            💡 <strong>Mẹo:</strong> Cron format: [phút] [giờ] [ngày] [tháng]
            [thứ]
            <br />
            • 0 9 * * 1-5 = 9h sáng thứ 2-6
            <br />• 0 * * * * = Mỗi giờ
          </div>
        </div>
      );
    }

    switch (input.type.toLowerCase()) {
      case "boolean":
        return (
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id={`param-${input.name}`}
              checked={value === true || value === "true"}
              onChange={(e) =>
                handleParameterChange(input.name, e.target.checked)
              }
              className="w-5 h-5 text-indigo-600 border-stone-300 rounded focus:ring-indigo-500"
            />
            <label
              htmlFor={`param-${input.name}`}
              className="text-sm text-stone-700 cursor-pointer"
            >
              {input.description || input.name}
            </label>
          </div>
        );

      case "number":
        return (
          <input
            type="number"
            value={value}
            onChange={(e) => handleParameterChange(input.name, e.target.value)}
            placeholder={`Nhập số...`}
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-stone-900"
          />
        );

      case "array":
      case "object":
        return (
          <textarea
            value={
              typeof value === "string" ? value : JSON.stringify(value, null, 2)
            }
            onChange={(e) => {
              try {
                const parsed = JSON.parse(e.target.value);
                handleParameterChange(input.name, parsed);
              } catch {
                handleParameterChange(input.name, e.target.value);
              }
            }}
            placeholder={`Nhập JSON... ví dụ: {"key": "value"}`}
            rows={4}
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 font-mono text-sm text-stone-900"
          />
        );

      default:
        const useSmartInput = [
          "to",
          "subject",
          "body",
          "message",
          "content",
          "text",
          "url",
          "path",
          "email",
        ].some((keyword) => input.name.toLowerCase().includes(keyword));

        if (useSmartInput) {
          const fieldValue: FieldValue[] =
            typeof value === "string" && value
              ? [{ type: "text", value }]
              : Array.isArray(value)
              ? value
              : [];

          let fieldType: "email" | "text" | "number" | "url" = "text";
          if (
            input.name.toLowerCase().includes("email") ||
            input.name.toLowerCase() === "to"
          ) {
            fieldType = "email";
          } else if (
            input.name.toLowerCase().includes("url") ||
            input.name.toLowerCase().includes("link")
          ) {
            fieldType = "url";
          }

          return (
            <SmartInput
              label=""
              value={fieldValue}
              onChange={(newValue) => {
                handleParameterChange(input.name, newValue);
              }}
              type="text-with-fields"
              fieldType={fieldType}
              currentNodeId={nodeId}
              nodes={nodes}
              edges={edges}
              placeholder={`Enter ${input.name}...`}
              multiline={
                input.name.toLowerCase().includes("body") ||
                input.name.toLowerCase().includes("content") ||
                input.name.toLowerCase().includes("message")
              }
            />
          );
        }

        return (
          <input
            type="text"
            value={value}
            onChange={(e) => handleParameterChange(input.name, e.target.value)}
            placeholder={`Nhập ${input.name}...`}
            className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-stone-900"
          />
        );
    }
  };

  return (
    <div>
      <h3 className="text-lg font-semibold mb-3 text-stone-900">
        Cài Đặt Node
      </h3>

      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-lg p-4 mb-4 border border-indigo-200">
        <div className="flex items-center gap-2 mb-1">
          {nodeData?.category === "trigger" ? (
            <Clock className="w-6 h-6 text-indigo-600" />
          ) : nodeData?.category === "action" ? (
            <Mail className="w-6 h-6 text-indigo-600" />
          ) : (
            <Wrench className="w-6 h-6 text-indigo-600" />
          )}
          <span className="font-bold text-stone-900">
            {nodeData?.nodeType || "Node"}
          </span>
        </div>
        <p className="text-sm text-stone-600">
          {nodeData?.description || "Không có mô tả"}
        </p>
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-stone-700 mb-2">
          Tên hiển thị
        </label>
        <input
          type="text"
          value={selectedNode.data.label || ""}
          onChange={(e) => handleLabelChange(e.target.value)}
          className="w-full px-3 py-2 border border-stone-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-stone-900"
          placeholder="Nhập tên node..."
        />
      </div>

      {nodeData?.inputs && nodeData.inputs.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-stone-700 mb-3 flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Thông số
          </h4>
          <div className="space-y-3">
            {nodeData.inputs
              .filter(
                (input: any) =>
                  input.id !== "trigger" && input.name !== "trigger"
              )
              .map((input: any, index: number) => (
                <div key={index} className="space-y-1">
                  <label className="block text-sm font-medium text-stone-700">
                    {input.name}
                    {input.required && (
                      <span className="text-red-500 ml-1">*</span>
                    )}
                  </label>
                  {input.description && (
                    <p className="text-xs text-stone-500 mb-1">
                      {input.description}
                    </p>
                  )}
                  {renderInputField(input)}
                  <div className="text-xs text-stone-400">
                    Loại:{" "}
                    <span className="font-mono bg-stone-100 px-1 rounded">
                      {input.type}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {nodeData?.outputs && nodeData.outputs.length > 0 && (
        <div className="mb-4">
          <h4 className="text-sm font-medium text-stone-700 mb-2">
            Dữ liệu đầu ra
          </h4>
          <div className="bg-green-50 border border-green-200 rounded-md p-3">
            <div className="space-y-2">
              {nodeData.outputs.map((output: any, index: number) => (
                <div key={index} className="flex items-start gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 mt-1.5"></div>
                  <div className="flex-1">
                    <div className="text-sm font-medium text-green-900">
                      {output.name}
                    </div>
                    <div className="text-xs text-green-700 font-mono">
                      {output.type}
                    </div>
                    {output.description && (
                      <div className="text-xs text-green-600 mt-0.5">
                        {output.description}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="border-t pt-4 space-y-2">
        <button
          onClick={() => {
            console.log("Cấu hình Node:", {
              id: nodeId,
              type: nodeData?.nodeType,
              label: selectedNode.data.label,
              parameters,
            });
            alert("Đã lưu cấu hình! Xem console để biết chi tiết.");
          }}
          className="w-full px-4 py-2 bg-indigo-500 text-white rounded-md hover:bg-indigo-600 transition-colors flex items-center justify-center gap-2 font-medium"
        >
          <Save className="w-4 h-4" />
          Lưu cấu hình
        </button>
        <button
          onClick={handleDeleteNode}
          className="w-full px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
        >
          Delete Node
        </button>
      </div>
    </div>
  );
}
