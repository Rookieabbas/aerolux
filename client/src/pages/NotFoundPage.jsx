import React from 'react';
import { Link } from 'react-router-dom';
import { Plane, Compass, Home } from 'lucide-react';
import { Button } from '../components/Button';

export function NotFoundPage() {
  return (
    <div className="min-h-[75vh] flex items-center justify-center px-4 py-16 text-center">
      <div className="max-w-md w-full bg-surface border border-border rounded-3xl p-8 sm:p-10 shadow-luxury">
        <div className="w-16 h-16 rounded-2xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mx-auto mb-6 shadow-gold-glow">
          <Compass className="w-8 h-8 animate-spin-slow" />
        </div>
        <span className="text-xs uppercase tracking-widest text-gold font-mono font-bold block mb-1">
          Error 404
        </span>
        <h1 className="font-serif text-3xl font-bold text-white tracking-tight mb-3">
          Airway Not Found
        </h1>
        <p className="text-xs sm:text-sm text-muted mb-8 leading-relaxed">
          The flight coordinates you are attempting to access do not exist on our global aeronautical charts.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="primary" size="md" icon={Home} className="w-full">
              Main Terminal
            </Button>
          </Link>
          <Link to="/jets" className="w-full sm:w-auto">
            <Button variant="secondary" size="md" icon={Plane} className="w-full">
              Explore Fleet
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
