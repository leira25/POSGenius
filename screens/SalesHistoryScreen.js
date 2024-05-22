import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { getData } from '../storage';

function SalesHistoryScreen() {
  const [salesHistory, setSalesHistory] = useState([]);

  useEffect(() => {
    const fetchSalesHistory = async () => {
      const storedSalesHistory = await getData('salesHistory');
      if (storedSalesHistory) {
        setSalesHistory(storedSalesHistory);
      }
    };
    fetchSalesHistory();
  }, []);

  const totalSales = salesHistory.reduce((total, item) => total + parseFloat(item.total), 0).toFixed(2);

  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <Text>Order ID: {item.id}</Text>
      <Text>Date: {new Date(item.date).toLocaleString()}</Text>
      <Text>Total: ₱{item.total}</Text>
      <Text>Items:</Text>
      {item.items.map((product, index) => (
        <Text key={index}>- {product.name}: ₱{product.price}</Text>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.totalSales}>Total Sales: ₱{totalSales}</Text>
      <FlatList
        data={salesHistory}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  historyItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: 'gray',
    marginBottom: 10,
  },
  totalSales: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default SalesHistoryScreen;
