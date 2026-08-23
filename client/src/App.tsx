import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet, Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { AdminSidebar } from './components/AdminSidebar';
import { ProtectedRoute } from './components/ProtectedRoute';

import { Home } from './pages/Home';
import { Shop } from './pages/Shop';
import { ProductDetails } from './pages/ProductDetails';
import { Cart } from './pages/Cart';
import { Checkout } from './pages/Checkout';
import { OrderConfirmation } from './pages/OrderConfirmation';
import { MyOrders } from './pages/MyOrders';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

import { DashboardOverview } from './pages/admin/DashboardOverview';
import { ProductManagement } from './pages/admin/ProductManagement';
import { OrderManagement } from './pages/admin/OrderManagement';
import { CustomerManagement } from './pages/admin/CustomerManagement';
import { AnalyticsReports } from './pages/admin/AnalyticsReports';

// 404 Not Found Component
const NotFound: React.FC = () => (
  <div className="text-center py-24 space-y-4">
    <h1 className="text-6xl font-black text-blue-600">404</h1>
    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Page Not Found</h2>
    <p className="text-slate-500 dark:text-slate-400 text-sm max-w-md mx-auto">
      The requested route or resource does not exist on the platform.
    </p>
    <Link to="/" className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2.5 rounded-xl transition">
      Return to Store Homepage
    </Link>
  </div>
);

// Store Layout (Navbar + Content + Footer)
const StoreLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col justify-between bg-slate-50 dark:bg-slate-950 text-gray-900 dark:text-slate-100 transition-colors duration-200">
    <div>
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16">
        <Outlet />
      </main>
    </div>
    <Footer />
  </div>
);

// Admin Layout (Dark theme with AdminSidebar)
const AdminLayout: React.FC = () => (
  <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col transition-colors duration-200">
    <Navbar />
    <div className="flex-1 flex">
      <AdminSidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  </div>
);

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <Toaster position="top-right" toastOptions={{ duration: 4000 }} />
          
          <Routes>
            {/* Customer Store Front */}
            <Route element={<StoreLayout />}>
              <Route path="/" element={<Home />} />
              <Route path="/shop" element={<Shop />} />
              <Route path="/product/:slug" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected Customer Routes */}
              <Route element={<ProtectedRoute allowedRoles={['CUSTOMER', 'MANAGER', 'ADMIN']} />}>
                <Route path="/checkout" element={<Checkout />} />
                <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                <Route path="/my-orders" element={<MyOrders />} />
              </Route>

              {/* 404 Catch All */}
              <Route path="*" element={<NotFound />} />
            </Route>

            {/* Protected Admin & Manager Portal */}
            <Route element={<ProtectedRoute allowedRoles={['ADMIN', 'MANAGER']} />}>
              <Route element={<AdminLayout />}>
                <Route path="/admin" element={<DashboardOverview />} />
                <Route path="/admin/products" element={<ProductManagement />} />
                <Route path="/admin/orders" element={<OrderManagement />} />
                <Route path="/admin/customers" element={<CustomerManagement />} />
                <Route path="/admin/analytics" element={<AnalyticsReports />} />
              </Route>
            </Route>

          </Routes>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
