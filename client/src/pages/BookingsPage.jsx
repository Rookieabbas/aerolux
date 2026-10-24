import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  Plane, Calendar, Users, Clock, AlertTriangle, Eye, Edit3, 
  Ban, ShieldCheck, Download, Plus, MapPin, RefreshCw 
} from 'lucide-react';
import { useBookings } from '../hooks/useBookings';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Modal } from '../components/Modal';
import { Input } from '../components/Input';
import { Ticket } from '../components/Ticket';
import { TableRowSkeleton, Skeleton } from '../components/Skeleton';
import { formatCurrency, formatFlightDuration } from '../utils/haversine';

export function BookingsPage() {
  const { bookings, loading, refetch, cancelBooking, updateBooking } = useBookings(false);

  // Status Filter: All, Confirmed, Cancelled
  const [statusFilter, setStatusFilter] = useState('All');

  // Modals state
  const [selectedTicketBooking, setSelectedTicketBooking] = useState(null);
  const [cancelModalBooking, setCancelModalBooking] = useState(null);
  const [editModalBooking, setEditModalBooking] = useState(null);

  // Edit form state
  const [editDate, setEditDate] = useState('');
  const [editPassengers, setEditPassengers] = useState(1);
  const [editSpecialRequests, setEditSpecialRequests] = useState('');
  const [updating, setUpdating] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'All') return true;
    return b.status === statusFilter;
  });

  const openEditModal = (booking) => {
    setEditModalBooking(booking);
    setEditDate(booking.flight_date);
    setEditPassengers(booking.passengers);
    setEditSpecialRequests(booking.special_requests || '');
  };

  const handleSaveEdit = async () => {
    if (!editModalBooking) return;
    setUpdating(true);
    const success = await updateBooking(editModalBooking.id, {
      flight_date: editDate,
      passengers: Number(editPassengers),
      special_requests: editSpecialRequests.trim() || null,
    });
    setUpdating(false);
    if (success) {
      setEditModalBooking(null);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancelModalBooking) return;
    setCancelling(true);
    const success = await cancelBooking(cancelModalBooking.id);
    setCancelling(false);
    if (success) {
      setCancelModalBooking(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/80">
        <div>
          <span className="text-xs uppercase tracking-widest text-gold font-semibold block mb-2">
            VIP Flight Manifest
          </span>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            My Flight Itineraries
          </h1>
          <p className="text-sm text-muted mt-2">
            Manage your scheduled private charter flights, review boarding passes, and modify itineraries.
          </p>
        </div>

        <Link to="/jets">
          <Button variant="primary" size="md" icon={Plus} className="shadow-gold-glow">
            Charter Another Jet
          </Button>
        </Link>
      </div>

      {/* Filter Tabs */}
      <div className="py-6 flex items-center justify-between border-b border-border/40">
        <div className="flex items-center gap-2">
          {['All', 'Confirmed', 'Cancelled'].map((tab) => (
            <button
              key={tab}
              onClick={() => setStatusFilter(tab)}
              className={`px-4 py-1.5 rounded-xl text-xs font-medium transition-all ${
                statusFilter === tab
                  ? 'bg-gold text-black font-semibold shadow-gold-glow'
                  : 'bg-surface border border-border text-muted hover:text-white'
              }`}
            >
              {tab} Flights
            </button>
          ))}
        </div>

        <button
          onClick={refetch}
          className="text-xs text-muted hover:text-white flex items-center gap-1.5 p-1.5"
          title="Refresh bookings"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Refresh</span>
        </button>
      </div>

      {/* Bookings List / Cards */}
      <div className="py-8">
        {loading ? (
          <div className="space-y-4">
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
            <Skeleton className="h-28 w-full rounded-2xl" />
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="min-h-[40vh] flex flex-col items-center justify-center text-center p-12 bg-surface rounded-3xl border border-border">
            <div className="w-16 h-16 rounded-full bg-surface-card flex items-center justify-center text-muted mb-4 border border-border">
              <Plane className="w-8 h-8 opacity-40 rotate-45" />
            </div>
            <h3 className="font-serif text-2xl text-white font-medium mb-2">
              No Flights Found
            </h3>
            <p className="text-xs sm:text-sm text-muted max-w-md mb-6 leading-relaxed">
              {statusFilter === 'All'
                ? "You haven't reserved any private flights yet. Explore our premier fleet and take off on your schedule."
                : `You currently have no ${statusFilter.toLowerCase()} flight bookings.`}
            </p>
            <Link to="/jets">
              <Button variant="primary" size="md">
                Charter Your First Aircraft
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {filteredBookings.map((booking, index) => {
              const isCancelled = booking.status === 'Cancelled';
              return (
                <motion.div
                  key={booking.id}
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.05 }}
                  className={`bg-surface border rounded-3xl p-6 sm:p-7 shadow-lg transition-all ${
                    isCancelled
                      ? 'border-border/50 opacity-70'
                      : 'border-border hover:border-gold/40 hover:shadow-gold-glow'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
                    {/* Left: Route, Booking Ref & Jet details */}
                    <div className="space-y-3 flex-1">
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="font-mono text-xs px-2.5 py-1 rounded-lg bg-surface-card text-gold font-bold border border-gold/30 tracking-wider">
                          {booking.booking_ref}
                        </span>
                        <Badge variant={booking.status}>{booking.status}</Badge>
                        <span className="text-xs text-muted">
                          Reserved on{' '}
                          {new Date(booking.created_at).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>

                      {/* Route Header */}
                      <div className="flex items-center gap-4">
                        <div className="flex items-baseline gap-2">
                          <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
                            {booking.from_city}
                          </span>
                          <span className="text-gold font-mono">&rarr;</span>
                          <span className="font-serif text-2xl sm:text-3xl font-bold text-white">
                            {booking.to_city}
                          </span>
                        </div>
                      </div>

                      {/* Aircraft & Passenger Chips */}
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-light pt-1">
                        <div className="flex items-center gap-1.5">
                          <Plane className="w-3.5 h-3.5 text-gold" />
                          <span>
                            {booking.jet?.manufacturer} {booking.jet?.name || 'Private Jet'}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-gold" />
                          <span>
                            Flight Date:{' '}
                            <strong className="text-white">
                              {new Date(booking.flight_date).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                              })}
                            </strong>
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Users className="w-3.5 h-3.5 text-gold" />
                          <span>{booking.passengers} Passengers</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-gold" />
                          <span>
                            {formatFlightDuration(booking.flight_hours)} (
                            {booking.distance_km?.toLocaleString()} km)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Right: Price & Action Buttons */}
                    <div className="flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-between gap-4 w-full lg:w-auto pt-4 lg:pt-0 border-t lg:border-t-0 border-border">
                      <div className="text-left lg:text-right">
                        <span className="text-[10px] uppercase tracking-wider text-muted block">
                          Total Charter Investment
                        </span>
                        <span className="text-2xl font-serif font-bold text-gold">
                          {formatCurrency(booking.total_price)}
                        </span>
                      </div>

                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        {/* View VIP Ticket */}
                        {!isCancelled && (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => setSelectedTicketBooking(booking)}
                            icon={Download}
                            className="text-xs px-3.5 shadow-gold-glow"
                          >
                            VIP Boarding Pass
                          </Button>
                        )}

                        {/* Edit Itinerary */}
                        {!isCancelled && (
                          <Button
                            variant="secondary"
                            size="sm"
                            onClick={() => openEditModal(booking)}
                            icon={Edit3}
                            className="text-xs px-3"
                          >
                            Modify
                          </Button>
                        )}

                        {/* Cancel Flight */}
                        {!isCancelled && (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => setCancelModalBooking(booking)}
                            icon={Ban}
                            className="text-xs px-3"
                          >
                            Cancel
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      {/* VIEW TICKET MODAL */}
      <Modal
        isOpen={Boolean(selectedTicketBooking)}
        onClose={() => setSelectedTicketBooking(null)}
        title="VIP Flight Manifest & Boarding Pass"
        subtitle={`Booking Reference: ${selectedTicketBooking?.booking_ref}`}
        maxWidth="max-w-4xl"
      >
        {selectedTicketBooking && (
          <div className="py-4">
            <Ticket
              booking={selectedTicketBooking}
              jet={selectedTicketBooking.jet}
              onDone={() => setSelectedTicketBooking(null)}
            />
          </div>
        )}
      </Modal>

      {/* EDIT BOOKING MODAL */}
      <Modal
        isOpen={Boolean(editModalBooking)}
        onClose={() => setEditModalBooking(null)}
        title="Modify Charter Itinerary"
        subtitle={`Booking Ref: ${editModalBooking?.booking_ref} (${editModalBooking?.from_city} → ${editModalBooking?.to_city})`}
        maxWidth="max-w-lg"
      >
        <div className="space-y-4 py-2">
          <div>
            <label className="text-xs text-muted-light block mb-1.5 font-medium flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gold" />
              New Flight Date
            </label>
            <input
              type="date"
              min={new Date().toISOString().split('T')[0]}
              value={editDate}
              onChange={(e) => setEditDate(e.target.value)}
              className="w-full bg-surface-card border border-border focus:border-gold rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
            />
          </div>

          <div>
            <label className="text-xs text-muted-light block mb-1.5 font-medium flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-gold" />
              Passenger Count
            </label>
            <input
              type="number"
              min="1"
              max={editModalBooking?.jet?.seats || 20}
              value={editPassengers}
              onChange={(e) => setEditPassengers(parseInt(e.target.value, 10) || 1)}
              className="w-full bg-surface-card border border-border focus:border-gold rounded-xl px-3.5 py-2.5 text-sm text-white outline-none"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium tracking-wide uppercase text-muted-light/80">
              Special In-Flight Requests
            </label>
            <textarea
              rows={3}
              value={editSpecialRequests}
              onChange={(e) => setEditSpecialRequests(e.target.value)}
              className="w-full bg-surface-card border border-border focus:border-gold rounded-xl p-3 text-xs text-white outline-none resize-none"
            />
          </div>

          <p className="text-[11px] text-muted leading-relaxed">
            Note: Changing flight date or passenger counts triggers server-side validation.
            Dates with active overlapping reservations on this airframe will be rejected.
          </p>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setEditModalBooking(null)}
            >
              Close
            </Button>
            <Button
              variant="primary"
              size="sm"
              loading={updating}
              onClick={handleSaveEdit}
            >
              Save Changes
            </Button>
          </div>
        </div>
      </Modal>

      {/* CANCEL CONFIRMATION MODAL */}
      <Modal
        isOpen={Boolean(cancelModalBooking)}
        onClose={() => setCancelModalBooking(null)}
        title="Cancel Flight Charter"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 py-2">
          <div className="flex items-start gap-3 p-4 bg-red-950/20 border border-red-800/40 rounded-xl text-xs text-red-300">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <p>
              Are you sure you want to cancel booking{' '}
              <strong className="text-white">{cancelModalBooking?.booking_ref}</strong> ({cancelModalBooking?.from_city} to {cancelModalBooking?.to_city})?
              The aircraft reservation hold will be released immediately.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setCancelModalBooking(null)}
            >
              Keep Charter
            </Button>
            <Button
              variant="danger"
              size="sm"
              loading={cancelling}
              onClick={handleConfirmCancel}
            >
              Confirm Cancellation
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
