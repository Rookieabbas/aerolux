import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plane, Mail, Lock, ArrowRight, Sparkles, UserCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [demoLoading, setDemoLoading] = useState(false);

  const { signIn, signInDemoUser, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // 1-Click Instant Demo Login
  const handleQuickDemoLogin = async () => {
    setDemoLoading(true);
    const toastId = toast.loading('Connecting as VIP Demo Member...');
    try {
      await signInDemoUser();
      toast.success('Welcome aboard, Lord Alexander Hamilton!', { id: toastId });
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Demo login error:', err);
      toast.error(err.message || 'Failed to sign in demo user.', { id: toastId });
    } finally {
      setDemoLoading(false);
    }
  };

  // Auto-fill demo inputs
  const handleAutoFill = () => {
    setEmail('vip.guest@aerolux.vip');
    setPassword('AeroLuxVIP2025!');
    toast.success('VIP demo credentials auto-filled!');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Authenticating VIP credentials...');

    try {
      await signIn({ email, password });
      toast.success('Welcome aboard AeroLux.', { id: toastId });
      navigate(from, { replace: true });
    } catch (err) {
      console.error('Sign-in failed:', err);
      toast.error(err.message || 'Invalid email or password.', { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md bg-surface border border-border rounded-3xl p-8 sm:p-10 shadow-luxury"
      >
        {/* Brand Crest */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-gold-gradient flex items-center justify-center text-black font-bold mx-auto mb-4 shadow-gold-glow">
            <Plane className="w-6 h-6 fill-current rotate-45" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            VIP Member Access
          </h1>
          <p className="text-xs text-muted mt-2">
            Sign in to manage your flight itineraries and charter requests.
          </p>
        </div>

        {/* 1-CLICK INSTANT DEMO LOGIN BANNER */}
        <div className="mb-6 p-4 bg-gold-gradient/10 border border-gold/40 rounded-2xl flex flex-col gap-2.5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-gold flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-gold" />
              Instant Demo Experience
            </span>
            <button
              type="button"
              onClick={handleAutoFill}
              className="text-[11px] text-muted hover:text-white underline transition-colors"
            >
              Fill form
            </button>
          </div>
          <Button
            type="button"
            variant="primary"
            size="md"
            loading={demoLoading}
            onClick={handleQuickDemoLogin}
            icon={UserCheck}
            className="w-full font-bold py-2.5 text-xs shadow-gold-glow"
          >
            1-Click VIP Demo Login
          </Button>
        </div>

        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-border"></div>
          <span className="flex-shrink mx-3 text-[11px] text-muted uppercase tracking-wider">
            or sign in with credentials
          </span>
          <div className="flex-grow border-t border-border"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Email Address"
            type="email"
            placeholder="member@aerolux.vip"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            icon={Mail}
            required
            autoComplete="email"
          />

          <Input
            label="Password"
            type="password"
            placeholder="••••••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            variant="secondary"
            size="lg"
            loading={loading}
            icon={ArrowRight}
            className="w-full mt-2 font-bold hover:border-gold/50"
          >
            Sign In to Flight Deck
          </Button>
        </form>

        {/* Bottom Switch Link */}
        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted">
          Don&apos;t have an account?{' '}
          <Link to="/signup" className="text-gold hover:text-gold-light font-semibold transition-colors">
            Join the AeroLux Club
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
