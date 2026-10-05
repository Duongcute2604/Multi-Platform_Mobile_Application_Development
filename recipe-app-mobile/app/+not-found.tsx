import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';
import { TitleText } from '../src/components/ui/VanBan';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Không tìm thấy' }} />
      <View className="flex-1 items-center justify-center bg-white p-5">
        <TitleText canLe="giua" kichThuoc="2xl">
          Trang này không tồn tại.
        </TitleText>
        <Link href="/(tabs)" className="mt-4 py-2">
          <Text className="text-left text-sm text-accent-dark">Về trang chủ</Text>
        </Link>
      </View>
    </>
  );
}
