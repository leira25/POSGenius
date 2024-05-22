import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TextInput, StyleSheet, Alert, TouchableOpacity, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { storeData, getData } from '../storage';

function OrderScreen() {
  const [products, setProducts] = useState([]);
  const [order, setOrder] = useState({});
  const [cash, setCash] = useState('');
  const [change, setChange] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const storedProducts = await getData('products');
      if (storedProducts) {
        setProducts(storedProducts);
        const uniqueCategories = [...new Set(storedProducts.map((product) => product.category))];
        setCategories(uniqueCategories);
      }
    };
    fetchProducts();
  }, []);

  const addToOrder = (product) => {
    setOrder((prevOrder) => {
      const newOrder = { ...prevOrder };
      if (newOrder[product.id]) {
        newOrder[product.id].quantity += 1;
        newOrder[product.id].total += parseFloat(product.price);
      } else {
        newOrder[product.id] = {
          ...product,
          quantity: 1,
          total: parseFloat(product.price),
        };
      }
      return newOrder;
    });
  };

  const removeFromOrder = (productId) => {
    setOrder((prevOrder) => {
      const newOrder = { ...prevOrder };
      delete newOrder[productId];
      return newOrder;
    });
  };

  const reduceQuantity = (productId) => {
    setOrder((prevOrder) => {
      const newOrder = { ...prevOrder };
      if (newOrder[productId]) {
        newOrder[productId].quantity -= 1;
        newOrder[productId].total -= parseFloat(newOrder[productId].price);
        if (newOrder[productId].quantity === 0) {
          delete newOrder[productId];
        }
      }
      return newOrder;
    });
  };

  const getTotal = () => {
    return Object.values(order).reduce((sum, product) => sum + product.total, 0).toFixed(2);
  };

  const handleCashChange = (value) => {
    setCash(value);
    const total = parseFloat(getTotal());
    const cashAmount = parseFloat(value);
    if (cashAmount >= total) {
      setChange((cashAmount - total).toFixed(2));
    } else {
      setChange(null);
    }
  };

  const completeOrder = async () => {
    const newOrder = {
      id: Date.now().toString(),
      items: Object.values(order),
      total: getTotal(),
      date: new Date().toISOString(),
    };
    const salesHistory = (await getData('salesHistory')) || [];
    await storeData('salesHistory', [...salesHistory, newOrder]);
    setOrder({});
    setCash('');
    setChange(null);
    Alert.alert("Payment Successful!");
  };

  const filterProducts = (products) => {
    let filteredProducts = products;
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          (product.name && product.name.toLowerCase().includes(query)) ||
          (product.category && product.category.toLowerCase().includes(query))
      );
    }
    if (selectedCategory) {
      filteredProducts = filteredProducts.filter((product) => product.category === selectedCategory);
    }
    return filteredProducts;
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search products..."
        value={searchQuery}
        onChangeText={setSearchQuery}
      />
      <Picker
        selectedValue={selectedCategory}
        onValueChange={(itemValue) => setSelectedCategory(itemValue)}
        style={styles.input}
      >
        <Picker.Item label="All Categories" value="" />
        {categories.map((category) => (
          <Picker.Item key={category} label={category} value={category} />
        ))}
      </Picker>
      <FlatList
        data={filterProducts(products)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => addToOrder(item)} style={styles.productItem}>
            <View style={styles.productContainer}>
              <Image source={{ uri: item.image }} style={styles.productImage} />
              <View style={styles.productInfo}>
                <Text>{item.name}</Text>
                <Text style={styles.price}>₱{item.price}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
      <FlatList
        data={Object.values(order)}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.orderItem}>
            <Text>{item.name} x {item.quantity} - ₱{item.total.toFixed(2)}</Text>
            <Button title="Remove" onPress={() => removeFromOrder(item.id)} />
            <Button title="Reduce" onPress={() => reduceQuantity(item.id)} />
          </View>
        )}
      />
      <View style={styles.orderSummary}>
        <Text>Total: ₱{getTotal()}</Text>
        <TextInput
          placeholder="Enter cash amount"
          value={cash}
          onChangeText={handleCashChange}
          keyboardType="numeric"
          style={styles.input}
        />
        {change !== null && <Text>Change: ₱{change}</Text>}
        <Button title="Complete Order" onPress={completeOrder} disabled={!Object.keys(order).length || change === null} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  productItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  productContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    textAlign: 'right',
  },
  orderItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
  },
  orderSummary: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: 'gray',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default OrderScreen;
