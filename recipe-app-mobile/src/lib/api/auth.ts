import type { ApiResponse, DangNhapResponse, NguoiDung } from '../../types/api';
import { apiClient, goiApi } from './client';
import { dangNhapResponseSchema, nguoiDungSchema } from './schemas';

/**
 * BR-AUTH: Tên field lấy đúng theo DTO backend (`email`, `password`,
 * `displayName`). Trước đây gửi tiếng Việt (`matKhau`, `tenHienThi`) nên
 * ValidationPipe với `forbidNonWhitelisted` chặn hết, đăng nhập không bao
 * giờ được. Form trên màn hình vẫn dùng tên tiếng Việt, chỗ này là lớp dịch.
 */
export interface DangNhapPayload {
  email: string;
  matKhau: string;
}

export interface DangKyPayload {
  email: string;
  matKhau: string;
  tenHienThi: string;
}

/** Backend trả `{ user, tokens }` — gộp lại thành object token phẳng cho store. */
function tachTokens(duLieu: { user: NguoiDung; tokens: DangNhapResponse }): DangNhapResponse {
  return duLieu.tokens;
}

export async function dangKy(payload: DangKyPayload): Promise<DangNhapResponse> {
  const duLieu = await goiApi(
    apiClient
      .post('auth/register', {
        json: {
          email: payload.email,
          password: payload.matKhau,
          displayName: payload.tenHienThi,
        },
      })
      .json<ApiResponse<{ user: NguoiDung; tokens: DangNhapResponse }>>(),
  );
  return dangNhapResponseSchema.parse(tachTokens(duLieu));
}

export async function dangNhap(payload: DangNhapPayload): Promise<DangNhapResponse> {
  const duLieu = await goiApi(
    apiClient
      .post('auth/login', { json: { email: payload.email, password: payload.matKhau } })
      .json<ApiResponse<{ user: NguoiDung; tokens: DangNhapResponse }>>(),
  );
  return dangNhapResponseSchema.parse(tachTokens(duLieu));
}

export async function layThongTinNguoiDung(): Promise<NguoiDung> {
  const duLieu = await goiApi(apiClient.get('auth/me').json<ApiResponse<NguoiDung>>());
  return nguoiDungSchema.parse(duLieu);
}

/** BR-AUTH: Quên mật khẩu — backend luôn trả lời chung để chống dò email. */
export async function quenMatKhau(email: string): Promise<string> {
  const duLieu = await goiApi(
    apiClient
      .post('auth/forgot-password', { json: { email } })
      .json<ApiResponse<{ message: string }>>(),
  );
  return duLieu.message;
}

/** Task 3.2: Đổi mật khẩu — đúng ChangePasswordDto của backend. */
export async function doiMatKhau(currentPassword: string, newPassword: string): Promise<void> {
  await goiApi(
    apiClient
      .post('auth/change-password', { json: { currentPassword, newPassword } })
      .json<ApiResponse<null>>(),
  );
}

export interface CapNhatHoSoPayload {
  displayName?: string;
  avatarUrl?: string;
}

/**
 * Task 3.3: Sửa hồ sơ — PATCH /auth/me. Backend chỉ nhận field tiếng Anh
 * (`displayName`, `avatarUrl`); callback chủ động bỏ field undefined để không
 * gửi key thừa (forbidNonWhitelisted của backend).
 */
export async function capNhatHoSo(payload: CapNhatHoSoPayload): Promise<{ email: string; displayName: string; avatarUrl: string | null }> {
  const duLieu = await goiApi(
    apiClient
      .patch('auth/me', {
        json: {
          ...(payload.displayName !== undefined ? { displayName: payload.displayName } : {}),
          ...(payload.avatarUrl !== undefined ? { avatarUrl: payload.avatarUrl } : {}),
        },
      })
      .json<ApiResponse<{ email: string; displayName: string; avatarUrl: string | null }>>(),
  );
  return duLieu;
}