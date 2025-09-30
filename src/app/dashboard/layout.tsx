'use client';
import React, { useState, createContext, useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import NotificationSidebar from '@/components/NotificationSidebar';
import DashboardHeader from '@/components/DashboardHeader';
import AuthGuard from '@/components/AuthGuard';

// Create context for the notification sidebar
export const NotificationContext = createContext({
  isNotificationOpen: false,
  toggleNotification: () => {}
});

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // State for main navigation sidebar
  const [sidebarOpen, setSidebarOpen] = useState(false);
  
  // State for notification sidebar
  const [notificationOpen, setNotificationOpen] = useState(false);

  // Handle token from URL hash (Google OAuth redirect)
  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith('#token=')) {
      const token = hash.replace('#token=', '');
      localStorage.setItem('auth_token', token);
      // Clean up URL
      window.history.replaceState(null, '', window.location.pathname);
    }
  }, []);
  
  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };
  
  const toggleNotification = () => {
    setNotificationOpen(!notificationOpen);
  };
  
  return (
    <AuthGuard requireAuth redirectTo="/login">
      <NotificationContext.Provider value={{ isNotificationOpen: notificationOpen, toggleNotification }}>
        <div className="flex h-screen">
          {/* Left Sidebar */}
          <Sidebar isOpen={sidebarOpen} toggleSidebar={toggleSidebar} />
          
        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Header */}
          <DashboardHeader />
          <div className="flex flex-1 overflow-hidden pt-10">
            {/* Main content area - always leaves space for sidebars with responsive margins */}
            <div className={`flex-1 bg-[#f5f5f7] p-8 sm:p-6 pt-24 overflow-auto transition-all duration-300 custom-scrollbar ${
                sidebarOpen ? 'ml-20 sm:ml-64' : 'ml-20'
                } ${notificationOpen ? 'mr-14 md:mr-80' : 'mr-14'}`}>
                {children}
            </div>
          
          </div>

          <style jsx global>{`
            .custom-scrollbar {
              scrollbar-width: thin;
              scrollbar-color: #aaa #f5f5f7;
            }
            .custom-scrollbar::-webkit-scrollbar {
              width: 8px;
              height: 8px;
            }
            .custom-scrollbar::-webkit-scrollbar-track {
              background: #f5f5f7;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb {
              background: #ccc;
              border-radius: 10px;
            }
            .custom-scrollbar::-webkit-scrollbar-thumb:hover {
              background: #aaa;
            }
          `}</style>
        </div>
        
        {/* Right Notification Sidebar */}
        <NotificationSidebar isOpen={notificationOpen} toggleSidebar={toggleNotification} />
      </div>
      </NotificationContext.Provider>
    </AuthGuard>
  );
}
