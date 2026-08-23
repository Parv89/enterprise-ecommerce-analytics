import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Star, ShieldCheck, Truck, ArrowLeft } from 'lucide-react';
import api from '../api/client';
import { Product } from '../types';
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
    category: { id: 'cat-001', name: 'Electronics & Gadgets', slug: 'electronics' },
    images: [
      'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800',
      'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800'
    ],
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
    category: { id: 'cat-002', name: 'Audio & Acoustics', slug: 'audio' },
    images: [
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800',
      'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800'
    ],
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
    category: { id: 'cat-003', name: 'Smart Wearables', slug: 'wearables' },
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
    category: { id: 'cat-004', name: 'Smart Office', slug: 'home-office' },
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
    category: { id: 'cat-001', name: 'Electronics & Gadgets', slug: 'electronics' },
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
    category: { id: 'cat-002', name: 'Audio & Acoustics', slug: 'audio' },
    images: ['https://images.unsplash.com/photo-1545454675-3531b543be5d?w=800'],
    isFeatured: false,
    ratingsAvg: 4.6,
    ratingsCount: 31
  }
];

export const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(() => {
    return FALLBACK_PRODUCTS.find((p) => p.slug === slug || p.id === slug) || FALLBACK_PRODUCTS[0];
  });
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.data.success && res.data.product) {
          setProduct(res.data.product);
          if (res.data.product.images?.length) {
            setActiveImage(res.data.product.images[0]);
          }
        }
      } catch (err) {
        console.warn('Using client fallback for Product Details:', err);
      }
    };

    const foundFallback = FALLBACK_PRODUCTS.find((p) => p.slug === slug || p.id === slug);
    if (foundFallback) {
      setProduct(foundFallback);
      if (foundFallback.images?.length) setActiveImage(foundFallback.images[0]);
    }

    fetchProduct();
  }, [slug]);

  if (!product) {
    return (
      <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-2xl border border-gray-200 dark:border-slate-800 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Product Not Found</h2>
        <Link to="/shop" className="inline-flex items-center space-x-2 text-blue-600 dark:text-blue-400 font-semibold hover:underline">
          <ArrowLeft className="w-4 h-4" />
          <span>Return to Catalog</span>
        </Link>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, quantity);
    toast.success(`Added ${quantity} x "${product.name}" to cart!`);
  };

  return (
    <div className="space-y-12">
      
      <Link to="/shop" className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Product Catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm">
        
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700">
            <img
              src={activeImage || product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {product.images.length > 1 && (
            <div className="flex space-x-3 overflow-x-auto pb-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition ${
                    activeImage === img ? 'border-blue-600 ring-2 ring-blue-600/30' : 'border-gray-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Details & Purchase Panel */}
        <div className="flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-widest bg-blue-50 dark:bg-blue-900/30 px-3 py-1 rounded-full border border-blue-200 dark:border-blue-800">
                {product.category?.name || 'Enterprise Hardware'}
              </span>
              <span className="text-xs font-mono text-gray-500 dark:text-slate-400">SKU: {product.sku}</span>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white leading-tight">{product.name}</h1>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold text-gray-900 dark:text-white">{product.ratingsAvg}</span>
                <span className="text-xs text-gray-400 dark:text-slate-500">({product.ratingsCount} verified reviews)</span>
              </div>
              <span className="text-gray-300 dark:text-slate-700">|</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                product.stock > 0 ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300'
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>

            <div className="pt-2">
              <span className="text-4xl font-black text-gray-900 dark:text-white">${product.price.toFixed(2)}</span>
              {product.compareAtPrice && (
                <span className="text-lg text-gray-400 dark:text-slate-500 line-through ml-3">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed border-t border-gray-100 dark:border-slate-800 pt-4">
              {product.description}
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-4 border-t border-gray-100 dark:border-slate-800 pt-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 dark:border-slate-700 rounded-xl bg-gray-50 dark:bg-slate-800">
                <button
                  onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                  className="px-3.5 py-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white font-bold"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold text-gray-900 dark:text-white">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(q + 1, product.stock))}
                  className="px-3.5 py-2 text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 dark:disabled:bg-slate-800 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 dark:border-slate-800 text-xs text-gray-600 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                <span>2-Year Enterprise Warranty</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                <span>Express Regional Shipping</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
