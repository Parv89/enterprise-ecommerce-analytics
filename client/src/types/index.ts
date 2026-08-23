export interface User {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'MANAGER' | 'CUSTOMER';
  phone?: string;
  avatar?: string;
  createdAt?: string;
  _count?: {
    orders: number;
  };
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  _count?: {
    products: number;
  };
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  sku: string;
  images: string[];
  isFeatured: boolean;
  ratingsAvg: number;
  ratingsCount: number;
  categoryId: string;
  category?: Category;
}

export interface OrderItem {
  id: string;
  productId: string;
  product: Product;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user?: User;
  status: 'PENDING' | 'PAID' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  totalAmount: number;
  shippingAddress: string;
  paymentMethod: string;
  paymentStatus: 'PENDING' | 'COMPLETED' | 'FAILED' | 'REFUNDED';
  trackingNumber?: string;
  createdAt: string;
  items: OrderItem[];
}

export interface AnalyticsMetrics {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  totalProducts: number;
  avgOrderValue: number;
  conversionRate: number;
  lowStockCount: number;
}

export interface RevenueTrend {
  month: string;
  revenue: number;
}

export interface TopProduct {
  id: string;
  name: string;
  totalUnitsSold: number;
  totalRevenue: number;
}
