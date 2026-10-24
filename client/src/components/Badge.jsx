import React from 'react';

export function Badge({
  children,
  variant = 'default',
  size = 'md',
  className = '',
}) {
  const variants = {
    default: 'bg-surface-card text-muted-light border border-border',
    gold: 'bg-gold/10 text-gold-light border border-gold/30',
    Confirmed: 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40',
    Cancelled: 'bg-rose-950/60 text-rose-400 border border-rose-800/40',
    Light: 'bg-cyan-950/50 text-cyan-400 border border-cyan-800/40',
    Midsize: 'bg-indigo-950/50 text-indigo-400 border border-indigo-800/40',
    Heavy: 'bg-amber-950/50 text-amber-400 border border-amber-800/40',
    'Ultra Long Range': 'bg-gold/15 text-gold-light border border-gold/40 shadow-sm shadow-gold/10',
    available: 'bg-emerald-950/50 text-emerald-400 border border-emerald-800/40',
    unavailable: 'bg-zinc-900 text-zinc-500 border border-zinc-800',
  };

  const sizes = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  return (
    <span
      className={`inline-flex items-center font-medium rounded-full tracking-wide ${
        variants[variant] || variants.default
      } ${sizes[size] || sizes.md} ${className}`}
    >
      {children}
    </span>
  );
}
