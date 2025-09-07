import { getRequest } from './api';
import { AUTH_ENDPOINTS } from '@/constants/api';
import { UserData } from '@/types/auth';

// Cache dữ liệu người dùng để giảm số lần gọi API
let currentUser: UserData | null = null;

/**
 * Kiểm tra xem token có tồn tại trong localStorage không
 */
export function hasToken(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return !!localStorage.getItem('auth_token');
}

/**
 * Lấy access token từ localStorage
 */
export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem('auth_token');
}

/**
 * Kiểm tra xem người dùng đã đăng nhập chưa bằng cách kiểm tra token
 * và gọi API endpoint /auth/check
 */
export async function checkAuthentication(): Promise<boolean> {
  try {
    if (!hasToken()) {
      return false;
    }
    
    // Gọi API để xác thực token
    const response = await getRequest<{ authenticated: boolean, user?: UserData }>(
      AUTH_ENDPOINTS.CHECK_AUTH,
      true
    );
    
    if (response.authenticated && response.user) {
      currentUser = response.user;
      return true;
    }
    
    // Xóa token nếu không còn hợp lệ
    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');
    currentUser = null;
    return false;
  } catch (error) {
    console.error('Authentication check error:', error);
    currentUser = null;
    return false;
  }
}

/**
 * Lấy dữ liệu người dùng hiện tại
 */
export async function getCurrentUser(): Promise<UserData | null> {
  // Trả về từ cache nếu có
  if (currentUser) {
    return currentUser;
  }
  
  // Kiểm tra xác thực nếu có token
  if (hasToken()) {
    const isAuthenticated = await checkAuthentication();
    return isAuthenticated ? currentUser : null;
  }
  
  return null;
}
