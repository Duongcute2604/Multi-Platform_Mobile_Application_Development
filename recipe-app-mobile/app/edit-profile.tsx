import { useRouter } from 'expo-router';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Camera, ChevronLeft, UserRound } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { launchImageLibraryAsync } from 'expo-image-picker';
import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { Avatar } from '../src/components/ui/Avatar';
import { NutBam } from '../src/components/ui/NutBam';
import { ONhapLieu } from '../src/components/ui/ONhapLieu';
import { TitleText, CaptionText } from '../src/components/ui/VanBan';
import { capNhatHoSo } from '../src/lib/api/auth';
import { taiAnhLen } from '../src/lib/api/uploads';
import { khoaTruyVan, queryClient } from '../src/lib/queryClient';
import { suaHoSoSchema, type SuaHoSoForm } from '../src/lib/validation/schemas';
import { useAuthStore } from '../src/stores/authStore';

function dayUrlDayDu(url: string | null | undefined): string | null {
  if (!url) return null;
  return url.startsWith('/') ? url : url;
}

// Task 3.3: Sửa hồ sơ — displayName + avatar (chọn ảnh -> POST /uploads -> URL),
// sau khi lưu cập nhật lại authStore + query hồ sơ để profile tab hiện đúng.
export default function ManHinhSuaHoSo() {
  const router = useRouter();
  const queryClientHooks = useQueryClient();
  const nguoiDung = useAuthStore((s) => s.nguoiDung);
  const datNguoiDung = useAuthStore((s) => s.datNguoiDung);
  const [dangTaiAnh, setDangTaiAnh] = useState(false);
  const [loiAnh, setLoiAnh] = useState<string | null>(null);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SuaHoSoForm>({
    resolver: zodResolver(suaHoSoSchema),
    defaultValues: {
      displayName: nguoiDung?.displayName ?? '',
      avatarUrl: dayUrlDayDu(nguoiDung?.avatarUrl) ?? '',
    },
  });

  const avatarHienTai = watch('avatarUrl') ?? '';

  const chonAnh = async () => {
    const ketQua = await launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (ketQua.canceled || ketQua.assets.length === 0) return;
    setDangTaiAnh(true);
    setLoiAnh(null);
    try {
      const url = await taiAnhLen(ketQua.assets[0].uri);
      setValue('avatarUrl', url, { shouldValidate: true });
    } catch (e) {
      setLoiAnh(e instanceof Error ? e.message : 'Tải ảnh thất bại');
    } finally {
      setDangTaiAnh(false);
    }
  };

  const luu = useMutation({
    mutationFn: (duLieu: SuaHoSoForm) =>
      capNhatHoSo({
        ...(duLieu.displayName !== nguoiDung?.displayName ? { displayName: duLieu.displayName } : {}),
        ...(avatarHienTai && avatarHienTai !== dayUrlDayDu(nguoiDung?.avatarUrl)
          ? { avatarUrl: avatarHienTai }
          : {}),
      }),
    onSuccess: async (hoSo) => {
      if (nguoiDung) {
        datNguoiDung({ ...nguoiDung, displayName: hoSo.displayName, avatarUrl: hoSo.avatarUrl });
      }
      queryClientHooks.setQueryData(khoaTruyVan.nguoiDung.hoSo(), hoSo);
      queryClient.invalidateQueries({ queryKey: khoaTruyVan.nguoiDung.hoSo() });
      Alert.alert('Đã lưu', 'Hồ sơ của bạn đã được cập nhật.', [{ text: 'OK', onPress: () => router.back() }]);
    },
  });

  const guiDi = handleSubmit((duLieu) => luu.mutate(duLieu));

  return (
    <SafeAreaView className="flex-1 bg-mist">
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-2">
          <Pressable accessibilityRole="button" accessibilityLabel="Quay lại" onPress={() => router.back()}>
            <ChevronLeft size={24} color="#1A1A2E" />
          </Pressable>
          <TitleText kichThuoc="2xl">Sửa hồ sơ</TitleText>
        </View>

        <View className="mt-4 rounded-3xl bg-white p-5 shadow-sm">
          <View className="items-center py-2">
            <Avatar nguon={avatarHienTai || null} ten={nguoiDung?.displayName ?? ''} kichThuoc={96} />
            <Pressable
              accessibilityRole="button"
              onPress={chonAnh}
              disabled={dangTaiAnh}
              className="mt-3 flex-row items-center gap-2 rounded-xl border border-primary px-3 py-2"
            >
              <Camera size={16} color="#0A2533" />
              <Text className="text-sm font-semibold text-primary">
                {dangTaiAnh ? 'Đang tải ảnh...' : 'Chọn ảnh đại diện'}
              </Text>
            </Pressable>
            <CaptionText className="mt-1 text-center">JPG/PNG, tối đa 500 ký tự URL</CaptionText>
            {loiAnh ? <Text className="mt-1 text-center text-xs text-red-600">{loiAnh}</Text> : null}
          </View>

          <Controller
            control={control}
            name="displayName"
            render={({ field: { value, onChange } }) => (
              <ONhapLieu
                nhan="Tên hiển thị"
                giaTri={value ?? ''}
                khiDoi={onChange}
                goiY="Tên bạn muốn hiện trong cộng đồng"
                loi={errors.displayName?.message}
                className="mt-4"
                bieuTuong={<UserRound size={20} color="#97A2B0" />}
              />
            )}
          />

          {luu.isError ? (
            <Text className="mt-3 text-left text-sm text-red-600">
              {(luu.error as Error)?.message ?? 'Lưu hồ sơ thất bại'}
            </Text>
          ) : null}
        </View>

        <NutBam
          tieuDe="Lưu thay đổi"
          khiBam={guiDi}
          dangTai={luu.isPending || dangTaiAnh}
          className="mt-4 py-4"
        />
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}