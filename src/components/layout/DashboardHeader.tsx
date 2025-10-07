'use client';

import React, { useContext, useEffect, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { NotificationContext } from '@/app/dashboard/layout';
import { Avatar, AvatarFallback } from '@/components/shared/ui/avatar';
import { getGmailFromToken } from '@/utils/auth';
import { getUserProfile } from '@/services/authService';
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
          const userData = await getUserProfile(userGmail);
          setUser(userData);
        } catch (error) {
          console.error('Failed to fetch user profile:', error);
        }
      }
    };

    fetchUserProfile();
  }, []);

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="bg-white border-b-2 border-black flex justify-between items-center px-6 py-4 h-16 fixed top-0 left-0 right-0 z-40">
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
      </div>
    </div>
  );
}
