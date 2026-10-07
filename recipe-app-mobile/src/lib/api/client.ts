import ky, { HTTPError } from 'ky';
import { API_BASE_URL } from '../../constants/cau-hinh';
import type { ApiResponse } from '../../types/api';
import { lamMoiAccessToken, layAccessToken, xoaTokens } from '../auth/tokenManager';

export class ApiError extends Error {
  constructor(
    public maLoi: string,
    message: string,
    public status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

const DA_LAM_MOI_HEADER = 'x-cook-da-lam-moi';

export const apiClient = ky.create({
  prefix: API_BASE_URL,
  timeout: 30_000,
  retry: { limit: 1, methods: ['get'], statusCodes: [408, 413, 429, 500, 502, 503, 504] },
  headers: { 'Content-Type': 'application/json' },
  hooks: {
    beforeRequest: [
      async ({ request }) => {
        const token = await layAccessToken();
        if (token) request.headers.set('Authorization', `Bearer ${token}`);
      },
    ],
    afterResponse: [
      async ({ request, options, response }) => {
        // BR-AUTH: 401 → refresh 1 lần rồi thử lại request gốc
        if (response.status !== 401 || request.headers.get(DA_LAM_MOI_HEADER)) return response;
        const tokenMoi = await lamMoiAccessToken();
        if (!tokenMoi) {
          await xoaTokens();
          throw new ApiError('AUTH-02', 'Phiên đăng nhập hết hạn, vui lòng đăng nhập lại', 401);
        }
        const tieuDe = new Headers(request.headers);
        tieuDe.set('Authorization', `Bearer ${tokenMoi}`);
        tieuDe.set(DA_LAM_MOI_HEADER, '1');
        // throwHttpErrors:false để lần retry 401 KHÔNG ném HTTPError giữa chừng —
        // cho phép inspect status dưới và parse body lỗi nghiệp vụ.
        const loiThuLai = await ky(new Request(request, { headers: tieuDe }), {
          ...options,
          throwHttpErrors: false,
        });
        // Task 5.2: retry vẫn 401 là lỗi NGHIỆP VỤ (vd [AUTH-14] sai mật khẩu hiện tại),
        // không phải token hết hạn. ky đã consume body nên phải parse ngay ở đây rồi
        // throw ApiError — nếu để response về goiApi thì bodyUsed=true làm mất message.
        if (loiThuLai.status === 401) {
          let than: ApiResponse<unknown> | null = null;
          try {
            than = (await loiThuLai.clone().json()) as ApiResponse<unknown>;
          } catch {
            than = null;
          }
          if (than?.error) throw new ApiError(than.error.code, than.error.message, 401);
          return loiThuLai;
        }
        return loiThuLai;
      },
    ],
  },
});

export async function goiApi<T>(loiHua: Promise<ApiResponse<T>>): Promise<T> {
  try {
    const ketQua = await loiHua;
    // BR-API: DELETE/POST void trả data null — chỉ lỗi khi backend báo error
    if (!ketQua.success || ketQua.error) {
      throw new ApiError(
        ketQua.error?.code ?? 'UNKNOWN',
        ketQua.error?.message ?? 'Đã có lỗi xảy ra',
      );
    }
    return ketQua.data as T;
  } catch (loi) {
    if (loi instanceof ApiError) throw loi;
    if (loi instanceof HTTPError) {
      try {
        // BR-API: đọc qua clone() để tránh body đã bị ky consume trong vòng
        // refresh/retry 401 — nếu không thì rơi vào fallback "Lỗi HTTP <status>"
        // làm mất message lỗi cụ thể từ backend (vd [AUTH-14]).
        const body = (await loi.response.clone().json()) as ApiResponse<unknown>;
        if (body?.error) throw new ApiError(body.error.code, body.error.message, loi.response.status);
      } catch (e) {
        if (e instanceof ApiError) throw e;
      }
      throw new ApiError('NETWORK', `Lỗi HTTP ${loi.response.status}`, loi.response.status);
    }
    throw new ApiError('NETWORK', 'Không thể kết nối máy chủ');
  }
}
