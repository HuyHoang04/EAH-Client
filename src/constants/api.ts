// Địa chỉ API gateway
export const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:5001';

// Địa chỉ Flow Service
export const FLOW_URL = process.env.NEXT_PUBLIC_FLOW_URL || 'http://localhost:8080';

// Các endpoint xác thực
export const GATEWAY_ENDPOINTS = {
  REGISTER: `${GATEWAY_URL}/auth/register`,
  LOGIN: `${GATEWAY_URL}/auth/login`,
  GOOGLE_LOGIN: `${GATEWAY_URL}/auth/google`,
  PROFILE: `${GATEWAY_URL}/users/profile`,
};
