'use client';

import { useRouter } from 'next/navigation';

/**
 * Hook để thực hiện đăng xuất
 */
export const useLogout = () => {
  const router = useRouter();

  const logout = async () => {
    try {
      // Xóa token từ localStorage trước
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token');
      }
      
      // Gọi API đăng xuất để xóa HTTP-only cookie
      const response = await fetch('/api/auth/logout', {
        method: 'GET',
        headers: {
          'Cache-Control': 'no-cache',
        },
      });

      if (response.ok) {
        // Làm mới trình duyệt để xóa hết các state
        router.push('/login');
        router.refresh();
      } else {
        console.error('Failed to logout from server');
        // Nếu server không xóa được cookie, vẫn chuyển hướng về trang login
        // vì đã xóa token trên client rồi
        router.push('/login');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Nếu có lỗi, vẫn chuyển hướng về trang login
      router.push('/login');
    }
  };

  return { logout };
};
