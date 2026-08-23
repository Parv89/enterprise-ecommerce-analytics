import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, ShieldCheck, User as UserIcon, LogOut, Search, LayoutDashboard, Sun, Moon, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export const Navbar: React.FC = () => {
  const { user, logout, isManagerOrAdmin } = useAuth();
  const { itemCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('theme') === 'dark' || document.documentElement.classList.contains('dark');
  });

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => setIsDarkMode((prev) => !prev);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const isAdminView = location.pathname.startsWith('/admin');

  return (
    <header className="sticky top-0 z-50 bg-slate-900 text-white shadow-md border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-4">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 text-xl font-bold tracking-tight text-white hover:text-blue-400 transition">
            <div className="bg-blue-600 p-2 rounded-lg text-white shadow-md shadow-blue-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <span className="hidden sm:inline">Enterprise<span className="text-blue-500">Commerce</span></span>
          </Link>

          {/* Instant Search Bar */}
          <form onSubmit={handleSearchSubmit} className="flex-1 max-w-md relative hidden md:block">
            <input
              type="text"
              placeholder="Search enterprise catalog by SKU, product, specs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-800 text-white text-sm rounded-lg pl-10 pr-4 py-2 border border-slate-700 focus:outline-none focus:border-blue-500 transition"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          </form>

          {/* Right Controls */}
          <div className="flex items-center space-x-4">
            
            {/* Catalog Link */}
            <Link to="/shop" className="text-sm font-medium text-slate-300 hover:text-white transition">
              Catalog
            </Link>

            {/* Quick Mode Toggle (Storefront vs Admin Portal) for Admin/Manager */}
            {isManagerOrAdmin && (
              <div className="flex items-center bg-slate-800 p-1 rounded-xl border border-slate-700">
                <button
                  onClick={() => navigate('/')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    !isAdminView ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Switch to Customer Store View"
                >
                  <Store className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Store</span>
                </button>
                <button
                  onClick={() => navigate('/admin')}
                  className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition ${
                    isAdminView ? 'bg-blue-600 text-white shadow-sm' : 'text-slate-400 hover:text-white'
                  }`}
                  title="Switch to Admin Analytics Suite"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span className="hidden lg:inline">Admin</span>
                </button>
              </div>
            )}

            {/* Dark / Light Theme Toggle Switch */}
            <button
              onClick={toggleTheme}
              className="p-2 text-slate-300 hover:text-amber-400 bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700 transition"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-5 h-5 text-amber-400" />
              ) : (
                <Moon className="w-5 h-5 text-blue-300" />
              )}
            </button>

            {/* Cart Icon */}
            <Link to="/cart" className="relative p-2 text-slate-300 hover:text-white transition">
              <ShoppingBag className="w-6 h-6" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
                  {itemCount}
                </span>
              )}
            </Link>

            {/* Auth Dropdown / Buttons */}
            {user ? (
              <div className="flex items-center space-x-3 border-l border-slate-700 pl-4">
                <Link to="/my-orders" className="flex items-center space-x-2 text-sm text-slate-300 hover:text-white">
                  {user.avatar ? (
                    <img src={user.avatar} alt={user.name} className="w-8 h-8 rounded-full border border-slate-600" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center font-bold text-xs">
                      {user.name.substring(0, 2).toUpperCase()}
                    </div>
                  )}
                  <span className="hidden lg:inline text-sm font-medium">{user.name}</span>
                </Link>
                <button
                  onClick={logout}
                  title="Logout"
                  className="p-1.5 text-slate-400 hover:text-rose-400 transition"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Link to="/login" className="text-sm font-medium text-slate-300 hover:text-white px-3 py-1.5">
                  Sign In
                </Link>
                <Link to="/register" className="text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white px-3.5 py-1.5 rounded-lg transition shadow-sm">
                  Register
                </Link>
              </div>
            )}

          </div>

        </div>
      </div>
    </header>
  );
};
