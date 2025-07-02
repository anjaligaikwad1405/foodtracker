// services/deliveryService.ts - Mock backend for live tracking

export interface DeliveryUpdate {
  orderId: string;
  agentLocation: {
    latitude: number;
    longitude: number;
  };
  status: 'picked_up' | 'on_the_way' | 'nearby' | 'delivered';
  timestamp: number;
  estimatedArrival: string;
}

// Internal interface for route points
interface RoutePoint {
  latitude: number;
  longitude: number;
}

class DeliveryTrackingService {
  private mockRoutes: Map<string, Array<RoutePoint>> = new Map();
  private currentPositions: Map<string, number> = new Map();
  
  constructor() {
    this.initializeMockRoutes();
  }

  private initializeMockRoutes() {
    // Mock route from restaurant to customer (Mumbai coordinates)
    const sampleRoute: RoutePoint[] = [
      { latitude: 19.0760, longitude: 72.8777 }, // Restaurant (starting point)
      { latitude: 19.0770, longitude: 72.8770 }, // Moving towards customer
      { latitude: 19.0780, longitude: 72.8760 }, // Point 2
      { latitude: 19.0800, longitude: 72.8740 }, // Point 3
      { latitude: 19.0820, longitude: 72.8720 }, // Point 4
      { latitude: 19.0840, longitude: 72.8700 }, // Point 5
      { latitude: 19.0860, longitude: 72.8680 }, // Getting closer
      { latitude: 19.0880, longitude: 72.8660 }, // Almost there
      { latitude: 19.0896, longitude: 72.8656 }, // Customer location (final)
    ];
    
    this.mockRoutes.set('default', sampleRoute);
  }

  // Start tracking an order
  startTracking(orderId: string): void {
    this.currentPositions.set(orderId, 0);
  }

  // Get current delivery status
  async getDeliveryUpdate(orderId: string): Promise<DeliveryUpdate> {
    const route = this.mockRoutes.get('default') || [];
    const currentIndex = this.currentPositions.get(orderId) || 0;
    
    if (currentIndex >= route.length) {
      return {
        orderId,
        agentLocation: route[route.length - 1],
        status: 'delivered',
        timestamp: Date.now(),
        estimatedArrival: 'Delivered!'
      };
    }

    const currentPos = route[currentIndex];
    const remainingStops = route.length - currentIndex - 1;
    const estimatedMinutes = remainingStops * 2; // 2 minutes per stop

    let status: DeliveryUpdate['status'] = 'on_the_way';
    if (currentIndex === 0) status = 'picked_up';
    else if (remainingStops <= 2) status = 'nearby';
    else if (remainingStops === 0) status = 'delivered';

    // Move to next position for next call
    this.currentPositions.set(orderId, currentIndex + 1);

    return {
      orderId,
      agentLocation: currentPos, // Now correctly matches the interface
      status,
      timestamp: Date.now(),
      estimatedArrival: estimatedMinutes > 0 ? `${estimatedMinutes} minutes` : 'Arriving now'
    };
  }

  // Simulate real-time updates
  subscribeToUpdates(orderId: string, callback: (update: DeliveryUpdate) => void): () => void {
    const interval = setInterval(async () => {
      const update = await this.getDeliveryUpdate(orderId);
      callback(update);
      
      if (update.status === 'delivered') {
        clearInterval(interval);
      }
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }

  // Reset tracking for testing purposes
  resetTracking(orderId: string): void {
    this.currentPositions.set(orderId, 0);
  }

  // Get the full route for drawing on map
  getRoute(orderId: string = 'default'): RoutePoint[] {
    return this.mockRoutes.get('default') || [];
  }

  // Get restaurant location
  getRestaurantLocation(): RoutePoint {
    const route = this.mockRoutes.get('default') || [];
    return route[0] || { latitude: 19.0760, longitude: 72.8777 };
  }

  // Get customer location
  getCustomerLocation(): RoutePoint {
    const route = this.mockRoutes.get('default') || [];
    return route[route.length - 1] || { latitude: 19.0896, longitude: 72.8656 };
  }
}

export const deliveryService = new DeliveryTrackingService();

// Optional: Real backend API calls (for future use)
export class RealDeliveryAPI {
  private baseURL = 'https://your-api-endpoint.com';

  async getDeliveryStatus(orderId: string): Promise<DeliveryUpdate> {
    try {
      const response = await fetch(`${this.baseURL}/orders/${orderId}/delivery`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Failed to fetch delivery status:', error);
      throw error;
    }
  }

  async updateDeliveryLocation(orderId: string, location: RoutePoint): Promise<void> {
    try {
      const response = await fetch(`${this.baseURL}/orders/${orderId}/location`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          location, 
          timestamp: Date.now() 
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Failed to update location:', error);
      throw error;
    }
  }
}

// Usage example in your React component:
/*
import { deliveryService } from './services/deliveryService';

const TrackingComponent = ({ orderId }: { orderId: string }) => {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [deliveryStatus, setDeliveryStatus] = useState('picked_up');
  const [eta, setETA] = useState('');

  useEffect(() => {
    deliveryService.startTracking(orderId);
    
    const unsubscribe = deliveryService.subscribeToUpdates(orderId, (update) => {
      setCurrentLocation(update.agentLocation);
      setDeliveryStatus(update.status);
      setETA(update.estimatedArrival);
    });

    return unsubscribe; // Cleanup subscription
  }, [orderId]);

  return (
    // Your component JSX
  );
};
*/