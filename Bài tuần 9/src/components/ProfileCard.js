import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, spacing } from '../theme';

// Thẻ hồ sơ: avatar + tên + vai trò + 3 chỉ số + nút Theo dõi.
export default function ProfileCard({ style }) {
  return (
    <View style={[styles.card, style]}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>MA</Text>
      </View>

      <Text style={styles.name}>Nguyễn Minh Anh</Text>
      <Text style={styles.role}>Frontend Developer</Text>

      <View style={styles.stats}>
        <View style={styles.stat}>
          <Text style={styles.statValue}>128</Text>
          <Text style={styles.statLabel}>Bài viết</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>12.5K</Text>
          <Text style={styles.statLabel}>Followers</Text>
        </View>
        <View style={styles.stat}>
          <Text style={styles.statValue}>340</Text>
          <Text style={styles.statLabel}>Following</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Theo dõi</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    padding: spacing.lg,
    alignItems: 'center',
  },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: radius.pill,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '700',
  },
  name: {
    marginTop: spacing.md,
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  role: {
    marginTop: 4,
    fontSize: 14,
    color: colors.textMuted,
  },
  stats: {
    flexDirection: 'row', // 3 chỉ số nằm ngang
    width: '100%',
    marginTop: spacing.lg,
    paddingTop: spacing.md,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  stat: {
    flex: 1, // mỗi ô chiếm 1/3 chỗ còn lại
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  statLabel: {
    marginTop: 2,
    fontSize: 12,
    color: colors.textMuted,
  },
  button: {
    width: '100%',
    marginTop: spacing.lg,
    paddingVertical: 12,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});
