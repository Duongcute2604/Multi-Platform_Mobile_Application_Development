import type { ApiError } from '../client';
import { kiemTraTuongTac, tachMonTuChuoi } from '../foodCheck';

jest.mock('../../auth/tokenManager', () => ({
  layAccessToken: jest.fn(async () => 'token-hien-tai'),
  lamMoiAccessToken: jest.fn(async () => 'token-moi'),
  xoaTokens: jest.fn(async () => {}),
}));

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });
}

/** Ghi lại body request để assert payload gửi đi (ky đã stream sẵn 1 lần). */
let bodyDaGui: unknown = null;

function mockJson(duLieu: unknown, status = 200) {
  bodyDaGui = null;
  global.fetch = jest.fn(async (input: unknown) => {
    bodyDaGui = await (input as Request).clone().json();
    return jsonResponse(duLieu, status);
  }) as unknown as typeof fetch;
}

const KET_QUA_MAU = {
  items: ['Tôm', 'Nước cam'],
  pairs: [
    {
      a: 'Tôm',
      b: 'Nước cam',
      level: 'CONFLICT',
      note: 'Tôm giàu canxi, vitamin C làm giảm hấp thu.',
      source: 'Bài viết dinh dưỡng về thực phẩm giàu canxi',
    },
  ],
  summary: { conflicts: 1, harmonious: 0, neutrals: 0 },
};

describe('tachMonTuChuoi', () => {
  it('tách theo xuống dòng, dấu phẩy, dấu chấm phẩy và bỏ khoảng trắng thừa', () => {
    expect(tachMonTuChuoi(' Tôm ,  Nước cam;\nThịt bò\n\n Rau muống ')).toEqual([
      'Tôm',
      'Nước cam',
      'Thịt bò',
      'Rau muống',
    ]);
  });

  it('chuỗi rỗng hoặc chỉ khoảng trắng -> danh sách rỗng', () => {
    expect(tachMonTuChuoi('')).toEqual([]);
    expect(tachMonTuChuoi('  \n , ; ')).toEqual([]);
  });
});

describe('kiemTraTuongTac', () => {
  it('gọi POST đúng endpoint food-compatibility/check với danh sách món', async () => {
    mockJson({ success: true, data: KET_QUA_MAU, error: null });

    await kiemTraTuongTac(['Tôm', 'Nước cam']);

    const req = (global.fetch as jest.Mock).mock.calls[0][0] as Request;
    expect(req.method).toBe('POST');
    expect(req.url).toContain('food-compatibility/check');
    expect(bodyDaGui).toEqual({ items: ['Tôm', 'Nước cam'] });
  });

  it('trả về đúng cấu trúc pairs + summary để màn hình hiển thị', async () => {
    mockJson({ success: true, data: KET_QUA_MAU, error: null });

    const ketQua = await kiemTraTuongTac(['Tôm', 'Nước cam']);

    expect(ketQua.items).toEqual(['Tôm', 'Nước cam']);
    expect(ketQua.pairs).toHaveLength(1);
    expect(ketQua.pairs[0].level).toBe('CONFLICT');
    expect(ketQua.pairs[0].note).toContain('vitamin C');
    expect(ketQua.pairs[0].source).toBeTruthy();
    expect(ketQua.summary).toEqual({ conflicts: 1, harmonious: 0, neutrals: 0 });
  });

  it('nhận đủ 3 mức CONFLICT / HARMONIOUS / NEUTRAL', async () => {
    mockJson({
      success: true,
      data: {
        items: ['Thịt bò', 'Hành tây', 'Cơm'],
        pairs: [
          { a: 'Thịt bò', b: 'Hành tây', level: 'HARMONIOUS', note: 'Bổ sung vi chất.', source: null },
          { a: 'Cơm', b: 'Thịt bò', level: 'NEUTRAL', note: null, source: null },
        ],
        summary: { conflicts: 0, harmonious: 1, neutrals: 1 },
      },
      error: null,
    });

    const ketQua = await kiemTraTuongTac(['Thịt bò', 'Hành tây', 'Cơm']);

    expect(ketQua.pairs.map((p) => p.level)).toEqual(['HARMONIOUS', 'NEUTRAL']);
  });

  it('ném lỗi khi backend từ chối danh sách rỗng', async () => {
    mockJson(
      {
        success: false,
        data: null,
        error: { code: 'FO-05', message: '[FO-05] Danh sách món không được rỗng' },
      },
      400,
    );

    await expect(kiemTraTuongTac([])).rejects.toMatchObject({
      name: 'ApiError',
      status: 400,
    } as Partial<ApiError>);
  });

  it('ném ApiError với mã lỗi khi envelope success=false', async () => {
    mockJson({
      success: false,
      data: null,
      error: { code: 'FO-05', message: '[FO-05] Danh sách món không được rỗng' },
    });

    await expect(kiemTraTuongTac(['Tôm'])).rejects.toMatchObject({
      name: 'ApiError',
      maLoi: 'FO-05',
    } as Partial<ApiError>);
  });

  it('báo lỗi khi thiếu mạng', async () => {
    global.fetch = jest.fn(async () => {
      throw new Error('offline');
    }) as unknown as typeof fetch;

    await expect(kiemTraTuongTac(['Tôm', 'Nước cam'])).rejects.toThrow('Không thể kết nối máy chủ');
  });
});