// app/map/[id].tsx - Live delivery tracking map screen

import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE } from 'react-native-maps';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { deliveryService, DeliveryUpdate } from '../../services/deliveryService';

interface Location {
  latitude: number;
  longitude: number;
}

export default function DeliveryMapScreen() {
  const { id: orderId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const mapRef = useRef<MapView>(null);
  
  // State management
  const [agentLocation, setAgentLocation] = useState<Location | null>(null);
  const [deliveryStatus, setDeliveryStatus] = useState<DeliveryUpdate['status']>('picked_up');
  const [eta, setETA] = useState<string>('');
  const [isLoading, setIsLoading] = useState(true);
  const [agentName] = useState('Rajesh Kumar');
  const [agentPhone] = useState('+91 98765 43210');
  const [distance, setDistance] = useState('2.1 km away');
  
  // Fixed locations
  const restaurantLocation: Location = deliveryService.getRestaurantLocation();
  const customerLocation: Location = deliveryService.getCustomerLocation();
  const routeCoordinates: Location[] = deliveryService.getRoute();

  useEffect(() => {
    if (!orderId) {
      Alert.alert('Error', 'Order ID not found');
      router.back();
      return;
    }

    // Start tracking and get initial position
    deliveryService.startTracking(orderId);
    
    // Subscribe to real-time updates
    const unsubscribe = deliveryService.subscribeToUpdates(orderId, (update: DeliveryUpdate) => {
      setAgentLocation(update.agentLocation);
      setDeliveryStatus(update.status);
      setETA(update.estimatedArrival);
      setIsLoading(false);
      
      // Update distance based on status
      switch (update.status) {
        case 'picked_up':
          setDistance('3.2 km away');
          break;
        case 'on_the_way':
          setDistance('1.8 km away');
          break;
        case 'nearby':
          setDistance('0.3 km away');
          break;
        case 'delivered':
          setDistance('Delivered');
          break;
      }
      
      // Auto-focus map on agent location
      if (mapRef.current && update.agentLocation) {
        mapRef.current.animateToRegion({
          ...update.agentLocation,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 1000);
      }
    });

    return unsubscribe; // Cleanup subscription
  }, [orderId]);

  const getStatusColor = () => {
    switch (deliveryStatus) {
      case 'picked_up': return '#FF6B35';
      case 'on_the_way': return '#A855F7';
      case 'nearby': return '#10B981'; 
      case 'delivered': return '#059669';
      default: return '#6B7280';
    }
  };

  const getStatusText = () => {
    switch (deliveryStatus) {
      case 'picked_up': return 'Order Picked Up';
      case 'on_the_way': return 'On the Way';
      case 'nearby': return 'Nearby';
      case 'delivered': return 'Delivered';
      default: return 'Preparing Food';
    }
  };

  const getStatusIcon = () => {
    switch (deliveryStatus) {
      case 'picked_up': return '📦';
      case 'on_the_way': return '🚗';
      case 'nearby': return '📍';
      case 'delivered': return '✅';
      default: return '👨‍🍳';
    }
  };

  const handleCenterMap = () => {
    if (mapRef.current && agentLocation) {
      mapRef.current.animateToRegion({
        ...agentLocation,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const handleCallAgent = () => {
    Alert.alert(
      'Call Delivery Agent',
      `Call ${agentName} at ${agentPhone}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Call', onPress: () => console.log('Calling agent...') }
      ]
    );
  };

  const handleResetTracking = () => {
    Alert.alert(
      'Reset Tracking',
      'This will restart the delivery simulation. Continue?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Reset',
          onPress: () => {
            deliveryService.resetTracking(orderId);
            setIsLoading(true);
          }
        }
      ]
    );
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#A855F7" />
        <Text style={styles.loadingText}>Loading delivery map...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backIcon}>←</Text>
        </Pressable>
        <Text style={styles.headerTitle}>Track Order</Text>
        <Pressable onPress={handleResetTracking} style={styles.resetButton}>
          <Text style={styles.resetIcon}>🔄</Text>
        </Pressable>
      </View>

      <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
        {/* Status Card */}
        <View style={styles.statusCard}>
          <View style={styles.statusHeader}>
            <View style={styles.statusIconContainer}>
              <Text style={styles.statusIcon}>{getStatusIcon()}</Text>
            </View>
            <View style={styles.statusInfo}>
              <Text style={styles.statusTitle}>{getStatusText()}</Text>
              <Text style={styles.statusSubtitle}>
                {deliveryStatus === 'delivered' ? 'Enjoy your meal!' : `Your order is being delivered to you`}
              </Text>
            </View>
          </View>
          
          <View style={styles.etaContainer}>
            <View style={styles.etaItem}>
              <Text style={styles.etaLabel}>ETA</Text>
              <Text style={styles.etaValue}>{eta}</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.etaItem}>
              <Text style={styles.etaLabel}>Distance</Text>
              <Text style={styles.etaValue}>{distance}</Text>
            </View>
          </View>
        </View>

        {/* Map Container */}
        <View style={styles.mapCard}>
          <MapView
            ref={mapRef}
            style={styles.map}
            provider={PROVIDER_GOOGLE}
            initialRegion={{
              latitude: (restaurantLocation.latitude + customerLocation.latitude) / 2,
              longitude: (restaurantLocation.longitude + customerLocation.longitude) / 2,
              latitudeDelta: 0.02,
              longitudeDelta: 0.02,
            }}
            showsUserLocation={false}
            showsMyLocationButton={false}
          >
            {/* Restaurant Marker */}
            <Marker
              coordinate={restaurantLocation}
              title="Restaurant"
              description="Barman's Bistro"
            >
              <View style={[styles.customMarker, { backgroundColor: '#FF6B35' }]}>
                <Text style={styles.markerText}>🏪</Text>
              </View>
            </Marker>

            {/* Customer Marker */}
            <Marker
              coordinate={customerLocation}
              title="Delivery Location"
              description="123 MG Road, Bangalore"
            >
              <View style={[styles.customMarker, { backgroundColor: '#10B981' }]}>
                <Text style={styles.markerText}>📍</Text>
              </View>
            </Marker>

            {/* Delivery Agent Marker */}
            {agentLocation && (
              <Marker
                coordinate={agentLocation}
                title={agentName}
                description={`Status: ${getStatusText()}`}
                anchor={{ x: 0.5, y: 0.5 }}
              >
                <View style={[styles.agentMarker, { backgroundColor: getStatusColor() }]}>
                  <Text style={styles.agentMarkerText}>🛵</Text>
                </View>
              </Marker>
            )}

            {/* Route Line */}
            <Polyline
              coordinates={routeCoordinates}
              strokeColor="rgba(168, 85, 247, 0.3)"
              strokeWidth={4}
              lineDashPattern={[10, 5]}
            />

            {/* Completed Path */}
            {agentLocation && (
              <Polyline
                coordinates={[restaurantLocation, agentLocation]}
                strokeColor="#10B981"
                strokeWidth={6}
              />
            )}
          </MapView>

          {/* Map Controls */}
          <Pressable onPress={handleCenterMap} style={styles.centerButton}>
            <Text style={styles.centerButtonText}>📍</Text>
          </Pressable>
        </View>

        {/* Order Details */}
        <View style={styles.orderCard}>
          <Text style={styles.cardTitle}>Order Details</Text>
          <View style={styles.orderHeader}>
            <Text style={styles.orderId}>Order #{orderId}</Text>
            <View style={[styles.statusBadge, { backgroundColor: getStatusColor() }]}>
              <Text style={styles.statusBadgeText}>{getStatusText()}</Text>
            </View>
          </View>
          
          <View style={styles.orderItems}>
            <View style={styles.orderItem}>
              <Text style={styles.itemQuantity}>1x</Text>
              <Text style={styles.itemName}>Hakka Noodles</Text>
              <Text style={styles.itemPrice}>₹220</Text>
            </View>
            <View style={styles.orderItem}>
              <Text style={styles.itemQuantity}>1x</Text>
              <Text style={styles.itemName}>Chicken Fried Rice</Text>
              <Text style={styles.itemPrice}>₹280</Text>
            </View>
          </View>
          
          <View style={styles.totalContainer}>
            <Text style={styles.totalText}>Total: </Text>
            <Text style={styles.totalAmount}>₹590.00</Text>
          </View>
        </View>

        {/* Delivery Agent Info */}
        <View style={styles.agentCard}>
          <Text style={styles.cardTitle}>Delivery Agent</Text>
          <View style={styles.agentInfo}>
            <View style={styles.agentAvatar}>
              <Text style={styles.agentAvatarText}>👨‍🍳</Text>
            </View>
            <View style={styles.agentDetails}>
              <Text style={styles.agentName}>{agentName}</Text>
              <Text style={styles.agentPhone}>{agentPhone}</Text>
              <Text style={styles.agentStatus}>
                {deliveryStatus === 'delivered' ? 'Order completed successfully' : 'On the way to you'}
              </Text>
            </View>
            <Pressable onPress={handleCallAgent} style={styles.callButton}>
              <Text style={styles.callButtonText}>📞</Text>
            </Pressable>
          </View>
        </View>

        {/* Delivery Address */}
        <View style={styles.addressCard}>
          <Text style={styles.cardTitle}>Delivery Information</Text>
          <View style={styles.addressInfo}>
            <View style={styles.addressIcon}>
              <Text style={styles.addressIconText}>📍</Text>
            </View>
            <View style={styles.addressDetails}>
              <Text style={styles.addressTitle}>Delivery Address</Text>
              <Text style={styles.addressText}>123 MG Road, Bangalore, Karnataka 560001</Text>
              <Text style={styles.addressLabel}>Default Address</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    fontSize: 18,
    color: '#1E293B',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
  },
  resetButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetIcon: {
    fontSize: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  statusCard: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  statusHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  statusIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  statusIcon: {
    fontSize: 24,
  },
  statusInfo: {
    flex: 1,
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: '#64748B',
  },
  etaContainer: {
    flexDirection: 'row',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  etaItem: {
    flex: 1,
    alignItems: 'center',
  },
  etaLabel: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 4,
  },
  etaValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  divider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  mapCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  map: {
    height: 300,
  },
  customMarker: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  markerText: {
    fontSize: 20,
  },
  agentMarker: {
    width: 50,
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 3,
    borderColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  agentMarkerText: {
    fontSize: 24,
  },
  centerButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  centerButtonText: {
    fontSize: 16,
  },
  orderCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  orderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  orderId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  orderItems: {
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  itemQuantity: {
    fontSize: 14,
    color: '#64748B',
    width: 30,
  },
  itemName: {
    flex: 1,
    fontSize: 14,
    color: '#1E293B',
    marginLeft: 8,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  totalText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: '700',
    color: '#A855F7',
  },
  agentCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  agentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  agentAvatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  agentAvatarText: {
    fontSize: 24,
  },
  agentDetails: {
    flex: 1,
  },
  agentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  agentPhone: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2,
  },
  agentStatus: {
    fontSize: 12,
    color: '#64748B',
  },
  callButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#A855F7',
    alignItems: 'center',
    justifyContent: 'center',
  },
  callButtonText: {
    fontSize: 18,
  },
  addressCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 16,
    marginBottom: 32,
    padding: 20,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  addressInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FEF3F2',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  addressIconText: {
    fontSize: 16,
  },
  addressDetails: {
    flex: 1,
  },
  addressTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
    marginBottom: 4,
  },
  addressLabel: {
    fontSize: 12,
    color: '#A855F7',
    fontWeight: '500',
  },
});