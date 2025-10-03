'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Network, FileText, LogOut, Menu } from 'lucide-react';
import { logout } from '@/services/authService';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

export default function Sidebar({ isOpen, toggleSidebar }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
    router.push('/');
  };

  const menuItems = [
    {
      href: '/dashboard',
      icon: LayoutDashboard,
      label: 'Dashboard',
      color: 'text-blue-600'
    },
    {
      href: '/dashboard/network',
      icon: Network,
      label: 'Network',
      color: 'text-green-600'
    },
    {
      href: '/dashboard/files',
      icon: FileText,
      label: 'Files',
      color: 'text-purple-600'
    }
  ];

  return (
    <div className={`fixed top-16 left-0 h-[calc(100vh-64px)] bg-white border-r-2 border-black z-30 flex flex-col py-8 text-black rounded-tr-2xl transition-all duration-300 shadow-lg ${isOpen ? 'w-64' : 'w-20'}`}>
      {/* Hamburger at top of sidebar */}
      <button
        className="self-start ml-7 mb-8 text-black hover:text-blue-600 transition-all duration-300 hover:scale-110"
        onClick={toggleSidebar}
        aria-label="Toggle sidebar width"
      >
        <Menu size={24} className="hover:rotate-90 transition-transform duration-300" />
      </button>

      {/* Navigation Links */}
      <div className="flex flex-col items-center w-full flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`mb-6 p-3 flex items-center rounded-xl transition-all duration-300 group ${
                isActive
                  ? 'bg-black text-white shadow-lg scale-105'
                  : 'text-black hover:bg-blue-600 hover:text-white hover:shadow-md hover:scale-105'
              } ${isOpen ? 'w-[85%] justify-start' : 'justify-center'}`}
            >
              <Icon
                size={28}
                className={`transition-all duration-300 group-hover:scale-110 ${
                  isActive ? 'text-white' : item.color
                }`}
              />
              {isOpen && (
                <span className={`ml-4 font-semibold transition-all duration-300 ${
                  isActive ? 'text-white' : 'text-black group-hover:text-white'
                }`}>
                  {item.label}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* Logout Button */}
      <div className="flex flex-col items-center w-full mt-auto mb-8">
        <button
          onClick={handleLogout}
          className={`p-3 flex items-center rounded-xl transition-all duration-300 group bg-red-600 text-white hover:bg-red-700 hover:shadow-lg hover:scale-105 ${
            isOpen ? 'w-[85%] justify-start' : 'justify-center'
          }`}
        >
          <LogOut
            size={28}
            className="transition-all duration-300 group-hover:scale-110 group-hover:rotate-12"
          />
          {isOpen && (
            <span className="ml-4 font-semibold transition-all duration-300">
              Logout
            </span>
          )}
        </button>
      </div>
    </div>
  );
}
