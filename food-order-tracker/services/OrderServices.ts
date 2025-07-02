// services/orderService.ts - Enhanced Firebase-based order management
import {
  collection,
  addDoc,
  doc,
  getDoc,
  updateDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from '../firebase/config';

export interface OrderItem {
  name: string;
  quantity: number;
  price: number;
}

export interface CustomerAddress {
  street: string;
  city: string;
  state: string;
  pincode: string;
  fullAddress?: string;
}

export interface TimelineItem {
  status: OrderStatus;
  label: string;
  description: string;
  completed: boolean;
  timestamp: Date | null;
}

export type OrderStatus = 'placed' | 'accepted' | 'preparing' | 'on_the_way' | 'delivered';

export interface Order {
  id: string;
  items: OrderItem[];
  address: CustomerAddress | string;
  paymentMethod: 'googlepay' | 'phonepe' | 'upi' | 'cod';
  upiId?: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  estimatedDelivery: Date;
  timeline: TimelineItem[];
}

class OrderService {
  private initializeTimeline(): TimelineItem[] {
    return [
      {
        status: 'placed',
        label: 'Order Placed',
        description: 'Your order has been placed successfully',
        completed: true,
        timestamp: new Date()
      },
      {
        status: 'accepted',
        label: 'Order Accepted',
        description: 'Restaurant has accepted your order',
        completed: false,
        timestamp: null
      },
      {
        status: 'preparing',
        label: 'Preparing Food',
        description: 'The restaurant is preparing your delicious meal',
        completed: false,
        timestamp: null
      },
      {
        status: 'on_the_way',
        label: 'On the Way',
        description: 'Your order is being delivered to you',
        completed: false,
        timestamp: null
      },
      {
        status: 'delivered',
        label: 'Delivered',
        description: 'Enjoy your meal!',
        completed: false,
        timestamp: null
      }
    ];
  }

  async createOrder(
    items: OrderItem[],
    address: CustomerAddress | string,
    paymentMethod: 'googlepay' | 'phonepe' | 'upi' | 'cod',
    totalAmount: number,
    upiId?: string
  ): Promise<string> {
    try {
      const timeline = this.initializeTimeline();
      
      const docRef = await addDoc(collection(db, 'orders'), {
        items,
        address,
        paymentMethod,
        upiId: upiId || null,
        totalAmount,
        status: 'placed',
        createdAt: serverTimestamp(),
        estimatedDelivery: new Date(Date.now() + 35 * 60 * 1000), // 35 minutes
        timeline: timeline.map(item => ({
          ...item,
          timestamp: item.timestamp ? serverTimestamp() : null
        }))
      });

      console.log('Order created with ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  }

  async getOrder(id: string): Promise<Order | null> {
    try {
      const docRef = doc(db, 'orders', id);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          estimatedDelivery: data.estimatedDelivery?.toDate() || new Date(),
          timeline: data.timeline?.map((item: any) => ({
            ...item,
            timestamp: item.timestamp?.toDate() || null
          })) || this.initializeTimeline()
        } as Order;
      }
      return null;
    } catch (error) {
      console.error('Error getting order:', error);
      return null;
    }
  }

  async updateOrderStatus(id: string, status: OrderStatus): Promise<void> {
    try {
      const order = await this.getOrder(id);
      if (!order) throw new Error('Order not found');

      // Update timeline
      const updatedTimeline = order.timeline.map(item => {
        if (item.status === status) {
          return {
            ...item,
            completed: true,
            timestamp: new Date()
          };
        }
        return item;
      });

      const docRef = doc(db, 'orders', id);
      await updateDoc(docRef, {
        status,
        timeline: updatedTimeline.map(item => ({
          ...item,
          timestamp: item.timestamp ? serverTimestamp() : null
        }))
      });
      
      console.log('Order status updated:', status);
    } catch (error) {
      console.error('Error updating order status:', error);
      throw error;
    }
  }

  // Get orders by status for restaurant/admin dashboard
  async getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
    try {
      // Implementation would use Firebase query
      // This is a placeholder for the actual Firebase query
      console.log(`Fetching orders with status: ${status}`);
      return [];
    } catch (error) {
      console.error('Error fetching orders by status:', error);
      return [];
    }
  }

  // Calculate delivery time based on distance/location
  calculateEstimatedDelivery(address: CustomerAddress | string): Date {
    const baseTime = 25; // Base delivery time in minutes
    const variableTime = Math.floor(Math.random() * 20) + 10; // 10-30 minutes
    return new Date(Date.now() + (baseTime + variableTime) * 60 * 1000);
  }

  // Get order timeline progress percentage
  getOrderProgress(timeline: TimelineItem[]): number {
    const completedCount = timeline.filter(item => item.completed).length;
    return (completedCount / timeline.length) * 100;
  }

  // Check if order can be cancelled
  canCancelOrder(status: OrderStatus): boolean {
    return ['placed', 'accepted'].includes(status);
  }

  // Cancel order
  async cancelOrder(id: string): Promise<void> {
    try {
      const order = await this.getOrder(id);
      if (!order) throw new Error('Order not found');
      
      if (!this.canCancelOrder(order.status)) {
        throw new Error('Order cannot be cancelled at this stage');
      }

      const docRef = doc(db, 'orders', id);
      await updateDoc(docRef, {
        status: 'cancelled',
        cancelledAt: serverTimestamp()
      });
      
      console.log('Order cancelled:', id);
    } catch (error) {
      console.error('Error cancelling order:', error);
      throw error;
    }
  }
}

export const orderService = new OrderService();

// Helper functions for UI components
export const getStatusColor = (status: OrderStatus): string => {
  const colors = {
    placed: 'bg-green-500',
    accepted: 'bg-blue-500',
    preparing: 'bg-orange-500',
    on_the_way: 'bg-purple-500',
    delivered: 'bg-green-600'
  };
  return colors[status] || 'bg-gray-400';
};

export const getStatusText = (status: OrderStatus): string => {
  const texts = {
    placed: 'Order Placed',
    accepted: 'Order Accepted', 
    preparing: 'Preparing Food',
    on_the_way: 'On the Way',
    delivered: 'Delivered'
  };
  return texts[status] || status;
};

// Usage example:
/*
import { orderService, OrderItem, CustomerAddress } from './services/orderService';

const items: OrderItem[] = [
  { name: 'Hakka Noodles', quantity: 1, price: 220 },
  { name: 'Chicken Fried Rice', quantity: 1, price: 280 }
];

const address: CustomerAddress = {
  street: '123 MG Road',
  city: 'Bangalore',
  state: 'Karnataka', 
  pincode: '560001',
  fullAddress: '123 MG Road, Bangalore, Karnataka 560001'
};

// Create order
const orderId = await orderService.createOrder(
  items,
  address,
  'googlepay',
  500
);

// Get order
const order = await orderService.getOrder(orderId);

// Update status
await orderService.updateOrderStatus(orderId, 'accepted');
*/