import { act } from 'react';
import { useUiStore } from '../uiStore';

// Task 3.1: toggle thông báo phải thật (đổi giá trị trong store, mặc định đúng)
// và persist best-effort: khi SecureStore lỗi (web / sandbox) KHÔNG được crash.
jest.mock('../../lib/auth/khoLuuTru', () => ({
  datMuc: jest.fn(async () => {
    throw new Error('SecureStore khong kha dung (web)');
  }),
  layMuc: jest.fn(async () => {
    throw new Error('SecureStore khong kha dung (web)');
  }),
  xoaMuc: jest.fn(async () => {
    throw new Error('SecureStore khong kha dung (web)');
  }),
}));

describe('uiStore — thông báo nấu ăn (Task 3.1)', () => {
  beforeEach(() => {
    useUiStore.setState({
      thongBaoNacGioNau: true,
      thongBaoNacDiCho: false,
      cheDoSangToi: 'he-thong',
      dinhDangNgay: 'DD/MM/YYYY',
    });
  });

  it('default: nhắc giờ nấu = true, nhắc đi chợ = false', () => {
    const s = useUiStore.getState();
    expect(s.thongBaoNacGioNau).toBe(true);
    expect(s.thongBaoNacDiCho).toBe(false);
  });

  it('setter thay đổi đúng giá trị từng toggle', () => {
    useUiStore.getState().datThongBaoNacGioNau(false);
    useUiStore.getState().datThongBaoNacDiCho(true);
    const s = useUiStore.getState();
    expect(s.thongBaoNacGioNau).toBe(false);
    expect(s.thongBaoNacDiCho).toBe(true);
  });

  it('toggle không đụng các cài đặt khác (chế độ tối, định dạng ngày)', () => {
    useUiStore.getState().datThongBaoNacGioNau(false);
    useUiStore.getState().datCheDoSangToi('toi');
    const s = useUiStore.getState();
    expect(s.thongBaoNacGioNau).toBe(false);
    expect(s.cheDoSangToi).toBe('toi');
    expect(s.dinhDangNgay).toBe('DD/MM/YYYY');
  });

  it('khi SecureStore lỗi, thao tác toggle không ném lỗi (web không crash)', async () => {
    await expect(
      act(async () => {
        useUiStore.getState().datThongBaoNacGioNau(false);
        await Promise.resolve();
      }),
    ).resolves.not.toThrow();
    expect(useUiStore.getState().thongBaoNacGioNau).toBe(false);
  });
});