import { postRequest, getRequest } from '@/utils/api';
import { LoginFormData, RegisterRequest, AuthResponse, UserData } from '@/types/auth';
import { GATEWAY_ENDPOINTS } from '@/constants/api';

export async function login(credentials: LoginFormData): Promise<AuthResponse> {
  try {
    const response = await postRequest<AuthResponse>(
      GATEWAY_ENDPOINTS.LOGIN,
      credentials,
      false 
    );

    if (response.accessToken) {
      localStorage.setItem('auth_token', response.accessToken);
    } else if (response.token) {
      localStorage.setItem('auth_token', response.token);
    }

    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

export async function register(userData: RegisterRequest): Promise<AuthResponse> {
  try {
    const response = await postRequest<AuthResponse>(
      GATEWAY_ENDPOINTS.REGISTER,
      userData,
      false 
    );

    return response;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}

export async function logout(): Promise<void> {
  try {

    localStorage.removeItem('auth_token');
    localStorage.removeItem('refresh_token');

    console.log('User logged out successfully');
  } catch (error) {
    console.error('Logout failed:', error);
    throw error;
  }
}



export async function getUserProfile(gmail: string): Promise<UserData> {
  try {
    const profileUrl = `${GATEWAY_ENDPOINTS.PROFILE}?gmail=${encodeURIComponent(gmail)}`;
    const response = await getRequest<UserData>(profileUrl, true);
    return response;
  } catch (error) {
    console.error('Failed to fetch user profile:', error);
    throw error;
  }
}