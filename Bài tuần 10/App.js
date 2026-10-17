import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native';

import PostListScreen from './src/PostListScreen';
import SaveScreen from './src/SaveScreen';
import SavedScreen from './src/SavedScreen';

/**
 * App gồm 2 bài tập:
 *  - Tab "Bài tập 1": gọi API JSONPlaceholder, hiển thị danh sách bài viết
 *  - Tab "Bài tập 2": chọn ảnh + lưu tên vào AsyncStorage, màn hình "Saved data" đọc lại
 */
export default function App() {
  const [tab, setTab] = useState(1);
  const [saved, setSaved] = useState(false); // Bài tập 2: đã lưu chưa

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tabItem, tab === 1 && styles.tabActive]}
          onPress={() => setTab(1)}
        >
          <Text style={[styles.tabLabel, tab === 1 && styles.tabLabelActive]}>Bài tập 1</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabItem, tab === 2 && styles.tabActive]}
          onPress={() => setTab(2)}
        >
          <Text style={[styles.tabLabel, tab === 2 && styles.tabLabelActive]}>Bài tập 2</Text>
        </TouchableOpacity>
      </View>

      {tab === 1 && <PostListScreen />}

      {tab === 2 &&
        (saved ? (
          <SavedScreen onBack={() => setSaved(false)} />
        ) : (
          <SaveScreen onSaved={() => setSaved(true)} />
        ))}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  tabBar: { flexDirection: 'row', borderBottomWidth: 1, borderBottomColor: '#eee' },
  tabItem: { flex: 1, alignItems: 'center', paddingVertical: 12 },
  tabActive: { borderBottomWidth: 2, borderBottomColor: '#2563eb' },
  tabLabel: { fontSize: 15, color: '#888' },
  tabLabelActive: { color: '#2563eb', fontWeight: '700' },
});
