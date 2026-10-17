import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { colors, radius, spacing } from '../theme';

const ITEMS = [
  { id: 'profile', icon: '👤', title: 'Thông tin cá nhân' },
  { id: 'security', icon: '🛡️', title: 'Bảo mật' },
  { id: 'language', icon: '🌐', title: 'Ngôn ngữ', value: 'Tiếng Việt' },
  { id: 'theme', icon: '🎨', title: 'Giao diện', value: 'Sáng' },
  { id: 'logout', icon: '🚪', title: 'Đăng xuất' },
];

// Danh sách cài đặt: mỗi dòng là icon + tiêu đề + (giá trị) + mũi tên.
export default function SettingsList({ style }) {
  return (
    <View style={[styles.card, style]}>
      <Text style={styles.heading}>Cài đặt</Text>

      {ITEMS.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.7}
          style={[styles.row, index < ITEMS.length - 1 && styles.rowDivider]}
        >
          <View style={styles.icon}>
            <Text style={styles.iconText}>{item.icon}</Text>
          </View>
          <Text style={styles.rowTitle}>{item.title}</Text>
          {item.value ? <Text style={styles.rowValue}>{item.value}</Text> : null}
          <Text style={styles.chevron}>›</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
  },
  heading: {
    fontSize: 13,
    fontWeight: '700',
    color: colors.textMuted,
    textTransform: 'uppercase',
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: spacing.sm,
    gap: spacing.sm,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: colors.background,
  },
  icon: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 16,
  },
  rowTitle: {
    flex: 1, // đẩy giá trị và mũi tên về phía bên phải
    fontSize: 15,
    color: colors.text,
  },
  rowValue: {
    fontSize: 14,
    color: colors.textMuted,
  },
  chevron: {
    fontSize: 20,
    color: colors.textMuted,
  },
});
