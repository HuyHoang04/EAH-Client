import { NextResponse } from 'next/server';
import { AUTH_ENDPOINTS } from '@/constants/api';

export async function GET() {
  try {
    // Gửi yêu cầu đăng xuất đến backend API
    const response = await fetch(AUTH_ENDPOINTS.LOGOUT, {
      method: 'POST',
    });
    
    // Tạo response mới để xóa cookie
    const clearResponse = NextResponse.json({ success: true });
    
    // Xóa cookies bằng cách đặt giá trị trống và thời gian hết hạn trong quá khứ
    clearResponse.cookies.set('auth_token', '', {
      expires: new Date(0),
      path: '/',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict'
    });
    
    return clearResponse;
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({ success: false, error: 'Đã xảy ra lỗi khi đăng xuất' }, { status: 500 });
  }
}
