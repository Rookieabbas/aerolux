import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { Plane, Mail, Lock, User, Phone, ArrowRight, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/Button';
import { Input } from '../components/Input';

export function SignupPage() {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp, isSupabaseConfigured } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!fullName.trim()) {
      toast.error('Please enter your full name.');
      return;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      toast.error('Passwords do not match.');
      return;
    }

    setLoading(true);
    const toastId = toast.loading('Registering VIP membership...');

    try {
      await signUp({
        email: email.trim(),
        password,
        fullName: fullName.trim(),
        phone: phone.trim(),
      });

      toast.success('VIP Membership created successfully! Welcome aboard.', {
        id: toastId,
        duration: 4000,
      });
      navigate('/jets');
    } catch (err) {
      console.error('Sign-up failed:', err);
      toast.error(err.message || 'Failed to create account.', { id: toastId });
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
            Join the AeroLux Club
          </h1>
          <p className="text-xs text-muted mt-2">
            Instant booking access, tailored in-flight dining, and bespoke private aviation charter.
          </p>
        </div>

        {/* Supabase Config Warning */}
        {!isSupabaseConfigured && (
          <div className="mb-6 p-3.5 bg-amber-950/30 border border-amber-800/40 rounded-xl text-xs text-amber-300">
            <strong>Configuration Notice:</strong> Please configure your Supabase URL & Anon Key in <code className="text-gold">client/.env</code>.
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Full Legal Name"
            placeholder="Lord Alexander Hamilton"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            icon={User}
            required
            autoComplete="name"
          />

          <Input
            label="Contact Phone Number"
            type="tel"
            placeholder="+1 (555) 019-2834"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            icon={Phone}
            autoComplete="tel"
          />

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
            placeholder="Minimum 6 characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            icon={Lock}
            required
            autoComplete="new-password"
          />

          <Input
            label="Confirm Password"
            type="password"
            placeholder="Repeat password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            icon={Lock}
            required
            autoComplete="new-password"
          />

          <div className="pt-2">
            <Button
              type="submit"
              variant="primary"
              size="lg"
              loading={loading}
              icon={ArrowRight}
              className="w-full font-bold shadow-gold-glow"
            >
              Activate VIP Account
            </Button>
          </div>
        </form>

        {/* Bottom Switch Link */}
        <div className="mt-6 pt-6 border-t border-border text-center text-xs text-muted">
          Already a VIP member?{' '}
          <Link to="/login" className="text-gold hover:text-gold-light font-semibold transition-colors">
            Sign In to Flight Deck
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
