import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { 
  Plane, Calendar, Users, MapPin, ArrowRight, ShieldCheck, 
  Clock, Award, Sparkles, Coffee, Globe, Key, ChevronRight 
} from 'lucide-react';
import { Button } from '../components/Button';
import { JetCard } from '../components/JetCard';
import { JetCardSkeleton } from '../components/Skeleton';
import { getJets } from '../services/jets';
import { getCities } from '../services/cities';

export function LandingPage() {
  const navigate = useNavigate();
  const [featuredJets, setFeaturedJets] = useState([]);
  const [cities, setCities] = useState([]);
  const [loadingJets, setLoadingJets] = useState(true);

  // Quick Search Bar state
  const [fromCity, setFromCity] = useState('Delhi');
  const [toCity, setToCity] = useState('Dubai');
  const [flightDate, setFlightDate] = useState(() => {
    const today = new Date();
    today.setDate(today.getDate() + 3);
    return today.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState(4);

  useEffect(() => {
    async function loadData() {
      try {
        const [jetsRes, citiesRes] = await Promise.all([
          getJets({ pageSize: 3, sortBy: 'price_per_hour', sortOrder: 'desc' }),
          getCities(),
        ]);
        setFeaturedJets(jetsRes.data || []);
        setCities(citiesRes.data || []);
      } catch (err) {
        console.error('Failed to load landing page data:', err);
      } finally {
        setLoadingJets(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams({
      from: fromCity,
      to: toCity,
      date: flightDate,
      passengers: passengers.toString(),
      minSeats: passengers.toString(),
    });
    navigate(`/jets?${params.toString()}`);
  };

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        {/* Background Jet Visual with Gradient Overlays */}
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=2000&q=85"
            alt="Private Jet Charter"
            className="w-full h-full object-cover object-center brightness-[0.32] scale-105 transform animate-pulse duration-[10000ms]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
          <div className="absolute inset-0 bg-radial-vignette opacity-70" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto text-center flex flex-col items-center">
          {/* Subtle Tagline Pill */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-surface-card/80 border border-gold/40 text-gold-light text-xs uppercase tracking-[0.25em] font-medium backdrop-blur-md mb-8 shadow-gold-glow"
          >
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>The Sovereign Standard in Private Aviation</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-white max-w-4xl leading-[1.15]"
          >
            Elevate Your Journey Above the Ordinary.
          </motion.h1>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="mt-6 text-base sm:text-xl text-muted-light max-w-2xl font-light leading-relaxed"
          >
            Direct access to the world&apos;s most refined private aircraft. Zero lines, absolute discretion,
            and tailored intercontinental itineraries on your exact schedule.
          </motion.p>

          {/* 2. LIVE ROUTE SEARCH WIDGET */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.45 }}
            className="w-full max-w-4xl mt-12 bg-surface/90 border border-gold/40 rounded-3xl p-4 sm:p-6 shadow-luxury backdrop-blur-xl"
          >
            <form onSubmit={handleSearchSubmit} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* From City */}
              <div className="flex flex-col text-left">
                <label className="text-[11px] font-medium uppercase tracking-wider text-muted-light mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-gold" />
                  Departure Port
                </label>
                <select
                  value={fromCity}
                  onChange={(e) => setFromCity(e.target.value)}
                  className="w-full bg-surface-card border border-border focus:border-gold rounded-xl px-3.5 py-3 text-sm text-white outline-none cursor-pointer"
                >
                  {cities.map((c) => (
                    <option key={c.code} value={c.name} className="bg-surface text-white">
                      {c.name} ({c.code}) - {c.country}
                    </option>
                  ))}
                </select>
              </div>

              {/* To City */}
              <div className="flex flex-col text-left">
                <label className="text-[11px] font-medium uppercase tracking-wider text-muted-light mb-1.5 flex items-center gap-1.5">
                  <Plane className="w-3.5 h-3.5 text-gold" />
                  Arrival Port
                </label>
                <select
                  value={toCity}
                  onChange={(e) => setToCity(e.target.value)}
                  className="w-full bg-surface-card border border-border focus:border-gold rounded-xl px-3.5 py-3 text-sm text-white outline-none cursor-pointer"
                >
                  {cities.map((c) => (
                    <option key={c.code} value={c.name} className="bg-surface text-white">
                      {c.name} ({c.code}) - {c.country}
                    </option>
                  ))}
                </select>
              </div>

              {/* Flight Date */}
              <div className="flex flex-col text-left">
                <label className="text-[11px] font-medium uppercase tracking-wider text-muted-light mb-1.5 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-gold" />
                  Departure Date
                </label>
                <input
                  type="date"
                  min={new Date().toISOString().split('T')[0]}
                  value={flightDate}
                  onChange={(e) => setFlightDate(e.target.value)}
                  className="w-full bg-surface-card border border-border focus:border-gold rounded-xl px-3.5 py-2.5 text-sm text-white outline-none cursor-pointer"
                />
              </div>

              {/* Passengers & CTA */}
              <div className="flex flex-col justify-end">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  icon={ArrowRight}
                  className="w-full py-3.5 font-bold shadow-gold-glow"
                >
                  Find Available Jets
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* 3. KEY STATS BANNER */}
      <section className="border-y border-border/80 bg-surface/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-gold">5,000+</div>
              <p className="text-xs uppercase tracking-wider text-muted mt-1">Exclusive Private FBOs</p>
            </div>
            <div>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-white">15 min</div>
              <p className="text-xs uppercase tracking-wider text-muted mt-1">Average Ramp Boarding</p>
            </div>
            <div>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-gold">100%</div>
              <p className="text-xs uppercase tracking-wider text-muted mt-1">Safety Audit Record</p>
            </div>
            <div>
              <div className="font-serif text-3xl sm:text-4xl font-bold text-white">24/7/365</div>
              <p className="text-xs uppercase tracking-wider text-muted mt-1">VIP Flight Dispatch</p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. FEATURED FLEET SHOWCASE */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-widest text-gold font-semibold block mb-2">
              Featured Flagships
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Curated Private Aircraft
            </h2>
          </div>
          <Link to="/jets">
            <Button variant="outline" size="sm" icon={ChevronRight} className="self-start">
              Explore Full Fleet (10 Aircraft)
            </Button>
          </Link>
        </div>

        {loadingJets ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <JetCardSkeleton />
            <JetCardSkeleton />
            <JetCardSkeleton />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredJets.map((jet, idx) => (
              <JetCard key={jet.id} jet={jet} index={idx} />
            ))}
          </div>
        )}
      </section>

      {/* 5. WHY AEROLUX (LUXURY CHARTER ADVANTAGES) */}
      <section className="py-24 bg-surface/40 border-y border-border/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-widest text-gold font-semibold block mb-2">
              The AeroLux Advantage
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
              Aviation Crafted for Discretion & Luxury
            </h2>
            <p className="text-sm text-muted mt-4 leading-relaxed">
              Commercial first class cannot compete with the liberty of choosing your departure hour,
              landing closer to your destination, and operating in complete acoustic privacy.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-surface border border-border hover:border-gold/30 rounded-2xl p-6 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-5">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">Uncompromising Safety</h3>
              <p className="text-xs text-muted leading-relaxed">
                Dual-pilot type-rated captains, Wyvern Wingman & ARGUS Platinum verified operators on every mission.
              </p>
            </div>

            <div className="bg-surface border border-border hover:border-gold/30 rounded-2xl p-6 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-5">
                <Coffee className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">Michelin In-Flight Dining</h3>
              <p className="text-xs text-muted leading-relaxed">
                Bespoke gourmet menus, sommelier-curated champagne pairings, and specialized culinary requests prepared fresh.
              </p>
            </div>

            <div className="bg-surface border border-border hover:border-gold/30 rounded-2xl p-6 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-5">
                <Key className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">Tarmac Drive-Up Access</h3>
              <p className="text-xs text-muted leading-relaxed">
                Pull your vehicle directly up to the aircraft boarding stairs at private FBOs. Arrive 15 minutes before wheels up.
              </p>
            </div>

            <div className="bg-surface border border-border hover:border-gold/30 rounded-2xl p-6 transition-all">
              <div className="w-12 h-12 rounded-xl bg-gold/10 border border-gold/30 flex items-center justify-center text-gold mb-5">
                <Globe className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-lg font-bold text-white mb-2">Intercontinental Range</h3>
              <p className="text-xs text-muted leading-relaxed">
                Fly non-stop between continents with high-speed Ka-Band satellite connectivity and lie-flat master staterooms.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. HOW IT WORKS */}
      <section id="how-it-works" className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold block mb-2">
            Seamless Process
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-white tracking-tight">
            Charter Your Aircraft in 4 Steps
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
          <div className="flex flex-col items-center text-center p-6 bg-surface-card/40 rounded-2xl border border-border">
            <span className="w-10 h-10 rounded-full bg-gold/20 text-gold font-serif text-lg font-bold flex items-center justify-center mb-4">
              1
            </span>
            <h4 className="font-serif text-base font-bold text-white mb-2">Select Your Jet</h4>
            <p className="text-xs text-muted leading-relaxed">
              Browse our diverse fleet from agile Light Jets to flagship Ultra Long Range aircraft.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-surface-card/40 rounded-2xl border border-border">
            <span className="w-10 h-10 rounded-full bg-gold/20 text-gold font-serif text-lg font-bold flex items-center justify-center mb-4">
              2
            </span>
            <h4 className="font-serif text-base font-bold text-white mb-2">Set Your Itinerary</h4>
            <p className="text-xs text-muted leading-relaxed">
              Choose departure and arrival cities. Our automated avionics instantly calculate distance and cost.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-surface-card/40 rounded-2xl border border-border">
            <span className="w-10 h-10 rounded-full bg-gold/20 text-gold font-serif text-lg font-bold flex items-center justify-center mb-4">
              3
            </span>
            <h4 className="font-serif text-base font-bold text-white mb-2">VIP Manifest</h4>
            <p className="text-xs text-muted leading-relaxed">
              Input lead passenger details and bespoke culinary or ground transportation requirements.
            </p>
          </div>

          <div className="flex flex-col items-center text-center p-6 bg-surface-card/40 rounded-2xl border border-border">
            <span className="w-10 h-10 rounded-full bg-gold/20 text-gold font-serif text-lg font-bold flex items-center justify-center mb-4">
              4
            </span>
            <h4 className="font-serif text-base font-bold text-white mb-2">Instant VIP Pass</h4>
            <p className="text-xs text-muted leading-relaxed">
              Download your official boarding pass, arrive at the private hangar, and step aboard.
            </p>
          </div>
        </div>
      </section>

      {/* 7. BOTTOM CTA */}
      <section className="py-20 bg-gradient-to-b from-surface to-background border-t border-border">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight mb-4">
            Your Private Runway Awaits.
          </h2>
          <p className="text-base text-muted-light max-w-xl mb-8 leading-relaxed">
            Experience the zenith of executive travel. Speak with our flight operations team
            or reserve your charter online in minutes.
          </p>
          <Link to="/jets">
            <Button variant="primary" size="lg" icon={ArrowRight} className="px-8 shadow-gold-glow-lg font-bold">
              View Available Fleet Now
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
