import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Filter, ShoppingBag, Star, X } from 'lucide-react';
import api from '../api/client';
import { Product, Category } from '../types';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export const Shop: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
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
        if (res.data.success) setCategories(res.data.categories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
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
        if (res.data.success) {
          setProducts(res.data.products);
          setTotal(res.data.pagination.total);
          setTotalPages(res.data.pagination.totalPages);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
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
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">Showing {total} available products</p>
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
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 bg-gray-200 dark:bg-slate-800 animate-pulse rounded-2xl"></div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white dark:bg-slate-900 p-12 rounded-2xl border border-gray-200 dark:border-slate-800 text-center space-y-3">
              <p className="text-gray-500 dark:text-slate-400 text-lg">No products match your active search filters.</p>
              <button onClick={clearFilters} className="text-sm text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Clear Filters & View Catalog
              </button>
            </div>
          ) : (
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
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-6">
              <button
                onClick={() => setPage((p) => Math.max(p - 1, 1))}
                disabled={page === 1}
                className="px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 text-sm font-semibold text-gray-800 dark:text-slate-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                Previous
              </button>
              <span className="text-sm font-medium text-gray-600 dark:text-slate-400">
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                disabled={page === totalPages}
                className="px-4 py-2 bg-white dark:bg-slate-900 border border-gray-300 dark:border-slate-800 text-sm font-semibold text-gray-800 dark:text-slate-200 rounded-lg disabled:opacity-50 hover:bg-gray-50 dark:hover:bg-slate-800"
              >
                Next
              </button>
            </div>
          )}
        </main>
      </div>

    </div>
  );
};
