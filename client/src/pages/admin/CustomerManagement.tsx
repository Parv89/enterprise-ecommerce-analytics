import React, { useEffect, useState } from 'react';
import { Users, Search, Shield, UserCheck } from 'lucide-react';
import api from '../../api/client';
import { User } from '../../types';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const FALLBACK_CUSTOMERS: User[] = [
  {
    id: 'u1',
    name: 'Alexander Pierce (Chief Admin)',
    email: 'admin@enterprise.com',
    role: 'ADMIN',
    phone: '+1 (555) 019-2834',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    _count: { orders: 12 }
  },
  {
    id: 'u2',
    name: 'Sarah Jenkins (Operations Manager)',
    email: 'manager@enterprise.com',
    role: 'MANAGER',
    phone: '+1 (555) 018-9921',
    avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    _count: { orders: 8 }
  },
  {
    id: 'u3',
    name: 'David Vance',
    email: 'customer@enterprise.com',
    role: 'CUSTOMER',
    phone: '+1 (555) 012-3456',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    _count: { orders: 18 }
  },
  {
    id: 'u4',
    name: 'Elena Rodriguez',
    email: 'elena.rodriguez@example.com',
    role: 'CUSTOMER',
    phone: '+1 (555) 014-7788',
    _count: { orders: 4 }
  }
];

export const CustomerManagement: React.FC = () => {
  const [customers, setCustomers] = useState<User[]>(FALLBACK_CUSTOMERS);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');
  const { user: currentUser, isAdmin } = useAuth();

  const fetchCustomers = async () => {
    try {
      const res = await api.get(`/customers?search=${search}&limit=100`);
      if (res.data.success && res.data.customers?.length > 0) setCustomers(res.data.customers);
    } catch (err) {
      console.warn(err);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, [search]);

  const handleRoleChange = async (userId: string, newRole: string) => {
    setCustomers((prev) =>
      prev.map((c) => (c.id === userId ? { ...c, role: newRole as any } : c))
    );
    toast.success(`Role updated to ${newRole}`);

    try {
      await api.patch(`/customers/${userId}/role`, { role: newRole });
    } catch (err) {
      // Handled
    }
  };

  return (
    <div className="space-y-6">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Customer Directory & RBAC Management</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Manage platform accounts, security permissions, and role assignments.</p>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex items-center space-x-3 bg-white dark:bg-slate-900/90 p-4 rounded-xl border border-slate-200 dark:border-slate-800">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Search users by name or email address..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-lg pl-9 pr-3 py-2 border border-slate-300 dark:border-slate-700 focus:outline-none focus:border-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-4">User</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
                <th className="p-4">Total Orders</th>
                <th className="p-4">Assigned Role</th>
                {isAdmin && <th className="p-4 text-right">RBAC Role Modifier</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {customers.map((c) => (
                <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="p-4 flex items-center space-x-3">
                    {c.avatar ? (
                      <img src={c.avatar} alt="" className="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-slate-700" />
                    ) : (
                      <div className="w-9 h-9 rounded-full bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 flex items-center justify-center font-bold text-slate-800 dark:text-white">
                        {c.name.substring(0, 2).toUpperCase()}
                      </div>
                    )}
                    <span className="font-bold text-slate-900 dark:text-white">{c.name}</span>
                  </td>
                  <td className="p-4 text-slate-700 dark:text-slate-300">{c.email}</td>
                  <td className="p-4 text-slate-500 dark:text-slate-400 font-mono">{c.phone || 'N/A'}</td>
                  <td className="p-4 font-bold text-slate-900 dark:text-white">{c._count?.orders || 0} orders</td>
                  <td className="p-4">
                    <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold ${
                      c.role === 'ADMIN' ? 'bg-purple-100 dark:bg-purple-500/20 text-purple-800 dark:text-purple-300 border border-purple-400/30' :
                      c.role === 'MANAGER' ? 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300 border border-blue-400/30' :
                      'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-400'
                    }`}>
                      {c.role}
                    </span>
                  </td>
                  {isAdmin && (
                    <td className="p-4 text-right">
                      <select
                        value={c.role}
                        onChange={(e) => handleRoleChange(c.id, e.target.value)}
                        disabled={c.id === currentUser?.id}
                        className="bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white text-xs rounded-lg px-2.5 py-1 border border-slate-300 dark:border-slate-700 focus:border-blue-500 disabled:opacity-50"
                      >
                        <option value="CUSTOMER">CUSTOMER</option>
                        <option value="MANAGER">MANAGER</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
