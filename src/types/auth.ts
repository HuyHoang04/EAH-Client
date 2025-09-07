// Kiểu dữ liệu form đăng ký
export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  phone: string;
}

// Kiểu dữ liệu gửi lên API đăng ký
export interface RegisterRequest {
  name: string; // Kết hợp firstName và lastName
  gmail: string;
  password: string;
  phone: string;
}

// Kiểu dữ liệu API trả về khi đăng ký hoặc đăng nhập
export interface AuthResponse {
  success?: boolean;
  message?: string;
  token?: string;  // Token JWT từ server (cấu trúc cũ)
  accessToken?: string; // Token JWT từ server (cấu trúc mới)
  refreshToken?: string; // Refresh token
  user?: UserData;
}

// Kiểu dữ liệu form đăng nhập
export interface LoginFormData {
  gmail: string;
  password: string;
}

// Dữ liệu người dùng
export interface UserData {
  id: string;
  name: string;
  email: string;
  phone: string;
}
