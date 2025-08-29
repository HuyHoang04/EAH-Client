'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  
  return (
    <div className={`fixed top-16 left-0 h-[calc(100vh-64px)] bg-[#111] z-30 flex flex-col py-8 text-white rounded-tr-2xl transition-all duration-300 ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* Hamburger at top of sidebar */}
      <button 
        className="self-start ml-7 mb-8" 
        onClick={toggleSidebar}
        aria-label="Toggle sidebar width"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="3" y1="12" x2="21" y2="12"></line>
          <line x1="3" y1="6" x2="21" y2="6"></line>
          <line x1="3" y1="18" x2="21" y2="18"></line>
        </svg>
      </button>
      
      {/* Navigation Links */}
      <div className="flex flex-col items-center w-full">
        <Link 
          href="/dashboard" 
          className={`mb-8 p-2 flex items-center rounded-lg transition-colors ${
            pathname === '/dashboard' 
              ? 'bg-white text-black' 
              : 'text-white hover:bg-[#222]'
          } ${isOpen ? 'w-[80%] justify-start' : 'justify-center'}`}
        >
          <Image 
            src="/window.svg" 
            alt="Dashboard" 
            width={32} 
            height={32} 
          />
          {isOpen && <span className="ml-3">Dashboard</span>}
        </Link>
        
        <Link 
          href="/dashboard/network" 
          className={`mb-8 p-2 flex items-center rounded-lg transition-colors ${
            pathname === '/dashboard/network' 
              ? 'bg-white text-black' 
              : 'text-white hover:bg-[#222]'
          } ${isOpen ? 'w-[80%] justify-start' : 'justify-center'}`}
        >
          <Image 
            src="/globe.svg" 
            alt="Network" 
            width={32} 
            height={32} 
          />
          {isOpen && <span className="ml-3">Network</span>}
        </Link>
        
        <Link 
          href="/dashboard/files" 
          className={`p-2 flex items-center rounded-lg transition-colors ${
            pathname === '/dashboard/files' 
              ? 'bg-white text-black' 
              : 'text-white hover:bg-[#222]'
          } ${isOpen ? 'w-[80%] justify-start' : 'justify-center'}`}
        >
          <Image 
            src="/file.svg" 
            alt="Files" 
            width={32} 
            height={32} 
          />
          {isOpen && <span className="ml-3">Files</span>}
        </Link>
      </div>
    </div>
  );
}
