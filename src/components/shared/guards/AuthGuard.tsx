'use client';

import { useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { checkAuthentication, hasToken } from '@/utils/auth';

interface AuthMiddlewareProps {
  children: ReactNode;
  requireAuth?: boolean;
  redirectTo?: string;
}

/**
 * AuthGuard: Bảo vệ route dựa trên trạng thái đăng nhập
 */
export default function AuthGuard({
  children,
  requireAuth = false,
  redirectTo = '/login',
}: AuthMiddlewareProps) {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log(`AuthGuard checking auth, requireAuth=${requireAuth}, redirectTo=${redirectTo}`);
        
        // Kiểm tra tồn tại token trong localStorage
        const hasLocalToken = hasToken();
        console.log(`Local token exists: ${hasLocalToken}`);
        
        // Xử lý các tình huống chuyển hướng
        if (!hasLocalToken && requireAuth) {
          // Chuyển hướng khi không có token nhưng trang cần xác thực
          console.log('No token and auth required, redirecting to', redirectTo);
          router.push(redirectTo);
          setChecking(false);
          return;
        } else if (hasLocalToken && !requireAuth && redirectTo === '/dashboard') {
          // Chuyển hướng khi đã đăng nhập nhưng đang ở trang login/register
          console.log('Token exists and on auth page, redirecting to dashboard');
          router.push('/dashboard');
          setChecking(false);
          return;
        } else if (!requireAuth) {
          // Hiển thị trang không cần xác thực
          console.log('Page does not require auth, showing content');
          setChecking(false);
          return;
        }
        
        // Xác thực chỉ dựa trên token, bỏ qua kiểm tra API
        if (hasLocalToken) {
          console.log('Token exists, allowing access');
          setIsAuthenticated(true);
          setChecking(false);
          return;
        } else {
          console.log('No token found, redirecting to', redirectTo);
          router.push(redirectTo);
          return;
        }
        
      } catch (error) {
        console.error('Auth check error in AuthGuard:', error);
        if (requireAuth) {
          // Nếu có lỗi khi kiểm tra và trang yêu cầu đăng nhập -> chuyển hướng an toàn
          console.log('Error during auth check, redirecting safely to', redirectTo);
          router.push(redirectTo);
        }
      } finally {
        setChecking(false);
      }
    };
    
    checkAuth();
  }, [requireAuth, redirectTo, router]);

  // Hiển thị loading khi đang kiểm tra
  if (checking) {
    return <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-black"></div>
    </div>;
  }
  
  // Nếu trang yêu cầu đăng nhập và user chưa đăng nhập -> không hiển thị nội dung
  if (requireAuth && !isAuthenticated) {
    return null;
  }
  
  return <>{children}</>;
}
