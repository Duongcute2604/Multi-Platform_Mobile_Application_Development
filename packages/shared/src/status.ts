/**
 * Nhãn tiếng Việt cho trạng thái nghiệp vụ dùng ở nhiều app.
 *
 * Web admin có bản riêng trong `components/ui/statusMeta.ts` (kèm màu badge),
 * mobile chỉ cần chữ. Đặt ở shared để backend + web + mobile không lệch nhau.
 */

/** BR-02: trạng thái công thức. Khớp enum `RecipeStatus` trong schema.prisma. */
export const TEN_TRANG_THAI_CONG_THUC: Record<string, string> = {
  DRAFT: 'Nháp',
  PENDING: 'Chờ duyệt',
  APPROVED: 'Đã duyệt',
  REJECTED: 'Từ chối',
  HIDDEN: 'Đã ẩn',
};

/** BR-SHOP: trạng thái danh sách đi chợ. Khớp `ShoppingListStatus` trong shared/types.ts. */
export const TEN_TRANG_THAI_DANH_SACH: Record<string, string> = {
  ACTIVE: 'Đang dùng',
  COMPLETED: 'Đã hoàn thành',
  ARCHIVED: 'Đã lưu trữ',
};

export function tenTrangThai(trangThai: string): string {
  return TEN_TRANG_THAI_CONG_THUC[trangThai] ?? TEN_TRANG_THAI_DANH_SACH[trangThai] ?? trangThai;
}