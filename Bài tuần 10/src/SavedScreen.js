import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@user_info';

/**
 * BÀI TẬP 2 — Màn hình "Saved data": đọc lại thông tin đã lưu trong AsyncStorage.
 */
export default function SavedScreen({ onBack }) {
  const [data, setData] = useState(null);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY).then(json => {
      if (json) setData(JSON.parse(json));
    });
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Dữ liệu đã lưu</Text>

      {data ? (
        <View>
          {data.avatar ? <Image source={{ uri: data.avatar }} style={styles.avatar} /> : null}
          <Text style={styles.text}>Tên người dùng: {data.name}</Text>
        </View>
      ) : (
        <Text style={styles.text}>Chưa có dữ liệu nào được lưu.</Text>
      )}

      <TouchableOpacity style={styles.button} onPress={onBack}>
        <Text style={styles.buttonText}>Quay lại</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  title: { fontSize: 18, fontWeight: '700', color: '#111', marginBottom: 16 },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignSelf: 'center',
    marginBottom: 12,
  },
  text: { fontSize: 15, color: '#111', textAlign: 'center' },
  button: {
    backgroundColor: '#2563eb',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonText: { color: '#fff', fontWeight: '700' },
});
