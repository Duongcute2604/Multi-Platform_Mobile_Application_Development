/**
 * Bảng chọn mốc định lượng + danh sách đơn vị cho ô nhập nguyên liệu.
 *
 * Ô nhập gồm 2 tầng: chọn mốc (nhỏ/vừa/lớn) rồi kéo slider trong khoảng của
 * mốc, và chọn đơn vị từ danh sách chip. Tách riêng khỏi `unit-conversion.ts`
 * vì đây là dữ liệu cho UI, còn unit-conversion là thuật toán quy đổi.
 */

export interface MocDinhLuong {
  /** Nhãn hiển thị trên chip */
  nhan: string;
  /** Giá trị nhỏ nhất của slider */
  min: number;
  /** Giá trị lớn nhất của slider */
  max: number;
  /** Bước nhảy của slider */
  buoc: number;
}

/** Ba mốc, tỷ lệ 1 : 10 : 100 để người dùng kéo nhanh ở cả ba khung giá trị. */
export const MOC_DINH_LUONG: MocDinhLuong[] = [
  { nhan: 'Nhỏ', min: 1, max: 10, buoc: 1 },
  { nhan: 'Vừa', min: 10, max: 100, buoc: 5 },
  { nhan: 'Lớn', min: 100, max: 1000, buoc: 50 },
];

/**
 * Đơn vị hay dùng khi nấu ăn tại Việt Nam, đúng những gì backend chấp nhận.
 * Khớp với bảng `UNITS` trong `unit-conversion.ts` (g, kg, ml, l, muỗng...).
 */
export const DON_VI_CHUAN: string[] = [
  'g',
  'kg',
  'ml',
  'l',
  'muỗng cà phê',
  'muỗng canh',
  'chén',
  'bát',
  'cái',
  'quả',
  'lát',
  'nhánh',
  'gói',
  'hộp',
  'lon',
];

/**
 * Suy ra mốc đang phù hợp với một giá trị.
 * Trả về chỉ số trong `MOC_DINH_LUONG`; giá trị nằm trên mốc cuối thì dùng mốc cuối.
 */
export function mocChoGiaTri(giaTri: number): number {
  for (let i = 0; i < MOC_DINH_LUONG.length; i++) {
    const moc = MOC_DINH_LUONG[i];
    if (giaTri >= moc.min && giaTri <= moc.max) return i;
  }
  return giaTri < MOC_DINH_LUONG[0].min ? 0 : MOC_DINH_LUONG.length - 1;
}