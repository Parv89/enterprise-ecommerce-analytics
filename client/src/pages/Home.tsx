import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ShieldCheck, Truck, CreditCard, Award, Star, ShoppingBag } from 'lucide-react';
import api from '../api/client';
import { Product, Category } from '../types';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

// Fallback Demo Products for Guaranteed Vercel Live Display
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 'prod-001',
    name: 'ApexPro M3 Workstation Laptop',
    slug: 'apexpro-m3-workstation',
    description: 'Next-generation 16-inch computing power with 64GB Unified Memory and 2TB NVMe SSD.',
    price: 2499.99,
    compareAtPrice: 2799.99,
    stock: 45,
    sku: 'APX-M3-001',
    categoryId: 'cat-001',
    images: ['https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800'],
    isFeatured: true,
    ratingsAvg: 4.9,
    ratingsCount: 128
  },
  {
    id: 'prod-002',
    name: 'AcousticMax Horizon Headphones',
    slug: 'acousticmax-horizon-headphones',
    description: 'Active ANC with spatial audio streaming and 40-hour battery stamina.',
    price: 349.99,
    compareAtPrice: 399.99,
    stock: 120,
    sku: 'AUD-NC-900',
    categoryId: 'cat-002',
    images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800'],
    isFeatured: true,
    ratingsAvg: 4.8,
    ratingsCount: 94
  },
  {
    id: 'prod-003',
    name: 'ChronoTech Ultra Titanium Smartwatch',
    slug: 'chronotech-ultra-titanium',
    description: 'Aerospace grade titanium casing, OLED Display, GPS, and ECG monitor.',
    price: 799.00,
    compareAtPrice: 899.00,
    stock: 8,
    sku: 'WRB-TITAN-05',
    categoryId: 'cat-003',
    images: ['https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800'],
    isFeatured: true,
    ratingsAvg: 4.7,
    ratingsCount: 65
  },
  {
    id: 'prod-004',
    name: 'OmniCam 4K Cinematic Camera',
    slug: 'omnicam-4k-cinematic',
    description: 'Full-frame sensor with 4K 120fps recording capability and 5-axis IBIS.',
    price: 1899.00,
    compareAtPrice: 2099.00,
    stock: 3,
    sku: 'CAM-4K-990',
    categoryId: 'cat-001',
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800'],
    isFeatured: true,
    ratingsAvg: 4.9,
    ratingsCount: 88
  }
];

const FALLBACK_CATEGORIES: Category[] = [
  { id: 'cat-001', name: 'Electronics & Gadgets', slug: 'electronics', description: 'Workstations, laptops, smartphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', _count: { products: 12 } },
  { id: 'cat-002', name: 'Audio & Acoustics', slug: 'audio', description: 'Studio monitors, ANC headphones', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500', _count: { products: 8 } },
  { id: 'cat-003', name: 'Smart Wearables', slug: 'wearables', description: 'Titanium smartwatches & health trackers', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', _count: { products: 6 } },
  { id: 'cat-004', name: 'Smart Office', slug: 'home-office', description: 'Ergonomic standing desks & lighting', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500', _count: { products: 9 } }
];

export const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          api.get('/products?isFeatured=true&limit=4'),
          api.get('/products/categories')
        ]);
        if (prodRes.data.success && prodRes.data.products?.length > 0) {
          setFeaturedProducts(prodRes.data.products);
        }
        if (catRes.data.success && catRes.data.categories?.length > 0) {
          setCategories(catRes.data.categories);
        }
      } catch (err) {
        console.warn('Using client fallback data for Home page:', err);
      }
    };
    fetchData();
  }, []);

  const handleAddToCart = (product: Product, e: React.MouseEvent) => {
    e.preventDefault();
    addToCart(product, 1);
    toast.success(`Added "${product.name}" to cart!`);
  };

  return (
    <div className="space-y-16">
      
      {/* Hero Banner */}
      <section className="relative bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white py-20 px-6 sm:px-12 rounded-3xl overflow-hidden shadow-2xl border border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(#3b82f6_1px,transparent_1px)] [background-size:16px_16px] opacity-10"></div>
        
        <div className="relative max-w-3xl space-y-6">
          <div className="inline-flex items-center space-x-2 bg-blue-500/20 text-blue-300 border border-blue-400/30 text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-wider">
            <Award className="w-3.5 h-3.5" />
            <span>Enterprise Grade Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight leading-tight">
            Next-Gen Commerce & <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 to-indigo-300 bg-clip-text text-transparent">
              Real-Time Analytics
            </span>
          </h1>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            Empower your enterprise with scalable inventory control, instant checkout security, role-based administration, and automated financial insights.
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link
              to="/shop"
              className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-6 py-3.5 rounded-xl transition shadow-lg shadow-blue-600/30"
            >
              <span>Explore Products</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              to="/admin"
              className="inline-flex items-center space-x-2 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold px-6 py-3.5 rounded-xl transition"
            >
              <ShieldCheck className="w-4 h-4 text-blue-400" />
              <span>Launch Admin Dashboard</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start space-x-4">
          <div className="p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl">
            <Truck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Priority Express Dispatch</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Tracked real-time fulfillment across regional warehouses.</p>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start space-x-4">
          <div className="p-3 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl">
            <CreditCard className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Stripe Payment Gateway</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Encrypted transactions & instant payment status sync.</p>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start space-x-4">
          <div className="p-3 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-xl">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">RBAC Security</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Role-based controls for Admin, Manager, & Customers.</p>
          </div>
        </div>

        <div className="p-6 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-start space-x-4">
          <div className="p-3 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl">
            <Award className="w-6 h-6" />
          </div>
          <div>
            <h3 className="font-bold text-gray-900 dark:text-white">Analytics & Reports</h3>
            <p className="text-xs text-gray-500 dark:text-slate-400 mt-1">Recharts metrics, conversion tracking & CSV exports.</p>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Shop by Category</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">Discover premium hardware, wearables, and audio technology.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.id}
              to={`/shop?category=${cat.slug}`}
              className="group relative h-48 rounded-2xl overflow-hidden shadow-md border border-slate-200 dark:border-slate-800"
            >
              <img
                src={cat.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                alt={cat.name}
                className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/30 to-transparent p-5 flex flex-col justify-end">
                <h3 className="text-lg font-bold text-white group-hover:text-blue-300 transition">{cat.name}</h3>
                <p className="text-xs text-slate-300 line-clamp-1">{cat.description}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products Showcase */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Featured Products</h2>
            <p className="text-sm text-gray-500 dark:text-slate-400">Top-tier enterprise gear picked for high performance.</p>
          </div>
          <Link to="/shop" className="text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 flex items-center space-x-1">
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <div key={product.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-lg transition group flex flex-col justify-between">
              <Link to={`/product/${product.slug}`} className="block relative aspect-video overflow-hidden bg-gray-100 dark:bg-slate-800">
                <img
                  src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                {product.compareAtPrice && (
                  <span className="absolute top-3 left-3 bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                    Save ${(product.compareAtPrice - product.price).toFixed(0)}
                  </span>
                )}
              </Link>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide">
                    {product.category?.name || 'Hardware'}
                  </span>
                  <Link to={`/product/${product.slug}`} className="block mt-1">
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-1">
                      {product.name}
                    </h3>
                  </Link>
                  <div className="flex items-center space-x-1 mt-1 text-amber-400">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span className="text-xs font-semibold text-gray-700 dark:text-slate-300">{product.ratingsAvg}</span>
                    <span className="text-xs text-gray-400 dark:text-slate-500">({product.ratingsCount})</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-slate-800">
                  <div>
                    <span className="text-lg font-bold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
                    {product.compareAtPrice && (
                      <span className="text-xs text-gray-400 dark:text-slate-500 line-through ml-2">
                        ${product.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>
                  <button
                    onClick={(e) => handleAddToCart(product, e)}
                    disabled={product.stock <= 0}
                    className="p-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-slate-800 text-white rounded-xl transition"
                    title="Add to Cart"
                  >
                    <ShoppingBag className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
