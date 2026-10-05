import { useEffect, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { CheckCircle2, Loader2, X, AlertTriangle, Check } from 'lucide-react-native';
import { apiClient } from '../src/lib/api/client';
import { BottomSheet } from '../src/components/ui/BottomSheet';
import { NutBam } from '../src/components/ui/NutBam';
import { ONhapLieu } from '../src/components/ui/ONhapLieu';
import { CaptionText, BodyText, TitleText } from '../src/components/ui/VanBan';
import { useAuthStore } from '../src/stores/authStore';

interface KetQuaTuongTac {
  mon1: string;
  mon2: string;
  mucDo: 'KY' | 'DOC' | 'OK';
  nguonThamKhao: string;
}

export default function ManHinhKiemTraTuongTac() {
  const [danhSachMon, setDanhSachMon] = useState<string>('');
  const [ketQua, setKetQua] = useState<KetQuaTuongTac[]>([]);
  const [dangTai, setDangTai] = useState(false);
  const [loi, setLoi] = useState<string | null>(null);
  const [hienThiKetQua, setHienThiKetQua] = useState(false);
  const { accessToken } = useAuthStore();

  const kiemTraTuongTac = async () => {
    const danhSach = danhSachMon.trim().split('\n').map(m => m.trim()).filter(m => m.length > 0);
    
    if (danhSach.length < 2) {
      setLoi('Vui lòng nhập ít nhất 2 món để kiểm tra tương tác');
      return;
    }

    setDangTai(true);
    setLoi(null);
    setKetQua([]);

    try {
      const res = await apiClient.post('/food-check', { items: danhSach }, {
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : {},
      });
      
      setKetQua(res.data);
      setHienThiKetQua(true);
      setLoi(null);
    } catch (err: any) {
      setLoi(err.response?.data?.message || 'Có lỗi xảy ra khi kiểm tra');
      setHienThiKetQua(false);
    } finally {
      setDangTai(false);
    }
  };

  const xoaKetQua = () => {
    setDanhSachMon('');
    setKetQua([]);
    setHienThiKetQua(false);
    setLoi(null);
  };

  const layMauSac = (mucDo: string) => {
    switch (mucDo) {
      case 'KY': return '#DC2626'; // red-600
      case 'DOC': return '#EA580C'; // orange-600
      case 'OK': return '#16A34A'; // green-600
      default: return '#6B7280'; // gray-500
    }
  };

  const layIcon = (mucDo: string) => {
    switch (mucDo) {
      case 'KY': return <AlertTriangle size={20} color="#DC2626" />;
      case 'DOC': return <AlertTriangle size={20} color="#EA580C" />;
      case 'OK': return <CheckCircle2 size={20} color="#16A34A" />;
      default: return <CheckCircle2 size={20} color="#6B7280" />;
    }
  };

  const layNhomTen = (mucDo: string) => {
    switch (mucDo) {
      case 'KY': return 'KỴ (Tuyệt đối không dùng chung)';
      case 'DOC': return 'ĐỘC (Có hại khi dùng chung)';
      case 'OK': return 'AN TOÀN (Có thể dùng chung)';
      default: return 'Không xác định';
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-mist">
      <View className="flex-1">
        <View className="px-4 pb-2 pt-4">
          <View className="mb-6">
            <Text className="text-center font-serif text-3xl font-black text-primary">
              Kiểm tra tương tác
            </Text>
            <Text className="mt-1 text-center text-neutral-600 text-base">
              Nhập danh sách món để kiểm tra tương tác Kỵ/Độc
            </Text>
          </View>

          <View className="mb-4">
            <ONhapLieu
              giaTri={danhSachMon}
              khiDoi={setDanhSachMon}
              goiY="Nhập mỗi dòng 1 món (VD: Tôm\nNước cam\nThịt bò)"
              soDong={6}
              placeholder="VD:\nTôm\nNước cam\nThịt bò\nHành tây"
            />
            <View className="mt-2 flex-row gap-2">
              <NutBam
                tieuDe="Kiểm tra"
                khiBam={kiemTraTuongTac}
                dangTai={dangTai}
                className="flex-1"
                icon={<Loader2 size={18} color="white" />}
              />
              {danhSachMon.trim() && (
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Xóa kết quả"
                  onPress={xoaKetQua}
                  className="flex-1"
                >
                  <NutBam tieuDe="Xóa" bienThe="phu" />
                </Pressable>
              )}
            </View>
            
            {loi && (
              <View className="mt-3 p-3 rounded-lg bg-red-50 border border-red-200">
                <View className="flex-row items-center gap-2">
                  <AlertTriangle size={20} color="#DC2626" />
                  <Text className="text-red-700 flex-1">{loi}</Text>
                </View>
              </View>
            )}
          </View>
        </View>

        {hienThiKetQua && (
          <View className="flex-1 px-4 pb-4">
            <View className="mb-4">
              <View className="flex-row items-center justify-between mb-3">
                <TitleText>Kết quả kiểm tra</TitleText>
                <Text className="text-sm text-neutral-500">
                  {ketQua.length} cặp món
                </Text>
              </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              {ketQua.map((item, index) => (
                <Pressable
                  key={`${item.mon1}-${item.mon2}-${index}`}
                  onPress={() => {
                    // Could show detail modal here
                  }}
                  className="mb-3"
                >
                  <View className="bg-white rounded-xl border shadow-sm overflow-hidden">
                    <View className="p-4">
                      <View className="flex-row items-start gap-3">
                        <View className="flex-1">
                          <View className="flex-row items-center gap-2 mb-2">
                            {layIcon(item.mucDo)}
                            <View className="flex-row items-center gap-1">
                              <View
                                className="w-2 h-2 rounded-full"
                                style={{ backgroundColor: layMauSac(item.mucDo) }}
                              />
                              <Text className="text-sm font-semibold" style={{ color: layMauSac(item.mucDo) }}>
                                {item.mucDo}
                              </Text>
                            </View>
                          </View>
                          <View className="flex-row items-center gap-2 mb-1">
                            <Text className="text-base font-medium text-neutral-900">{item.mon1}</Text>
                            <Text className="text-neutral-400">+</Text>
                            <Text className="text-base font-medium text-neutral-900">{item.mon2}</Text>
                          </View>
                        </View>
                        <View className="ml-auto items-end">
                          <Text className="text-xs text-neutral-500">{layNhomTen(item.mucDo)}</Text>
                        </View>
                      </View>
                      
                      <View className="mt-3 pt-3 border-t border-neutral-100">
                        <View className="flex-row items-center gap-2">
                          <Check size={14} color="#6B7280" />
                          <CaptionText className="text-neutral-600">
                            Nguồn: {item.nguonThamKhao}
                          </CaptionText>
                        </View>
                      </View>
                    </View>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        )}

        {!hienThiKetQua && !dangTai && !danhSachMon.trim() && (
          <View className="flex-1 items-center justify-center px-4">
            <View className="items-center">
              <View className="w-20 h-20 rounded-full bg-neutral-100 items-center justify-center mb-4">
                <CheckCircle2 size={40} color="#9CA3AF" />
              </View>
              <TitleText canLe="giua">Sẵn sàng kiểm tra</TitleText>
              <BodyText canLe="giua" className="mt-2 text-neutral-500 max-w-[280px]">
                Nhập danh sách món ăn (mỗi dòng 1 món) và nhấn "Kiểm tra" để xem tương tác Kỵ/Độc/OK
              </BodyText>
              <View className="mt-6 p-4 bg-neutral-50 rounded-xl">
                <CaptionText className="font-bold mb-2">Ví dụ món thường gặp:</CaptionText>
                <View className="flex-row flex-wrap gap-2 justify-center">
                  {['Tôm', 'Nước cam', 'Thịt bò', 'Hành tây', 'Rau muống', 'Sữa', 'Trứng', 'Cà phê'].map((mon) => (
                    <Pressable
                      key={mon}
                      onPress={() => setDanhSachMon((prev) => prev.trim() ? `${prev.trim()}\n${mon}` : mon)}
                      className="bg-white px-3 py-1.5 rounded-full border border-neutral-200"
                    >
                      <CaptionText>{mon}</CaptionText>
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          </View>
        )}
      </View>
    </SafeAreaView>
  );
}