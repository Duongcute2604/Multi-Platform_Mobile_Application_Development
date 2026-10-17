import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProductCard = ({ name, price }) => {
  // Format giá tiền VNĐ
  const formatPrice = (value) => {
    return value.toLocaleString('vi-VN') + ' VNĐ';
  };

  return (
    <View style={styles.card}>
      <Text style={styles.productName}>{name}</Text>
      <Text style={styles.productPrice}>{formatPrice(price)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 16,
    marginVertical: 8,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  productName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  productPrice: {
    fontSize: 16,
    color: '#e63946',
    fontWeight: '600',
  },
});

export default ProductCard;
