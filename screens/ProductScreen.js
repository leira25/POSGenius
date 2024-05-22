import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet } from 'react-native';
import { storeData, getData } from '../storage';
import ProductForm from '../components/ProductForm';

function ProductScreen() {
  const [products, setProducts] = useState([]);
  const [editingProduct, setEditingProduct] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const storedProducts = await getData('products');
      if (storedProducts) {
        setProducts(storedProducts);
        setFilteredProducts(storedProducts);
      }
    };
    fetchProducts();
  }, []);

  const handleAddProduct = async (product) => {
    const newProducts = editingProduct
      ? products.map((p) => (p.id === editingProduct.id ? { ...p, ...product } : p))
      : [...products, { ...product, id: Date.now().toString() }];
    setProducts(newProducts);
    setFilteredProducts(newProducts);
    await storeData('products', newProducts);
    setEditingProduct(null);
  };

  const handleEditProduct = (product) => {
    setEditingProduct(product);
  };

  const handleDeleteProduct = async (id) => {
    const newProducts = products.filter((product) => product.id !== id);
    setProducts(newProducts);
    setFilteredProducts(newProducts);
    await storeData('products', newProducts);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
    const filtered = products.filter((product) => {
      const name = product.name || '';
      const category = product.category || '';
      return (
        name.toLowerCase().includes(query.toLowerCase()) ||
        category.toLowerCase().includes(query.toLowerCase())
      );
    });
    setFilteredProducts(filtered);
  }
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={handleSearch}
      />
      <ProductForm onSubmit={handleAddProduct} product={editingProduct} />
      <FlatList
        data={filteredProducts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.productItem}>
            <Text>{item.name} - ₱{item.price}</Text>
            <Button title="Edit" onPress={() => handleEditProduct(item)} />
            <Button title="Delete" onPress={() => handleDeleteProduct(item.id)} />
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  productItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  searchInput: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default ProductScreen;
