import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Plane, Calendar, Users, MapPin, ArrowRight, ArrowLeft, 
  Clock, ShieldCheck, DollarSign, FileText, CheckCircle2, Sparkles 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getJetById } from '../services/jets';
import { getCities } from '../services/cities';
import { createBooking } from '../services/bookings';
import { Stepper } from '../components/Stepper';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Ticket } from '../components/Ticket';
import { Skeleton } from '../components/Skeleton';
import { 
  calculateDistance, 
  calculateFlightHours, 
  calculateEstimatedPrice, 
  formatCurrency, 
  formatFlightDuration 
} from '../utils/haversine';

const STEPS = [
  { title: 'Route & Schedule', subtitle: 'Live flight avionics' },
  { title: 'Passenger Details', subtitle: 'Lead manifest' },
  { title: 'Itinerary Review', subtitle: 'Charter agreement' },
  { title: 'VIP Boarding Pass', subtitle: 'Confirmed ticket' },
];

export function BookingFlowPage() {
  const { jetId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, profile } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [jet, setJet] = useState(null);
  const [cities, setCities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // Step 1: Route & Schedule Form
  const [fromCity, setFromCity] = useState(searchParams.get('from') || 'Delhi');
  const [toCity, setToCity] = useState(searchParams.get('to') || 'Dubai');
  const [flightDate, setFlightDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 3);
    return d.toISOString().split('T')[0];
  });
  const [passengers, setPassengers] = useState(
    parseInt(searchParams.get('passengers') || '4', 10)
  );

  // Step 2: Passenger & Service Details Form
  const [passengerName, setPassengerName] = useState(profile?.full_name || '');
  const [passengerPhone, setPassengerPhone] = useState(profile?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(true);

  // Load Jet and Cities
  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const [jetRes, citiesRes] = await Promise.all([
          getJetById(jetId),
          getCities(),
        ]);
        setJet(jetRes.data);
        setCities(citiesRes.data || []);
      } catch (err) {
        console.error('Error loading booking prerequisites:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [jetId]);

  // Sync profile details if available
  useEffect(() => {
    if (profile) {
      if (!passengerName && profile.full_name) setPassengerName(profile.full_name);
      if (!passengerPhone && profile.phone) setPassengerPhone(profile.phone);
    }
  }, [profile, passengerName, passengerPhone]);

  // Live client-side calculation using exact same formula
  const fromCityObj = cities.find((c) => c.name === fromCity);
  const toCityObj = cities.find((c) => c.name === toCity);

  const estimatedDistance =
    fromCityObj && toCityObj && fromCity !== toCity
      ? calculateDistance(fromCityObj.lat, fromCityObj.lng, toCityObj.lat, toCityObj.lng)
      : 0;

  const estimatedHours = jet
    ? calculateFlightHours(estimatedDistance, jet.speed_kmh)
    : 0;

  const estimatedTotal = jet
    ? calculateEstimatedPrice(estimatedHours, jet.price_per_hour)
    : 0;

  // Demo auto-fill helpers
  const handleAutoFillRoute = () => {
    setFromCity('Delhi');
    setToCity('Dubai');
    const d = new Date();
    d.setDate(d.getDate() + 3);
    setFlightDate(d.toISOString().split('T')[0]);
    setPassengers(Math.min(4, jet?.seats || 4));
    toast.success('Demo flight route auto-filled: Delhi ✈ Dubai');
  };

  const handleAutoFillPassenger = () => {
    setPassengerName('Lord Alexander Hamilton');
    setPassengerPhone('+1 (555) 019-2834');
    setSpecialRequests('Chilled Dom Pérignon 2008 Vintage on boarding, Ossetra Royal Caviar service with blinis, and tarmac Rolls-Royce Phantom ramp transfer on arrival.');
    toast.success('VIP Passenger Manifest auto-filled!');
  };

  // Step Navigation Validators
  const handleNextFromStep1 = () => {
    if (fromCity === toCity) {
      toast.error('Departure and arrival cities cannot be the same.');
      return;
    }
    const today = new Date().toISOString().split('T')[0];
    if (flightDate < today) {
      toast.error('Flight date cannot be in the past.');
      return;
    }
    if (passengers <= 0) {
      toast.error('Please enter at least 1 passenger.');
      return;
    }
    if (jet && passengers > jet.seats) {
      toast.error(`Passenger count exceeds aircraft capacity of ${jet.seats} seats.`);
      return;
    }
    setCurrentStep(2);
  };

  const handleNextFromStep2 = () => {
    if (!passengerName.trim()) {
      toast.error('Please enter the lead passenger full name.');
      return;
    }
    if (!passengerPhone.trim()) {
      toast.error('Please enter a valid contact phone number.');
      return;
    }
    setCurrentStep(3);
  };

  // Submit Final Booking to Supabase
  const handleFinalBookingSubmit = async () => {
    if (!termsAccepted) {
      toast.error('Please accept the charter terms and flight manifest conditions.');
      return;
    }

    setSubmitting(true);
    const toastId = toast.loading('Dispatching private aircraft reservation...');

    try {
      const payload = {
        user_id: user.id,
        jet_id: jet.id,
        from_city: fromCity,
        to_city: toCity,
        flight_date: flightDate,
        passengers: Number(passengers),
        passenger_name: passengerName.trim(),
        passenger_phone: passengerPhone.trim(),
        special_requests: specialRequests.trim() || null,
        status: 'Confirmed',
      };

      const { data, error } = await createBooking(payload);

      if (error) {
        toast.error(error.message, { id: toastId, duration: 5000 });
        setSubmitting(false);
        return;
      }

      toast.success('Private jet charter confirmed successfully!', { id: toastId });
      setConfirmedBooking(data);
      setCurrentStep(4);
    } catch (err) {
      console.error('Charter dispatch exception:', err);
      toast.error(err.message || 'Failed to dispatch charter reservation.', { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 space-y-6">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-96 w-full rounded-3xl" />
      </div>
    );
  }

  if (!jet) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="font-serif text-2xl text-white font-bold mb-2">Aircraft Not Found</h2>
        <p className="text-sm text-muted mb-6">
          The requested private jet could not be found.
        </p>
        <Button variant="primary" onClick={() => navigate('/jets')}>
          Back to Fleet Catalog
        </Button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 min-h-screen">
      {/* Header Stepper */}
      <div className="mb-8">
        <div className="text-center mb-4">
          <span className="text-xs uppercase tracking-widest text-gold font-semibold">
            Private Charter Dispatch
          </span>
          <h1 className="font-serif text-2xl sm:text-4xl font-bold text-white tracking-tight mt-1">
            Charter {jet.manufacturer} {jet.name}
          </h1>
        </div>

        <Stepper
          steps={STEPS}
          currentStep={currentStep}
          onStepClick={(step) => {
            if (currentStep < 4) setCurrentStep(step);
          }}
        />
      </div>

      {/* Step Contents with AnimatePresence */}
      <AnimatePresence mode="wait">
        {/* STEP 1: ROUTE & SCHEDULE */}
        {currentStep === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Form Left (7 cols) */}
            <div className="lg:col-span-7 bg-surface border border-border rounded-3xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-border">
                <h3 className="font-serif text-xl font-bold text-white">
                  1. Select Route & Flight Schedule
                </h3>
                <button
                  type="button"
                  onClick={handleAutoFillRoute}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gold/10 hover:bg-gold/20 border border-gold/40 text-gold-light text-xs font-medium transition-all"
                >
                  <Sparkles className="w-3.5 h-3.5 text-gold" />
                  <span>Demo Route</span>
                </button>
              </div>

              <div className="space-y-4">
                {/* From City */}
                <div>
                  <label className="text-xs text-muted-light block mb-1.5 font-medium flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-gold" />
                    Departure Airport / City
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
                <div>
                  <label className="text-xs text-muted-light block mb-1.5 font-medium flex items-center gap-1.5">
                    <Plane className="w-3.5 h-3.5 text-gold" />
                    Arrival Airport / City
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

                {/* Date & Passengers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-muted-light block mb-1.5 font-medium flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-gold" />
                      Charter Flight Date
                    </label>
                    <input
                      type="date"
                      min={new Date().toISOString().split('T')[0]}
                      value={flightDate}
                      onChange={(e) => setFlightDate(e.target.value)}
                      className="w-full bg-surface-card border border-border focus:border-gold rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                    />
                  </div>

                  <div>
                    <label className="text-xs text-muted-light block mb-1.5 font-medium flex items-center gap-1.5">
                      <Users className="w-3.5 h-3.5 text-gold" />
                      Passengers (Max: {jet.seats})
                    </label>
                    <input
                      type="number"
                      min="1"
                      max={jet.seats}
                      value={passengers}
                      onChange={(e) => setPassengers(parseInt(e.target.value, 10) || 1)}
                      className="w-full bg-surface-card border border-border focus:border-gold rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
                    />
                  </div>
                </div>
              </div>

              {fromCity === toCity && (
                <div className="p-3 bg-red-950/30 border border-red-800/40 rounded-xl text-xs text-red-300">
                  Departure and arrival cities cannot be identical.
                </div>
              )}

              <div className="pt-4 flex justify-end">
                <Button
                  variant="primary"
                  size="lg"
                  onClick={handleNextFromStep1}
                  disabled={fromCity === toCity}
                  icon={ArrowRight}
                  className="w-full sm:w-auto px-8 font-bold"
                >
                  Continue to Manifest
                </Button>
              </div>
            </div>

            {/* Live Avionics Right (5 cols) */}
            <div className="lg:col-span-5 bg-surface border border-gold/40 rounded-3xl p-6 sm:p-7 shadow-luxury space-y-6 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-gold font-semibold block mb-1">
                  Live Avionics Estimate
                </span>
                <h4 className="font-serif text-lg font-bold text-white">
                  Route & Charter Economics
                </h4>
                <p className="text-xs text-muted mt-1 leading-relaxed">
                  Real-time distance and flight time calculations based on {jet.name}&apos;s cruising speed ({jet.speed_kmh} km/h).
                </p>

                <div className="mt-6 space-y-3 p-4 bg-surface-card rounded-2xl border border-border">
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">Direct Great-Circle Distance</span>
                    <span className="font-semibold text-white">
                      {estimatedDistance.toLocaleString()} km
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">Estimated Flight Duration</span>
                    <span className="font-semibold text-white">
                      {formatFlightDuration(estimatedHours)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-muted">Hourly Aircraft Rate</span>
                    <span className="font-semibold text-white">
                      {formatCurrency(jet.price_per_hour)} / hr
                    </span>
                  </div>
                  <div className="pt-3 border-t border-border flex items-baseline justify-between">
                    <span className="text-xs uppercase tracking-wider text-muted font-medium">
                      Estimated Charter Total
                    </span>
                    <span className="text-2xl font-serif font-bold text-gold">
                      {formatCurrency(estimatedTotal)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-3.5 bg-gold/10 border border-gold/30 rounded-xl text-[11px] text-gold-light flex items-start gap-2.5">
                <ShieldCheck className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                <span>
                  Exact price is verified and sealed by the Postgres database trigger upon reservation creation.
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* STEP 2: PASSENGER & SERVICE DETAILS */}
        {currentStep === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-2xl mx-auto bg-surface border border-border rounded-3xl p-6 sm:p-8 space-y-6"
          >
            <div className="border-b border-border pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="font-serif text-xl font-bold text-white">
                  2. Lead Passenger Manifest & Requests
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Private hangar security clearance and in-flight catering.
                </p>
              </div>
              <button
                type="button"
                onClick={handleAutoFillPassenger}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gold/10 hover:bg-gold/20 border border-gold/40 text-gold-light text-xs font-medium transition-all shadow-sm hover:shadow-gold-glow self-start sm:self-auto"
              >
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>Auto-Fill VIP Details</span>
              </button>
            </div>

            <div className="space-y-4">
              <Input
                label="Lead Passenger Full Name (VIP)"
                placeholder="e.g. Lord Alexander Hamilton"
                value={passengerName}
                onChange={(e) => setPassengerName(e.target.value)}
                required
              />

              <Input
                label="Primary Contact Phone"
                placeholder="e.g. +1 (555) 019-2834"
                value={passengerPhone}
                onChange={(e) => setPassengerPhone(e.target.value)}
                required
              />

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium tracking-wide uppercase text-muted-light/80">
                  Bespoke In-Flight Requests & Dietary (Optional)
                </label>
                <textarea
                  rows={4}
                  placeholder="Specify champagne preference (e.g. Dom Pérignon), caviar selection, ground limousine service, or special luggage requirements..."
                  value={specialRequests}
                  onChange={(e) => setSpecialRequests(e.target.value)}
                  className="w-full bg-surface-card border border-border focus:border-gold rounded-xl p-3.5 text-xs text-white placeholder-muted-dark outline-none resize-none leading-relaxed"
                />
              </div>
            </div>

            <div className="pt-4 flex items-center justify-between">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setCurrentStep(1)}
                icon={ArrowLeft}
              >
                Back to Route
              </Button>
              <Button
                variant="primary"
                size="md"
                onClick={handleNextFromStep2}
                icon={ArrowRight}
                className="px-8 font-bold"
              >
                Proceed to Review
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 3: ITINERARY REVIEW */}
        {currentStep === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="max-w-3xl mx-auto bg-surface border border-gold/40 rounded-3xl p-6 sm:p-8 space-y-6 shadow-luxury"
          >
            <div className="border-b border-border pb-3">
              <h3 className="font-serif text-2xl font-bold text-white">
                3. Review Charter Itinerary & Confirmation
              </h3>
              <p className="text-xs text-muted mt-1">
                Please verify your flight parameters before final dispatch authorization.
              </p>
            </div>

            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Flight Summary */}
              <div className="p-4 bg-surface-card rounded-2xl border border-border space-y-2.5">
                <span className="text-[10px] uppercase tracking-wider text-gold font-bold block">
                  Flight Routing
                </span>
                <div className="text-base font-serif font-bold text-white">
                  {fromCity} &rarr; {toCity}
                </div>
                <div className="text-xs text-muted">
                  Date: <span className="text-white font-medium">{flightDate}</span>
                </div>
                <div className="text-xs text-muted">
                  Passengers: <span className="text-white font-medium">{passengers} Guests</span>
                </div>
                <div className="text-xs text-muted">
                  Flight Hours:{' '}
                  <span className="text-white font-medium">
                    {formatFlightDuration(estimatedHours)} ({estimatedHours} hrs)
                  </span>
                </div>
              </div>

              {/* Jet & Passenger Summary */}
              <div className="p-4 bg-surface-card rounded-2xl border border-border space-y-2.5">
                <span className="text-[10px] uppercase tracking-wider text-gold font-bold block">
                  Aircraft & Lead Manifest
                </span>
                <div className="text-base font-serif font-bold text-white">
                  {jet.manufacturer} {jet.name}
                </div>
                <div className="text-xs text-muted">
                  Category: <span className="text-white font-medium">{jet.category}</span>
                </div>
                <div className="text-xs text-muted">
                  Lead VIP: <span className="text-white font-medium">{passengerName}</span>
                </div>
                <div className="text-xs text-muted truncate">
                  Phone: <span className="text-white font-medium">{passengerPhone}</span>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="p-5 bg-surface-card/60 rounded-2xl border border-border space-y-3">
              <div className="flex justify-between text-xs text-muted">
                <span>Base Aircraft Charter Rate ({jet.speed_kmh} km/h cruise)</span>
                <span>{formatCurrency(jet.price_per_hour)} / hr</span>
              </div>
              <div className="flex justify-between text-xs text-muted">
                <span>Calculated Air Time ({estimatedDistance.toLocaleString()} km)</span>
                <span>{estimatedHours} charter hours</span>
              </div>
              <div className="flex justify-between text-xs text-muted">
                <span>Private FBO Ramp Access & VIP Lounge</span>
                <span className="text-emerald-400">Complimentary</span>
              </div>
              <div className="pt-3 border-t border-border flex items-baseline justify-between">
                <span className="text-sm font-bold uppercase tracking-wider text-white">
                  Total Charter Investment
                </span>
                <span className="text-3xl font-serif font-bold text-gold">
                  {formatCurrency(estimatedTotal)}
                </span>
              </div>
            </div>

            {/* Terms checkbox */}
            <label className="flex items-start gap-3 cursor-pointer select-none p-3.5 bg-surface-card rounded-xl border border-border">
              <input
                type="checkbox"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-0.5 rounded accent-gold cursor-pointer"
              />
              <span className="text-xs text-muted-light leading-relaxed">
                I hereby authorize this private charter reservation under the AeroLux Sovereign Flight Agreement.
                I understand the database trigger enforces capacity restrictions and immediate airframe hold.
              </span>
            </label>

            <div className="pt-4 flex items-center justify-between">
              <Button
                variant="secondary"
                size="md"
                onClick={() => setCurrentStep(2)}
                icon={ArrowLeft}
              >
                Back to Manifest
              </Button>
              <Button
                variant="primary"
                size="lg"
                loading={submitting}
                disabled={!termsAccepted}
                onClick={handleFinalBookingSubmit}
                icon={CheckCircle2}
                className="px-8 font-bold shadow-gold-glow"
              >
                Confirm & Dispatch Aircraft
              </Button>
            </div>
          </motion.div>
        )}

        {/* STEP 4: CONFIRMATION & BOARDING PASS */}
        {currentStep === 4 && confirmedBooking && (
          <motion.div
            key="step4"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full space-y-6"
          >
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-full bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 flex items-center justify-center mx-auto mb-3 shadow-gold-glow">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h2 className="font-serif text-3xl font-bold text-white">
                Charter Flight Authorized & Confirmed
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-1 max-w-lg mx-auto">
                Your private flight manifest has been registered. Present this boarding pass
                at the private FBO terminal upon departure.
              </p>
            </div>

            {/* Boarding Pass Ticket Component */}
            <Ticket
              booking={confirmedBooking}
              jet={jet}
              onDone={() => navigate('/bookings')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
