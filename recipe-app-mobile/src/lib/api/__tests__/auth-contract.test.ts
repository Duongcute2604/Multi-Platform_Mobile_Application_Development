/**
 * Contract với backend thật: tên field tiếng Anh + đường dẫn/verb đúng.
 *
 * Mobile từng viết theo backend tiếng Việt (matKhau, tenHienThi) nên mọi
 * request bị ValidationPipe chặn với `forbidNonWhitelisted`. Test ở đây khoá
 * lại đúng tên field backend nhận — đổi tên là test đỏ.
 */
import { dangNhap, dangKy, doiMatKhau, layThongTinNguoiDung, quenMatKhau } from '../auth';

jest.mock('../../auth/tokenManager', () => ({
  layAccessToken: jest.fn(async () => 'token'),
  lamMoiAccessToken: jest.fn(async () => 'token-moi'),
  xoaTokens: jest.fn(async () => {}),
}));

let bodyDaGui: unknown = null;
let methodDaGui = '';
let urlDaGui = '';

function mockJson(duLieu: unknown, status = 200) {
  bodyDaGui = null;
  global.fetch = jest.fn(async (input: unknown, init?: { method?: string }) => {
    const req = input as Request;
    methodDaGui = init?.method ?? req.method;
    urlDaGui = req.url;
    // GET không có body — đọc .json() lúc đó sẽ throw và làm hỏng test khác
    if (methodDaGui !== 'GET') bodyDaGui = await req.clone().json();
    return new Response(JSON.stringify(duLieu), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }) as unknown as typeof fetch;
}

const NGUOI_DUNG = {
  id: 'u1',
  email: 'demo@cookbook.vn',
  displayName: 'Bếp Nhà',
  role: 'USER',
};

describe('dangNhap - phai gui field tieng Anh backend mong', () => {
  it('gui { email, password } chu khong phai { email, matKhau }', async () => {
    mockJson({ success: true, data: { user: NGUOI_DUNG, tokens: { accessToken: 'a', refreshToken: 'r', expiresIn: 900 } }, error: null });

    await dangNhap({ email: 'demo@cookbook.vn', matKhau: 'DemoPass123' } as never);

    expect(bodyDaGui).toEqual({ email: 'demo@cookbook.vn', password: 'DemoPass123' });
    expect(methodDaGui).toBe('POST');
    expect(urlDaGui).toContain('auth/login');
  });

  it('doc ra tokens.accessToken / tokens.refreshToken', async () => {
    mockJson({ success: true, data: { user: NGUOI_DUNG, tokens: { accessToken: 'a', refreshToken: 'r', expiresIn: 900 } }, error: null });

    const tokens = await dangNhap({ email: 'demo@cookbook.vn', password: 'DemoPass123' } as never);

    expect(tokens.accessToken).toBe('a');
    expect(tokens.refreshToken).toBe('r');
  });
});

describe('dangKy - phai gui displayName chu khong phai tenHienThi', () => {
  it('gui { email, password, displayName }', async () => {
    mockJson({ success: true, data: { user: NGUOI_DUNG, tokens: { accessToken: 'a', refreshToken: 'r', expiresIn: 900 } }, error: null });

    await dangKy({ email: 'moi@cookbook.vn', matKhau: 'MatKhau123', tenHienThi: 'Bếp Mới' } as never);

    expect(bodyDaGui).toEqual({
      email: 'moi@cookbook.vn',
      password: 'MatKhau123',
      displayName: 'Bếp Mới',
    });
  });
});

describe('layThongTinNguoiDung - doc field tieng Anh', () => {
  it('tra ve user voi displayName + role', async () => {
    mockJson({ success: true, data: NGUOI_DUNG, error: null });

    const user = await layThongTinNguoiDung();

    expect(user.displayName).toBe('Bếp Nhà');
    expect(user.role).toBe('USER');
    expect(urlDaGui).toContain('auth/me');
  });
});

describe('quenMatKhau', () => {
  it('gui email va nhan message chung', async () => {
    mockJson({ success: true, data: { message: 'Nếu email này đã đăng ký...' }, error: null });

    const ketQua = await quenMatKhau('demo@cookbook.vn');

    expect(bodyDaGui).toEqual({ email: 'demo@cookbook.vn' });
    expect(urlDaGui).toContain('auth/forgot-password');
    expect(ketQua).toContain('đăng ký');
  });
});

describe('doiMatKhau - Task 3.2', () => {
  it('POST auth/change-password voi body { currentPassword, newPassword }', async () => {
    mockJson({ success: true, data: null, error: null });

    await doiMatKhau('MatKhauCu123', 'MatKhauMoi123');

    expect(bodyDaGui).toEqual({ currentPassword: 'MatKhauCu123', newPassword: 'MatKhauMoi123' });
    expect(methodDaGui).toBe('POST');
    expect(urlDaGui).toContain('auth/change-password');
  });
});