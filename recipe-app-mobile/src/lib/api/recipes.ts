import type {
  ApiResponse,
  BinhLuan,
  CongThuc,
  CongThucTomTat,
  DanhGiaResponse,
  DanhSachTrang,
  TrangSpring,
} from '../../types/api';
import { KICH_THUOC_TRANG_MAC_DINH } from '../../constants/cau-hinh';
import { apiClient, goiApi } from './client';
import {
  binhLuanSchema,
  congThucSchema,
  congThucTomTatSchema,
  danhSachTrangSchema,
  trangSpringSchema,
} from './schemas';

/**
 * BR-UREC: Công thức backend dùng tên field tiếng Anh và trả phân trang kiểu
 * Spring (`content`/`totalElements`). Module này là lớp dịch duy nhất, các
 * màn hình bên dưới đọc đúng object đã parse.
 */
const congThucTrangSchema = trangSpringSchema(congThucSchema);

export interface ThamSoDanhSachCongThuc {
  page?: number;
  size?: number;
  search?: string;
  tacGiaId?: string;
}

/** DTO tạo/sửa — đúng tên `CreateRecipeDto` của backend. */
export interface NguyenLieuMoi {
  originalText: string;
  quantity: number;
  unit: string;
}

export interface BuocMoi {
  content: string;
}

export interface TaoCongThucPayload {
  title: string;
  description?: string;
  thumbnailUrl?: string;
  cookTimeMinutes: number;
  prepTimeMinutes?: number;
  servings: number;
  ingredients: NguyenLieuMoi[];
  steps: BuocMoi[];
}

export async function layDanhSachCongThuc(
  thamSo: ThamSoDanhSachCongThuc = {},
): Promise<TrangSpring<CongThuc>> {
  const duLieu = await goiApi(
    apiClient
      .get('recipes', {
        searchParams: {
          page: thamSo.page ?? 0,
          size: thamSo.size ?? KICH_THUOC_TRANG_MAC_DINH,
          ...(thamSo.search ? { search: thamSo.search } : {}),
        },
      })
      .json<ApiResponse<TrangSpring<CongThuc>>>(),
  );
  return congThucTrangSchema.parse(duLieu);
}

export async function layChiTietCongThuc(id: string): Promise<CongThuc> {
  const duLieu = await goiApi(apiClient.get(`recipes/${id}`).json<ApiResponse<CongThuc>>());
  return congThucSchema.parse(duLieu);
}

/** BR-REC: Công thức tương tự — backend trả mảng phẳng, không phân trang. */
export interface CongThucTomTatGoiY {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  cookTimeMinutes: number;
  servings: number;
  status: string;
}

export async function layCongThucTuongTu(id: string): Promise<CongThucTomTatGoiY[]> {
  const duLieu = await goiApi(
    apiClient.get(`recipes/${id}/similar`).json<ApiResponse<CongThucTomTatGoiY[]>>(),
  );
  return duLieu ?? [];
}

export async function timKiemTheoNguyenLieu(
  nguyenLieu: string,
  soLuong = 10,
): Promise<TrangSpring<CongThuc>> {
  const duLieu = await goiApi(
    apiClient
      .get('recipes/search/by-ingredients', { searchParams: { ingredients: nguyenLieu, number: soLuong } })
      .json<ApiResponse<TrangSpring<CongThuc>>>(),
  );
  return congThucTrangSchema.parse(duLieu);
}

// BR-UREC: Tạo/sửa/xóa công thức cá nhân. Sửa dùng `PUT` (backend không có PATCH).
export async function taoCongThuc(payload: TaoCongThucPayload): Promise<CongThuc> {
  const duLieu = await goiApi(
    apiClient.post('recipes', { json: payload }).json<ApiResponse<CongThuc>>(),
  );
  return congThucSchema.parse(duLieu);
}

export async function capNhatCongThuc(
  id: string,
  payload: Partial<TaoCongThucPayload>,
): Promise<CongThuc> {
  const duLieu = await goiApi(
    apiClient.put(`recipes/${id}`, { json: payload }).json<ApiResponse<CongThuc>>(),
  );
  return congThucSchema.parse(duLieu);
}

export async function xoaCongThuc(id: string): Promise<void> {
  await goiApi(apiClient.delete(`recipes/${id}`).json<ApiResponse<unknown>>());
}

// BR-UREC: Gửi duyệt bài nháp/bị từ chối lên hàng chờ PENDING
export async function guiDuyetCongThuc(id: string): Promise<CongThuc> {
  const duLieu = await goiApi(
    apiClient.patch(`recipes/${id}/submit-review`).json<ApiResponse<CongThuc>>(),
  );
  return congThucSchema.parse(duLieu);
}

// BR-SOC: Yêu thích — backend toggle, trả trạng thái sau cùng
export interface KetQuaYeuThich {
  yeuThich: boolean;
  congThucId: string;
  ten?: string;
}

export async function themYeuThich(id: string): Promise<KetQuaYeuThich> {
  return goiApi(
    apiClient.post(`recipes/${id}/favorite`).json<ApiResponse<KetQuaYeuThich>>(),
  );
}

// BR-SOC: Danh sách công thức đã yêu thích (backend trả kiểu tiếng Việt)
export async function layDanhSachYeuThich(
  thamSo: { page?: number; size?: number } = {},
): Promise<DanhSachTrang<CongThuc>> {
  const duLieu = await goiApi(
    apiClient
      .get('favorites', {
        searchParams: {
          page: thamSo.page ?? 0,
          size: thamSo.size ?? KICH_THUOC_TRANG_MAC_DINH,
        },
      })
      .json<ApiResponse<DanhSachTrang<CongThuc>>>(),
  );
  return danhSachTrangSchema(congThucSchema).parse(duLieu);
}

export async function xoaYeuThich(id: string): Promise<void> {
  await goiApi(apiClient.delete(`recipes/${id}/favorite`).json<ApiResponse<unknown>>());
}

export async function danhGiaCongThuc(id: string, diem: number): Promise<DanhGiaResponse> {
  return goiApi(
    apiClient.post(`recipes/${id}/rating`, { json: { diem } }).json<ApiResponse<DanhGiaResponse>>(),
  );
}

// BR-SOC: Bình luận — backend dùng tên tiếng Việt `{ noiDung, tacGia.tenHienThi }`
export async function layBinhLuan(
  id: string,
  page = 0,
  size = 20,
): Promise<DanhSachTrang<BinhLuan>> {
  const duLieu = await goiApi(
    apiClient
      .get(`recipes/${id}/comments`, { searchParams: { page, size } })
      .json<ApiResponse<DanhSachTrang<BinhLuan>>>(),
  );
  return danhSachTrangSchema(binhLuanSchema).parse(duLieu);
}

export async function taoBinhLuan(
  id: string,
  noiDung: string,
  chaId?: string,
): Promise<BinhLuan> {
  const duLieu = await goiApi(
    apiClient
      .post(`recipes/${id}/comments`, { json: { noiDung, ...(chaId ? { chaId } : {}) } })
      .json<ApiResponse<BinhLuan>>(),
  );
  return binhLuanSchema.parse(duLieu);
}

// BR-SOC: Sửa/xóa bình luận của chính mình, xem replies
export async function suaBinhLuan(recipeId: string, commentId: string, noiDung: string): Promise<BinhLuan> {
  const duLieu = await goiApi(
    apiClient
      .patch(`recipes/${recipeId}/comments/${commentId}`, { json: { noiDung } })
      .json<ApiResponse<BinhLuan>>(),
  );
  return binhLuanSchema.parse(duLieu);
}

export async function xoaBinhLuan(recipeId: string, commentId: string): Promise<void> {
  await goiApi(apiClient.delete(`recipes/${recipeId}/comments/${commentId}`).json<ApiResponse<unknown>>());
}

export async function layPhanHoi(
  recipeId: string,
  commentId: string,
): Promise<DanhSachTrang<BinhLuan>> {
  const duLieu = await goiApi(
    apiClient
      .get(`recipes/${recipeId}/comments/${commentId}/replies`)
      .json<ApiResponse<DanhSachTrang<BinhLuan>>>(),
  );
  return danhSachTrangSchema(binhLuanSchema).parse(duLieu);
}

export interface TomTatDanhGia {
  diemTrungBinh: number;
  tongSoDanhGia: number;
  phanBo: Record<string, number>;
}

// BR-SOC: Tổng quan điểm + phân bổ sao (thật từ server)
export async function layTomTatDanhGia(id: string): Promise<TomTatDanhGia> {
  return goiApi(
    apiClient.get(`recipes/${id}/rating/summary`).json<ApiResponse<TomTatDanhGia>>(),
  );
}