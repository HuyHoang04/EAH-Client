'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface NotificationSidebarProps {
  isOpen?: boolean;
  toggleSidebar?: () => void;
}

interface NotificationProps {
  id: string;
  title: string;
  time: string;
  isRead: boolean;
}

export default function NotificationSidebar({ isOpen = false, toggleSidebar }: NotificationSidebarProps) {
  // State for checking if we're on mobile
  const [isMobile, setIsMobile] = useState(false);
  
  // Check if we're on mobile
  React.useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);
  
  // Sample notifications
  const notifications: NotificationProps[] = [
    {
      id: '1',
      title: 'New workflow added',
      time: '10 mins ago',
      isRead: false
    },
    {
      id: '2',
      title: 'System update completed',
      time: '1 hour ago',
      isRead: false
    },
    {
      id: '3',
      title: 'Workflow "Attendance Tracker" needs attention',
      time: '3 hours ago',
      isRead: true
    },
    {
      id: '4',
      title: 'New feature available',
      time: 'Yesterday',
      isRead: true
    }
  ];
  
  // Count unread notifications
  const unreadCount = notifications.filter(n => !n.isRead).length;
  
  return (
    <div className={`top-16 fixed right-0 h-[calc(100vh-64px)] bg-[#111] flex flex-col py-4 text-white border-l border-[#222] rounded-tl-2xl transition-all duration-300 z-30 ${
      isOpen ? 'w-80' : 'w-14'
    } ${isMobile && !isOpen ? 'translate-x-full' : ''}`}>
      <button 
        className="self-center p-2 rounded-lg hover:bg-[#222] transition-colors mb-4"
        onClick={toggleSidebar}
      >
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
            <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
          </svg>
          {unreadCount > 0 && (
            <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-[10px]">
              {unreadCount}
            </div>
          )}
        </div>
      </button>
      
      <div className={`px-4 transition-all duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
        <h3 className="text-lg font-semibold mb-4">Notifications</h3>
        <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-1">
          {notifications.map(notification => (
            <div key={notification.id} className={`p-3 rounded-lg ${notification.isRead ? 'bg-[#222]' : 'bg-[#333] border-l-4 border-blue-500'} hover:bg-[#444] transition-colors`}>
              <p className="text-sm font-medium">{notification.title}</p>
              <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
            </div>
          ))}
        </div>
        
        <style jsx global>{`
          .custom-scrollbar {
            scrollbar-width: thin;
            scrollbar-color: rgba(255,255,255,0.2) rgba(0,0,0,0);
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: rgba(0,0,0,0.1);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(255,255,255,0.2);
            border-radius: 10px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(255,255,255,0.4);
          }
        `}</style>
        <div className="mt-4 pt-3 border-t border-[#222]">
          <Link href="/notifications" className="text-sm text-blue-400 hover:text-blue-300 transition-colors">
            View all notifications
          </Link>
        </div>
      </div>
    </div>
  );
}
