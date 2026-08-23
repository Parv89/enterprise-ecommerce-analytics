import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Package, ShoppingCart, Users, BarChart3, Shield, ArrowLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const AdminSidebar: React.FC = () => {
  const { user } = useAuth();

  const navItems = [
    { label: 'Dashboard Overview', path: '/admin', icon: LayoutDashboard, exact: true },
    { label: 'Products & Inventory', path: '/admin/products', icon: Package },
    { label: 'Order Fulfillment', path: '/admin/orders', icon: ShoppingCart },
    { label: 'Customer Directory', path: '/admin/customers', icon: Users },
    { label: 'Analytics & Reports', path: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <aside className="w-64 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white min-h-[calc(100vh-4rem)] flex flex-col justify-between p-4 transition-colors duration-200">
      <div>
        <div className="mb-6 px-3 py-2 bg-slate-100 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-700">
          <div className="flex items-center space-x-2 text-xs font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
            <Shield className="w-3.5 h-3.5" />
            <span>Admin Console</span>
          </div>
          <p className="text-sm font-semibold text-slate-900 dark:text-white mt-1 truncate">{user?.name}</p>
          <span className="inline-block mt-1 text-[10px] bg-blue-500/20 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded border border-blue-400/20">
            {user?.role} ROLE
          </span>
        </div>

        <nav className="space-y-1">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.exact}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`
              }
            >
              <item.icon className="w-4 h-4" />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      </div>

      <div className="pt-4 border-t border-slate-200 dark:border-slate-800">
        <NavLink
          to="/shop"
          className="flex items-center space-x-2 px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Exit to Customer Store</span>
        </NavLink>
      </div>
    </aside>
  );
};
