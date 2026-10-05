import { useState } from 'react';
import { ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertTriangle, CheckCircle2 } from 'lucide-react-native';
import { Chip } from '../../src/components/ui/Chip';
import { NutBam } from '../../src/components/ui/NutBam';
import { ONhapLieu } from '../../src/components/ui/ONhapLieu';
import { BodyText, CaptionText, TitleText } from '../../src/components/ui/VanBan';
import { kiemTraTuongTac, tachMonTuChuoi } from '../../src/lib/api/foodCheck';
import { MAU_SAC } from '../../src/constants/cau-hinh';
import type { CapDoTuongTac, CapTayTuongTac, KetQuaTuongTac } from '../../src/types/api';

// BR-FOOD: hiển thị 3 mức, CONFLICT đứng đầu vì an toàn (FO-04)
const MAU_THEO_MUC: Record<CapDoTuongTac, { nhan: string; chu: string; mau: string }> = {
  CONFLICT: { nhan: 'Kỵ / Độc', chu: 'bg-red-100 text-red-700', mau: '#DC2626' },
  HARMONIOUS: { nhan: 'Hợp', chu: 'bg-green-100 text-green-700', mau: '#16A34A' },
  NEUTRAL: { nhan: 'Trung tính', chu: 'bg-neutral-100 text-neutral-600', mau: '#6B7280' },
};

const THU_TU_UU_TIEN: Record<CapDoTuongTac, number> = { CONFLICT: 0, HARMONIOUS: 1, NEUTRAL: 2 };

const MON_GOI_Y = ['Tôm', 'Nước cam', 'Thịt bò', 'Hành tây', 'Sữa', 'Trứng'];

export default function ManHinhKiemTraTuongTac() {
  const [oNhapLieu, setONhapLieu] = useState('');
  const [ketQua, setKetQua] = useState<KetQuaTuongTac | null>(null);
  const [dangTai, setDangTai] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);

  async function kiemTra() {
    const danhSach = tachMonTuChuoi(oNhapLieu);
    // 1 món không tạo ra cặp nào để so - báo trước cho khỏi gọi API vô ích
    if (danhSach.length < 2) {
      setKetQua(null);
      setLoi('Cần ít nhất 2 món để kiểm tra tương tác.');
      return;
    }
    setDangTai(true);
    setLoi(null);
    try {
      setKetQua(await kiemTraTuongTac(danhSach));
    } catch (e) {
      setKetQua(null);
      setLoi(e instanceof Error ? e.message : 'Không kiểm tra được, vui lòng thử lại.');
    } finally {
      setDangTai(false);
    }
  }

  function xoaKetQua() {
    setONhapLieu('');
    setKetQua(null);
    setLoi(null);
  }

  function themMon(mon: string) {
    setONhapLieu((truoc) => (truoc.trim() ? `${truoc.trim()}\n${mon}` : mon));
    setLoi(null);
  }

  const capTay = [...(ketQua?.pairs ?? [])].sort(
    (x, y) => THU_TU_UU_TIEN[x.level] - THU_TU_UU_TIEN[y.level],
  );

  return (
    <SafeAreaView className="flex-1 bg-mist" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ padding: 16, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        <TitleText canLe="giua" kichThuoc="2xl">Kiểm tra tương tác</TitleText>
        <BodyText canLe="giua" className="mt-1 text-neutral-600">
          Nhập từng dòng một món để xem mức Kỵ/Độc, Hợp hay Trung tính.
        </BodyText>

        <View className="mt-4">
          <ONhapLieu
            nhan="Danh sách món / nguyên liệu"
            giaTri={oNhapLieu}
            khiDoi={setONhapLieu}
            goiY={'Tôm\nNước cam\nThịt bò'}
            soDong={5}
          />
          <View className="mt-3 flex-row gap-2">
            <NutBam
              tieuDe={dangTai ? 'Đang kiểm tra...' : 'Kiểm tra'}
              khiBam={kiemTra}
              dangTai={dangTai}
              className="flex-1"
            />
            <NutBam tieuDe="Xóa" bienThe="phu" khiBam={xoaKetQua} className="flex-1" />
          </View>
        </View>

        <View className="mt-3 flex-row flex-wrap gap-2">
          {MON_GOI_Y.map((mon) => (
            // Chip tự là Pressable — bọc thêm Pressable ở ngoài sẽ thành
            // nested Pressable và React Native cảnh báo mỗi lần render.
            <Chip key={mon} nhan={mon} khiBam={() => themMon(mon)} />
          ))}
        </View>

        {loi ? (
          <View className="mt-4 flex-row items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-3">
            <AlertTriangle size={20} color={MAU_THEO_MUC.CONFLICT.mau} />
            <BodyText className="flex-1 text-red-700">{loi}</BodyText>
          </View>
        ) : null}

        {ketQua ? (
          <View className="mt-5">
            <View className="flex-row gap-3">
              <SoLieuTonghop nhan="Kỵ / Độc" giaTri={ketQua.summary.conflicts} mau={MAU_THEO_MUC.CONFLICT.mau} />
              <SoLieuTonghop nhan="Hợp" giaTri={ketQua.summary.harmonious} mau={MAU_THEO_MUC.HARMONIOUS.mau} />
              <SoLieuTonghop nhan="Trung tính" giaTri={ketQua.summary.neutrals} mau={MAU_THEO_MUC.NEUTRAL.mau} />
            </View>

            <View className="mt-4">
              {capTay.map((cap, i) => (
                <TheCapTay key={`${cap.a}-${cap.b}-${i}`} cap={cap} />
              ))}
            </View>

            <CaptionText className="mt-4 text-neutral-500">
              Kết quả dựa trên bảng rule tương tác thực phẩm kèm nguồn tham khảo. Khi một cặp khớp cả
              mức kỵ lẫn mức hợp, hệ thống ưu tiên cảnh báo kỵ.
            </CaptionText>
          </View>
        ) : null}
      </ScrollView>
    </SafeAreaView>
  );
}

function SoLieuTonghop({ nhan, giaTri, mau }: { nhan: string; giaTri: number; mau: string }) {
  return (
    <View className="flex-1 items-center rounded-2xl bg-white p-3 shadow-sm">
      <BodyText dam style={{ color: mau }}>
        {giaTri}
      </BodyText>
      <CaptionText className="mt-0.5">{nhan}</CaptionText>
    </View>
  );
}

function TheCapTay({ cap }: { cap: CapTayTuongTac }) {
  const mau = MAU_THEO_MUC[cap.level];
  return (
    <View className="mb-3 rounded-2xl bg-white p-4 shadow-sm">
      <View className="flex-row items-center gap-2">
        {cap.level === 'CONFLICT' ? (
          <AlertTriangle size={18} color={mau.mau} />
        ) : (
          <CheckCircle2 size={18} color={mau.mau} />
        )}
        <CaptionText className={`rounded-full px-2 py-0.5 ${mau.chu}`}>{mau.nhan}</CaptionText>
      </View>
      <BodyText dam className="mt-2">
        {cap.a} + {cap.b}
      </BodyText>
      {cap.note ? <BodyText className="mt-1 text-neutral-600">{cap.note}</BodyText> : null}
      {cap.source ? (
        <View className="mt-2 flex-row items-center gap-1">
          <CheckCircle2 size={12} color={MAU_SAC.MUTED} />
          <CaptionText>Nguồn: {cap.source}</CaptionText>
        </View>
      ) : null}
    </View>
  );
}