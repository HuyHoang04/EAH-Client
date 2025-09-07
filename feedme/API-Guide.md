# Tài liệu API trong EAH Client

## Cấu trúc hệ thống API

Dự án EAH Client sử dụng một hệ thống gọi API với xác thực kép (HTTP-only cookies và Bearer token) để đảm bảo bảo mật tối đa và trải nghiệm người dùng liền mạch.

### Vị trí các file liên quan

- **Cấu hình API**: `src/constants/api.ts`
- **Tiện ích gọi API**: `src/utils/api.ts`
- **Tiện ích xác thực**: `src/utils/auth.ts`
- **Kiểu dữ liệu API**: `src/types/auth.ts`
- **Middleware bảo vệ route**: `src/components/AuthGuard.tsx`
- **Hook đăng xuất**: `src/utils/useLogout.ts`

## Cách gọi API

### 1. Cơ bản

Dự án sử dụng 2 hàm tiện ích chính để gọi API:

```typescript
// GET request
const data = await getRequest<ResponseType>(url, useAuth = true);

// POST request
const data = await postRequest<ResponseType>(url, requestData, useAuth = true);
```

Tham số:
- `url`: URL của endpoint API
- `requestData` (chỉ với POST): Dữ liệu gửi lên server
- `useAuth`: Có sử dụng Bearer token hay không (mặc định: có)

### 2. Xác thực và đăng nhập

#### Đăng ký người dùng
```typescript
import { postRequest } from '@/utils/api';
import { AUTH_ENDPOINTS } from '@/constants/api';
import { RegisterRequest, AuthResponse } from '@/types/auth';

// Tạo dữ liệu đăng ký
const requestData: RegisterRequest = {
  name: `${firstName} ${lastName}`,
  email: email,
  password: password,
  phone: phone
};

// Gọi API đăng ký
const response = await postRequest<AuthResponse>(
  AUTH_ENDPOINTS.REGISTER,
  requestData,
  false // không sử dụng auth token khi đăng ký
);
```

#### Đăng nhập
```typescript
import { postRequest } from '@/utils/api';
import { AUTH_ENDPOINTS } from '@/constants/api';
import { AuthResponse } from '@/types/auth';

// Gọi API đăng nhập
const response = await postRequest<AuthResponse>(
  AUTH_ENDPOINTS.LOGIN,
  { email, password },
  false // không sử dụng auth token khi đăng nhập
);

// Token được lưu tự động trong localStorage
// HTTP-only cookie được đặt tự động bởi server
```

#### Kiểm tra xác thực
```typescript
import { checkAuthentication } from '@/utils/auth';

// Kiểm tra xem người dùng đã đăng nhập chưa
const isAuthenticated = await checkAuthentication();
```

#### Đăng xuất
```typescript
import { useLogout } from '@/utils/useLogout';

// Trong component React
const { logout } = useLogout();

// Khi người dùng click vào nút đăng xuất
const handleLogout = () => {
  logout(); // Xóa token và chuyển hướng đến trang đăng nhập
};
```

### 3. Gọi API được bảo vệ

Sau khi đăng nhập, mọi API call đều được tự động thêm Bearer token:

```typescript
// Lấy dữ liệu người dùng
const userData = await getRequest<UserProfileResponse>(`${GATEWAY_URL}/users/profile`);

// Cập nhật thông tin người dùng
const updatedData = await postRequest<UpdateResponse>(
  `${GATEWAY_URL}/users/update`,
  { name: newName, phone: newPhone }
);

// Gọi API không yêu cầu xác thực
const publicData = await getRequest<PublicDataResponse>(
  `${GATEWAY_URL}/public/data`,
  false // không gửi token xác thực
);
```

## Cơ chế xác thực

### 1. Bearer Token

- **Lưu trữ**: Trong `localStorage` với key `auth_token`
- **Thêm vào request**: Tự động thêm vào header `Authorization: Bearer <token>`
- **Kiểm tra**: `hasToken()` từ `utils/auth.ts`

### 2. HTTP-only Cookie

- **Đặt bởi**: Server khi đăng nhập thành công
- **Gửi đi**: Tự động bởi trình duyệt với mỗi request
- **Không thể truy cập**: Bảo vệ khỏi XSS (Cross-Site Scripting)

### 3. Luồng xác thực

1. Khi đăng nhập:
   - Server đặt HTTP-only cookie
   - Client lưu token vào localStorage

2. Khi gọi API:
   - Client thêm Bearer token vào header
   - Trình duyệt tự động gửi HTTP-only cookie
   - Backend kiểm tra cả hai để xác thực

3. Khi đăng xuất:
   - Client xóa token từ localStorage
   - Server xóa HTTP-only cookie

## Bảo vệ Route

### AuthGuard Component

```tsx
<AuthGuard requireAuth redirectTo="/login">
  {/* Nội dung trang được bảo vệ */}
</AuthGuard>

<AuthGuard redirectTo="/dashboard">
  {/* Nội dung trang đăng nhập/đăng ký */}
</AuthGuard>
```

- `requireAuth`: Yêu cầu người dùng đăng nhập (mặc định: false)
- `redirectTo`: Đường dẫn chuyển hướng khi xác thực không thành công

## Xử lý Lỗi API

```typescript
try {
  const data = await getRequest<DataType>(apiUrl);
  // Xử lý dữ liệu thành công
} catch (error: any) {
  // error.message chứa thông báo lỗi từ API
  console.error('API error:', error.message);
}
```

## Sử dụng Tốt Nhất

1. **Gọi API Được Bảo Vệ**:
   ```typescript
   const data = await getRequest<ResponseType>(apiUrl);
   ```

2. **Gọi API Công Khai** (không yêu cầu xác thực):
   ```typescript
   const data = await getRequest<ResponseType>(apiUrl, false);
   ```

3. **Đặt Payload Tùy Chỉnh**:
   ```typescript
   const data = await postRequest<ResponseType>(apiUrl, customPayload);
   ```

4. **Bảo Vệ Route**:
   ```tsx
   <AuthGuard requireAuth redirectTo="/login">
     <YourSecurePage />
   </AuthGuard>
   ```

5. **Kiểm Tra Đăng Nhập**:
   ```typescript
   import { hasToken, getCurrentUser } from '@/utils/auth';
   
   // Kiểm tra nhanh
   const isLoggedIn = hasToken();
   
   // Lấy thông tin người dùng
   const user = await getCurrentUser();
   ```

---

*Tài liệu này được tạo ra để hỗ trợ việc phát triển dự án EAH Client. Vui lòng cập nhật khi có thay đổi trong hệ thống API.*
