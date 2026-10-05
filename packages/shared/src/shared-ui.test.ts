import { describe, it, expect } from 'vitest';
import { mocChoGiaTri, DON_VI_CHUAN, MOC_DINH_LUONG } from './measurement';
import { tenTrangThai } from './status';
import { getUnitInfo } from './unit-conversion';

describe('mocChoGiaTri', () => {
  it('suy đúng mốc khi giá trị nằm trong khoảng', () => {
    expect(mocChoGiaTri(1)).toBe(0);
    expect(mocChoGiaTri(5)).toBe(0);
    expect(mocChoGiaTri(10)).toBe(0);
    expect(mocChoGiaTri(50)).toBe(1);
    expect(mocChoGiaTri(100)).toBe(1);
    expect(mocChoGiaTri(500)).toBe(2);
    expect(mocChoGiaTri(1000)).toBe(2);
  });

  it('giá trị nhỏ hơn mốc đầu -> mốc đầu', () => {
    expect(mocChoGiaTri(0)).toBe(0);
    expect(mocChoGiaTri(-3)).toBe(0);
  });

  it('giá trị lớn hơn mốc cuối -> mốc cuối', () => {
    expect(mocChoGiaTri(5000)).toBe(MOC_DINH_LUONG.length - 1);
  });

  it('giá trị rác (NaN) không ném lỗi', () => {
    expect(() => mocChoGiaTri(Number.NaN)).not.toThrow();
  });
});

describe('DON_VI_CHUAN', () => {
  it('mọi đơn vị đều có định nghĩa trong bảng quy đổi', () => {
    const thieu = DON_VI_CHUAN.filter((dv) => !getUnitInfo(dv));
    expect(thieu).toEqual([]);
  });
});

describe('tenTrangThai', () => {
  it('dịch 5 trạng thái công thức', () => {
    expect(tenTrangThai('DRAFT')).toBe('Nháp');
    expect(tenTrangThai('PENDING')).toBe('Chờ duyệt');
    expect(tenTrangThai('APPROVED')).toBe('Đã duyệt');
    expect(tenTrangThai('REJECTED')).toBe('Từ chối');
    expect(tenTrangThai('HIDDEN')).toBe('Đã ẩn');
  });

  it('dịch trạng thái danh sách đi chợ', () => {
    expect(tenTrangThai('ACTIVE')).toBe('Đang dùng');
    expect(tenTrangThai('COMPLETED')).toBe('Đã hoàn thành');
    expect(tenTrangThai('ARCHIVED')).toBe('Đã lưu trữ');
  });

  it('trạng thái lạ -> trả nguyên gốc thay vì undefined', () => {
    expect(tenTrangThai('KHONG_CO')).toBe('KHONG_CO');
  });
});