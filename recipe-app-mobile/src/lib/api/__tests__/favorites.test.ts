import { layDanhSachYeuThich } from '../recipes';
import type { CongThuc, DanhSachTrang } from '../../../types/api';

jest.mock('../../auth/tokenManager', () => ({
  layAccessToken: jest.fn(async () => 'token-hien-tai'),
  lamMoiAccessToken: jest.fn(async () => 'token-moi'),
  xoaTokens: jest.fn(async () => {}),
}));

/** `GET /favorites` trả công thức với tên field tiếng Anh (không kèm author). */
function taoCongThuc(id: string): CongThuc {
  return {
    id,
    title: 'Phở bò',
    description: null,
    thumbnailUrl: null,
    cookTimeMinutes: 30,
    prepTimeMinutes: null,
    servings: 2,
    status: 'APPROVED',
    source: 'LOCAL',
    authorId: 'user-1',
    ingredients: [],
    steps: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

describe('layDanhSachYeuThich', () => {
  it('goi GET favorites va tra ve trang danh sach', async () => {
    const trang: DanhSachTrang<CongThuc> = {
      noiDung: [taoCongThuc('ct-1')],
      tongSoPhanTu: 1,
      tongSoTrang: 1,
    };
    global.fetch = jest.fn(async () =>
      new Response(JSON.stringify({ success: true, data: trang, error: null }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }),
    ) as unknown as typeof fetch;

    const ketQua = await layDanhSachYeuThich({ page: 0, size: 10 });

    expect(ketQua.noiDung).toHaveLength(1);
    expect(ketQua.noiDung[0].title).toBe('Phở bò');
    expect(ketQua.tongSoPhanTu).toBe(1);
    const url = (global.fetch as jest.Mock).mock.calls[0][0] as Request;
    expect(url.url).toContain('favorites');
  });
});