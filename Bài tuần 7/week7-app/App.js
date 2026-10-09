import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import Bai1Screen from './src/screens/Bai1Screen';
import Bai2Screen from './src/screens/Bai2Screen';
import Bai3Screen from './src/screens/Bai3Screen';

// Danh sách 3 bài thực hành buổi 7
const TABS = [
  { key: 'bai1', label: 'Bài 1', screen: Bai1Screen },
  { key: 'bai2', label: 'Bài 2', screen: Bai2Screen },
  { key: 'bai3', label: 'Bài 3', screen: Bai3Screen },
];

export default function App() {
  const [tab, setTab] = useState('bai1');
  const Screen = TABS.find((t) => t.key === tab).screen;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />

      {/* Thanh chuyển bài đơn giản (không cần thư viện navigation) */}
      <View style={styles.tabbar}>
        {TABS.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, tab === t.key && styles.tabActive]}
            onPress={() => setTab(t.key)}
          >
            <Text style={[styles.tabText, tab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.body}>
        <Screen />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#f2f2f2' },
  tabbar: { flexDirection: 'row', backgroundColor: '#fff', padding: 8 },
  tab: {
    flex: 1,
    paddingVertical: 10,
    marginHorizontal: 4,
    borderRadius: 8,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
  },
  tabActive: { backgroundColor: '#2e86de' },
  tabText: { color: '#2c3e50', fontWeight: '600' },
  tabTextActive: { color: '#fff' },
  body: { flex: 1 },
});
