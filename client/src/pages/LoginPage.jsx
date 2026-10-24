import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plane, Mail, Lock, ArrowRight, ShieldCheck, Key } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

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
        <div className="text-center mb-8">
          <div className="w-12 h-12 rounded-2xl bg-gold-gradient flex items-center justify-center text-black font-bold mx-auto mb-4 shadow-gold-glow">
            <Plane className="w-6 h-6 fill-current rotate-45" />
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-white tracking-tight">
            VIP Flight Deck
          </h1>
          <p className="text-xs text-muted mt-2">
            Sign in to access your charter bookings and VIP member services.
          </p>
        </div>

        {/* Supabase Not Configured Warning (if applicable) */}
        {!isSupabaseConfigured && (
          <div className="mb-6 p-3.5 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-300">
            <strong>Configuration Notice:</strong> Please configure your Supabase URL & Anon Key in <code className="text-gold">client/.env</code>.
          </div>
        )}

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
            variant="primary"
            size="lg"
            loading={loading}
            icon={ArrowRight}
            className="w-full mt-2 font-bold shadow-gold-glow"
          >
            Sign In to Flight Deck
          </Button>
        </form>

        {/* Quick Demo Helper Hint */}
        <div className="mt-6 p-4 bg-surface-card rounded-2xl border border-border/80 text-[11px] text-muted space-y-1">
          <div className="flex items-center gap-1.5 text-gold font-medium">
            <Key className="w-3.5 h-3.5" />
            <span>VIP First Time User?</span>
          </div>
          <p>
            Create an account using the join link below. To make any user an administrator,
            run the SQL script in Supabase:
          </p>
          <code className="text-[10px] text-muted-light block bg-black/50 p-1.5 rounded border border-border/40 font-mono mt-1 overflow-x-auto">
            UPDATE profiles SET role = &apos;admin&apos; WHERE id = &apos;&lt;uuid&gt;&apos;;
          </code>
        </div>

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
