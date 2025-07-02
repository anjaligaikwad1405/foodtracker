// app/status/[id].tsx - Updated to match reference UI

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Link, useLocalSearchParams, useRouter } from 'expo-router';

export default function OrderStatusScreen() {
  const { id: orderId } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  if (!orderId) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>Order not found</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <Text style={styles.backButtonText}>←</Text>
          </Pressable>
          <Text style={styles.title}>Order Status</Text>
        </View>

        {/* Success Banner */}
        <View style={styles.successBanner}>
          <View style={styles.successIcon}>
            <Text style={styles.checkmark}>✓</Text>
          </View>
          <Text style={styles.successTitle}>Order Placed Successfully!</Text>
          <Text style={styles.successSubtitle}>Your order #{orderId} has been confirmed</Text>
        </View>

        {/* Order Summary */}
        <View style={styles.orderSummary}>
          <Text style={styles.orderNumber}>Order #{orderId}</Text>
          <Text style={styles.orderAmount}>₹590.00</Text>
          <Text style={styles.deliveryTime}>Estimated delivery: 25-35 min</Text>
        </View>

        {/* Current Status */}
        <View style={styles.currentStatus}>
          <View style={styles.statusBadge}>
            <Text style={styles.statusBadgeText}>Placed</Text>
          </View>
          <Text style={styles.statusDescription}>Your order has been placed successfully</Text>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={styles.progressFill} />
          </View>
        </View>

        {/* Order Timeline */}
        <View style={styles.timelineContainer}>
          <Text style={styles.timelineTitle}>Order Timeline</Text>
          
          <View style={styles.timelineItem}>
            <View style={[styles.timelineIcon, styles.timelineIconActive]}>
              <Text style={styles.timelineIconText}>●</Text>
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineItemTitle}>Order Placed</Text>
              <Text style={styles.timelineItemSubtitle}>Your order has been placed successfully</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineIcon}>
              <Text style={styles.timelineIconText}>●</Text>
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineItemTitle}>Order Accepted</Text>
              <Text style={styles.timelineItemSubtitle}>Restaurant has accepted your order</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineIcon}>
              <Text style={styles.timelineIconText}>●</Text>
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineItemTitle}>Preparing Food</Text>
              <Text style={styles.timelineItemSubtitle}>The restaurant is preparing your delicious meal</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineIcon}>
              <Text style={styles.timelineIconText}>●</Text>
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineItemTitle}>On the Way</Text>
              <Text style={styles.timelineItemSubtitle}>Your order is being delivered to you</Text>
            </View>
          </View>

          <View style={styles.timelineItem}>
            <View style={styles.timelineIcon}>
              <Text style={styles.timelineIconText}>●</Text>
            </View>
            <View style={styles.timelineContent}>
              <Text style={styles.timelineItemTitle}>Delivered</Text>
              <Text style={styles.timelineItemSubtitle}>Enjoy your meal!</Text>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View style={styles.orderItemsContainer}>
          <Text style={styles.orderItemsTitle}>Order Items</Text>
          
          <View style={styles.orderItem}>
            <Text style={styles.orderItemQuantity}>1x</Text>
            <Text style={styles.orderItemName}>Hakka Noodles</Text>
            <Text style={styles.orderItemPrice}>₹220</Text>
          </View>
          
          <View style={styles.orderItem}>
            <Text style={styles.orderItemQuantity}>1x</Text>
            <Text style={styles.orderItemName}>Chicken Fried Rice</Text>
            <Text style={styles.orderItemPrice}>₹280</Text>
          </View>
        </View>

        {/* Delivery Information */}
        <View style={styles.deliveryInfo}>
          <Text style={styles.deliveryInfoTitle}>Delivery Information</Text>
          <View style={styles.deliveryAddress}>
            <Text style={styles.addressIcon}>📍</Text>
            <View style={styles.addressContent}>
              <Text style={styles.addressLabel}>Delivery Address</Text>
              <Text style={styles.addressText}>123 MG Road, Bangalore, Karnataka 560001</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <Pressable style={styles.continueButton}>
            <Text style={styles.continueButtonText}>Continue Shopping</Text>
          </Pressable>
          
          <Link href={`/map/${orderId}`} asChild>
            <Pressable style={styles.trackButton}>
              <Text style={styles.trackButtonIcon}>🚚</Text>
              <Text style={styles.trackButtonText}>Track Order</Text>
            </Pressable>
          </Link>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: 'white',
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 24,
    color: '#000',
    fontWeight: '400',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 50,
  },
  successBanner: {
    backgroundColor: '#E8F5E8',
    paddingVertical: 32,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  successIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkmark: {
    color: 'white',
    fontSize: 28,
    fontWeight: 'bold',
  },
  successTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#4CAF50',
    marginBottom: 8,
  },
  successSubtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  orderSummary: {
    paddingHorizontal: 20,
    paddingVertical: 24,
  },
  orderNumber: {
    fontSize: 20,
    fontWeight: '600',
    color: '#000',
    marginBottom: 8,
  },
  orderAmount: {
    fontSize: 20,
    fontWeight: '600',
    color: '#E91E63',
    marginBottom: 4,
  },
  deliveryTime: {
    fontSize: 14,
    color: '#4CAF50',
  },
  currentStatus: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  statusBadge: {
    backgroundColor: '#FF9800',
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 12,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  statusDescription: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  progressContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  progressBar: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
  },
  progressFill: {
    height: 4,
    backgroundColor: '#4CAF50',
    borderRadius: 2,
    width: '25%',
  },
  timelineContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  timelineTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  timelineItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  timelineIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 2,
  },
  timelineIconActive: {
    backgroundColor: '#E91E63',
  },
  timelineIconText: {
    fontSize: 12,
    color: 'white',
  },
  timelineContent: {
    flex: 1,
  },
  timelineItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  timelineItemSubtitle: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  orderItemsContainer: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  orderItemsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  orderItemQuantity: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
    width: 40,
  },
  orderItemName: {
    fontSize: 16,
    color: '#000',
    flex: 1,
  },
  orderItemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
  },
  deliveryInfo: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  deliveryInfoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginBottom: 16,
  },
  deliveryAddress: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  addressIcon: {
    fontSize: 20,
    marginRight: 12,
    marginTop: 2,
  },
  addressContent: {
    flex: 1,
  },
  addressLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 16,
    color: '#000',
    lineHeight: 22,
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingBottom: 32,
    gap: 12,
  },
  continueButton: {
    flex: 1,
    paddingVertical: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E91E63',
    alignItems: 'center',
  },
  continueButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#E91E63',
  },
  trackButton: {
    flex: 1,
    flexDirection: 'row',
    paddingVertical: 16,
    borderRadius: 8,
    backgroundColor: '#E91E63',
    alignItems: 'center',
    justifyContent: 'center',
  },
  trackButtonIcon: {
    fontSize: 18,
    marginRight: 8,
  },
  trackButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
});