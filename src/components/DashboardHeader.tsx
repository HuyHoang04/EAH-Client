'use client';

import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { NotificationContext } from '@/app/dashboard/layout';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { getGmailFromToken } from '@/utils/auth';
import { getRequest } from '@/utils/api';
import { UserData } from '@/types/auth';

interface DashboardHeaderProps {}

export default function DashboardHeader({}: DashboardHeaderProps) {
  const { isNotificationOpen, toggleNotification } = useContext(NotificationContext);
  const [user, setUser] = useState<UserData | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const userGmail = getGmailFromToken();
      if (userGmail) {
        try {
          const profileUrl = `${process.env.NEXT_PUBLIC_GATEWAY_URL}/users/profile?gmail=${encodeURIComponent(userGmail)}`;
          const userData = await getRequest<UserData>(profileUrl, true);
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
    };
    
    fetchUserProfile();
  }, []);

  const handleLogout = () => {
    // Clear local storage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('refresh_token');
    }
    
    // Redirect to home page
    router.push('/');
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

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
      <div className="flex items-center space-x-4">
        {user && (
          <>
            <span className="font-medium text-black">{user.name}</span>
            <Avatar>
              <AvatarFallback className="bg-black text-white">{getInitials(user.name)}</AvatarFallback>
            </Avatar>
          </>
        )}
        <Button onClick={handleLogout} variant="outline">
          Logout
        </Button>
      </div>
    </div>
  );
}
