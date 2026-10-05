import { Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import { apiClient, goiApi } from './api/client';

// BR-NOTI: Hiển thị thông báo ngay cả khi app đang mở (mặc định Expo bỏ qua).
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

// BR-NOTI: Đăng ký Expo Push Token lên backend sau khi đăng nhập.
// Bỏ qua trên web và mọi lỗi (quyền bị từ chối, không có mạng...) —
// đăng nhập và dùng app không bao giờ bị chặn vì push.
export async function dangKyPushToken(): Promise<void> {
  if (Platform.OS === 'web') return;
  try {
    const quyenHienTai = await Notifications.getPermissionsAsync();
    let trangThai = quyenHienTai.status;
    if (trangThai !== 'granted') {
      const xinQuyen = await Notifications.requestPermissionsAsync();
      trangThai = xinQuyen.status;
    }
    if (trangThai !== 'granted') return;
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
      });
    }
    const { data: token } = await Notifications.getExpoPushTokenAsync();
    if (!token) return;
    await goiApi<unknown>(
      apiClient
        .post('notifications/tokens', { json: { token, platform: Platform.OS } })
        .json(),
    );
  } catch {
    // Bỏ qua — push là tính năng phụ
  }
}
