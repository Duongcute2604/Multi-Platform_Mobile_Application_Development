import React, { useState } from 'react';
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import LoginScreen from './src/screens/LoginScreen';
import ProfileSettingsScreen from './src/screens/ProfileSettingsScreen';
import { colors } from './src/theme';

export default function App() {
  const [screen, setScreen] = useState('login');

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor={colors.background} />

      {screen === 'login' ? <LoginScreen /> : <ProfileSettingsScreen />}

      {/* Thanh chuyển màn hình phục vụ demo - có thể xoá khi nộp bài */}
      <View style={styles.switcher}>
        <TouchableOpacity
          style={[styles.pill, screen === 'login' && styles.pillActive]}
          activeOpacity={0.8}
          onPress={() => setScreen('login')}
        >
          <Text style={[styles.pillText, screen === 'login' && styles.pillTextActive]}>
            Bài 1 - Login
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.pill, screen === 'profile' && styles.pillActive]}
          activeOpacity={0.8}
          onPress={() => setScreen('profile')}
        >
          <Text style={[styles.pillText, screen === 'profile' && styles.pillTextActive]}>
            Bài 2 - Profile + Settings
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
  },
  switcher: {
    position: 'absolute',
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  pill: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderWidth: 1,
    borderColor: colors.border,
  },
  pillActive: {
    backgroundColor: colors.text,
    borderColor: colors.text,
  },
  pillText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.textMuted,
  },
  pillTextActive: {
    color: '#FFFFFF',
  },
});
