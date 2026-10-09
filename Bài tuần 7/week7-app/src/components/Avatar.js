import React from 'react';
import { Image, StyleSheet } from 'react-native';

// Component con: chỉ hiển thị ảnh đại diện
export default function Avatar({ imageUrl }) {
  return <Image style={styles.avatar} source={{ uri: imageUrl }} />;
}

const styles = StyleSheet.create({
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40, // bo tròn
    backgroundColor: '#ddd',
  },
});
