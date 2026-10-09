import React from 'react';
import { View, Text, TextInput, StyleSheet } from 'react-native';

// Component nhỏ tái sử dụng: 1 ô nhập + nhãn + thông báo lỗi
export default function Field({ label, value, onChangeText, error, ...rest }) {
  return (
    <View style={styles.field}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={label}
        placeholderTextColor="#aaa"
        {...rest}
      />
      {!!error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  field: { marginBottom: 14 },
  label: { fontSize: 15, marginBottom: 6, fontWeight: '500' },
  input: {
    height: 44,
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
  },
  inputError: { borderColor: '#e74c3c' },
  errorText: { color: '#e74c3c', fontSize: 13, marginTop: 4 },
});
