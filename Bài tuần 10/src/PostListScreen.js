import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from 'react-native';

/**
 * BÀI TẬP 1 — Gọi API public (JSONPlaceholder) và hiển thị danh sách bài viết.
 * Xử lý: trạng thái đang tải, hiển thị lỗi, hiển thị tiêu đề + nội dung tóm tắt.
 */
export default function PostListScreen() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch('https://jsonplaceholder.typicode.com/posts');
      if (!response.ok) throw new Error(`Lỗi ${response.status}`);
      const data = await response.json();
      setPosts(data);
    } catch (e) {
      setError('Không tải được dữ liệu. Vui lòng kiểm tra kết nối mạng.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Đang tải dữ liệu
  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2563eb" />
        <Text style={styles.message}>Đang tải dữ liệu...</Text>
      </View>
    );
  }

  // Gọi API thất bại
  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  // Gọi API thành công
  return (
    <FlatList
      data={posts}
      keyExtractor={item => String(item.id)}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.body} numberOfLines={2}>
            {item.body}
          </Text>
        </View>
      )}
      contentContainerStyle={styles.list}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 },
  message: { marginTop: 12, color: '#666' },
  errorText: { color: '#dc2626', fontSize: 15, textAlign: 'center' },
  list: { padding: 16 },
  card: {
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  title: { fontSize: 15, fontWeight: '700', color: '#111' },
  body: { fontSize: 13, color: '#555', marginTop: 4, lineHeight: 18 },
});
