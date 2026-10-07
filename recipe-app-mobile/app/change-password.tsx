import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import { Controller, useForm } from 'react-hook-form';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { ChevronLeft, KeyRound, Lock } from 'lucide-react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { NutBam } from '../src/components/ui/NutBam';
import { ONhapLieu } from '../src/components/ui/ONhapLieu';
import { TitleText } from '../src/components/ui/VanBan';
import { doiMatKhau } from '../src/lib/api/auth';
import { doiMatKhauSchema, type DoiMatKhauForm } from '../src/lib/validation/schemas';

// Task 3.2: Đổi mật khẩu — form 3 field khớp ChangePasswordDto backend.
// Lỗi mật khẩu cũ sai từ backend trả `[AUTH-14]` -> hiện message trực tiếp.
export default function ManHinhDoiMatKhau() {
  const router = useRouter();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<DoiMatKhauForm>({ resolver: zodResolver(doiMatKhauSchema) });

  const mutation = useMutation({
    mutationFn: (duLieu: DoiMatKhauForm) => doiMatKhau(duLieu.matKhauHienTai, duLieu.matKhauMoi),
    onSuccess: () => {
      Alert.alert('Thành công', 'Mật khẩu đã được đổi. Lần đăng nhập sau hãy dùng mật khẩu mới.', [
        { text: 'OK', onPress: () => router.back() },
      ]);
    },
  });

  const guiDi = handleSubmit((duLieu) => mutation.mutate(duLieu));

  return (
    <SafeAreaView className="flex-1 bg-mist">
      <ScrollView className="flex-1 px-4 pt-4" showsVerticalScrollIndicator={false}>
        <View className="flex-row items-center gap-2">
          <Pressable accessibilityRole="button" accessibilityLabel="Quay lại" onPress={() => router.back()}>
            <ChevronLeft size={24} color="#1A1A2E" />
          </Pressable>
          <TitleText kichThuoc="2xl">Đổi mật khẩu</TitleText>
        </View>

        <View className="mt-4 rounded-3xl bg-white p-4 shadow-sm">
          <Controller
            control={control}
            name="matKhauHienTai"
            render={({ field: { value, onChange } }) => (
              <ONhapLieu
                nhan="Mật khẩu hiện tại"
                giaTri={value ?? ''}
                khiDoi={onChange}
                anChu
                goiY="Mật khẩu đang dùng"
                loi={errors.matKhauHienTai?.message}
                bieuTuong={<KeyRound size={20} color="#97A2B0" />}
              />
            )}
          />
          <Controller
            control={control}
            name="matKhauMoi"
            render={({ field: { value, onChange } }) => (
              <ONhapLieu
                nhan="Mật khẩu mới"
                giaTri={value ?? ''}
                khiDoi={onChange}
                anChu
                goiY="Hoa + thường + số, tối thiểu 8 ký tự"
                loi={errors.matKhauMoi?.message}
                className="mt-4"
                bieuTuong={<Lock size={20} color="#97A2B0" />}
              />
            )}
          />
          <Controller
            control={control}
            name="xacNhanMatKhau"
            render={({ field: { value, onChange } }) => (
              <ONhapLieu
                nhan="Xác nhận mật khẩu mới"
                giaTri={value ?? ''}
                khiDoi={onChange}
                anChu
                goiY="Nhập lại mật khẩu mới"
                loi={errors.xacNhanMatKhau?.message}
                className="mt-4"
                bieuTuong={<Lock size={20} color="#97A2B0" />}
              />
            )}
          />

          {mutation.isError ? (
            <Text className="mt-3 text-left text-sm text-red-600">
              {(mutation.error as Error)?.message ?? 'Đổi mật khẩu thất bại'}
            </Text>
          ) : null}
        </View>

        <NutBam
          tieuDe="Đổi mật khẩu"
          khiBam={guiDi}
          dangTai={mutation.isPending}
          className="mt-4 py-4"
        />
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}