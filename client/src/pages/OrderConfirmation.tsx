import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, Download } from 'lucide-react';
import api from '../api/client';
import { Order } from '../types';

export const OrderConfirmation: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${id}`);
        if (res.data.success) setOrder(res.data.order);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
        <h2 className="text-2xl font-bold text-gray-800">Order Not Found</h2>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8 my-8">
      
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm text-center space-y-4">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <h1 className="text-3xl font-extrabold text-gray-900">Order Confirmed!</h1>
        <p className="text-sm text-gray-500 max-w-md mx-auto">
          Thank you for your business. We sent an order confirmation email to <span className="font-semibold text-gray-800">{order.user?.email}</span>.
        </p>

        <div className="inline-flex items-center space-x-2 bg-gray-100 px-4 py-2 rounded-xl text-xs font-mono text-gray-700">
          <span>Order Number: <strong>{order.orderNumber}</strong></span>
        </div>
      </div>

      {/* Details Card */}
      <div className="bg-white p-8 rounded-3xl border border-gray-200 shadow-sm space-y-6">
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="font-bold text-gray-900">Order Summary</h3>
          <span className="text-xs font-bold bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full border border-emerald-200">
            {order.status}
          </span>
        </div>

        <div className="space-y-4 divide-y divide-gray-100">
          {order.items.map((item) => (
            <div key={item.id} className="pt-4 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Package className="w-5 h-5 text-gray-400" />
                <div>
                  <h4 className="text-sm font-bold text-gray-900">{item.product.name}</h4>
                  <p className="text-xs text-gray-500">Qty: {item.quantity} x ${item.unitPrice.toFixed(2)}</p>
                </div>
              </div>
              <span className="font-bold text-gray-900">${item.totalPrice.toFixed(2)}</span>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-100 pt-4 flex justify-between text-base font-extrabold text-gray-900">
          <span>Total Paid</span>
          <span className="text-blue-600">${order.totalAmount.toFixed(2)}</span>
        </div>

        <div className="pt-4 border-t border-gray-100 flex flex-wrap gap-4 items-center justify-between">
          <Link
            to="/my-orders"
            className="inline-flex items-center space-x-2 bg-blue-600 text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-blue-700 transition"
          >
            <span>View All My Orders</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </div>
  );
};
