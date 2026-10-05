// BR-AUTH/BR-UREC/BR-SOC/BR-MEAL/BR-SHOP: Kiểu dữ liệu mirror backend NestJS
// (response interceptor { success, data, error })
//
// LƯU Ý: backend trộn hai kiểu đặt tên — công thức dùng tiếng Anh
// (`title`, `author`) còn bình luận / kế hoạch / đi chợ dùng tiếng Việt
// (`noiDung`, `tacGia`, `tenGoc`). File này giữ nguyên từng kiểu đúng với
// backend; đổi tên ở đây là mọi màn hình đọc ra `undefined`.

export interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ApiError | null;
}

export interface ApiError {
  code: string;
  message: string;
  details?: string;
}

/** Endpoint tiếng Việt (kế hoạch ăn, đi chợ, bình luận) trả kiểu này. */
export interface DanhSachTrang<T> {
  noiDung: T[];
  tongSoPhanTu: number;
  tongSoTrang: number;
}

/** `GET /recipes` trả kiểu phân trang của Spring: `content` + `totalElements`. */
export interface TrangSpring<T> {
  content: T[];
  totalElements: number;
  totalPages?: number;
}

// BR-AUTH: khớp AuthUserResponse backend — tên field tiếng Anh
export interface NguoiDung {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string | null;
  role: string;
  status?: string;
}

/** BR-SOC: bình luận dùng tên tiếng Việt (khác `NguoiDung` ở trên). */
export interface TacGiaBinhLuan {
  id: string;
  email: string;
  tenHienThi: string;
  anhDaiDien: string | null;
  vaiTro: string;
  trangThai: string;
}

// BR-UREC: RecipeIngredient — BE nhận number lúc tạo, trả string lúc đọc
export interface NguyenLieuCongThuc {
  id: string;
  originalText: string;
  quantity: string | number;
  unit: string;
  sortOrder: number;
  internalIngredientId?: string | null;
}

export interface BuocNauAn {
  id: string;
  stepOrder: number;
  content: string;
  imageUrl: string | null;
}

export interface DinhDuong {
  calories: number;
  protein: string | number;
  carbs: string | number;
  fat: string | number;
}

export interface TacGiaCongThuc {
  displayName: string;
  email: string;
}

export interface CongThuc {
  id: string;
  title: string;
  description: string | null;
  thumbnailUrl: string | null;
  cookTimeMinutes: number;
  prepTimeMinutes: number | null;
  servings: number;
  status: string;
  source: string;
  /** Chỉ có ở endpoint chi tiết; `GET /recipes` cố tình giấu để chống dò UUID. */
  authorId?: string;
  rejectionReason?: string | null;
  categoryId?: string | null;
  author?: TacGiaCongThuc;
  category?: { name: string; slug: string } | null;
  tags?: { name: string }[];
  ingredients: NguyenLieuCongThuc[];
  steps: BuocNauAn[];
  nutrition?: DinhDuong | null;
  createdAt: string;
  updatedAt: string;
}

export interface DangNhapResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn?: number;
}

export interface BinhLuan {
  id: string;
  noiDung: string;
  tacGia: TacGiaBinhLuan;
  thoiGianTao: string;
  soLuongPhanHoi: number;
}

export interface MonTrongKeHoach {
  id: string;
  ngay: string;
  loaiBuoiAn: string;
  khauPhan: number;
  thuTu: number;
  congThuc: CongThucTomTat | null;
}

// BR-MEAL: Món trong kế hoạch chỉ mang tên + ảnh, đủ để hiển thị lịch tuần
export interface CongThucTomTat {
  id: string;
  title: string;
  thumbnailUrl: string | null;
}

export interface KeHoachAn {
  id: string;
  ten: string;
  ngayBatDau: string;
  ngayKetThuc: string;
  kichHoat: boolean;
  cacMon: MonTrongKeHoach[];
}

export interface MonTrongDanhSachDiCho {
  id: string;
  nguyenLieuId: string | null;
  tenGoc: string;
  dinhLuong: string | number;
  donVi: string;
  daChon: boolean;
  thuTu: number;
}

export interface DanhSachDiCho {
  id: string;
  ten: string;
  loaiNguon: string;
  nguonId: string | null;
  trangThai: string;
  cacMon: MonTrongDanhSachDiCho[];
}

export interface DanhGiaResponse {
  diemTrungBinh: number;
  tongSoDanhGia: number;
}

// BR-FOOD: Mức tương tác thực phẩm. CONFLICT = kỵ/độc (ưu tiên cảnh báo),
// HARMONIOUS = hợp, NEUTRAL = trung tính.
export type CapDoTuongTac = 'CONFLICT' | 'HARMONIOUS' | 'NEUTRAL';

export interface CapTayTuongTac {
  a: string;
  b: string;
  level: CapDoTuongTac;
  note: string | null;
  source: string | null;
}

export interface KetQuaTuongTac {
  items: string[];
  pairs: CapTayTuongTac[];
  summary: { conflicts: number; harmonious: number; neutrals: number };
}