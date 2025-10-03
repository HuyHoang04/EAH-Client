
function getAuthToken(): string | null {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('auth_token');
  }
  return null;
}

export async function postRequest<T>(url: string, data: any, useAuth = true): Promise<T> {
  try {
    // Tạo headers với Content-Type
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Thêm Bearer token vào header nếu cần
    if (useAuth) {
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });
    
    const responseData = await response.json();
    
    // Xử lý token từ response nếu có
    if (response.ok) {
      if (responseData.accessToken) {
        localStorage.setItem('auth_token', responseData.accessToken);
        
        if (responseData.refreshToken) {
          localStorage.setItem('refresh_token', responseData.refreshToken);
        }
      }
      else if (responseData.token) {
        localStorage.setItem('auth_token', responseData.token);
      }
    }
    
    if (!response.ok) {
      throw new Error(responseData.message || 'Có lỗi xảy ra');
    }
    
    return responseData;
  } catch (error: any) {
    throw error;
  }
}

export async function getRequest<T>(url: string, useAuth = true): Promise<T> {
  try {
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    // Thêm Bearer token vào header nếu cần
    if (useAuth) {
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    const response = await fetch(url, {
      method: 'GET',
      headers,
    });
    
    const responseData = await response.json();
    
    if (!response.ok) {
      throw new Error(responseData.message || `Request failed with status: ${response.status}`);
    }
    
    return responseData;
  } catch (error: any) {
    console.error('GET Request Error:', {
      url,
      error: error.message,
      useAuth
    });
    throw error;
  }
}

/**
 * Axios-like API client for Node Runner
 */
const NODE_RUNNER_BASE_URL = process.env.NEXT_PUBLIC_NODE_RUNNER_URL || 'http://localhost:3001/api';

// Debug: Log base URL on startup
if (typeof window !== 'undefined') {
  console.log('🔗 Node Runner Base URL:', NODE_RUNNER_BASE_URL);
}

export const api = {
  async get<T = any>(endpoint: string, useAuth = false): Promise<{ data: T }> {
    const url = `${NODE_RUNNER_BASE_URL}${endpoint}`;
    console.log('📡 GET Request:', url);
    const data = await getRequest<T>(url, useAuth);
    return { data };
  },

  async post<T = any>(endpoint: string, body: any, useAuth = false): Promise<{ data: T }> {
    const url = `${NODE_RUNNER_BASE_URL}${endpoint}`;
    const data = await postRequest<T>(url, body, useAuth);
    return { data };
  },

  async put<T = any>(endpoint: string, body: any, useAuth = false): Promise<{ data: T }> {
    const url = `${NODE_RUNNER_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (useAuth) {
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    const response = await fetch(url, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'PUT request failed');
    }
    
    return { data };
  },

  async delete<T = any>(endpoint: string, options?: { data?: any; useAuth?: boolean }): Promise<{ data: T }> {
    const url = `${NODE_RUNNER_BASE_URL}${endpoint}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (options?.useAuth) {
      const token = getAuthToken();
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }
    }
    
    const response = await fetch(url, {
      method: 'DELETE',
      headers,
      body: options?.data ? JSON.stringify(options.data) : undefined,
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'DELETE request failed');
    }
    
    return { data };
  }
};
