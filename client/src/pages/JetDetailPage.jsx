import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Users, Gauge, Compass, CheckCircle2, ArrowRight, ShieldCheck, 
  MapPin, Clock, DollarSign, ChevronLeft, Wifi, Award, Sparkles 
} from 'lucide-react';
import { getJetById } from '../services/jets';
import { getCities } from '../services/cities';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { 
  calculateDistance, 
  calculateFlightHours, 
  calculateEstimatedPrice, 
  formatCurrency, 
  formatFlightDuration 
} from '../utils/haversine';
import { Skeleton } from '../components/Skeleton';

export function JetDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [jet, setJet] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Live route calculator widget state
  const [calcFrom, setCalcFrom] = useState('Delhi');
  const [calcTo, setCalcTo] = useState('London');

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [jetRes, citiesRes] = await Promise.all([
          getJetById(id),
          getCities(),
        ]);
        setJet(jetRes.data);
        setCities(citiesRes.data || []);
      } catch (err) {
        console.error('Error fetching jet details:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [id]);

  // Route Calculation
  const fromCityObj = cities.find((c) => c.name === calcFrom);
  const toCityObj = cities.find((c) => c.name === calcTo);

  const routeDistance =
    fromCityObj && toCityObj && calcFrom !== calcTo
      ? calculateDistance(fromCityObj.lat, fromCityObj.lng, toCityObj.lat, toCityObj.lng)
      : 0;

  const routeHours = jet
    ? calculateFlightHours(routeDistance, jet.speed_kmh)
    : 0;

  const routePrice = jet
    ? calculateEstimatedPrice(routeHours, jet.price_per_hour)
    : 0;

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <Skeleton className="h-96 w-full rounded-3xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-32 w-full" />
          </div>
          <Skeleton className="h-80 w-full" />
        </div>
      </div>
    );
  }

  if (!jet) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="font-serif text-2xl text-white font-bold mb-2">Aircraft Not Found</h2>
        <p className="text-sm text-muted mb-6">
          The requested private jet could not be found or has been decommissioned.
        </p>
        <Link to="/jets">
          <Button variant="primary" icon={ChevronLeft}>
            Return to Fleet
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Back button */}
      <div className="mb-6">
        <Link
          to="/jets"
          className="inline-flex items-center gap-1.5 text-xs text-muted hover:text-white transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back to Fleet Catalog</span>
        </Link>
      </div>

      {/* Hero Banner Visual */}
      <div className="relative h-[420px] sm:h-[500px] w-full rounded-3xl overflow-hidden shadow-2xl border border-border">
        <img
          src={jet.image_url}
          alt={`${jet.manufacturer} ${jet.name}`}
          className="w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-black/20" />

        {/* Floating Header Badges */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
          <Badge variant={jet.category} size="lg">
            {jet.category} Jet
          </Badge>
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-black/60 backdrop-blur-md text-emerald-400 border border-emerald-500/30">
            Available For Charter
          </span>
        </div>

        {/* Title Overlay */}
        <div className="absolute bottom-6 left-6 right-6 sm:bottom-10 sm:left-10">
          <span className="text-xs sm:text-sm uppercase tracking-widest text-gold font-semibold">
            {jet.manufacturer}
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight mt-1">
            {jet.name}
          </h1>
        </div>
      </div>

      {/* Two Column Layout: Details on Left, Interactive Calculator on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 mt-12">
        {/* Left Col (8 cols): Specs, Description, Amenities */}
        <div className="lg:col-span-8 space-y-10">
          {/* Technical Specs Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-surface rounded-2xl border border-border">
            <div className="flex flex-col">
              <span className="text-xs text-muted flex items-center gap-1.5 mb-1">
                <Users className="w-3.5 h-3.5 text-gold" />
                Cabin Capacity
              </span>
              <span className="text-lg font-bold text-white">
                {jet.seats} <span className="text-xs text-muted font-normal">Passengers</span>
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-muted flex items-center gap-1.5 mb-1">
                <Compass className="w-3.5 h-3.5 text-gold" />
                Max Range
              </span>
              <span className="text-lg font-bold text-white">
                {jet.range_km?.toLocaleString()} <span className="text-xs text-muted font-normal">km</span>
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-muted flex items-center gap-1.5 mb-1">
                <Gauge className="w-3.5 h-3.5 text-gold" />
                Cruising Speed
              </span>
              <span className="text-lg font-bold text-white">
                {jet.speed_kmh} <span className="text-xs text-muted font-normal">km/h</span>
              </span>
            </div>

            <div className="flex flex-col">
              <span className="text-xs text-muted flex items-center gap-1.5 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-gold" />
                Charter Rate
              </span>
              <span className="text-lg font-bold text-gold">
                {formatCurrency(jet.price_per_hour)} <span className="text-xs text-muted font-normal">/ hr</span>
              </span>
            </div>
          </div>

          {/* Aircraft Overview */}
          <div>
            <h3 className="font-serif text-2xl font-bold text-white mb-3">
              Aircraft Overview & Engineering
            </h3>
            <p className="text-sm sm:text-base text-muted-light leading-relaxed font-light">
              {jet.description}
            </p>
          </div>

          {/* Bespoke Cabin Amenities */}
          <div>
            <h3 className="font-serif text-2xl font-bold text-white mb-4">
              Bespoke Cabin Amenities
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {(jet.amenities || []).map((amenity, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3.5 bg-surface rounded-xl border border-border"
                >
                  <div className="w-7 h-7 rounded-lg bg-gold/15 text-gold flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs sm:text-sm font-medium text-white">
                    {amenity}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Safety & Standards Assurance */}
          <div className="p-6 bg-surface-card rounded-2xl border border-border/80 flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-gold/15 text-gold flex items-center justify-center shrink-0 mt-0.5">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white mb-1">
                IS-BAO Stage 3 & ARGUS Platinum Flight Standards
              </h4>
              <p className="text-xs text-muted leading-relaxed">
                Every charter flight operated with this aircraft adheres to the highest global safety standards,
                complete with dual-captain flight decks and certified ground handling protocols.
              </p>
            </div>
          </div>
        </div>

        {/* Right Col (4 cols): Live Route Estimate Calculator & Sticky CTA */}
        <div className="lg:col-span-4">
          <div className="sticky top-28 bg-surface border border-gold/40 rounded-3xl p-6 sm:p-7 shadow-luxury space-y-6">
            <div className="border-b border-border/80 pb-4">
              <span className="text-[11px] uppercase tracking-widest text-gold font-semibold block mb-1">
                Instant Flight Estimate
              </span>
              <h3 className="font-serif text-xl font-bold text-white">
                Live Route Avionics
              </h3>
              <p className="text-xs text-muted mt-1">
                Haversine distance and duration calculator based on this aircraft&apos;s cruising speed.
              </p>
            </div>

            {/* Calculator Selects */}
            <div className="space-y-4">
              <div>
                <label className="text-xs text-muted-light block mb-1.5 font-medium">
                  Departure City
                </label>
                <select
                  value={calcFrom}
                  onChange={(e) => setCalcFrom(e.target.value)}
                  className="w-full bg-surface-card border border-border focus:border-gold rounded-xl px-3.5 py-2.5 text-xs text-white outline-none cursor-pointer"
                >
                  {cities.map((c) => (
                    <option key={c.code} value={c.name} className="bg-surface text-white">
                      {c.name} ({c.code}) - {c.country}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-muted-light block mb-1.5 font-medium">
                  Destination City
                </label>
                <select
                  value={calcTo}
                  onChange={(e) => setCalcTo(e.target.value)}
                  className="w-full bg-surface-card border border-border focus:border-gold rounded-xl px-3.5 py-2.5 text-xs text-white outline-none cursor-pointer"
                >
                  {cities.map((c) => (
                    <option key={c.code} value={c.name} className="bg-surface text-white">
                      {c.name} ({c.code}) - {c.country}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Calculator Metrics Output */}
            {calcFrom === calcTo ? (
              <div className="p-3 bg-red-950/30 border border-red-800/40 rounded-xl text-xs text-red-300 text-center">
                Departure and arrival cities cannot be the same.
              </div>
            ) : (
              <div className="space-y-3 p-4 bg-surface-card/60 rounded-2xl border border-border">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    Direct Route Distance
                  </span>
                  <span className="font-semibold text-white">
                    {routeDistance.toLocaleString()} km
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-gold" />
                    Estimated Flight Time
                  </span>
                  <span className="font-semibold text-white">
                    {formatFlightDuration(routeHours)}
                  </span>
                </div>

                <div className="pt-3 border-t border-border flex items-baseline justify-between">
                  <span className="text-xs uppercase tracking-wider text-muted font-medium">
                    Estimated Charter Cost
                  </span>
                  <div className="text-right">
                    <span className="text-xl font-serif font-bold text-gold">
                      {formatCurrency(routePrice)}
                    </span>
                    <span className="text-[10px] text-muted block">excl. airport taxes</span>
                  </div>
                </div>
              </div>
            )}

            {/* Book Now Button */}
            <Button
              variant="primary"
              size="lg"
              onClick={() => {
                const params = new URLSearchParams({
                  from: calcFrom,
                  to: calcTo,
                });
                navigate(`/book/${jet.id}?${params.toString()}`);
              }}
              icon={ArrowRight}
              className="w-full shadow-gold-glow-lg font-bold"
            >
              Charter This Aircraft
            </Button>

            <p className="text-[11px] text-center text-muted-dark">
              Guaranteed availability upon booking confirmation. Final price verified by flight deck trigger.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
