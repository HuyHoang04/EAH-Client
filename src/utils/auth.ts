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
 * Decode JWT token để lấy payload
 */
export function decodeToken(token: string): any | null {
  try {
    const payload = token.split('.')[1];
    const decodedPayload = atob(payload);
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Failed to decode token:', error);
    return null;
  }
}

/**
 * Lấy gmail từ token
 */
export function getGmailFromToken(): string | null {
  const token = getToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.gmail || decoded?.email || null;
}

/**
 * Kiểm tra xem người dùng đã đăng nhập chưa bằng cách kiểm tra token trong localStorage
 */
export async function checkAuthentication(): Promise<boolean> {
  try {
    if (!hasToken()) {
      return false;
    }

    // Chỉ kiểm tra token có tồn tại không, không gọi API
    return true;
  } catch (error) {
    console.error('Authentication check error:', error);
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
