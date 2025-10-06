'use client';

import React, { useState } from 'react';
import { SmartInput, FieldValue } from '../../components/workflow/reference';

// Mock nodes and edges for testing
const mockNodes = [
  {
    id: 'trigger-1',
    type: 'trigger',
    position: { x: 0, y: 0 },
    data: {
      label: 'Trigger',
      icon: '⚡',
      type: 'trigger'
    }
  },
  {
    id: 'get-students-1',
    type: 'getStudents',
    position: { x: 200, y: 0 },
    data: {
      label: 'Get Students',
      icon: '👥',
      type: 'getStudents'
    }
  },
  {
    id: 'send-email-1',
    type: 'sendEmail',
    position: { x: 400, y: 0 },
    data: {
      label: 'Send Email',
      icon: '📧',
      type: 'sendEmail'
    }
  }
];

const mockEdges = [
  {
    id: 'e1',
    source: 'trigger-1',
    target: 'get-students-1'
  },
  {
    id: 'e2',
    source: 'get-students-1',
    target: 'send-email-1'
  }
];

export default function TestSmartInputPage() {
  const [toValue, setToValue] = useState<FieldValue[]>([]);
  const [subjectValue, setSubjectValue] = useState<FieldValue[]>([]);
  const [bodyValue, setBodyValue] = useState<FieldValue[]>([]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-cyan-50 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent mb-2">
            🎨 SmartInput Component Test
          </h1>
          <p className="text-gray-600">
            Testing UI-first reference system without typing syntax
          </p>
        </div>

        {/* Test Card */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border-2 border-gray-200">
          <div className="mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-2">
              📧 Send Email Configuration
            </h2>
            <p className="text-sm text-gray-600">
              Try clicking "+ Field" to add data from previous nodes without typing any syntax!
            </p>
          </div>

          {/* Smart Inputs */}
          <div className="space-y-6">
            {/* To Field */}
            <SmartInput
              label="To (Email Address)"
              value={toValue}
              onChange={setToValue}
              type="text-with-fields"
              fieldType="email"
              currentNodeId="send-email-1"
              nodes={mockNodes as any}
              edges={mockEdges as any}
              placeholder="Enter email or add from previous steps..."
              required
            />

            {/* Subject Field */}
            <SmartInput
              label="Subject"
              value={subjectValue}
              onChange={setSubjectValue}
              type="text-with-fields"
              fieldType="text"
              currentNodeId="send-email-1"
              nodes={mockNodes as any}
              edges={mockEdges as any}
              placeholder="Enter subject..."
              required
            />

            {/* Body Field */}
            <SmartInput
              label="Email Body"
              value={bodyValue}
              onChange={setBodyValue}
              type="text-with-fields"
              fieldType="text"
              currentNodeId="send-email-1"
              nodes={mockNodes as any}
              edges={mockEdges as any}
              placeholder="Enter message..."
              multiline
            />
          </div>

          {/* Preview Section */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <h3 className="text-lg font-bold text-gray-800 mb-4">
              📋 Configuration Preview
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">To:</label>
                <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto">
                  {JSON.stringify(toValue, null, 2)}
                </pre>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Subject:</label>
                <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto">
                  {JSON.stringify(subjectValue, null, 2)}
                </pre>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600 block mb-1">Body:</label>
                <pre className="bg-gray-50 p-3 rounded-lg text-xs overflow-x-auto">
                  {JSON.stringify(bodyValue, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="mt-8 p-4 bg-blue-50 border-2 border-blue-200 rounded-lg">
            <h4 className="text-sm font-bold text-blue-800 mb-2">
              💡 How to use:
            </h4>
            <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
              <li>Click the <strong>"+ Field"</strong> button</li>
              <li>Browse available fields from previous nodes</li>
              <li>Click <strong>"Add"</strong> on any field you want to use</li>
              <li>Mix text and fields freely</li>
              <li>Remove by clicking the ×  button on chips</li>
            </ol>
            <p className="text-xs text-blue-600 mt-3">
              ✨ No syntax to remember, no curly brackets needed!
            </p>
          </div>
        </div>

        {/* Mock Data Info */}
        <div className="mt-6 p-4 bg-yellow-50 border-2 border-yellow-200 rounded-lg">
          <h4 className="text-sm font-bold text-yellow-800 mb-2">
            🔬 Test Data Available:
          </h4>
          <div className="text-sm text-yellow-700 space-y-2">
            <div>
              <strong>⚡ Trigger:</strong> timestamp, userId, eventType
            </div>
            <div>
              <strong>👥 Get Students:</strong> email, name, score, students[] (array)
            </div>
            <div className="mt-3 p-3 bg-white rounded border border-yellow-300">
              <strong className="text-purple-700">🔄 NEW: Loop Feature</strong>
              <p className="text-xs mt-1">
                Click the <strong className="text-purple-600">"🔄 Loop"</strong> button next to array fields to automatically send to all items!
              </p>
              <div className="mt-2 text-xs">
                Example: Click Loop on "students" → Select "email" field → Will send to john@example.com, jane@example.com, bob@example.com automatically!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
