// Địa chỉ API gateway
export const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL;

// Địa chỉ Node Runner Service (thay thế cho Flow Service)
export const NODE_RUNNER_URL = process.env.NEXT_PUBLIC_NODE_RUNNER_URL;

// Địa chỉ Flow Service (deprecated - sử dụng NODE_RUNNER_URL thay thế)
export const FLOW_URL = process.env.NEXT_PUBLIC_FLOW_URL ;

// Các endpoint xác thực
export const GATEWAY_ENDPOINTS = {
  REGISTER: `${GATEWAY_URL}/auth/register`,
  LOGIN: `${GATEWAY_URL}/auth/login`,
  GOOGLE_LOGIN: `${GATEWAY_URL}/auth/google`,
  PROFILE: `${GATEWAY_URL}/users/profile`,
};
