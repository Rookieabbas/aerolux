import React from 'react';

export function Input({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  containerClassName = '',
  id,
  type = 'text',
  ...props
}) {
  const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={inputId}
          className="text-xs font-medium tracking-wide uppercase text-muted-light/80"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-muted pointer-events-none transition-colors peer-focus:text-gold">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          id={inputId}
          type={type}
          className={`peer w-full bg-surface-card border rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-muted-dark transition-all duration-200 outline-none
            ${Icon ? 'pl-10' : ''}
            ${
              error
                ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/40'
                : 'border-border focus:border-gold focus:ring-1 focus:ring-gold/30'
            }
            ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
      {helperText && !error && (
        <p className="text-xs text-muted-dark mt-0.5">{helperText}</p>
      )}
    </div>
  );
}
