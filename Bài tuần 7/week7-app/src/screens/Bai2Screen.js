import React from 'react';
import { ScrollView, Text, StyleSheet } from 'react-native';
import UserProfile from '../components/UserProfile';

// ------------------------------------------------------------
// BÀI TẬP 2 (Mức trung bình) - Lồng component
// Avatar + UserProfile, hiển thị >= 2 hồ sơ người dùng
// ------------------------------------------------------------
export default function Bai2Screen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Danh sách hồ sơ người dùng</Text>

      <UserProfile
        name="Nguyễn Văn A"
        bio="Lập trình viên React Native"
        profileImage="https://i.pravatar.cc/150?img=1"
      />
      <UserProfile
        name="Trần Thị B"
        bio="Nhà thiết kế UI/UX"
        profileImage="https://i.pravatar.cc/150?img=5"
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 12,
  },
});
