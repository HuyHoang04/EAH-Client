'use client';

import React from 'react';

export default function FilesPage() {
  // Sample files data
  const files = [
    { name: "Student Records 2025.xlsx", type: "Excel", size: "2.4 MB", modified: "August 25, 2025", shared: true },
    { name: "Curriculum Guidelines.docx", type: "Word", size: "1.8 MB", modified: "August 20, 2025", shared: true },
    { name: "Budget Planning.pdf", type: "PDF", size: "3.2 MB", modified: "August 15, 2025", shared: false },
    { name: "Attendance Report.xlsx", type: "Excel", size: "1.1 MB", modified: "August 10, 2025", shared: true },
    { name: "Staff Meeting Notes.docx", type: "Word", size: "0.9 MB", modified: "August 5, 2025", shared: false },
    { name: "Semester Schedule.pdf", type: "PDF", size: "2.7 MB", modified: "July 28, 2025", shared: true },
    { name: "Campus Map.jpg", type: "Image", size: "4.5 MB", modified: "July 20, 2025", shared: true },
    { name: "School Logo.png", type: "Image", size: "1.2 MB", modified: "July 15, 2025", shared: false }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center my-10 text-gray-800">Files</h1>
        
        {/* Search bar */}
        <div className="w-full max-w-md mx-auto mb-10">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-5 h-5 text-black" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"/>
              </svg>
            </div>
            <input 
              type="search" 
              className="block w-full p-3 pl-10 text-sm bg-white border border-gray-200 rounded-lg focus:ring-2 focus:outline-none focus:ring-gray-200 shadow-sm" 
              placeholder="Search files..." 
            />
          </div>
        </div>
        
        {/* Files table */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">All Files</h2>
            <button className="bg-[#111] text-white px-4 py-2 rounded-lg hover:bg-black transition-colors text-sm">
              Upload New
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 pr-6 font-semibold text-gray-600">Name</th>
                  <th className="pb-3 px-6 font-semibold text-gray-600">Type</th>
                  <th className="pb-3 px-6 font-semibold text-gray-600">Size</th>
                  <th className="pb-3 px-6 font-semibold text-gray-600">Modified</th>
                  <th className="pb-3 px-6 font-semibold text-gray-600">Shared</th>
                  <th className="pb-3 pl-6 font-semibold text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {files.map((file, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 pr-6 text-gray-700 font-medium">{file.name}</td>
                    <td className="py-3 px-6 text-gray-500">{file.type}</td>
                    <td className="py-3 px-6 text-gray-700">{file.size}</td>
                    <td className="py-3 px-6 text-gray-500">{file.modified}</td>
                    <td className="py-3 px-6">
                      <span className={`inline-block w-2 h-2 rounded-full ${file.shared ? 'bg-green-500' : 'bg-gray-300'}`}></span>
                    </td>
                    <td className="py-3 pl-6">
                      <button className="text-blue-500 hover:text-blue-700">Download</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
