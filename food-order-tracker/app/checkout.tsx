import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  ActivityIndicator,
  StatusBar,
  StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function CheckoutPage() {
  const [loading, setLoading] = useState(false);
  
  // Mock cart items - keeping original data
  const MOCK_CART_ITEMS = [
    { id: '1', name: 'Hakka Noodles', price: 220, quantity: 1, restaurant: "Barman's Bistro" },
    { id: '2', name: 'Chicken Fried Rice', price: 280, quantity: 1, restaurant: "Barman's Bistro" },
  ];
  
  const [cartItems, setCartItems] = useState(MOCK_CART_ITEMS);

  const [address] = useState({
    street: '123 MG Road, Bangalore,',
    city: 'Karnataka 560001',
    isDefault: true
  });

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [upiId, setUpiId] = useState('');
  const [deliveryInstructions, setDeliveryInstructions] = useState('');

  // Navigation handler
  const handleGoBack = () => {
    console.log('Navigate back to previous page');
    // Add your navigation logic here
  };

  // Quantity adjustment functions
  const increaseQuantity = (itemId) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      )
    );
  };

  const decreaseQuantity = (itemId) => {
    setCartItems(prev => 
      prev.map(item => 
        item.id === itemId 
          ? { ...item, quantity: Math.max(1, item.quantity - 1) }
          : item
      )
    );
  };

  // Updated calculations with dynamic cart items
  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const deliveryFee = 50;
  const tax = 40;
  const totalAmount = subtotal + deliveryFee + tax;

  // Form validation
  const isFormValid = () => {
    const paymentValid = paymentMethod === 'upi' ? upiId.trim() : true;
    return paymentValid;
  };

  // Order handling
  const handlePlaceOrder = async () => {
    if (!isFormValid()) {
      Alert.alert('Error', 'Please fill all required fields');
      return;
    }

    setLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      Alert.alert('Success', 'Order placed successfully!');
    } catch (error) {
      console.error('Error placing order:', error);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const PaymentOption = ({ method, label, icon, description }) => (
    <TouchableOpacity 
      style={[
        styles.paymentOption,
        paymentMethod === method ? styles.paymentOptionSelected : styles.paymentOptionDefault
      ]}
      onPress={() => setPaymentMethod(method)}
    >
      <View style={styles.paymentOptionContent}>
        <View style={styles.paymentOptionLeft}>
          <Text style={styles.paymentIcon}>{icon}</Text>
          <View>
            <Text style={styles.paymentLabel}>{label}</Text>
            {description && <Text style={styles.paymentDescription}>{description}</Text>}
          </View>
        </View>
        <View style={[
          styles.radioButton,
          paymentMethod === method ? styles.radioButtonSelected : styles.radioButtonDefault
        ]}>
          {paymentMethod === method && <View style={styles.radioButtonInner} />}
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#374151" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
      </View>

      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        {/* Delivery Address */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Address</Text>
          
          <View style={styles.addressContainer}>
            <View style={styles.addressContent}>
              <Ionicons name="location" size={20} color="#9333ea" style={styles.locationIcon} />
              <View style={styles.addressText}>
                <Text style={styles.addressLine}>{address.street}</Text>
                <Text style={styles.addressLine}>{address.city}</Text>
                <Text style={styles.addressDefault}>Default Address</Text>
              </View>
            </View>
            <TouchableOpacity>
              <Text style={styles.changeButton}>Change</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Items</Text>
          {cartItems.map(item => (
            <View key={item.id} style={styles.orderItem}>
              <View style={styles.orderItemContent}>
                <View style={styles.itemDetails}>
                  <Text style={styles.itemName}>{item.name}</Text>
                  <Text style={styles.itemRestaurant}>{item.restaurant}</Text>
                  <Text style={styles.itemPrice}>₹{item.price}</Text>
                </View>
                
                {/* Quantity Controls */}
                <View style={styles.quantityControls}>
                  <TouchableOpacity
                    onPress={() => decreaseQuantity(item.id)}
                    style={[styles.quantityButton, item.quantity <= 1 && styles.quantityButtonDisabled]}
                    disabled={item.quantity <= 1}
                  >
                    <Ionicons name="remove" size={16} color="#9333ea" />
                  </TouchableOpacity>
                  
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  
                  <TouchableOpacity
                    onPress={() => increaseQuantity(item.id)}
                    style={styles.quantityButton}
                  >
                    <Ionicons name="add" size={16} color="#9333ea" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Delivery Instructions */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Instructions</Text>
          <TextInput
            placeholder="Add delivery notes (optional)"
            value={deliveryInstructions}
            onChangeText={setDeliveryInstructions}
            style={styles.instructionsInput}
            multiline
            numberOfLines={3}
            placeholderTextColor="#9ca3af"
          />
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          
          <PaymentOption 
            method="upi" 
            label="UPI Payment" 
            icon="🏦"
            description="Pay using UPI apps like GPay, PhonePe, Paytm"
          />
          <PaymentOption 
            method="cod" 
            label="Cash on Delivery" 
            icon="💰"
            description="Pay with cash when your order arrives"
          />

          {paymentMethod === 'upi' && (
            <TextInput
              placeholder="Enter UPI ID (e.g., user@paytm)"
              value={upiId}
              onChangeText={setUpiId}
              style={styles.upiInput}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          )}
        </View>

        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          
          <View style={styles.summaryContainer}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>₹{subtotal.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Delivery Fee</Text>
              <Text style={styles.summaryValue}>₹{deliveryFee.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Tax</Text>
              <Text style={styles.summaryValue}>₹{tax.toFixed(2)}</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTotal}>Total</Text>
              <Text style={styles.summaryTotalValue}>₹{totalAmount.toFixed(2)}</Text>
            </View>
          </View>

          <View style={styles.deliveryEstimate}>
            <Ionicons name="time" size={16} color="#059669" />
            <Text style={styles.deliveryText}>Estimated delivery: 25-35 minutes</Text>
          </View>
        </View>
      </ScrollView>

      {/* Place Order Button */}
      <View style={styles.bottomContainer}>
        <TouchableOpacity 
          onPress={handlePlaceOrder}
          disabled={!isFormValid() || loading}
          style={[
            styles.placeOrderButton,
            (!isFormValid() || loading) && styles.placeOrderButtonDisabled
          ]}
        >
          {loading && <ActivityIndicator color="white" style={styles.loadingSpinner} />}
          <Text style={styles.placeOrderText}>
            {loading ? 'Placing Order...' : `Place Order • ₹${totalAmount.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  backButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 12,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 120,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  addressContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  addressContent: {
    flexDirection: 'row',
    flex: 1,
  },
  locationIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  addressText: {
    flex: 1,
  },
  addressLine: {
    fontSize: 16,
    fontWeight: '500',
    color: '#111827',
  },
  addressDefault: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 4,
  },
  changeButton: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9333ea',
  },
  orderItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  orderItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  itemRestaurant: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  itemPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#9333ea',
    marginTop: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  quantityButtonDisabled: {
    opacity: 0.5,
  },
  quantityText: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 16,
    minWidth: 24,
    textAlign: 'center',
  },
  instructionsInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  paymentOption: {
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
    marginBottom: 12,
  },
  paymentOptionDefault: {
    borderColor: '#e5e7eb',
    backgroundColor: 'white',
  },
  paymentOptionSelected: {
    borderColor: '#9333ea',
    backgroundColor: '#faf5ff',
  },
  paymentOptionContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  paymentOptionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  paymentIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  paymentLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
  },
  paymentDescription: {
    fontSize: 14,
    color: '#6b7280',
    marginTop: 2,
  },
  radioButton: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioButtonDefault: {
    borderColor: '#d1d5db',
  },
  radioButtonSelected: {
    borderColor: '#9333ea',
    backgroundColor: '#9333ea',
  },
  radioButtonInner: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'white',
  },
  upiInput: {
    borderWidth: 2,
    borderColor: '#9333ea',
    backgroundColor: '#faf5ff',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginTop: 12,
  },
  summaryContainer: {
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  summaryLabel: {
    fontSize: 16,
    color: '#6b7280',
  },
  summaryValue: {
    fontSize: 16,
    color: '#111827',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: '#e5e7eb',
    marginVertical: 8,
  },
  summaryTotal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  summaryTotalValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#9333ea',
  },
  deliveryEstimate: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0fdf4',
    padding: 12,
    borderRadius: 8,
  },
  deliveryText: {
    fontSize: 14,
    color: '#059669',
    marginLeft: 8,
  },
  bottomContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    padding: 16,
  },
  placeOrderButton: {
    backgroundColor: '#9333ea',
    borderRadius: 8,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeOrderButtonDisabled: {
    backgroundColor: '#9ca3af',
  },
  placeOrderText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  loadingSpinner: {
    marginRight: 8,
  },
});