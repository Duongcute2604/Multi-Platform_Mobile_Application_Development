import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { datMuc, layMuc, xoaMuc } from '../lib/auth/khoLuuTru';

export type CheDoSangToi = 'sang' | 'toi' | 'he-thong';

export type DinhDangNgay = 'DD/MM/YYYY' | 'MM/DD/YYYY' | 'YYYY-MM-DD';

interface UiState {
  cheDoSangToi: CheDoSangToi;
  datCheDoSangToi: (cheDo: CheDoSangToi) => void;
  dinhDangNgay: DinhDangNgay;
  datDinhDangNgay: (dinhDang: DinhDangNgay) => void;
  // Task 3.1: toggle thật — giá trị lưu qua persist, web không crash khi SecureStore lỗi
  thongBaoNacGioNau: boolean;
  datThongBaoNacGioNau: (bat: boolean) => void;
  thongBaoNacDiCho: boolean;
  datThongBaoNacDiCho: (bat: boolean) => void;
}

// SecureStore chỉ có trên native; trên web (demo Expo web) API này ném lỗi.
// Persist là best-effort: bọc try/catch, lỗi thì bỏ qua (giữ in-memory trong phiên).
const nhoKienTri = createJSONStorage(() => ({
  getItem: async (khoa: string): Promise<string | null> => {
    try {
      return await layMuc(khoa);
    } catch {
      return null;
    }
  },
  setItem: async (khoa: string, giaTri: string): Promise<void> => {
    try {
      await datMuc(khoa, giaTri);
    } catch {
      // nuốt lỗi — web không crash
    }
  },
  removeItem: async (khoa: string): Promise<void> => {
    try {
      await xoaMuc(khoa);
    } catch {
      // nuốt lỗi — web không crash
    }
  },
}));

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      cheDoSangToi: 'he-thong',
      datCheDoSangToi: (cheDoSangToi) => set({ cheDoSangToi }),
      dinhDangNgay: 'DD/MM/YYYY',
      datDinhDangNgay: (dinhDangNgay) => set({ dinhDangNgay }),
      thongBaoNacGioNau: true,
      datThongBaoNacGioNau: (bat) => set({ thongBaoNacGioNau: bat }),
      thongBaoNacDiCho: false,
      datThongBaoNacDiCho: (bat) => set({ thongBaoNacDiCho: bat }),
    }),
    {
      name: 'ui-tu-chon',
      storage: nhoKienTri,
    },
  ),
);