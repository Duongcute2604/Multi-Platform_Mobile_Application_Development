import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@user_info';

/**
 * BÀI TẬP 2 — Chọn ảnh (Image Picker) và lưu 1 thông tin (tên) vào AsyncStorage.
 * Sau khi lưu sẽ chuyển sang màn hình "Saved data" để đọc lại.
 */
export default function SaveScreen({ onSaved }) {
  const [name, setName] = useState('');
  const [avatar, setAvatar] = useState(null); // uri ảnh đã chọn

  const pickImage = async () => {
    // Xin quyền truy cập thư viện ảnh
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Thông báo', 'Bạn cần cho phép truy cập ảnh trong Cài đặt.');
      return;
    }
    // Chọn ảnh từ thư viện
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      setAvatar(result.assets[0].uri);
    }
  };

  const save = async () => {
    if (!name.trim()) {
      Alert.alert('Thông báo', 'Vui lòng nhập tên người dùng.');
      return;
    }
    // Lưu thông tin vào AsyncStorage
    await AsyncStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ name: name.trim(), avatar }),
    );
    onSaved();
  };

  return (
    <View style={styles.container}>
      {avatar ? (
        <Image source={{ uri: avatar }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatar, styles.avatarEmpty]}>
          <Text style={{ color: '#94a3b8' }}>Chưa chọn ảnh</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={pickImage}>
        <Text style={styles.buttonText}>Chọn ảnh từ thư viện</Text>
      </TouchableOpacity>

      <Text style={styles.label}>Tên người dùng</Text>
      <TextInput
        style={styles.input}
        placeholder="Nguyễn Văn A"
        value={name}
        onChangeText={setName}
      />

      <TouchableOpacity style={[styles.button, styles.saveButton]} onPress={save}>
        <Text style={styles.buttonText}>Lưu thông tin</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignSelf: 'center',
    marginBottom: 12,
  },
  avatarEmpty: {
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  saveButton: { backgroundColor: '#16a34a', marginTop: 12 },
  buttonText: { color: '#fff', fontWeight: '700' },
  label: { fontSize: 14, fontWeight: '600', color: '#334155' },
  input: {
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginTop: 6,
    fontSize: 15,
  },
});
