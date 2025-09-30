
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
    throw error;
  }
}
