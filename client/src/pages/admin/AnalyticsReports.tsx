import React, { useEffect, useState } from 'react';
import { BarChart3, TrendingUp, Download, Award, PieChart as PieChartIcon } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';
import api from '../../api/client';
import { TopProduct } from '../../types';

const FALLBACK_CATEGORY_DATA = [
  { category: 'Electronics & Gadgets', sales: 48900 },
  { category: 'Audio & Acoustics', sales: 24500 },
  { category: 'Smart Wearables', sales: 18200 },
  { category: 'Smart Office', sales: 15400 }
];

const FALLBACK_TOP_PRODUCTS: TopProduct[] = [
  { id: 'p1', name: 'ApexPro M3 Workstation Laptop', totalUnitsSold: 18, totalRevenue: 44999.82 },
  { id: 'p2', name: 'OmniCam 4K Cinematic Camera', totalUnitsSold: 12, totalRevenue: 22788.00 },
  { id: 'p3', name: 'ChronoTech Ultra Titanium Smartwatch', totalUnitsSold: 15, totalRevenue: 11985.00 },
  { id: 'p4', name: 'AcousticMax Horizon Headphones', totalUnitsSold: 28, totalRevenue: 9799.72 },
  { id: 'p5', name: 'ErgoMotion Smart Standing Desk Pro', totalUnitsSold: 10, totalRevenue: 8995.00 }
];

export const AnalyticsReports: React.FC = () => {
  const [topProducts, setTopProducts] = useState<TopProduct[]>(FALLBACK_TOP_PRODUCTS);
  const [categoryData, setCategoryData] = useState<any[]>(FALLBACK_CATEGORY_DATA);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/analytics/dashboard');
        if (res.data.success && res.data.topProducts?.length) {
          setTopProducts(res.data.topProducts);
          setCategoryData([
            { category: 'Electronics & Gadgets', sales: 48900 },
            { category: 'Audio & Acoustics', sales: 24500 },
            { category: 'Smart Wearables', sales: 18200 },
            { category: 'Smart Office', sales: 15400 }
          ]);
        }
      } catch (err) {
        console.warn('Using client fallback for Analytics Reports:', err);
      }
    };
    fetchData();
  }, []);

  const handleExportCSV = () => {
    window.open('/api/analytics/export', '_blank');
  };

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white tracking-tight">Advanced Analytics & Financial Reporting</h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">Deep-dive category revenue, top seller rankings, and exportable ledgers.</p>
        </div>

        <button
          onClick={handleExportCSV}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition shadow-lg shadow-blue-600/30"
        >
          <Download className="w-4 h-4" />
          <span>Download Sales Ledger (CSV)</span>
        </button>
      </div>

      {/* Category Revenue Bar Chart */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
              <PieChartIcon className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Gross Sales Distribution by Product Category</span>
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total revenue generated per product sector</p>
          </div>
        </div>

        <div className="h-72 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#94a3b8" strokeOpacity={0.2} />
              <XAxis dataKey="category" stroke="#64748b" tick={{ fontSize: 12 }} />
              <YAxis stroke="#64748b" tick={{ fontSize: 12 }} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '12px' }}
                formatter={(val: any) => [`$${val.toLocaleString()}`, 'Total Sales']}
              />
              <Bar dataKey="sales" fill="#8b5cf6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Products Table */}
      <div className="bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-6 rounded-2xl shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center space-x-2">
          <Award className="w-4 h-4 text-amber-500" />
          <span>Top 5 Product Revenue Generators</span>
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-700 dark:text-slate-300">
            <thead className="bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-400 font-bold uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
              <tr>
                <th className="p-3">Rank</th>
                <th className="p-3">Product Name</th>
                <th className="p-3">Units Sold</th>
                <th className="p-3 text-right">Total Generated Revenue</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {topProducts.map((tp, index) => (
                <tr key={tp.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                  <td className="p-3 font-bold text-amber-600 dark:text-amber-400">#{index + 1}</td>
                  <td className="p-3 font-bold text-slate-900 dark:text-white">{tp.name}</td>
                  <td className="p-3 font-mono text-slate-600 dark:text-slate-300">{tp.totalUnitsSold} units</td>
                  <td className="p-3 text-right font-bold text-emerald-600 dark:text-emerald-400">${tp.totalRevenue.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
