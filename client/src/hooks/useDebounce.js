import { useState, useEffect } from 'react';

/**
 * Custom hook to debounce any value (e.g., search text input).
 * @param {any} value
 * @param {number} delay in milliseconds
 * @returns {any} debounced value
 */
export function useDebounce(value, delay = 400) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}
