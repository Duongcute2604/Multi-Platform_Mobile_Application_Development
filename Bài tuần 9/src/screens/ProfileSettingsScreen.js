import React from 'react';
import { ScrollView, StyleSheet, Text, useWindowDimensions, View } from 'react-native';

import ProfileCard from '../components/ProfileCard';
import SettingsList from '../components/SettingsList';
import { colors, spacing } from '../theme';

// Từ 700px trở lên (máy tính bảng, máy tính) 2 thẻ nằm ngang, dưới đó xếp dọc.
const WIDE_MIN_WIDTH = 700;

export default function ProfileSettingsScreen() {
  const { width } = useWindowDimensions(); // đọc chiều rộng màn hình thực tế
  const isWide = width >= WIDE_MIN_WIDTH;
  const columnStyle = isWide ? styles.columnWide : styles.columnFull;

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <Text style={styles.pageTitle}>Hồ sơ &amp; Cài đặt</Text>

      <View style={[styles.layout, isWide && styles.layoutWide]}>
        <ProfileCard style={columnStyle} />
        <SettingsList style={columnStyle} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    width: '100%',
    maxWidth: 960, // giới hạn chiều rộng để chữ không bị giãn quá trên màn hình lớn
    alignSelf: 'center',
    padding: spacing.md,
    paddingBottom: 96, // chừa chỗ cho thanh chuyển màn hình
  },
  pageTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: spacing.md,
  },
  layout: {
    gap: spacing.md, // khoảng cách giữa 2 thẻ
  },
  layoutWide: {
    flexDirection: 'row',
    flexWrap: 'wrap', // đủ chỗ thì nằm ngang, hết chỗ thì tự xuống dòng
    alignItems: 'flex-start',
    gap: spacing.lg,
  },
  columnFull: {
    width: '100%', // màn hình hẹp: chiếm hết chiều rộng, xếp dọc
  },
  columnWide: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 300, // màn hình rộng: mỗi thẻ tối thiểu 300px rồi co giãn đều nhau
  },
});
