import React from 'react';
import { View, Button, StyleSheet } from 'react-native';

function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Button
        title="Manage Products"
        onPress={() => navigation.navigate('Products')}
      />
      <Button
        title="Order Milk Tea"
        onPress={() => navigation.navigate('Order')}
      />
      <Button
        title="Sales History"
        onPress={() => navigation.navigate('SalesHistory')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
});

export default HomeScreen;
