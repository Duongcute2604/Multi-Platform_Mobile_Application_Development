import React from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';

const ProductDetailScreen = ({ route }) => {
  // Nhận params truyền từ HomeScreen
  const { id, name, price, description } = route.params;

  // Format giá tiền VNĐ
  const formatPrice = (value) => {
    return value.toLocaleString('vi-VN') + ' VNĐ';
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.card}>
          <Text style={styles.label}>Mã sản phẩm</Text>
          <Text style={styles.value}>#{id}</Text>

          <View style={styles.divider} />

          <Text style={styles.label}>Tên sản phẩm</Text>
          <Text style={styles.productName}>{name}</Text>

          <View style={styles.divider} />

          <Text style={styles.label}>Giá bán</Text>
          <Text style={styles.productPrice}>{formatPrice(price)}</Text>

          <View style={styles.divider} />

          <Text style={styles.label}>Mô tả chi tiết</Text>
          <Text style={styles.description}>{description}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  label: {
    fontSize: 14,
    color: '#6c757d',
    marginBottom: 6,
    fontWeight: '500',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  value: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
  },
  productName: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1d3557',
    lineHeight: 28,
  },
  productPrice: {
    fontSize: 20,
    color: '#e63946',
    fontWeight: 'bold',
  },
  description: {
    fontSize: 16,
    color: '#495057',
    lineHeight: 24,
  },
  divider: {
    height: 1,
    backgroundColor: '#e9ecef',
    marginVertical: 16,
  },
});

export default ProductDetailScreen;
