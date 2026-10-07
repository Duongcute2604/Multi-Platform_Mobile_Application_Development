/**
 * Contract công thức / bình luận / đánh giá với backend thật.
 *
 * Backend trả tên field tiếng Anh cho công thức (title, description,
 * author) nhưng bình luận lại dùng tiếng Việt (noiDung, tacGia.tenHienThi).
 * Test khoá đúng sự lệch lẫn này để không "đều hoá" nhầm làm hỏng API.
 */
import { danhGiaCongThuc, layBinhLuan, layChiTietCongThuc, layDanhSachCongThuc, taoBinhLuan } from '../recipes';

jest.mock('../../auth/tokenManager', () => ({
  layAccessToken: jest.fn(async () => 'token'),
  lamMoiAccessToken: jest.fn(async () => 'token-moi'),
  xoaTokens: jest.fn(async () => {}),
}));

/** Ghi lại body request để assert payload gửi đi (ky đã stream body một lần). */
let bodyDaGui: unknown = null;

function mockJson(duLieu: unknown, status = 200) {
  bodyDaGui = null;
  global.fetch = jest.fn(async (input: unknown) => {
    const req = input as Request;
    // GET không có body — đọc .json() lúc đó sẽ throw
    if (req.method !== 'GET') bodyDaGui = await req.clone().json();
    return new Response(JSON.stringify(duLieu), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as unknown as typeof fetch;
}

const RECIPE_BACKEND = {
  id: 'r1',
  title: 'Phở bò',
  description: 'Món quen thuộc',
  thumbnailUrl: null,
  cookTimeMinutes: 120,
  prepTimeMinutes: 30,
  servings: 4,
  authorId: 'u1',
  status: 'APPROVED',
  source: 'LOCAL',
  externalId: null,
  rejectionReason: null,
  categoryId: null,
  createdAt: '2026-10-01T00:00:00.000Z',
  updatedAt: '2026-10-01T00:00:00.000Z',
  deletedAt: null,
  author: { displayName: 'Bếp Nhà', email: 'a@b.vn' },
  category: null,
  tags: [],
  ingredients: [
    {
      id: 'i1',
      recipeId: 'r1',
      internalIngredientId: null,
      originalText: '500g thịt bò',
      quantity: '500',
      unit: 'g',
      sortOrder: 1,
      createdAt: '2026-10-01T00:00:00.000Z',
      internalIngredient: null,
    },
  ],
  steps: [
    { id: 's1', recipeId: 'r1', stepOrder: 1, content: 'Rửa thịt', imageUrl: null, createdAt: '2026-10-01T00:00:00.000Z' },
  ],
  nutrition: null,
};

describe('layChiTietCongThuc - doc field tieng Anh cua backend', () => {
  it('parse duoc title/description/author + nguyenLieu/cacBuoc', async () => {
    mockJson({ success: true, data: RECIPE_BACKEND, error: null });

    const ct = await layChiTietCongThuc('r1');

    expect(ct.title).toBe('Phở bò');
    expect(ct.author?.displayName).toBe('Bếp Nhà');
    expect(ct.ingredients[0].originalText).toBe('500g thịt bò');
    expect(ct.steps[0].content).toBe('Rửa thịt');
  });
});

describe('layDanhSachCongThuc - Task 3.4 (sortBy rating/popular)', () => {
  const TRANG = { success: true, data: { content: [RECIPE_BACKEND], totalElements: 1, totalPages: 1 }, error: null };
  let urlCuoi: string;

  function mockJsonVaGhiUrl(duLieu: unknown) {
    global.fetch = jest.fn(async (input: unknown) => {
      urlCuoi = (input as Request).url;
      return new Response(JSON.stringify(duLieu), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as unknown as typeof fetch;
  }

  it('gui sortBy=rating khi noiBat dung', async () => {
    mockJsonVaGhiUrl(TRANG);
    await layDanhSachCongThuc({ sortBy: 'rating', size: 5 });
    expect(urlCuoi).toContain('sortBy=rating');
  });

  it('gui sortBy=popular khi phoBien dung', async () => {
    mockJsonVaGhiUrl(TRANG);
    await layDanhSachCongThuc({ sortBy: 'popular', size: 6 });
    expect(urlCuoi).toContain('sortBy=popular');
  });

  it('khong set sortBy khi goi mac dinh (va van gui page/size)', async () => {
    mockJsonVaGhiUrl(TRANG);
    await layDanhSachCongThuc({ page: 1, size: 10 });
    expect(urlCuoi).toContain('page=1');
    expect(urlCuoi).toContain('size=10');
    expect(urlCuoi).not.toContain('sortBy');
  });
});

describe('layDanhSachCongThuc - Task 3.5 (filter server-side)', () => {
  const TRANG = { success: true, data: { content: [RECIPE_BACKEND], totalElements: 1, totalPages: 1 }, error: null };
  let urlCuoi: string;

  function mockJsonVaGhiUrl(duLieu: unknown) {
    global.fetch = jest.fn(async (input: unknown) => {
      urlCuoi = (input as Request).url;
      return new Response(JSON.stringify(duLieu), {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      });
    }) as unknown as typeof fetch;
  }

  it('gui minCookTime/maxCookTime/servings khi nguoi dung loc', async () => {
    mockJsonVaGhiUrl(TRANG);
    await layDanhSachCongThuc({ minCookTime: 15, maxCookTime: 30, servings: 4 });
    expect(urlCuoi).toContain('minCookTime=15');
    expect(urlCuoi).toContain('maxCookTime=30');
    expect(urlCuoi).toContain('servings=4');
  });

  it('gui dung 1 trong 3 param khi chi loc mot truong', async () => {
    mockJsonVaGhiUrl(TRANG);
    await layDanhSachCongThuc({ maxCookTime: 60 });
    expect(urlCuoi).toContain('maxCookTime=60');
    expect(urlCuoi).not.toContain('minCookTime');
    expect(urlCuoi).not.toContain('servings');
  });
});

describe('binhLuan - backend dung ten tieng Viet', () => {
  const BINH_LUAN = {
    id: 'c1',
    noiDung: 'Ngon thật',
    tacGia: {
      id: 'u1',
      email: 'a@b.vn',
      tenHienThi: 'An',
      anhDaiDien: null,
      vaiTro: 'USER',
      trangThai: 'ACTIVE',
    },
    thoiGianTao: '2026-10-01T00:00:00.000Z',
    soLuongPhanHoi: 0,
  };

  it('layBinhLuan tra { noiDung, tongSoPhanTu } doc duoc', async () => {
    mockJson({ success: true, data: { noiDung: [BINH_LUAN], tongSoPhanTu: 1, tongSoTrang: 1 }, error: null });

    const ds = await layBinhLuan('r1');

    expect(ds.noiDung[0].noiDung).toBe('Ngon thật');
    expect(ds.noiDung[0].tacGia.tenHienThi).toBe('An');
    expect(ds.tongSoPhanTu).toBe(1);
  });

  it('taoBinhLuan gui { noiDung }', async () => {
    mockJson({ success: true, data: BINH_LUAN, error: null });

    const bl = await taoBinhLuan('r1', 'Ngon thật');

    expect(bl.noiDung).toBe('Ngon thật');
    expect(bodyDaGui).toEqual({ noiDung: 'Ngon thật' });
  });
});

describe('danhGiaCongThuc - backend tra diemTrungBinh/tongSoDanhGia', () => {
  it('gui { diem } va doc diemTrungBinh', async () => {
    mockJson({ success: true, data: { diemTrungBinh: 4.5, tongSoDanhGia: 2 }, error: null });

    const kq = await danhGiaCongThuc('r1', 5);

    expect(bodyDaGui).toEqual({ diem: 5 });
    expect(kq.diemTrungBinh).toBe(4.5);
    expect(kq.tongSoDanhGia).toBe(2);
  });
});