import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, LogIn, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

export const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await login(email, password);
      if (res.success) {
        toast.success(`Welcome back, ${res.user.name}!`);
        if (res.user.role === 'ADMIN' || res.user.role === 'MANAGER') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials. Check email/phone and password.');
    } finally {
      setSubmitting(false);
    }
  };

  const fillQuickLogin = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto my-12 space-y-6">
      
      <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-gray-200 dark:border-slate-800 shadow-sm space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center mx-auto shadow-md shadow-blue-600/30">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">Sign In to Platform</h1>
          <p className="text-xs text-gray-500 dark:text-slate-400">Access enterprise commerce dashboard & catalog.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase">Email Address or Phone Number</label>
            <div className="relative">
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@enterprise.com or +1 (555) 019-2834"
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl pl-9 pr-3 py-2.5 text-sm focus:border-blue-500"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-700 dark:text-slate-300 uppercase">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-300 dark:border-slate-700 text-gray-900 dark:text-white rounded-xl pl-9 pr-3 py-2.5 text-sm focus:border-blue-500"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-3 rounded-xl transition shadow-lg shadow-blue-600/30 flex items-center justify-center space-x-2"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            )}
          </button>
        </form>

        {/* Quick Demo Login Credentials */}
        <div className="border-t border-gray-100 dark:border-slate-800 pt-4 space-y-2">
          <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block text-center">
            Quick Demo Auto-Fill Credentials:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => fillQuickLogin('admin@enterprise.com', 'Admin@123')}
              className="py-1.5 px-2 bg-purple-50 dark:bg-purple-900/30 hover:bg-purple-100 dark:hover:bg-purple-900/50 text-purple-700 dark:text-purple-300 rounded-lg text-xs font-bold border border-purple-200 dark:border-purple-800"
            >
              Admin
            </button>
            <button
              onClick={() => fillQuickLogin('manager@enterprise.com', 'Manager@123')}
              className="py-1.5 px-2 bg-indigo-50 dark:bg-indigo-900/30 hover:bg-indigo-100 dark:hover:bg-indigo-900/50 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs font-bold border border-indigo-200 dark:border-indigo-800"
            >
              Manager
            </button>
            <button
              onClick={() => fillQuickLogin('customer@enterprise.com', 'Customer@123')}
              className="py-1.5 px-2 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-xs font-bold border border-blue-200 dark:border-blue-800"
            >
              Customer
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-gray-500 dark:text-slate-400 pt-2">
          Don't have an account?{' '}
          <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
            Register Account
          </Link>
        </p>

      </div>

    </div>
  );
};
