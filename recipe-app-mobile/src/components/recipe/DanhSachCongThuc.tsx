import type { FC } from 'react';
import { FlatList, RefreshControl, View } from 'react-native';
import { layUrlAnh } from '../../lib/utils/anh';
import { TheCongThuc, type BienTheCard } from './TheCongThuc';
import { TrangDangTai, TrangLoi, TrangTrong } from '../ui/TrangThai';

/**
 * Chỉ cần 5 field để dựng thẻ — nhờ vậy `DanhSachCongThuc` nhận được cả
 * `CongThuc` đầy đủ lẫn kết quả `GET /recipes/:id/similar` (chỉ có 5 field).
 */
export interface CongThucNgonDong {
  id: string;
  title: string;
  thumbnailUrl: string | null;
  cookTimeMinutes: number;
  servings: number;
  author?: { displayName: string };
}

interface DanhSachCongThucProps {
  duLieu: CongThucNgonDong[];
  dangTai: boolean;
  dangTaiThem?: boolean;
  loi?: string | null;
  coTheTaiThem?: boolean;
  khiTaiThem?: () => void;
  khiLamMoi?: () => void;
  khiChon?: (id: string) => void;
  bienThe?: BienTheCard;
  cot?: number;
}

/** Lớp dịch: backend dùng tên field tiếng Anh, thẻ hiển thị dùng tiếng Việt. */
export function chuyenThanhDuLieuThe(congThuc: CongThucNgonDong) {
  return {
    id: congThuc.id,
    hinhAnh: layUrlAnh(congThuc.thumbnailUrl),
    tenMon: congThuc.title,
    thoiGianNau: congThuc.cookTimeMinutes,
    khauPhan: congThuc.servings,
    // `GET /recipes` không kèm author; chi tiết mới có
    tacGia: congThuc.author?.displayName ?? '',
    tacGiaAvatar: null,
  };
}

export const DanhSachCongThuc: FC<DanhSachCongThucProps> = ({
  duLieu,
  dangTai,
  dangTaiThem = false,
  loi,
  coTheTaiThem = false,
  khiTaiThem,
  khiLamMoi,
  khiChon,
  bienThe = 'large',
  cot = 1,
}) => {
  if (dangTai && duLieu.length === 0) return <TrangDangTai />;
  if (loi && duLieu.length === 0) return <TrangLoi loi={loi} khiThuLai={khiLamMoi} />;

  return (
    <FlatList
      data={duLieu}
      keyExtractor={(item) => item.id}
      numColumns={cot}
      key={cot}
      renderItem={({ item }) => (
        <View className={cot > 1 ? 'flex-1 p-1' : undefined}>
          <TheCongThuc
            duLieu={chuyenThanhDuLieuThe(item)}
            bienThe={bienThe}
            khiBam={khiChon ? () => khiChon(item.id) : undefined}
          />
        </View>
      )}
      onEndReached={() => {
        if (coTheTaiThem && !dangTaiThem) khiTaiThem?.();
      }}
      onEndReachedThreshold={0.5}
      ListFooterComponent={dangTaiThem ? <TrangDangTai thongDiep="Đang tải thêm..." /> : null}
      ListEmptyComponent={
        <TrangTrong tieuDe="Chưa có công thức" moTa="Hãy thử từ khóa khác hoặc tạo món mới" />
      }
      refreshControl={
        khiLamMoi ? <RefreshControl refreshing={dangTai} onRefresh={khiLamMoi} /> : undefined
      }
    />
  );
};
