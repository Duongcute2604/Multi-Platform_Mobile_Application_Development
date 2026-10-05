// Admin API functions
import { apiClient } from './client';

/**
 * Backend tra 3 kieu phan trang KHAC NHAU cho cac danh sach quan tri:
 * - `/categories`, `/tags`            -> mang thuan (khong phan trang)
 * - `/meal-plans`, `/shopping-lists`  -> `{ noiDung, tongSoPhanTu, tongSoTrang }`
 * - mot so cho nua                    -> `{ content, ... }`
 *
 * Trong khi doan code cua cac trang deu doc `{ content, tongSoPhanTu, tongSoTrang }`
 * nen truoc day `data.content` bi `undefined` -> `.map` nem loi toan bo trang
 * (man hinh trong trang). Chuan hoa TAI DAY de dung 1 cho thay vi sua 5 component.
 */
export interface TrangQuanTri<T> {
  content: T[];
  tongSoPhanTu: number;
  tongSoTrang: number;
}

export function chuanHoaTrang<T>(duLieu: unknown): TrangQuanTri<T> {
  if (Array.isArray(duLieu)) {
    // Mang thuan: backend lay toan bo, khong phan trang -> dung 1 trang.
    return { content: duLieu as T[], tongSoPhanTu: duLieu.length, tongSoTrang: 1 };
  }
  if (duLieu && typeof duLieu === 'object') {
    const o = duLieu as Record<string, unknown>;
    const content = Array.isArray(o.content)
      ? (o.content as T[])
      : Array.isArray(o.noiDung)
        ? (o.noiDung as T[])
        : [];
    const tongSoPhanTu =
      typeof o.tongSoPhanTu === 'number'
        ? o.tongSoPhanTu
        : typeof o.totalElements === 'number'
          ? o.totalElements
          : content.length;
    const tongSoTrang =
      typeof o.tongSoTrang === 'number'
        ? o.tongSoTrang
        : typeof o.totalPages === 'number'
          ? o.totalPages
          : 1;
    return { content, tongSoPhanTu, tongSoTrang: Math.max(1, tongSoTrang) };
  }
  return { content: [], tongSoPhanTu: 0, tongSoTrang: 1 };
}


export interface DanhMuc {
  id: string;
  ten: string;
  slug: string;
  moTa: string | null;
}

export interface Nhan {
  id: string;
  ten: string;
  slug: string;
}

export interface TaoDanhMucDto {
  ten: string;
  slug?: string;
  moTa?: string;
}

export interface CapNhatDanhMucDto {
  ten?: string;
  slug?: string;
  moTa?: string;
}

export interface TaoNhanDto {
  ten: string;
  slug?: string;
}

export interface DanhMucResponse {
  content: DanhMuc[];
  tongSoPhanTu: number;
  tongSoTrang: number;
}

export interface NhanResponse {
  content: Nhan[];
  tongSoPhanTu: number;
  tongSoTrang: number;
}

// ===== DANH MỤC =====
export async function layDanhSachDanhMuc(trang: number = 0, kichThuoc: number = 20) {
  const res = await apiClient.get('/categories', {
    params: { page: trang, size: kichThuoc },
  });
  return chuanHoaTrang<DanhMuc>(res.data);
}

export async function taoDanhMuc(dto: { ten: string; slug?: string; moTa?: string }) {
  const res = await apiClient.post('/categories', dto);
  return res.data;
}

export async function capNhatDanhMuc(id: string, dto: { ten?: string; slug?: string; moTa?: string }) {
  const res = await apiClient.patch(`/categories/${id}`, dto);
  return res.data;
}

export async function xoaDanhMuc(id: string) {
  await apiClient.delete(`/categories/${id}`);
  return { thanhCong: true };
}

// ===== NHÃN (TAGS) =====
export async function layDanhSachNhan(trang: number = 0, kichThuoc: number = 20) {
  const res = await apiClient.get('/tags', {
    params: { page: trang, size: kichThuoc },
  });
  return chuanHoaTrang<{ id: string; ten: string; slug: string }>(res.data);
}

export async function taoNhan(dto: { ten: string; slug?: string }) {
  const res = await apiClient.post('/tags', dto);
  return res.data;
}

export async function xoaNhan(id: string) {
  await apiClient.delete(`/tags/${id}`);
  return { thanhCong: true };
}

// ===== MEAL PLANS =====
export interface KeHoachAn {
  id: string;
  ten: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  kichHoat: boolean;
  cacMon: Array<{
    id: string;
    ngay: string;
    loaiBuoiAn: string;
    khauPhan: number;
    thuTu: number;
    congThuc: {
      id: string;
      ten: string;
      anhThumbnail: string | null;
    } | null;
  }>;
}

export interface KeHoachAnListResponse {
  content: KeHoachAn[];
  tongSoPhanTu: number;
  tongSoTrang: number;
}

export interface KeHoachAnDetail extends KeHoachAn {
  cacMon: Array<{
    id: string;
    ngay: string;
    loaiBuoiAn: string;
    khauPhan: number;
    thuTu: number;
    congThuc: {
      id: string;
      ten: string;
      anhThumbnail: string | null;
    } | null;
  }>;
}

export interface TaoKeHoachAnDto {
  ten: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  cacMon?: Array<{
    congThucId?: string;
    thamChieuId?: string;
    ngay: string;
    buoiAn: string;
    khauPhan: number;
  }>;
}

export interface CapNhatKeHoachAnDto {
  ten?: string;
  ngayBatDau?: string;
  ngayKetThuc?: string;
}

export interface KeHoachAnListResponse {
  content: KeHoachAn[];
  tongSoPhanTu: number;
  tongSoTrang: number;
}

// ===== MEAL PLANS =====
export async function layDanhSachKeHoachAn(trang: number = 0, kichThuoc: number = 20) {
  const res = await apiClient.get('/meal-plans', {
    params: { page: trang, size: kichThuoc },
  });
  // Backend tra `{ noiDung, tongSoPhanTu, tongSoTrang }` (ten tieng Viet)
  return chuanHoaTrang<any>(res.data);
}

export async function layChiTietKeHoachAn(id: string) {
  const res = await apiClient.get(`/meal-plans/${id}`);
  return res.data;
}

export async function taoKeHoachAn(dto: {
  ten: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  cacMon?: Array<{
    congThucId?: string;
    thamChieuId?: string;
    ngay: string;
    buoiAn: string;
    khauPhan: number;
  }>;
}) {
  const res = await apiClient.post('/meal-plans', dto);
  return res.data;
}

export async function capNhatKeHoachAn(id: string, dto: { ten?: string; ngayBatDau?: string; ngayKetThuc?: string }) {
  const res = await apiClient.patch(`/meal-plans/${id}`, dto);
  return res.data;
}

export async function xoaKeHoachAn(id: string) {
  await apiClient.delete(`/meal-plans/${id}`);
  return { thanhCong: true };
}

// ===== MEAL PLAN ITEMS =====
export interface MonMoiDto {
  congThucId?: string;
  thamChieuId?: string;
  ngay: string;
  buoiAn: string;
  khauPhan: number;
}

export interface CapNhatMonDto {
  khauPhan?: number;
  ngay?: string;
  buoiAn?: string;
}

export async function themMonVaoKeHoach(keHoachId: string, dto: { congThucId?: string; thamChieuId?: string; ngay: string; buoiAn: string; khauPhan: number }) {
  const res = await apiClient.post(`/meal-plans/${keHoachId}/items`, dto);
  return res.data;
}

export async function capNhatMonTrongKeHoach(keHoachId: string, monId: string, dto: { khauPhan?: number; ngay?: string; buoiAn?: string }) {
  const res = await apiClient.patch(`/meal-plans/${keHoachId}/items/${monId}`, dto);
  return res.data;
}

export async function xoaMonKhoiKeHoach(keHoachId: string, monId: string) {
  await apiClient.delete(`/meal-plans/${keHoachId}/items/${monId}`);
  return { thanhCong: true };
}

// ===== SHOPPING LISTS =====
export interface DanhSachDiCho {
  id: string;
  ten: string;
  loaiNguon: string;
  nguonId: string | null;
  trangThai: string;
  ngayTao: string;
  ngayCapNhat: string;
  cacMon: Array<{
    id: string;
    nguyenLieuId: string | null;
    tenGoc: string;
    dinhLuong: string;
    donVi: string;
    daChon: boolean;
    thuTu: number;
  }>;
}

export interface DanhSachDiChoListResponse {
  content: DanhSachDiCho[];
  tongSoPhanTu: number;
  tongSoTrang: number;
}

export interface TaoDanhSachDiChoDto {
  ten: string;
  loaiNguon: 'RECIPE' | 'MEAL_PLAN' | 'MANUAL';
  nguonId?: string;
}

export interface TaoTuCongThucDto {
  congThucId: string;
  khauPhan: number;
}

export interface TaoTuKeHoachAnDto {
  mealPlanId: string;
  tuNgay: string;
  denNgay: string;
  cacNgay?: string[];
}

export interface CapNhatDanhSachDto {
  ten?: string;
  trangThai?: string;
}

export interface MonMoiDto {
  tenGoc: string;
  dinhLuong: number;
  donVi: string;
  nguyenLieuId?: string;
}

export interface SuaMonDiChoDto {
  tenGoc?: string;
  dinhLuong?: number;
  donVi?: string;
  daChon?: boolean;
}

export async function layDanhSachDanhSachDiCho(trang: number = 0, kichThuoc: number = 20) {
  const res = await apiClient.get('/shopping-lists', {
    params: { page: trang, size: kichThuoc },
  });
  // Backend tra `{ noiDung, tongSoPhanTu, tongSoTrang }` (ten tieng Viet)
  return chuanHoaTrang<DanhSachDiCho>(res.data);
}

export async function taoDanhSachDiCho(dto: { ten: string; loaiNguon: 'RECIPE' | 'MEAL_PLAN' | 'MANUAL'; nguonId?: string }) {
  const res = await apiClient.post('/shopping-lists', dto);
  return res.data;
}

export async function taoTuCongThuc(dto: { congThucId: string; khauPhan: number }) {
  const res = await apiClient.post('/shopping-lists/generate-from-recipe', dto);
  return res.data;
}

export async function taoTuKeHoachAn(body: { mealPlanId: string; tuNgay: string; denNgay: string; cacNgay?: string[] }) {
  const res = await apiClient.post('/shopping-lists/generate-from-meal-plan', body);
  return res.data;
}

export async function layChiTietDanhSachDiCho(id: string) {
  const res = await apiClient.get(`/shopping-lists/${id}`);
  return res.data;
}

export async function xoaDanhSachDiCho(id: string) {
  await apiClient.delete(`/shopping-lists/${id}`);
  return { thanhCong: true };
}

export async function capNhatDanhSachDiCho(id: string, dto: { ten?: string; trangThai?: string }) {
  const res = await apiClient.patch(`/shopping-lists/${id}`, dto);
  return res.data;
}

export async function themMonVaoDanhSach(id: string, dto: { tenGoc: string; dinhLuong: number; donVi: string; nguyenLieuId?: string }) {
  const res = await apiClient.post(`/shopping-lists/${id}/items`, dto);
  return res.data;
}

export async function suaMonTrongDanhSach(id: string, itemId: string, dto: { tenGoc?: string; dinhLuong?: number; donVi?: string; daChon?: boolean }) {
  const res = await apiClient.patch(`/shopping-lists/${id}/items/${itemId}`, dto);
  return res.data;
}

export async function xoaMonKhoiDanhSach(id: string, itemId: string) {
  await apiClient.delete(`/shopping-lists/${id}/items/${itemId}`);
  return { thanhCong: true };
}