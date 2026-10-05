import { z } from 'zod';

/**
 * Schema phản chiếu đúng hình dạng backend trả về.
 *
 * Backend TRỘN HAI KIỂU ĐẶT TÊN — đây là điểm dễ sai nhất:
 * - Công thức (`Recipe` trong schema.prisma) dùng tiếng Anh: `title`,
 *   `author`, `ingredients[].originalText`, `steps[].content`.
 * - Bình luận / kế hoạch ăn / danh sách đi chợ dùng tiếng Việt: `noiDung`,
 *   `tacGia.tenHienThi`, `tenGoc`, `thuTu`.
 *
 * Đừng "đều hoá" hai kiểu này — mỗi tên ở đây khớp với một module backend
 * khác nhau, sửa một cái là hỏng luồng đó.
 */

export const apiErrorSchema = z.object({
  code: z.string(),
  message: z.string(),
  details: z.string().optional(),
});

export function apiResponseSchema<T extends z.ZodTypeAny>(dataSchema: T) {
  return z.object({
    success: z.boolean(),
    data: dataSchema.nullable(),
    error: apiErrorSchema.nullable(),
  });
}

// ===== AUTH (tiếng Anh) =====

export const nguoiDungSchema = z.object({
  id: z.string(),
  email: z.string(),
  displayName: z.string(),
  avatarUrl: z.string().nullable().optional(),
  role: z.string(),
  status: z.string().optional(),
});

// BR-AUTH: AuthTokens backend dùng `expiresIn` (giây), không phải thoiGianHetHan
export const dangNhapResponseSchema = z.object({
  accessToken: z.string(),
  refreshToken: z.string(),
  expiresIn: z.number().optional(),
});

// ===== CÔNG THỨC (tiếng Anh) =====

export const nguyenLieuSchema = z.object({
  id: z.string(),
  originalText: z.string(),
  // BR-03: BE nhận number lúc tạo nhưng trả string lúc đọc (Decimal.toString)
  quantity: z.union([z.string(), z.number()]),
  unit: z.string(),
  sortOrder: z.number(),
  internalIngredientId: z.string().nullable().optional(),
});

export const buocNauAnSchema = z.object({
  id: z.string(),
  stepOrder: z.number(),
  content: z.string(),
  imageUrl: z.string().nullable(),
});

export const dinhDuongSchema = z.object({
  calories: z.number(),
  protein: z.union([z.string(), z.number()]),
  carbs: z.union([z.string(), z.number()]),
  fat: z.union([z.string(), z.number()]),
});

export const tacGiaCongThucSchema = z.object({
  displayName: z.string(),
  email: z.string(),
});

export const congThucSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().nullable(),
  thumbnailUrl: z.string().nullable(),
  cookTimeMinutes: z.number(),
  prepTimeMinutes: z.number().nullable(),
  servings: z.number(),
  status: z.string(),
  source: z.string(),
  // `GET /recipes` cố tình giấu cả `id` lẫn `authorId` (chống dò UUID) — chỉ
  // endpoint chi tiết mới trả. Nên `authorId` là optional.
  authorId: z.string().optional(),
  rejectionReason: z.string().nullable().optional(),
  categoryId: z.string().nullable().optional(),
  author: tacGiaCongThucSchema.optional(),
  category: z.object({ name: z.string(), slug: z.string() }).nullable().optional(),
  tags: z.array(z.object({ name: z.string() })).optional(),
  // Endpoint list không kèm ingredients/steps — để mặc định rỗng cho parse được
  ingredients: z.array(nguyenLieuSchema).optional().default([]),
  steps: z.array(buocNauAnSchema).optional().default([]),
  nutrition: dinhDuongSchema.nullable().optional(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

/**
 * `GET /recipes` trả kiểu phân trang của Spring: `{ content, totalElements }`,
 * KHÁC với các endpoint tiếng Việt trả `{ noiDung, tongSoPhanTu }`.
 */
export const trangSpringSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    content: z.array(itemSchema),
    totalElements: z.number(),
    totalPages: z.number().optional(),
  });

// BR-MEAL: chi tiết kế hoạch chỉ cần tên + ảnh món, không tải full công thức
export const congThucTomTatSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnailUrl: z.string().nullable(),
});

// ===== BÌNH LUẬN (tiếng Việt) =====

export const tacGiaBinhLuanSchema = z.object({
  id: z.string(),
  email: z.string(),
  tenHienThi: z.string(),
  anhDaiDien: z.string().nullable(),
  vaiTro: z.string(),
  trangThai: z.string(),
});

export const binhLuanSchema = z.object({
  id: z.string(),
  noiDung: z.string(),
  tacGia: tacGiaBinhLuanSchema,
  thoiGianTao: z.string(),
  soLuongPhanHoi: z.number(),
});

// ===== KẾ HOẠCH ĂN (tiếng Việt) =====

export const monTrongKeHoachSchema = z.object({
  id: z.string(),
  ngay: z.string(),
  loaiBuoiAn: z.string(),
  khauPhan: z.number(),
  thuTu: z.number(),
  congThuc: congThucTomTatSchema.nullable(),
});

export const keHoachAnSchema = z.object({
  id: z.string(),
  ten: z.string(),
  ngayBatDau: z.string(),
  ngayKetThuc: z.string(),
  kichHoat: z.boolean(),
  cacMon: z.array(monTrongKeHoachSchema),
});

export const danhSachTrangSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
  z.object({
    noiDung: z.array(itemSchema),
    tongSoPhanTu: z.number(),
    tongSoTrang: z.number(),
  });

// ===== DANH SÁCH ĐI CHỢ (tiếng Việt) =====

export const monDiChoSchema = z.object({
  id: z.string(),
  nguyenLieuId: z.string().nullable(),
  tenGoc: z.string(),
  // BR-03: BE nhận number lúc tạo nhưng trả string lúc đọc (Decimal.toString)
  dinhLuong: z.union([z.string(), z.number()]),
  donVi: z.string(),
  daChon: z.boolean(),
  thuTu: z.number(),
});

export const danhSachDiChoSchema = z.object({
  id: z.string(),
  ten: z.string(),
  loaiNguon: z.string(),
  nguonId: z.string().nullable(),
  trangThai: z.string(),
  cacMon: z.array(monDiChoSchema),
});

// ===== KIỂM TRA TƯƠNG TÁC THỰC PHẨM =====

// backend đã tự ưu tiên CONFLICT khi một cặp khớp cả hai mức
export const capDoTuongTacSchema = z.enum(['CONFLICT', 'HARMONIOUS', 'NEUTRAL']);

export const capTayTuongTacSchema = z.object({
  a: z.string(),
  b: z.string(),
  level: capDoTuongTacSchema,
  note: z.string().nullable(),
  source: z.string().nullable(),
});

export const ketQuaTuongTacSchema = z.object({
  items: z.array(z.string()),
  pairs: z.array(capTayTuongTacSchema),
  summary: z.object({
    conflicts: z.number(),
    harmonious: z.number(),
    neutrals: z.number(),
  }),
});