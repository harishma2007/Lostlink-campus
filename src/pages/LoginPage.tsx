import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, Mail, Lock, ArrowRight, AlertCircle, UserCheck } from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError(null);

    try {
      const user = await login(demoEmail, demoPass);
      if (user.role === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/student/dashboard');
      }
    } catch (err: any) {
      setError(err.message || 'Demo login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-6">
        
        {/* Header */}
        <div className="text-center">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center font-black text-2xl mx-auto mb-3 shadow-sm">
            L
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Sign in to LostLink
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Access your campus reports, track ownership claims, and manage QR tags.
          </p>
        </div>

        {/* Demo Fast-Login Helpers */}
        <div className="p-4 bg-emerald-50/70 rounded-2xl border border-emerald-200/80 text-xs text-emerald-950 space-y-2">
          <p className="font-bold flex items-center gap-1.5 text-emerald-900">
            <UserCheck className="w-3.5 h-3.5 text-emerald-700" />
            Quick Demo Accounts (1-Click Fill &amp; Sign In):
          </p>
          <div className="grid grid-cols-2 gap-2 pt-1">
            <button
              type="button"
              onClick={() => handleQuickDemoLogin('alex.chen@campus.edu', 'Student@123')}
              className="p-2 bg-white hover:bg-emerald-100 rounded-lg border border-emerald-200 text-left transition-colors"
            >
              <span className="font-bold block text-slate-900">Demo Student</span>
              <span className="text-[10px] text-slate-500 block truncate">alex.chen@campus.edu</span>
            </button>

            <button
              type="button"
              onClick={() => handleQuickDemoLogin('admin@campus.edu', 'Admin@123')}
              className="p-2 bg-white hover:bg-emerald-100 rounded-lg border border-emerald-200 text-left transition-colors"
            >
              <span className="font-bold block text-slate-900">Campus Admin</span>
              <span className="text-[10px] text-slate-500 block truncate">admin@campus.edu</span>
            </button>
          </div>
        </div>

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              College Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@campus.edu"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1.5">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-sm transition-colors flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </form>

        <p className="text-center text-xs text-slate-500">
          New student on campus?{' '}
          <Link to="/register" className="font-bold text-emerald-700 hover:underline">
            Register your student account &rarr;
          </Link>
        </p>

      </div>
    </div>
  );
};
