'use client';

import React, { useContext } from 'react';
import Image from 'next/image';
import { NotificationContext } from '@/app/dashboard/layout';

interface DashboardHeaderProps {}

export default function DashboardHeader({}: DashboardHeaderProps) {
  // Use the notification context to get notification state and toggle function
  const { isNotificationOpen, toggleNotification } = useContext(NotificationContext);
  
  return (
    <div className="bg-white flex justify-between items-center px-6 py-4 shadow-sm h-16 fixed top-0 left-0 right-0 z-40">
      <div className="flex items-center">
        <Image 
            src="/eah-logo.svg" 
            alt="Education Automation Hub Logo" 
            width={40} 
            height={40} 
            className="mr-3"
        />
        <h1 className="text-2xl font-bold text-black">Education Automation Hub</h1>
      </div>
      <div className="flex items-center">
        {/* Notification bell for mobile/tablet */}
        <button 
          className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors relative md:hidden"
          onClick={toggleNotification}
          aria-label="Toggle notifications"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
        </button>
        <span className="mr-3 font-medium text-black">Hanlise La</span>
        <div className="w-10 h-10 rounded-full bg-[#111] flex items-center justify-center text-white font-semibold shadow-md">
          H
        </div>
      </div>
    </div>
  );
}
