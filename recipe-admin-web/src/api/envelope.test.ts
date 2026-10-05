/**
 * Test bọc envelope của backend ở tầng axios.
 *
 * Backend bật ResponseInterceptor nên mọi response thành công có dạng
 * `{ success, data, error }`. Web admin đọc `res.data` ở ~30 chỗ, nên ta bóc
 * envelope trong interceptor thay vì sửa từng trang. Test khoá lại hợp đồng:
 * sửa client.ts mà quên bóc envelope thì toàn bộ trang rỗng dữ liệu.
 */
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { apiClient } from './client';

beforeEach(() => {
  vi.restoreAllMocks();
});

/** Adapter trả sẵn body + status để kiểm tra interceptor bóc thế nào. */
function adapterTra(body: unknown, status = 200) {
  return async (config: any) => ({ data: body, status, statusText: 'OK', headers: {}, config }) as any;
}

describe('apiClient - boc envelope', () => {
  it('boc {success,data,error} thanh payload that', async () => {
    const orig = apiClient.defaults.adapter;
    apiClient.defaults.adapter = adapterTra({
      success: true,
      data: [{ id: 'c1', ten: 'Món Việt' }],
      error: null,
    });

    const res = await apiClient.get('/categories');

    expect(res.data).toEqual([{ id: 'c1', ten: 'Món Việt' }]);
    apiClient.defaults.adapter = orig;
  });

  it('boc duoc object phan trang (content/noiDung) ma khong doi hinh dang ben trong', async () => {
    const orig = apiClient.defaults.adapter;
    const noiDung = { noiDung: [], tongSoPhanTu: 0, tongSoTrang: 0 };
    apiClient.defaults.adapter = adapterTra({ success: true, data: noiDung, error: null });

    const res = await apiClient.get('/meal-plans');

    expect(res.data).toEqual(noiDung);
    apiClient.defaults.adapter = orig;
  });

  it('data null -> tra null (khong undefined)', async () => {
    const orig = apiClient.defaults.adapter;
    apiClient.defaults.adapter = adapterTra({ success: true, data: null, error: null });

    const res = await apiClient.delete('/categories/x');

    expect(res.data).toBeNull();
    apiClient.defaults.adapter = orig;
  });

  it('response KHONG phai envelope -> giu nguyen body (tuong thich backend cu)', async () => {
    const orig = apiClient.defaults.adapter;
    const raw = [{ id: 'c1' }];
    apiClient.defaults.adapter = adapterTra(raw);

    const res = await apiClient.get('/categories');

    expect(res.data).toEqual(raw);
    apiClient.defaults.adapter = orig;
  });

  it('loi 400: dua message tieng Viet tu error.message len error.response.data', async () => {
    const orig = apiClient.defaults.adapter;
    apiClient.defaults.adapter = async (config: any) => {
      throw {
        config,
        response: {
          status: 400,
          statusText: 'Bad Request',
          data: { success: false, data: null, error: { code: 'VAL-00', message: '[FO-05] Danh sách món không được rỗng' } },
        },
      };
    };

    await expect(apiClient.post('/food-compatibility/check', {})).rejects.toMatchObject({
      response: {
        data: {
          message: '[FO-05] Danh sách món không được rỗng',
          code: 'VAL-00',
        },
      },
    } as any);

    apiClient.defaults.adapter = orig;
  });
});