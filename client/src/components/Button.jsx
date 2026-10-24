import React from 'react';
import { Loader2 } from 'lucide-react';

export function Button({
  children,
  type = 'button',
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  className = '',
  icon: Icon,
  ...props
}) {
  const baseStyles =
    'relative inline-flex items-center justify-center font-medium transition-all duration-300 rounded-2xl select-none focus:outline-none focus:ring-2 focus:ring-gold/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]';

  const variants = {
    primary:
      'bg-gold-gradient text-black font-semibold shadow-gold-glow hover:shadow-gold-glow-lg hover:brightness-105 border border-gold-light/40',
    outline:
      'border border-gold text-gold hover:bg-gold/10 hover:shadow-gold-glow bg-transparent',
    secondary:
      'bg-surface-card hover:bg-surface-hover text-white border border-border hover:border-gold/30',
    ghost:
      'bg-transparent hover:bg-surface-subtle text-muted-light hover:text-white',
    danger:
      'bg-red-950/40 text-red-400 border border-red-800/40 hover:bg-red-900/60 hover:text-red-300',
  };

  const sizes = {
    sm: 'text-xs px-3.5 py-1.5 gap-1.5',
    md: 'text-sm px-5 py-2.5 gap-2',
    lg: 'text-base px-7 py-3.5 gap-2.5',
  };

  return (
    <button
      type={type}
      disabled={disabled || loading}
      onClick={onClick}
      className={`${baseStyles} ${variants[variant] || variants.primary} ${sizes[size] || sizes.md} ${className}`}
      {...props}
    >
      {loading ? (
        <>
          <Loader2 className="w-4 h-4 animate-spin text-current" />
          <span>Processing...</span>
        </>
      ) : (
        <>
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          {children}
        </>
      )}
    </button>
  );
}
