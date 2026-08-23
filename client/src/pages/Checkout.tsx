import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, CreditCard, Lock, CheckCircle2 } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import api from '../api/client';
import toast from 'react-hot-toast';

export const Checkout: React.FC = () => {
  const { cart, totalAmount, clearCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [address, setAddress] = useState({
    street: '742 Evergreen Terrace',
    city: 'Springfield',
    state: 'OR',
    zip: '97477',
    country: 'United States'
  });

  const [paymentMethod, setPaymentMethod] = useState('STRIPE');
  const [submitting, setSubmitting] = useState(false);

  if (cart.length === 0) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Your cart is empty</h2>
        <Link to="/shop" className="text-blue-600 font-semibold hover:underline mt-2 inline-block">
          Return to Catalog
        </Link>
      </div>
    );
  }

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // 1. Create order
      const orderPayload = {
        items: cart.map((item) => ({
          productId: item.product.id,
          quantity: item.quantity
        })),
        shippingAddress: JSON.stringify(address),
        paymentMethod
      };

      const orderRes = await api.post('/orders', orderPayload);

      if (orderRes.data.success) {
        const order = orderRes.data.order;

        // 2. Create Payment Intent & Confirm
        const intentRes = await api.post('/payments/create-intent', { orderId: order.id });
        if (intentRes.data.success) {
          await api.post('/payments/confirm', {
            orderId: order.id,
            paymentIntentId: intentRes.data.paymentIntentId
          });
        }

        clearCart();
        toast.success('Payment verified & order created!');
        navigate(`/order-confirmation/${order.id}`);
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to place order. Check server logs.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      
      <div>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Checkout</h1>
        <p className="text-sm text-gray-500 mt-1">Complete your order with secure end-to-end payment encryption.</p>
      </div>

      <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Shipping & Payment Form */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Shipping Address */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">1</span>
              <span>Shipping Address</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="sm:col-span-2 space-y-1">
                <label className="text-xs font-semibold text-gray-700">Street Address</label>
                <input
                  type="text"
                  required
                  value={address.street}
                  onChange={(e) => setAddress({ ...address, street: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">City</label>
                <input
                  type="text"
                  required
                  value={address.city}
                  onChange={(e) => setAddress({ ...address, city: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">State / Province</label>
                <input
                  type="text"
                  required
                  value={address.state}
                  onChange={(e) => setAddress({ ...address, state: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Postal / Zip Code</label>
                <input
                  type="text"
                  required
                  value={address.zip}
                  onChange={(e) => setAddress({ ...address, zip: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-gray-700">Country</label>
                <input
                  type="text"
                  required
                  value={address.country}
                  onChange={(e) => setAddress({ ...address, country: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-300 rounded-lg p-2.5"
                />
              </div>
            </div>
          </div>

          {/* Payment Method Selection */}
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center space-x-2">
              <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs flex items-center justify-center font-bold">2</span>
              <span>Payment Gateway (Stripe Integrated)</span>
            </h3>

            <div className="p-4 border-2 border-blue-600 bg-blue-50/50 rounded-xl flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <CreditCard className="w-6 h-6 text-blue-600" />
                <div>
                  <h4 className="font-bold text-gray-900 text-sm">Credit / Debit Card via Stripe</h4>
                  <p className="text-xs text-gray-500">256-Bit SSL Encrypted Instant Payment Processing</p>
                </div>
              </div>
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
            </div>

            <div className="p-4 bg-gray-50 rounded-xl text-xs text-gray-500 flex items-center space-x-2 border border-gray-200">
              <Lock className="w-4 h-4 text-emerald-600" />
              <span>Sandbox mode active: Real or test payment transactions will be autocommit confirmed.</span>
            </div>
          </div>

        </div>

        {/* Order Summary & Submit Button */}
        <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6 h-fit">
          <h3 className="text-lg font-bold text-gray-900 border-b border-gray-100 pb-4">Order Items ({cart.length})</h3>

          <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
            {cart.map((item) => (
              <div key={item.product.id} className="flex justify-between text-xs">
                <span className="truncate max-w-[12rem] font-medium text-gray-800">
                  {item.quantity}x {item.product.name}
                </span>
                <span className="font-bold text-gray-900">${(item.product.price * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span className="font-semibold text-gray-900">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping</span>
              <span className="font-semibold text-emerald-600">Free</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-gray-900 border-t border-gray-100 pt-2">
              <span>Total Payable</span>
              <span className="text-blue-600">${totalAmount.toFixed(2)}</span>
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <ShieldCheck className="w-5 h-5" />
                <span>Pay ${totalAmount.toFixed(2)} Now</span>
              </>
            )}
          </button>
        </div>

      </form>

    </div>
  );
};
