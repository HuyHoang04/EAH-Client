'use client';

import React from 'react';

export default function NetworkPage() {
  // Sample devices data
  const devices = [
    { name: "Classroom Computer 1", ipAddress: "192.168.1.101", status: "Online", lastActive: "2 minutes ago" },
    { name: "Classroom Computer 2", ipAddress: "192.168.1.102", status: "Online", lastActive: "5 minutes ago" },
    { name: "Classroom Computer 3", ipAddress: "192.168.1.103", status: "Offline", lastActive: "2 days ago" },
    { name: "Teacher Laptop 1", ipAddress: "192.168.1.105", status: "Online", lastActive: "1 minute ago" },
    { name: "Staff Room Printer", ipAddress: "192.168.1.110", status: "Online", lastActive: "30 minutes ago" },
    { name: "Library Computer 1", ipAddress: "192.168.1.120", status: "Idle", lastActive: "45 minutes ago" },
    { name: "Student Tablet 15", ipAddress: "192.168.1.135", status: "Online", lastActive: "10 minutes ago" },
    { name: "Administration PC", ipAddress: "192.168.1.150", status: "Online", lastActive: "3 minutes ago" }
  ];

  return (
    <div className="container mx-auto px-4">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-center my-10 text-gray-800">Network</h1>
        
        {/* Network stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Connection Status</h2>
              <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            <p className="text-3xl font-bold">Active</p>
            <p className="text-gray-500 text-sm mt-1">Last checked: 2 minutes ago</p>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Network Speed</h2>
              <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold">1.2 Gbps</p>
            <div className="flex items-center mt-1">
              <span className="text-green-500 text-sm">↑ 120 Mbps</span>
              <span className="mx-2 text-gray-300">|</span>
              <span className="text-blue-500 text-sm">↓ 980 Mbps</span>
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-800">Connected Devices</h2>
              <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="h-5 w-5 text-purple-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
            </div>
            <p className="text-3xl font-bold">32</p>
            <p className="text-gray-500 text-sm mt-1">8 devices currently active</p>
          </div>
        </div>
        
        {/* Connected devices table */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-gray-800">Connected Devices</h2>
            <button className="bg-[#111] text-white px-4 py-2 rounded-lg hover:bg-black transition-colors text-sm">
              Refresh
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="pb-3 pr-6 font-semibold text-gray-600">Device Name</th>
                  <th className="pb-3 px-6 font-semibold text-gray-600">IP Address</th>
                  <th className="pb-3 px-6 font-semibold text-gray-600">Status</th>
                  <th className="pb-3 pl-6 font-semibold text-gray-600">Last Active</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device, index) => (
                  <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-3 pr-6 font-medium">{device.name}</td>
                    <td className="py-3 px-6 text-gray-500">{device.ipAddress}</td>
                    <td className="py-3 px-6">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        device.status === 'Online' ? 'bg-green-100 text-green-800' : 
                        device.status === 'Offline' ? 'bg-red-100 text-red-800' : 
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {device.status}
                      </span>
                    </td>
                    <td className="py-3 pl-6 text-gray-500">{device.lastActive}</td>
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
