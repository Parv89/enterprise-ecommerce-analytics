import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ShoppingBag, Star, ShieldCheck, Truck, Check, ArrowLeft } from 'lucide-react';
import api from '../api/client';
import { Product } from '../types';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export const ProductDetails: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImage, setActiveImage] = useState<string>('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${slug}`);
        if (res.data.success) {
          setProduct(res.data.product);
          if (res.data.product.images?.length) {
            setActiveImage(res.data.product.images[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [slug]);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 space-y-4">
        <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
        <Link to="/shop" className="inline-flex items-center space-x-2 text-blue-600 font-semibold hover:underline">
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
      
      <Link to="/shop" className="inline-flex items-center space-x-2 text-sm font-semibold text-gray-600 hover:text-blue-600 transition">
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Product Catalog</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 bg-white p-8 rounded-3xl border border-gray-200 shadow-sm">
        
        {/* Left: Image Gallery */}
        <div className="space-y-4">
          <div className="aspect-square rounded-2xl overflow-hidden bg-gray-50 border border-gray-200">
            <img
              src={activeImage || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
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
                    activeImage === img ? 'border-blue-600 ring-2 ring-blue-600/30' : 'border-gray-200 opacity-70 hover:opacity-100'
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
              <span className="text-xs font-bold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
                {product.category?.name || 'Enterprise Hardware'}
              </span>
              <span className="text-xs font-mono text-gray-500">SKU: {product.sku}</span>
            </div>

            <h1 className="text-3xl font-extrabold text-gray-900 leading-tight">{product.name}</h1>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-1 text-amber-400">
                <Star className="w-4 h-4 fill-current" />
                <span className="text-sm font-bold text-gray-900">{product.ratingsAvg}</span>
                <span className="text-xs text-gray-400">({product.ratingsCount} verified reviews)</span>
              </div>
              <span className="text-gray-300">|</span>
              <span className={`text-xs font-semibold px-2.5 py-1 rounded-md ${
                product.stock > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
              }`}>
                {product.stock > 0 ? `In Stock (${product.stock} units)` : 'Out of Stock'}
              </span>
            </div>

            <div className="pt-2">
              <span className="text-4xl font-black text-gray-900">${product.price.toFixed(2)}</span>
              {product.compareAtPrice && (
                <span className="text-lg text-gray-400 line-through ml-3">
                  ${product.compareAtPrice.toFixed(2)}
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm leading-relaxed border-t border-gray-100 pt-4">
              {product.description}
            </p>
          </div>

          {/* Controls */}
          <div className="space-y-4 border-t border-gray-100 pt-6">
            <div className="flex items-center space-x-4">
              <div className="flex items-center border border-gray-300 rounded-xl bg-gray-50">
                <button
                  onClick={() => setQuantity((q) => Math.max(q - 1, 1))}
                  className="px-3.5 py-2 text-gray-600 hover:text-gray-900 font-bold"
                >
                  -
                </button>
                <span className="px-4 text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => Math.min(q + 1, product.stock))}
                  className="px-3.5 py-2 text-gray-600 hover:text-gray-900 font-bold"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={product.stock <= 0}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-bold py-3.5 px-6 rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
              >
                <ShoppingBag className="w-5 h-5" />
                <span>Add to Cart</span>
              </button>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100 text-xs text-gray-600">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-blue-600" />
                <span>2-Year Enterprise Warranty</span>
              </div>
              <div className="flex items-center space-x-2">
                <Truck className="w-4 h-4 text-emerald-600" />
                <span>Express Regional Shipping</span>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
