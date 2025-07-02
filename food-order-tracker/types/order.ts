// types/order.ts

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
}

export interface CustomerAddress {
  name: string;
  street: string;
  city: string;
  pincode: string;
  phone?: string;
}

export type PaymentMethod = 'googlepay' | 'phonepe' | 'upi' | 'cod';

export type OrderStatus = 'placed' | 'preparing' | 'picked' | 'on_way' | 'delivered';

export interface Order {
  id: string;
  items: OrderItem[];
  address: CustomerAddress;
  paymentMethod: PaymentMethod;
  upiId?: string;
  totalAmount: number;
  status: OrderStatus;
  createdAt: Date;
  estimatedDelivery: Date;
}

// Helper type for creating orders (without auto-generated fields)
export type CreateOrderData = Omit<Order, 'id' | 'createdAt' | 'estimatedDelivery'>;

// Status display names for UI
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  placed: 'Order Placed',
  preparing: 'Preparing Your Food',
  picked: 'Order Picked Up',
  on_way: 'On the Way',
  delivered: 'Delivered'
};

// Status progress for progress bar
export const ORDER_STATUS_PROGRESS: Record<OrderStatus, number> = {
  placed: 20,
  preparing: 40,
  picked: 60,
  on_way: 80,
  delivered: 100
};