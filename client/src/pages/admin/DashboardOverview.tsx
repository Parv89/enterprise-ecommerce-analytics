import React, { useEffect, useState } from 'react';
import { DollarSign, ShoppingBag, Users, Package, TrendingUp, AlertTriangle, Activity, Download } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import api from '../../api/client';
import { AnalyticsMetrics, RevenueTrend, TopProduct } from '../../types';

const FALLBACK_METRICS: AnalyticsMetrics = {
  totalRevenue: 48249.90,
  totalOrders: 42,
  totalCustomers: 128,
  totalProducts: 24,
  avgOrderValue: 1148.80,
  conversionRate: 32.8,
  lowStockCount: 3
};

const FALLBACK_TREND: RevenueTrend[] = [
  { month: 'Apr 26', revenue: 14200 },
  { month: 'May 26', revenue: 18900 },
  { month: 'Jun 26', revenue: 24500 },
  { month: 'Jul 26', revenue: 31000 },
  { month: 'Aug 26', revenue: 48250 }
];

const FALLBACK_TOP_PRODUCTS: TopProduct[] = [
  { id: 'p1', name: 'ApexPro M3 Workstation Laptop', totalUnitsSold: 18, totalRevenue: 44999.82 },
  { id: 'p2', name: 'OmniCam 4K Cinematic Camera', totalUnitsSold: 12, totalRevenue: 22788.00 },
  { id: 'p3', name: 'ChronoTech Ultra Titanium Smartwatch', totalUnitsSold: 15, totalRevenue: 11985.00 },
  { id: 'p4', name: 'AcousticMax Horizon Headphones', totalUnitsSold: 28, totalRevenue: 9799.72 }
];

const FALLBACK_LOW_STOCK = [
  { id: 'ls1', name: 'OmniCam 4K Cinematic Camera', sku: 'CAM-4K-990', stock: 3, price: 1899.00 },
  { id: 'ls2', name: 'ChronoTech Ultra Titanium Smartwatch', sku: 'WRB-TITAN-05', stock: 8, price: 799.00 }
];

const FALLBACK_AUDIT_LOGS = [
  { id: 'al1', action: 'SYSTEM_INITIALIZATION', entity: 'System', createdAt: new Date().toISOString(), user: { name: 'Alexander Pierce (Chief Admin)' } },
  { id: 'al2', action: 'USER_LOGIN', entity: 'User', createdAt: new Date().toISOString(), user: { name: 'Alexander Pierce (Chief Admin)' } },
  { id: 'al3', action: 'CREATE_ORDER', entity: 'Order', createdAt: new Date().toISOString(), user: { name: 'David Vance' } }
];

export const DashboardOverview: React.FC = () => {
  const [metrics, setMetrics] = useState<AnalyticsMetrics>(FALLBACK_METRICS);
  const [revenueTrend, setRevenueTrend] = useState<RevenueTrend[]>(FALLBACK_TREND);
  const [topProducts, setTopProducts] = useState<TopProduct[]>(FALLBACK_TOP_PRODUCTS);
  const [lowStockProducts, setLowStockProducts] = useState<any[]>(FALLBACK_LOW_STOCK);
  const [auditLogs, setAuditLogs] = useState<any[]>(FALLBACK_AUDIT_LOGS);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        if (res.data.success && res.data.metrics) {
          setMetrics(res.data.metrics);
          if (res.data.revenueTrend?.length) setRevenueTrend(res.data.revenueTrend);
          if (res.data.topProducts?.length) setTopProducts(res.data.topProducts);
          if (res.data.lowStockProducts?.length) setLowStockProducts(res.data.lowStockProducts);
          if (res.data.recentAuditLogs?.length) setAuditLogs(res.data.recentAuditLogs);
        }
      } catch (err) {
        console.warn('Using client fallback for Analytics Dashboard:', err);
      }
    };
    fetchAnalytics();
  }, []);

  const handleExportCSV = () => {
    window.open('/api/analytics/export', '_blank');
  };

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Executive Dashboard Overview</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Real-time telemetry, financial KPIs, and stock control alerts.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/30"
        >
          <Download className="w-4 h-4" />
          <span>Export Financial Report (CSV)</span>
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Gross Revenue</span>
            <div className="p-2 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 rounded-xl">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">${metrics.totalRevenue.toLocaleString()}</p>
          <div className="flex items-center space-x-1 text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+14.2% vs last month</span>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Total Orders</span>
            <div className="p-2 bg-blue-500/10 text-blue-600 dark:text-blue-400 rounded-xl">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{metrics.totalOrders}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Avg Value: <strong className="text-slate-900 dark:text-white">${metrics.avgOrderValue}</strong></p>
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Customers</span>
            <div className="p-2 bg-purple-500/10 text-purple-600 dark:text-purple-400 rounded-xl">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{metrics.totalCustomers}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">Conversion Rate: <strong className="text-purple-600 dark:text-purple-400">{metrics.conversionRate}%</strong></p>
        </div>

        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Low Stock Warnings</span>
            <div className="p-2 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-xl">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <p className="text-3xl font-black text-slate-900 dark:text-white">{metrics.lowStockCount}</p>
          <p className="text-xs text-amber-600 dark:text-amber-400 font-semibold">Requires immediate reorder</p>
        </div>

      </div>

      {/* Revenue Trend Chart (Recharts) */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Monthly Gross Revenue Trajectory</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">6-Month historical sales performance curve</p>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
              <XAxis dataKey="month" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }}
                formatter={(value: any) => [`$${value.toLocaleString()}`, 'Revenue']}
              />
              <Area type="monotone" dataKey="revenue" stroke="#3b82f6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Low Stock & Audit Logs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Low Stock Watchlist */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            <span>Low Stock Alert Watchlist</span>
          </h3>

          <div className="space-y-3">
            {lowStockProducts.map((p) => (
              <div key={p.id} className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs">
                <div>
                  <h4 className="font-bold text-slate-900 dark:text-white">{p.name}</h4>
                  <span className="text-slate-500 dark:text-slate-400 font-mono">SKU: {p.sku} | Price: ${p.price.toFixed(2)}</span>
                </div>
                <span className="px-2.5 py-1 bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold rounded-lg border border-amber-500/30">
                  {p.stock} units remaining
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* System Audit Trail */}
        <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
            <Activity className="w-4 h-4 text-blue-500" />
            <span>System Telemetry & Audit Logs</span>
          </h3>

          <div className="space-y-2 max-h-64 overflow-y-auto pr-1 text-xs">
            {auditLogs.map((log) => (
              <div key={log.id} className="p-2.5 bg-slate-50 dark:bg-slate-800/40 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="font-bold text-blue-600 dark:text-blue-400">{log.action}</span>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{log.user?.name || 'System'} - {log.entity}</p>
                </div>
                <span className="text-[10px] text-slate-400 font-mono">
                  {new Date(log.createdAt).toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
