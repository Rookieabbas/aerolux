import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Loader2, ShieldAlert } from 'lucide-react';

export function AdminRoute({ children }) {
  const { user, isAdmin, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-gold" />
        <p className="text-sm font-serif text-muted tracking-wide">
          Verifying administrative clearance...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-surface border border-border rounded-2xl p-8 text-center shadow-luxury">
          <div className="w-14 h-14 rounded-full bg-amber-950/40 text-gold border border-amber-800/40 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="font-serif text-2xl text-white font-medium mb-2">
            Restricted VIP Terminal
          </h2>
          <p className="text-xs text-muted mb-6 leading-relaxed">
            Administrative privileges required. To access the Fleet Operations deck,
            ensure your profile role is elevated to <span className="text-gold font-mono">admin</span> in Supabase.
          </p>
          <div className="bg-surface-card p-3 rounded-xl border border-border text-left font-mono text-[11px] text-muted mb-6">
            <span className="text-muted-dark block mb-1"># SQL command to promote user:</span>
            <span className="text-gold">UPDATE profiles SET role = &apos;admin&apos; WHERE id = &apos;{user.id}&apos;;</span>
          </div>
          <Navigate to="/" replace />
        </div>
      </div>
    );
  }

  return children;
}
