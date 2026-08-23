import React, { useEffect, useState } from 'react';
import { ShoppingCart, Search, Truck, CheckCircle2, Clock, XCircle, ArrowRight } from 'lucide-react';
import api from '../../api/client';
import { Order } from '../../types';
import toast from 'react-hot-toast';

export const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const fetchOrders = async () => {
    try {
      const res = await api.get(`/orders?search=${search}&status=${statusFilter}&limit=100`);
      if (res.data.success) setOrders(res.data.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [search, statusFilter]);

  const handleUpdateStatus = async (orderId: string, status: string) => {
    const trackingNumber = status === 'SHIPPED' ? `TRK-${Date.now().toString().substring(6)}` : undefined;

    try {
      const res = await api.patch(`/orders/${orderId}/status`, { status, trackingNumber });
      if (res.data.success) {
        toast.success(`Order status updated to ${status}`);
        fetchOrders();
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Status update failed');
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Order Fulfillment Workflow</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage processing pipeline, tracking numbers, and order state transitions.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-900/90 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search order number or customer email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-lg pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-lg px-3 py-2 border border-slate-300 dark:border-slate-700 focus:border-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">PENDING</option>
          <option value="PAID">PAID</option>
          <option value="PROCESSING">PROCESSING</option>
          <option value="SHIPPED">SHIPPED</option>
          <option value="DELIVERED">DELIVERED</option>
          <option value="CANCELLED">CANCELLED</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">Order Ref</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items</th>
                <th className="p-4">Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Update Workflow Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="p-4 font-mono font-bold text-slate-900 dark:text-white">
                    {o.orderNumber}
                    {o.trackingNumber && (
                      <span className="block text-[10px] text-blue-600 dark:text-blue-400">Track: {o.trackingNumber}</span>
                    )}
                  </td>
                  <td className="p-4">
                    <span className="font-bold text-slate-900 dark:text-white block">{o.user?.name || 'Customer'}</span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">{o.user?.email}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-slate-700 dark:text-slate-300 font-medium">{o.items.length} item(s)</span>
                  </td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">${o.totalAmount.toFixed(2)}</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      o.status === 'DELIVERED' ? 'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-800 dark:text-emerald-300' :
                      o.status === 'SHIPPED' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300' :
                      o.status === 'CANCELLED' ? 'bg-rose-100 dark:bg-rose-500/20 text-rose-800 dark:text-rose-300' :
                      'bg-amber-100 dark:bg-amber-500/20 text-amber-800 dark:text-amber-300'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="p-4 text-right space-x-2">
                    {o.status === 'PAID' && (
                      <button
                        onClick={() => handleUpdateStatus(o.id, 'PROCESSING')}
                        className="px-2.5 py-1 bg-amber-600/20 hover:bg-amber-600 text-amber-800 dark:text-amber-300 hover:text-white rounded border border-amber-500/30 font-semibold"
                      >
                        Start Processing
                      </button>
                    )}

                    {(o.status === 'PROCESSING' || o.status === 'PAID') && (
                      <button
                        onClick={() => handleUpdateStatus(o.id, 'SHIPPED')}
                        className="px-2.5 py-1 bg-blue-600/20 hover:bg-blue-600 text-blue-800 dark:text-blue-300 hover:text-white rounded border border-blue-500/30 font-semibold"
                      >
                        Mark Shipped
                      </button>
                    )}

                    {o.status === 'SHIPPED' && (
                      <button
                        onClick={() => handleUpdateStatus(o.id, 'DELIVERED')}
                        className="px-2.5 py-1 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-800 dark:text-emerald-300 hover:text-white rounded border border-emerald-500/30 font-semibold"
                      >
                        Mark Delivered
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
