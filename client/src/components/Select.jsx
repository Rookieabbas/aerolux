import React from 'react';
import { ChevronDown } from 'lucide-react';

export function Select({
  label,
  error,
  options = [],
  value,
  onChange,
  placeholder = 'Select an option',
  className = '',
  containerClassName = '',
  id,
  ...props
}) {
  const selectId = id || (label ? label.toLowerCase().replace(/\s+/g, '-') : undefined);

  return (
    <div className={`w-full flex flex-col gap-1.5 ${containerClassName}`}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-xs font-medium tracking-wide uppercase text-muted-light/80"
        >
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        <select
          id={selectId}
          value={value}
          onChange={onChange}
          className={`w-full appearance-none bg-surface-card border rounded-xl px-3.5 py-2.5 pr-10 text-sm text-white placeholder-muted-dark transition-all duration-200 outline-none cursor-pointer
            ${
              error
                ? 'border-red-500/80 focus:border-red-500 focus:ring-1 focus:ring-red-500/40'
                : 'border-border focus:border-gold focus:ring-1 focus:ring-gold/30'
            }
            ${className}`}
          {...props}
        >
          {placeholder && <option value="" disabled className="bg-surface text-muted">{placeholder}</option>}
          {options.map((opt) => {
            const val = typeof opt === 'object' ? opt.value : opt;
            const labelText = typeof opt === 'object' ? opt.label : opt;
            return (
              <option key={val} value={val} className="bg-surface text-white py-1">
                {labelText}
              </option>
            );
          })}
        </select>
        <div className="absolute right-3.5 pointer-events-none text-muted">
          <ChevronDown className="w-4 h-4" />
        </div>
      </div>
      {error && <p className="text-xs text-red-400 mt-0.5">{error}</p>}
    </div>
  );
}
