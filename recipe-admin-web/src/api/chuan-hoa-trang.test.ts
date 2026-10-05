import { describe, expect, it } from 'vitest';
import { chuanHoaTrang } from './admin';

/**
 * Backend tra 3 kieu phan trang khac nhau (mang thuan / `noiDung` / `content`)
 * nhung cac trang quan tri deu doc `{ content, tongSoPhanTu, tongSoTrang }`.
 * Truoc day doc sai lam `.map` tren `undefined` -> man hinh trong trang.
 */
describe('chuanHoaTrang', () => {
  it('chuan hoa mang thuan (categories, tags) thanh 1 trang', () => {
    const mang = [{ id: '1', ten: 'Món canh', slug: 'mon-canh' }];
    expect(chuanHoaTrang(mang)).toEqual({
      content: mang,
      tongSoPhanTu: 1,
      tongSoTrang: 1,
    });
  });

  it('mang rong van tra dung cau truc de `.map` khong loi', () => {
    expect(chuanHoaTrang([])).toEqual({ content: [], tongSoPhanTu: 0, tongSoTrang: 1 });
  });

  it('chuan hoa key noiDung (meal-plans, shopping-lists) thanh content', () => {
    const noiDung = [{ id: 'a' }, { id: 'b' }];
    expect(chuanHoaTrang({ noiDung, tongSoPhanTu: 7, tongSoTrang: 3 })).toEqual({
      content: noiDung,
      tongSoPhanTu: 7,
      tongSoTrang: 3,
    });
  });

  it('giu nguyen dang Spring pageable (content + totalElements/totalPages)', () => {
    const content = [{ id: 'x' }];
    expect(chuanHoaTrang({ content, totalElements: 18, totalPages: 2 })).toEqual({
      content,
      tongSoPhanTu: 18,
      tongSoTrang: 2,
    });
  });

  it('khong ban ve tongSoTrang am hoac 0', () => {
    expect(chuanHoaTrang({ content: [], tongSoPhanTu: 0, tongSoTrang: 0 }).tongSoTrang).toBe(1);
    expect(chuanHoaTrang(null).tongSoTrang).toBe(1);
    expect(chuanHoaTrang(undefined).content).toEqual([]);
  });
});
