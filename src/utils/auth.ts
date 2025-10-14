import { UserData } from '@/types/auth';


const currentUser: UserData | null = null;

export function hasToken(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  return !!localStorage.getItem('auth_token');
}


export function getToken(): string | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  return localStorage.getItem('auth_token');
}


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

export function getGmailFromToken(): string | null {
  const token = getToken();
  if (!token) return null;
  
  const decoded = decodeToken(token);
  return decoded?.gmail || decoded?.email || null;
}

export async function checkAuthentication(): Promise<boolean> {
  try {
    if (!hasToken()) {
      return false;
    }
    return true;
  } catch (error) {
    console.error('Authentication check error:', error);
    return false;
  }
}

export async function getCurrentUser(): Promise<UserData | null> {
  // Trả về từ cache nếu có
  if (currentUser) {
    return currentUser;
  }
  
  if (hasToken()) {
    const isAuthenticated = await checkAuthentication();
    return isAuthenticated ? currentUser : null;
  }
  
  return null;
}
