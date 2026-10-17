import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import ProductCard from '../components/ProductCard';
import products from '../data/products';

const HomeScreen = ({ navigation }) => {
  // Bài tập mức dễ: Sử dụng ProductCard ít nhất 3 lần với 3 bộ dữ liệu khác nhau
  const demoProducts = [
    { id: 'demo1', name: 'iPad Pro 11"', price: 21990000 },
    { id: 'demo2', name: 'Sony WH-1000XM5', price: 9990000 },
    { id: 'demo3', name: 'Logitech MX Master 3', price: 3490000 },
  ];

  // Render item cho FlatList (bài tập mức trung bình)
  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('Detail', { ...item })}
      activeOpacity={0.7}
    >
      <ProductCard name={item.name} price={item.price} />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* PHẦN 1: BÀI TẬP MỨC DỄ - Sử dụng ProductCard 3 lần */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bài tập mức dễ - ProductCard</Text>
          <Text style={styles.sectionSubtitle}>
            Sử dụng component ProductCard ít nhất 3 lần với dữ liệu khác nhau
          </Text>
          {demoProducts.map((product) => (
            <ProductCard
              key={product.id}
              name={product.name}
              price={product.price}
            />
          ))}
        </View>

        {/* PHẦN 2: BÀI TẬP MỨC TRUNG BÌNH - Product List */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bài tập mức trung bình - Danh sách sản phẩm</Text>
          <Text style={styles.sectionSubtitle}>
            Chạm vào sản phẩm để xem chi tiết
          </Text>
          <FlatList
            data={products}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            showsVerticalScrollIndicator={false}
          />
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
  section: {
    marginBottom: 20,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1d3557',
    marginHorizontal: 16,
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#6c757d',
    marginHorizontal: 16,
    marginBottom: 12,
  },
});

export default HomeScreen;
