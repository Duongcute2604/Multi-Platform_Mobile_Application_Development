// Axios client dùng chung: tự gắn Bearer token, xử lý 401 (refresh + logout)
// Mã lỗi backend theo quy tắc: [MODULE-XX] Mô tả lỗi bằng tiếng Việt
import axios from 'axios';
import { useAuthStore } from '../stores/authStore';

export const apiClient = axios.create({
  baseURL: '/api/v1',
  headers: { 'Content-Type': 'application/json' },
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Lấy access token mới từ refresh token khi hết hạn
async function tryRefresh(): Promise<boolean> {
  const { refreshToken, setAuth, user } = useAuthStore.getState();
  if (!refreshToken) return false;
  try {
    const res = await axios.post('/api/v1/auth/refresh', { refreshToken });
    // Backend tra PHAY `{ accessToken, refreshToken, expiresIn }` - KHONG phai
    // `{ tokens: {... } }` nhu POST /auth/login. Doc sai hinh dang o day se lam
    // tryRefresh() nem loi moi lan, nen 401 luon ket thuc bang dang xuat o at.
    const { accessToken, refreshToken: newRefresh } = res.data;
    if (!accessToken || !newRefresh || !user) return false;
    setAuth({ accessToken, refreshToken: newRefresh }, user);
    return true;
  } catch {
    return false;
  }
}

/**
 * Backend bọc mọi response trong `{ success, data, error }` (ResponseInterceptor).
 * Ở đây ta bóc lớp vỏ đó lúc đọc để phần còn lại của web admin cứ `res.data`
 * là ra payload thật — sửa 1 chỗ thay vì ~30 chỗ gọi API.
 */
interface Envelope<T> {
  success: boolean;
  data: T | null;
  error: { code: string; message: string; details?: string } | null;
}

function bocEnvelope<T>(duLieu: unknown): T | null {
  if (duLieu && typeof duLieu === 'object' && 'success' in duLieu && 'data' in duLieu && 'error' in duLieu) {
    return (duLieu as Envelope<T>).data;
  }
  return (duLieu ?? null) as T | null;
}

apiClient.interceptors.response.use(
  (res) => {
    const data = bocEnvelope(res.data);
    if (data === null) return { ...res, data: null };
    return { ...res, data };
  },
  async (error) => {
    const original = error.config;
    // 401 và chưa thử refresh một lần
    if (error.response?.status === 401 && !original._retried) {
      original._retried = true;
      const ok = await tryRefresh();
      if (ok) return apiClient(original);
      useAuthStore.getState().clearAuth();
    }
    // Lỗi cũng bọc envelope: đưa `message` tiếng Việt lên đầu cho errorMessage.ts
    const vo = error.response?.data as Envelope<unknown> | undefined;
    if (vo && typeof vo === 'object' && 'error' in vo && vo.error) {
      error.response.data = { ...vo, message: vo.error.message, code: vo.error.code };
    }
    return Promise.reject(error);
  }
);