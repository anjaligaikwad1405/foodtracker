import React from 'react';
import 'expo-router/entry';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Pressable } from 'react-native';
import { useRouter, Link } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

// Mock featured items
const FEATURED_ITEMS = [
  {
    id: 1,
    name: 'Margherita Pizza',
    price: 299,
    image: '🍕',
    description: 'Fresh tomatoes, mozzarella, basil',
    rating: 4.8,
    time: '25-30 min'
  },
  {
    id: 2,
    name: 'Chicken Biryani',
    price: 350,
    image: '🍛',
    description: 'Aromatic basmati rice with tender chicken',
    rating: 4.9,
    time: '30-35 min'
  },
  {
    id: 3,
    name: 'Garlic Bread',
    price: 120,
    image: '🥖',
    description: 'Crispy bread with garlic butter',
    rating: 4.6,
    time: '15-20 min'
  },
];

export default function HomePage() {
  const router = useRouter();
  const orderId = '12345';

  const handleGoToCheckout = () => {
    router.push('/checkout');
  };

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Minimal Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>IndiaEatz</Text>
            <Text style={styles.headerTitle}>What would you like to eat?</Text>
          </View>
          <View style={styles.locationBadge}>
            <Text style={styles.locationText}>📍 Mumbai</Text>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchContainer}>
          <View style={styles.searchBar}>
            <Text style={styles.searchIcon}>🔍</Text>
            <Text style={styles.searchPlaceholder}>Search for food, restaurants...</Text>
          </View>
        </View>

        {/* Quick Actions - Horizontal */}
        <View style={styles.quickActions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleGoToCheckout}>
            <Text style={styles.actionIcon}>🛒</Text>
            <Text style={styles.actionText}>Checkout</Text>
          </TouchableOpacity>
          
          <Link href={`/status/${orderId}`} asChild>
            <Pressable style={styles.actionButton}>
              <Text style={styles.actionIcon}>📋</Text>
              <Text style={styles.actionText}>My Orders</Text>
            </Pressable>
          </Link>
        </View>

        {/* Featured Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Popular Near You</Text>
          
          {FEATURED_ITEMS.map((item) => (
            <TouchableOpacity key={item.id} style={styles.foodCard}>
              <View style={styles.foodImageContainer}>
                <Text style={styles.foodEmoji}>{item.image}</Text>
              </View>
              
              <View style={styles.foodInfo}>
                <Text style={styles.foodName}>{item.name}</Text>
                <Text style={styles.foodDescription}>{item.description}</Text>
                
                <View style={styles.foodMeta}>
                  <View style={styles.ratingContainer}>
                    <Text style={styles.rating}>⭐ {item.rating}</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.time}>{item.time}</Text>
                  </View>
                  <Text style={styles.price}>₹{item.price}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Categories</Text>
          <View style={styles.categoryGrid}>
            <TouchableOpacity style={styles.categoryItem}>
              <Text style={styles.categoryIcon}>🍕</Text>
              <Text style={styles.categoryText}>Pizza</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem}>
              <Text style={styles.categoryIcon}>🍛</Text>
              <Text style={styles.categoryText}>Indian</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem}>
              <Text style={styles.categoryIcon}>🍔</Text>
              <Text style={styles.categoryText}>Burgers</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.categoryItem}>
              <Text style={styles.categoryIcon}>🍜</Text>
              <Text style={styles.categoryText}>Chinese</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom spacing */}
        <View style={styles.bottomSpacing} />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#B33691',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  greeting: {
    fontSize: 26,
    color: '#ffffff',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1A1A1A',
  },
  locationBadge: {
    backgroundColor: '#F5F5F5',
    paddingHorizontal: 2,
    paddingVertical: 6,
    borderRadius: 20,
  },
  locationText: {
    fontSize: 14,
    color: '#666666',
  },
  searchContainer: {
    paddingHorizontal: 20,
    marginBottom: 24,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
  },
  searchIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  searchPlaceholder: {
    flex: 1,
    fontSize: 16,
    color: '#999999',
  },
  quickActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 32,
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingVertical: 16,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 6,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  section: {
    paddingHorizontal: 20,
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1A1A1A',
    marginBottom: 16,
  },
  foodCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    padding: 16,
  },
  foodImageContainer: {
    width: 80,
    height: 80,
    backgroundColor: '#F8F8F8',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  foodEmoji: {
    fontSize: 36,
  },
  foodInfo: {
    flex: 1,
    justifyContent: 'space-between',
  },
  foodName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1A1A1A',
    marginBottom: 4,
  },
  foodDescription: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 8,
    lineHeight: 20,
  },
  foodMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    color: '#666666',
  },
  dot: {
    fontSize: 14,
    color: '#CCCCCC',
    marginHorizontal: 8,
  },
  time: {
    fontSize: 14,
    color: '#666666',
  },
  price: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FF6B35',
  },
  categoryGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  categoryItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    paddingVertical: 20,
    borderRadius: 12,
    marginHorizontal: 4,
  },
  categoryIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  categoryText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  bottomSpacing: {
    height: 40,
  },
});