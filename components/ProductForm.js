import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, Alert } from 'react-native';

function ProductForm({ onSubmit, product }) {
  const [name, setName] = useState(product ? product.name : '');
  const [price, setPrice] = useState(product ? product.price.toString() : '');
  const [category, setCategory] = useState(product ? product.category : '');

  const handleSubmit = () => {
    onSubmit({ name, price: parseFloat(price), category });
    setName('');
    setPrice('');
    setCategory('');
    Alert.alert("Added Successfully!");
  };

  const isFormValid = name.trim() !== '' && price.trim() !== '' && category.trim() !== '';

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Product Name"
        value={name}
        onChangeText={setName}
      />
      <TextInput
        style={styles.input}
        placeholder="Price"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        placeholder="Category"
        value={category}
        onChangeText={setCategory}
      />
      <Button
        title={product ? "Update Product" : "Add Product"}
        onPress={handleSubmit}
        disabled={!isFormValid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default ProductForm;
