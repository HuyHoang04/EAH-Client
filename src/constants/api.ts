// Địa chỉ API gateway
export const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || 'http://localhost:8080';

// Các endpoint xác thực
export const AUTH_ENDPOINTS = {
  REGISTER: `${GATEWAY_URL}/auth/register`,
  LOGIN: `${GATEWAY_URL}/auth/login`,
  LOGOUT: `${GATEWAY_URL}/auth/logout`,
  CHECK_AUTH: `${GATEWAY_URL}/auth/check`,
};
