import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from './screens/HomeScreen';
import ProductScreen from './screens/ProductScreen';
import OrderScreen from './screens/OrderScreen';
import SalesHistoryScreen from './screens/SalesHistoryScreen';

const Stack = createStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Products" component={ProductScreen} />
        <Stack.Screen name="Order" component={OrderScreen} />
        <Stack.Screen name="SalesHistory" component={SalesHistoryScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
