import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingBag, Trash2, ArrowRight, ArrowLeft } from 'lucide-react';
import { useCart } from '../context/CartContext';

export const Cart: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, clearCart, totalAmount } = useCart();
  const navigate = useNavigate();

  if (cart.length === 0) {
    return (
      <div className="bg-white p-12 rounded-3xl border border-gray-200 text-center space-y-4 max-w-2xl mx-auto my-12">
        <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto">
          <ShoppingBag className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Your Shopping Cart is Empty</h2>
        <p className="text-gray-500 text-sm">Explore our enterprise catalog to select top-tier workstation hardware, audio gear, and wearables.</p>
        <Link
          to="/shop"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-xl transition"
        >
          <span>Browse Products</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Shopping Cart</h1>
        <button
          onClick={clearCart}
          className="text-xs text-rose-600 hover:underline flex items-center space-x-1 font-semibold"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Clear All Items</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Cart Item Table */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
            <div className="divide-y divide-gray-100">
              {cart.map((item) => (
                <div key={item.product.id} className="p-5 flex items-center justify-between gap-4">
                  <img
                    src={item.product.images[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30'}
                    alt={item.product.name}
                    className="w-20 h-20 rounded-xl object-cover border border-gray-200"
                  />

                  <div className="flex-1 min-w-0">
                    <Link to={`/product/${item.product.slug}`} className="font-bold text-gray-900 hover:text-blue-600 transition truncate block">
                      {item.product.name}
                    </Link>
                    <p className="text-xs text-gray-400 mt-0.5">SKU: {item.product.sku}</p>
                    <p className="text-sm font-semibold text-gray-700 mt-1">${item.product.price.toFixed(2)} / unit</p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center space-x-2 bg-gray-50 border border-gray-300 rounded-lg p-1">
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      className="w-7 h-7 flex items-center justify-center font-bold text-gray-600 hover:text-gray-900"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      className="w-7 h-7 flex items-center justify-center font-bold text-gray-600 hover:text-gray-900"
                    >
                      +
                    </button>
                  </div>

                  {/* Item Total */}
                  <div className="text-right min-w-[5rem]">
                    <span className="font-bold text-gray-900 block">${(item.product.price * item.quantity).toFixed(2)}</span>
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-xs text-rose-500 hover:text-rose-700 mt-1 inline-block"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Link to="/shop" className="inline-flex items-center space-x-2 text-sm font-semibold text-blue-600 hover:underline">
            <ArrowLeft className="w-4 h-4" />
            <span>Continue Shopping</span>
          </Link>
        </div>

        {/* Summary Card */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 h-fit">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Order Summary</h3>

          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Estimated Shipping</span>
              <span className="font-semibold text-emerald-600">FREE</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (Estimated)</span>
              <span className="font-semibold text-gray-900">$0.00</span>
            </div>

            <div className="border-t border-gray-100 pt-3 flex justify-between text-base font-extrabold text-gray-900">
              <span>Total Amount</span>
              <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/checkout')}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
          >
            <span>Proceed to Checkout</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>

    </div>
  );
};
