import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

// ------------------------------------------------------------
// BÀI TẬP 1 (Mức dễ) - Controlled Component
// Màn hình nhập họ tên, hiển thị lại "Bạn đã nhập: ..."
// ------------------------------------------------------------
export default function Bai1Screen() {
  const [name, setName] = useState(''); // state quản lý giá trị input

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Nhập họ tên của bạn:</Text>

      <TextInput
        style={styles.input}
        placeholder="Ví dụ: Nguyễn Văn A"
        placeholderTextColor="#aaa"
        value={name}            // Controlled: value lấy từ state
        onChangeText={setName}  // mỗi lần gõ -> cập nhật state
      />

      <Text style={styles.result}>Bạn đã nhập: {name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  label: { fontSize: 16, marginBottom: 8 },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  result: { fontSize: 18, fontWeight: '600', color: '#2c3e50' },
});
