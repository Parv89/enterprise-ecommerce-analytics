import React from 'react';
import { ShieldCheck, Lock, Cpu, Globe } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          <div>
            <div className="flex items-center space-x-2 text-white font-bold text-lg mb-3">
              <ShieldCheck className="w-5 h-5 text-blue-500" />
              <span>Enterprise Commerce</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Scalable, secure enterprise e-commerce platform integrated with real-time analytics, RBAC permissions, and payment gateway automation.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Platform Capabilities</h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center space-x-2"><Lock className="w-3.5 h-3.5 text-emerald-400" /> <span>JWT & RBAC Access Control</span></li>
              <li className="flex items-center space-x-2"><Cpu className="w-3.5 h-3.5 text-blue-400" /> <span>SQLite + Prisma ORM Engine</span></li>
              <li className="flex items-center space-x-2"><Globe className="w-3.5 h-3.5 text-purple-400" /> <span>Stripe & Cloud CDN Service</span></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">System Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><a href="/shop" className="hover:text-white transition">Product Catalog</a></li>
              <li><a href="/cart" className="hover:text-white transition">Shopping Cart</a></li>
              <li><a href="/admin" className="hover:text-white transition">Admin Analytics Console</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-3">Operational Status</h4>
            <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg">
              <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>All Systems Operational</span>
              </div>
              <p className="text-[11px] text-slate-500 mt-1">API v1.0.0 (Node/Express/Vite)</p>
            </div>
          </div>

        </div>

        <div className="border-t border-slate-900 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} Enterprise Commerce & Analytics Platform. All rights reserved.</p>
          <div className="flex space-x-6 mt-4 sm:mt-0">
            <span>Privacy Policy</span>
            <span>Security Architecture</span>
            <span>Terms of Service</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
