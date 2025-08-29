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
        {/* Removed notification bell for mobile/tablet */}
        <span className="mr-3 font-medium text-black">Hanlise La</span>
        <div className="w-10 h-10 rounded-full bg-[#111] flex items-center justify-center text-white font-semibold shadow-md">
          H
        </div>
      </div>
    </div>
  );
}
