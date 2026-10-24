import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, SlidersHorizontal, X, ArrowUpDown, ChevronLeft, 
  ChevronRight, RefreshCcw, Filter, Plane 
} from 'lucide-react';
import { JetCard } from '../components/JetCard';
import { JetCardSkeleton } from '../components/Skeleton';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { useJets } from '../hooks/useJets';
import { useDebounce } from '../hooks/useDebounce';

const CATEGORIES = ['All', 'Light', 'Midsize', 'Heavy', 'Ultra Long Range'];

const SORT_OPTIONS = [
  { label: 'Charter Rate: Low to High', value: 'price_per_hour:asc' },
  { label: 'Charter Rate: High to Low', value: 'price_per_hour:desc' },
  { label: 'Passenger Capacity: High to Low', value: 'seats:desc' },
  { label: 'Passenger Capacity: Low to High', value: 'seats:asc' },
  { label: 'Flight Range: Max to Min', value: 'range_km:desc' },
  { label: 'Cruise Speed: Fast to Slow', value: 'speed_kmh:desc' },
];

export function JetsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  // Read initial states from URL params
  const initialSearch = searchParams.get('search') || '';
  const initialCategory = searchParams.get('category') || 'All';
  const initialMinSeats = searchParams.get('minSeats') || '';
  const initialMaxPrice = searchParams.get('maxPrice') || '';
  const initialAvailable = searchParams.get('available') || '';
  const initialSort = searchParams.get('sort') || 'price_per_hour:asc';
  const initialPage = parseInt(searchParams.get('page') || '1', 10);

  // Local state
  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [category, setCategory] = useState(initialCategory);
  const [minSeats, setMinSeats] = useState(initialMinSeats);
  const [maxPrice, setMaxPrice] = useState(initialMaxPrice);
  const [availableOnly, setAvailableOnly] = useState(initialAvailable === 'true');
  const [sortValue, setSortValue] = useState(initialSort);
  const [page, setPage] = useState(initialPage);
  const [showFiltersMobile, setShowFiltersMobile] = useState(false);

  // Debounced search
  const debouncedSearch = useDebounce(searchTerm, 350);

  // Parse sortBy and sortOrder
  const [sortBy, sortOrder] = useMemo(() => {
    const parts = sortValue.split(':');
    return [parts[0] || 'price_per_hour', parts[1] || 'asc'];
  }, [sortValue]);

  // Sync state to URL search parameters
  useEffect(() => {
    const params = new URLSearchParams();
    if (debouncedSearch) params.set('search', debouncedSearch);
    if (category && category !== 'All') params.set('category', category);
    if (minSeats) params.set('minSeats', minSeats);
    if (maxPrice) params.set('maxPrice', maxPrice);
    if (availableOnly) params.set('available', 'true');
    if (sortValue !== 'price_per_hour:asc') params.set('sort', sortValue);
    if (page > 1) params.set('page', page.toString());

    setSearchParams(params, { replace: true });
  }, [debouncedSearch, category, minSeats, maxPrice, availableOnly, sortValue, page, setSearchParams]);

  // Query hook with server-side query builder
  const { jets, loading, error, totalCount, totalPages, refetch } = useJets({
    search: debouncedSearch,
    category,
    minSeats,
    maxPrice,
    available: availableOnly ? true : null,
    sortBy,
    sortOrder,
    page,
    pageSize: 9,
  });

  const handleClearFilters = () => {
    setSearchTerm('');
    setCategory('All');
    setMinSeats('');
    setMaxPrice('');
    setAvailableOnly(false);
    setSortValue('price_per_hour:asc');
    setPage(1);
  };

  const hasActiveFilters = Boolean(
    debouncedSearch ||
    category !== 'All' ||
    minSeats ||
    maxPrice ||
    availableOnly
  );

  return (
    <div className="w-full min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/80">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold font-semibold block mb-2">
            World-Class Aviation
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            The AeroLux Fleet Catalog
          </h1>
          <p className="text-sm text-muted mt-2 max-w-2xl">
            Choose from agile regional light jets to flagship intercontinental staterooms.
            All aircraft are serviced by certified global operators.
          </p>
        </div>

        {/* Mobile Filter Toggle */}
        <div className="flex md:hidden items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFiltersMobile(!showFiltersMobile)}
            icon={SlidersHorizontal}
            className="w-full"
          >
            {showFiltersMobile ? 'Hide Filters' : 'Show Filters'}
          </Button>
        </div>
      </div>

      {/* Category Pills Bar */}
      <div className="py-6 flex items-center gap-2 overflow-x-auto no-scrollbar border-b border-border/40">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setCategory(cat);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-medium tracking-wide transition-all shrink-0 select-none ${
              category === cat
                ? 'bg-gold text-black font-semibold shadow-gold-glow'
                : 'bg-surface border border-border text-muted hover:text-white hover:border-gold/30'
            }`}
          >
            {cat} {cat === 'All' ? 'Aircraft' : 'Jets'}
          </button>
        ))}
      </div>

      {/* Control Filters Bar: Search, Inputs, Sorting */}
      <div className={`py-6 space-y-4 ${showFiltersMobile ? 'block' : 'hidden md:block'}`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-4 items-center">
          {/* Search Input (5 cols) */}
          <div className="lg:col-span-4">
            <Input
              placeholder="Search model or manufacturer (e.g. Gulfstream, Citation)..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setPage(1);
              }}
              icon={Search}
              className="bg-surface py-2.5"
            />
          </div>

          {/* Min Seats (2 cols) */}
          <div className="lg:col-span-2">
            <Input
              type="number"
              min="1"
              max="25"
              placeholder="Min Seats"
              value={minSeats}
              onChange={(e) => {
                setMinSeats(e.target.value);
                setPage(1);
              }}
              className="bg-surface py-2.5"
            />
          </div>

          {/* Max Price/hr (2 cols) */}
          <div className="lg:col-span-2">
            <Input
              type="number"
              min="1000"
              step="500"
              placeholder="Max $/hour"
              value={maxPrice}
              onChange={(e) => {
                setMaxPrice(e.target.value);
                setPage(1);
              }}
              className="bg-surface py-2.5"
            />
          </div>

          {/* Sort By Dropdown (3 cols) */}
          <div className="lg:col-span-3">
            <Select
              options={SORT_OPTIONS}
              value={sortValue}
              onChange={(e) => {
                setSortValue(e.target.value);
                setPage(1);
              }}
              placeholder=""
              className="bg-surface py-2.5"
            />
          </div>

          {/* Clear Button (1 col) */}
          <div className="lg:col-span-1 flex items-center justify-end">
            {hasActiveFilters && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleClearFilters}
                className="text-xs text-muted hover:text-white w-full lg:w-auto"
                title="Clear all filters"
                icon={X}
              >
                Reset
              </Button>
            )}
          </div>
        </div>

        {/* Filter Meta & Results Count */}
        <div className="flex items-center justify-between text-xs text-muted pt-2">
          <div className="flex items-center gap-3">
            <span>
              Showing <strong className="text-white">{jets.length}</strong> of{' '}
              <strong className="text-gold">{totalCount}</strong> private aircraft
            </span>
            <label className="flex items-center gap-2 cursor-pointer ml-4 select-none hover:text-white">
              <input
                type="checkbox"
                checked={availableOnly}
                onChange={(e) => {
                  setAvailableOnly(e.target.checked);
                  setPage(1);
                }}
                className="rounded accent-gold cursor-pointer"
              />
              <span>Available for immediate charter only</span>
            </label>
          </div>

          {hasActiveFilters && (
            <span className="hidden sm:inline-block text-[11px] text-gold/80 font-mono">
              [Filters Synchronized with URL]
            </span>
          )}
        </div>
      </div>

      {/* Fleet Grid */}
      <div className="py-8">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 6 }).map((_, i) => (
              <JetCardSkeleton key={i} />
            ))}
          </div>
        ) : jets.length === 0 ? (
          /* Empty State */
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="min-h-[40vh] flex flex-col items-center justify-center text-center p-12 bg-surface rounded-2xl border border-border"
          >
            <div className="w-16 h-16 rounded-full bg-surface-card flex items-center justify-center text-muted mb-4 border border-border">
              <Plane className="w-8 h-8 opacity-40 rotate-45" />
            </div>
            <h3 className="font-serif text-xl sm:text-2xl text-white font-medium mb-2">
              No Aircraft Found Matching Criteria
            </h3>
            <p className="text-xs sm:text-sm text-muted max-w-md mb-6 leading-relaxed">
              We couldn&apos;t find any aircraft meeting your exact filters.
              Try adjusting your passenger capacity, price ceiling, or category.
            </p>
            <Button variant="primary" size="md" onClick={handleClearFilters} icon={RefreshCcw}>
              Reset All Fleet Filters
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {jets.map((jet, idx) => (
              <JetCard key={jet.id} jet={jet} index={idx} />
            ))}
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {totalPages > 1 && (
        <div className="py-8 flex items-center justify-center gap-3 border-t border-border/60">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => {
              setPage((p) => Math.max(1, p - 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            icon={ChevronLeft}
          >
            Previous
          </Button>

          <div className="flex items-center gap-1.5 px-3">
            {Array.from({ length: totalPages }).map((_, i) => {
              const pNum = i + 1;
              return (
                <button
                  key={pNum}
                  onClick={() => {
                    setPage(pNum);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`w-8 h-8 rounded-lg text-xs font-medium transition-all ${
                    page === pNum
                      ? 'bg-gold text-black font-bold shadow-gold-glow'
                      : 'bg-surface border border-border text-muted hover:text-white'
                  }`}
                >
                  {pNum}
                </button>
              );
            })}
          </div>

          <Button
            variant="secondary"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => {
              setPage((p) => Math.min(totalPages, p + 1));
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4 ml-1" />
          </Button>
        </div>
      )}
    </div>
  );
}
