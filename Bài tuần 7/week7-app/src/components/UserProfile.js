import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Avatar from './Avatar'; // lồng component Avatar vào UserProfile

// Component cha của Avatar: hiển thị ảnh + tên + mô tả
export default function UserProfile({ name, bio, profileImage }) {
  return (
    <View style={styles.container}>
      <Avatar imageUrl={profileImage} />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.bio}>{bio}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  name: { fontSize: 18, fontWeight: 'bold', marginTop: 10 },
  bio: { textAlign: 'center', marginTop: 5, color: '#555' },
});
