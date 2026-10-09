import React, { useState } from 'react';
import {
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Field from '../components/Field';

// ------------------------------------------------------------
// BÀI TẬP 3 - Form đăng ký + Validate
// Họ tên, Email, Mật khẩu, Confirm mật khẩu
// Validate: rỗng, email đúng format, mật khẩu >= 6, confirm khớp
// ------------------------------------------------------------
export default function Bai3Screen() {
  // state lưu giá trị các ô nhập (Controlled Component)
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');

  // state lưu lỗi từng ô + thông báo thành công
  const [errors, setErrors] = useState({});
  const [success, setSuccess] = useState('');

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  const validate = () => {
    const newErrors = {};

    if (!fullName.trim()) newErrors.fullName = 'Vui lòng nhập họ tên';
    if (!email.trim()) newErrors.email = 'Vui lòng nhập email';
    else if (!emailRegex.test(email.trim()))
      newErrors.email = 'Email không đúng định dạng';

    if (!password) newErrors.password = 'Vui lòng nhập mật khẩu';
    else if (password.length < 6)
      newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';

    if (!confirm) newErrors.confirm = 'Vui lòng nhập lại mật khẩu';
    else if (confirm !== password)
      newErrors.confirm = 'Mật khẩu xác nhận không khớp';

    return newErrors;
  };

  const handleSubmit = () => {
    const newErrors = validate();
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setSuccess('Đăng ký thành công'); // hợp lệ
    } else {
      setSuccess(''); // có lỗi -> không hiện thành công
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Form đăng ký</Text>

        <Field
          label="Họ tên"
          value={fullName}
          onChangeText={setFullName}
          error={errors.fullName}
        />
        <Field
          label="Email"
          value={email}
          onChangeText={setEmail}
          error={errors.email}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <Field
          label="Mật khẩu"
          value={password}
          onChangeText={setPassword}
          error={errors.password}
          secureTextEntry
        />
        <Field
          label="Confirm mật khẩu"
          value={confirm}
          onChangeText={setConfirm}
          error={errors.confirm}
          secureTextEntry
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Đăng ký</Text>
        </TouchableOpacity>

        {!!success && <Text style={styles.successText}>{success}</Text>}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  container: { padding: 20 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#2e86de',
    paddingVertical: 14,
    borderRadius: 8,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  successText: {
    marginTop: 18,
    textAlign: 'center',
    color: '#27ae60',
    fontSize: 18,
    fontWeight: 'bold',
  },
});
