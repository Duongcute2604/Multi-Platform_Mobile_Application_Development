// Admin API functions
import { apiClient } from './client';

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
  return res.data as DanhMucResponse;
}

export async function taoDanhMuc(dto: TaoDanhMucDto) {
  const res = await apiClient.post('/categories', dto);
  return res.data as DanhMuc;
}

export async function capNhatDanhMuc(id: string, dto: { ten?: string; slug?: string; moTa?: string }) {
  const res = await apiClient.patch(`/categories/${id}`, dto);
  return res.data as DanhMuc;
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
  return res.data as NhanResponse;
}

export async function taoNhan(dto: TaoNhanDto) {
  const res = await apiClient.post('/tags', dto);
  return res.data as Nhan;
}

export async function xoaNhan(id: string) {
  await apiClient.delete(`/tags/${id}`);
  return { thanhCong: true };
}