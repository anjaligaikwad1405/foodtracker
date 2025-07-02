import { Stack } from 'expo-router';

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="index" 
        options={{ 
          title: 'Food Order Tracker',
          headerStyle: { backgroundColor: '#007bff' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      <Stack.Screen 
        name="checkout" 
        options={{ 
          title: 'Checkout',
          headerStyle: { backgroundColor: '#28a745' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
      <Stack.Screen 
        name="status/[id]" 
        options={{ 
          title: 'Order Status',
          headerStyle: { backgroundColor: '#17a2b8' },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' }
        }} 
      />
    </Stack>
  );
}