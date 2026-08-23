import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
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
