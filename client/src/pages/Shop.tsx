import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, ShoppingBag, Star, X } from 'lucide-react';
import api from '../api/client';
import { Product, Category } from '../types';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

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
    name: 'ErgoMotion Smart Standing Desk Pro',
    slug: 'ergomotion-smart-standing-desk',
    description: 'Dual electric motors, solid walnut top, and programmable memory presets.',
    price: 899.50,
    compareAtPrice: 1049.00,
    stock: 18,
    sku: 'DESK-ERG-01',
    categoryId: 'cat-004',
    images: ['https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=800'],
    isFeatured: false,
    ratingsAvg: 4.9,
    ratingsCount: 42
  },
  {
    id: 'prod-005',
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
  },
  {
    id: 'prod-006',
    name: 'PulseSound Studio Reference Monitors',
    slug: 'pulsesound-studio-monitors',
    description: 'Bi-amplified 8-inch studio reference speakers with custom Kevlar woofers.',
    price: 599.99,
    compareAtPrice: 699.99,
    stock: 32,
    sku: 'AUD-MON-808',
    categoryId: 'cat-002',
    images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800'],
    isFeatured: false,
    ratingsAvg: 4.6,
    ratingsCount: 31
  }
];

const FALLBACK_CATEGORIES: Category[] = [
  { id: 'cat-001', name: 'Electronics & Gadgets', slug: 'electronics', description: 'Workstations, laptops, smartphones', image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=500', _count: { products: 12 } },
  { id: 'cat-002', name: 'Audio & Acoustics', slug: 'audio', description: 'Studio monitors, ANC headphones', image: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=500', _count: { products: 8 } },
  { id: 'cat-003', name: 'Smart Wearables', slug: 'wearables', description: 'Titanium smartwatches & health trackers', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500', _count: { products: 6 } },
  { id: 'cat-004', name: 'Smart Office', slug: 'home-office', description: 'Ergonomic standing desks & lighting', image: 'https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=500', _count: { products: 9 } }
];

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [categories, setCategories] = useState<Category[]>(FALLBACK_CATEGORIES);
  const [loading, setLoading] = useState(false);
  const [total, setTotal] = useState(6);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const { addToCart } = useCart();

  const searchParam = searchParams.get('search') || '';
  const categoryParam = searchParams.get('category') || '';
  const sortByParam = searchParams.get('sortBy') || 'latest';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get('/products/categories');
        if (res.data.success && res.data.categories?.length > 0) {
          setCategories(res.data.categories);
        }
      } catch (err) {
        console.warn(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const params = new URLSearchParams();
        if (searchParam) params.append('search', searchParam);
        if (categoryParam) params.append('category', categoryParam);
        if (sortByParam) params.append('sortBy', sortByParam);
        if (minPriceParam) params.append('minPrice', minPriceParam);
        if (maxPriceParam) params.append('maxPrice', maxPriceParam);
        params.append('page', page.toString());
        params.append('limit', '9');

        const res = await api.get(`/products?${params.toString()}`);
        if (res.data.success && res.data.products?.length > 0) {
          setProducts(res.data.products);
          setTotal(res.data.pagination.total);
          setTotalPages(res.data.pagination.totalPages);
        }
      } catch (err) {
        console.warn(err);
      }
    };
    fetchProducts();
  }, [searchParam, categoryParam, sortByParam, minPriceParam, maxPriceParam, page]);

  const updateParam = (key: string, value: string) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    setPage(1);
    setSearchParams(newParams);
  };

  const clearFilters = () => {
    setSearchParams(new URLSearchParams());
    setPage(1);
  };

  const handleAddToCart = (product: Product) => {
    addToCart(product, 1);
    toast.success(`Added "${product.name}" to cart!`);
  };

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-gray-200 dark:border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">Enterprise Product Catalog</h1>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Showing {products.length} available products</p>
        </div>

        <div className="flex items-center space-x-3">
          <label className="text-xs font-semibold text-gray-500 dark:text-slate-400 uppercase">Sort By:</label>
          <select
            value={sortByParam}
            onChange={(e) => updateParam('sortBy', e.target.value)}
            className="bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 text-gray-900 dark:text-white text-sm rounded-lg px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="latest">Newest Arrivals</option>
            <option value="price_asc">Price: Low to High</option>
            <option value="price_desc">Price: High to Low</option>
            <option value="rating">Top Rated</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Sidebar Filters */}
        <aside className="space-y-6 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-gray-200 dark:border-slate-800 h-fit">
          <div className="flex items-center justify-between font-bold text-gray-900 dark:text-white border-b dark:border-slate-800 pb-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span>Filters</span>
            </div>
            {(searchParam || categoryParam || minPriceParam || maxPriceParam) && (
              <button
                onClick={clearFilters}
                className="text-xs text-rose-600 hover:underline flex items-center space-x-1 font-normal"
              >
                <X className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            )}
          </div>

          {/* Search Query Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Search Keyword</label>
            <div className="relative">
              <input
                type="text"
                placeholder="Search name or SKU..."
                value={searchParam}
                onChange={(e) => updateParam('search', e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-sm rounded-lg pl-9 pr-3 py-2 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Categories</label>
            <div className="space-y-1">
              <button
                onClick={() => updateParam('category', '')}
                className={`w-full text-left px-3 py-2 rounded-lg text-sm transition ${
                  !categoryParam ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateParam('category', cat.slug)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-sm transition flex items-center justify-between ${
                    categoryParam === cat.slug ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-600 dark:text-slate-300 hover:bg-gray-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <span>{cat.name}</span>
                  <span className="text-xs text-gray-400 dark:text-slate-500 bg-gray-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">{cat._count?.products || 0}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Filter */}
          <div className="space-y-2 pt-4 border-t border-gray-100 dark:border-slate-800">
            <label className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase tracking-wider">Price Range ($)</label>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                placeholder="Min"
                value={minPriceParam}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:border-blue-500 text-gray-900 dark:text-white"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max"
                value={maxPriceParam}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-xs rounded-lg px-2.5 py-1.5 focus:border-blue-500 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="lg:col-span-3 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between group">
                <Link to={`/product/${product.slug}`} className="relative aspect-square overflow-hidden bg-gray-50 dark:bg-slate-800 block">
                  <img
                    src={product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                  />
                  {product.stock <= 5 && product.stock > 0 && (
                    <span className="absolute top-3 left-3 bg-amber-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      Only {product.stock} left
                    </span>
                  )}
                  {product.stock === 0 && (
                    <span className="absolute top-3 left-3 bg-gray-800 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
                      Out of Stock
                    </span>
                  )}
                </Link>

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-[11px] font-medium text-gray-500 dark:text-slate-400">
                      <span>SKU: {product.sku}</span>
                      <div className="flex items-center space-x-1 text-amber-400">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        <span className="text-gray-700 dark:text-slate-300 font-semibold">{product.ratingsAvg}</span>
                      </div>
                    </div>
                    <Link to={`/product/${product.slug}`} className="block mt-1">
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-slate-800">
                    <div>
                      <span className="text-xl font-extrabold text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
                      {product.compareAtPrice && (
                        <span className="text-xs text-gray-400 dark:text-slate-500 line-through ml-2">
                          ${product.compareAtPrice.toFixed(2)}
                        </span>
                      )}
                    </div>
                    <button
                      onClick={() => handleAddToCart(product)}
                      disabled={product.stock <= 0}
                      className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-slate-800 text-white text-xs font-semibold rounded-xl transition flex items-center space-x-1.5"
                    >
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

    </div>
  );
};
