import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  Shield, Plane, Calendar, DollarSign, Plus, Edit2, 
  Trash2, Search, Check, X, RefreshCw, Users, AlertTriangle 
} from 'lucide-react';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Select } from '../components/Select';
import { Modal } from '../components/Modal';
import { Badge } from '../components/Badge';
import { TableRowSkeleton } from '../components/Skeleton';
import { getJets, createJet, updateJet, deleteJet } from '../services/jets';
import { getAllBookings } from '../services/bookings';
import { formatCurrency, formatFlightDuration } from '../utils/haversine';

const CATEGORIES = ['Light', 'Midsize', 'Heavy', 'Ultra Long Range'];

const INITIAL_JET_FORM = {
  name: '',
  manufacturer: '',
  category: 'Midsize',
  seats: 8,
  range_km: 6000,
  speed_kmh: 880,
  price_per_hour: 7500,
  image_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80',
  amenities: 'Ka-band Wi-Fi, Full Galley, Executive Stateroom, Private Lavatory',
  description: '',
  available: true,
};

export function AdminPage() {
  const [activeTab, setActiveTab] = useState('fleet'); // 'fleet' or 'bookings'

  // Fleet state
  const [jets, setJets] = useState([]);
  const [loadingJets, setLoadingJets] = useState(true);
  const [jetModalOpen, setJetModalOpen] = useState(false);
  const [editingJet, setEditingJet] = useState(null);
  const [jetForm, setJetForm] = useState(INITIAL_JET_FORM);
  const [deleteConfirmJet, setDeleteConfirmJet] = useState(null);
  const [savingJet, setSavingJet] = useState(false);

  // Bookings state
  const [bookings, setBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(true);
  const [bookingSearch, setBookingSearch] = useState('');

  // Fetch Fleet
  const loadFleet = async () => {
    setLoadingJets(true);
    try {
      const res = await getJets({ pageSize: 50 });
      setJets(res.data || []);
    } catch (err) {
      console.error('Error fetching fleet for admin:', err);
      toast.error('Failed to load fleet.');
    } finally {
      setLoadingJets(false);
    }
  };

  // Fetch Bookings
  const loadBookings = async () => {
    setLoadingBookings(true);
    try {
      const res = await getAllBookings();
      setBookings(res.data || []);
    } catch (err) {
      console.error('Error fetching bookings for admin:', err);
      toast.error('Failed to load all bookings.');
    } finally {
      setLoadingBookings(false);
    }
  };

  useEffect(() => {
    loadFleet();
    loadBookings();
  }, []);

  // Open Add Jet modal
  const handleOpenAddJet = () => {
    setEditingJet(null);
    setJetForm(INITIAL_JET_FORM);
    setJetModalOpen(true);
  };

  // Open Edit Jet modal
  const handleOpenEditJet = (jet) => {
    setEditingJet(jet);
    setJetForm({
      name: jet.name,
      manufacturer: jet.manufacturer,
      category: jet.category,
      seats: jet.seats,
      range_km: jet.range_km,
      speed_kmh: jet.speed_kmh,
      price_per_hour: jet.price_per_hour,
      image_url: jet.image_url,
      amenities: Array.isArray(jet.amenities) ? jet.amenities.join(', ') : '',
      description: jet.description,
      available: jet.available,
    });
    setJetModalOpen(true);
  };

  // Save Jet (Create or Update)
  const handleSaveJet = async (e) => {
    e.preventDefault();
    setSavingJet(true);

    try {
      const amenitiesArr = jetForm.amenities
        .split(',')
        .map((a) => a.trim())
        .filter(Boolean);

      const payload = {
        name: jetForm.name.trim(),
        manufacturer: jetForm.manufacturer.trim(),
        category: jetForm.category,
        seats: Number(jetForm.seats),
        range_km: Number(jetForm.range_km),
        speed_kmh: Number(jetForm.speed_kmh),
        price_per_hour: Number(jetForm.price_per_hour),
        image_url: jetForm.image_url.trim(),
        amenities: amenitiesArr,
        description: jetForm.description.trim(),
        available: Boolean(jetForm.available),
      };

      if (editingJet) {
        const { data, error } = await updateJet(editingJet.id, payload);
        if (error) throw error;
        toast.success(`Aircraft "${payload.name}" updated successfully.`);
      } else {
        const { data, error } = await createJet(payload);
        if (error) throw error;
        toast.success(`New aircraft "${payload.name}" added to fleet.`);
      }

      setJetModalOpen(false);
      loadFleet();
    } catch (err) {
      console.error('Save jet error:', err);
      toast.error(err.message || 'Failed to save aircraft.');
    } finally {
      setSavingJet(false);
    }
  };

  // Delete Jet
  const handleDeleteJet = async () => {
    if (!deleteConfirmJet) return;
    try {
      const { error } = await deleteJet(deleteConfirmJet.id);
      if (error) throw error;
      toast.success(`Aircraft "${deleteConfirmJet.name}" removed from fleet.`);
      setDeleteConfirmJet(null);
      loadFleet();
    } catch (err) {
      console.error('Delete jet error:', err);
      toast.error(err.message || 'Failed to delete aircraft.');
    }
  };

  // Quick Toggle Availability
  const handleToggleAvailability = async (jet) => {
    try {
      const newStatus = !jet.available;
      const { error } = await updateJet(jet.id, { available: newStatus });
      if (error) throw error;
      toast.success(`${jet.name} marked as ${newStatus ? 'Available' : 'Unavailable'}.`);
      setJets((prev) =>
        prev.map((j) => (j.id === jet.id ? { ...j, available: newStatus } : j))
      );
    } catch (err) {
      toast.error('Failed to update aircraft availability.');
    }
  };

  // Metrics
  const activeBookingsCount = bookings.filter((b) => b.status === 'Confirmed').length;
  const totalFleetValue = bookings.reduce(
    (sum, b) => (b.status === 'Confirmed' ? sum + Number(b.total_price || 0) : sum),
    0
  );

  // Filter Bookings by search
  const filteredBookings = bookings.filter((b) => {
    if (!bookingSearch) return true;
    const s = bookingSearch.toLowerCase().trim();
    return (
      (b.booking_ref && b.booking_ref.toLowerCase().includes(s)) ||
      (b.passenger_name && b.passenger_name.toLowerCase().includes(s)) ||
      (b.from_city && b.from_city.toLowerCase().includes(s)) ||
      (b.to_city && b.to_city.toLowerCase().includes(s))
    );
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-border/80">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="w-2.5 h-2.5 rounded-full bg-gold animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-gold font-mono font-semibold">
              VIP Fleet Command & Flight Operations
            </span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-bold text-white tracking-tight">
            Administrative Deck
          </h1>
          <p className="text-sm text-muted mt-2">
            Direct management of aircraft inventory, live dispatch itineraries, and operational statuses.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="primary"
            size="md"
            onClick={handleOpenAddJet}
            icon={Plus}
            className="shadow-gold-glow"
          >
            Add New Jet
          </Button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-8">
        <div className="p-6 bg-surface border border-border rounded-2xl">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs uppercase font-medium">Active Aircraft</span>
            <Plane className="w-4 h-4 text-gold" />
          </div>
          <div className="font-serif text-3xl font-bold text-white">
            {jets.length} <span className="text-xs text-muted font-normal">jets</span>
          </div>
        </div>

        <div className="p-6 bg-surface border border-border rounded-2xl">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs uppercase font-medium">Active Confirmed Charters</span>
            <Calendar className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="font-serif text-3xl font-bold text-white">
            {activeBookingsCount} <span className="text-xs text-muted font-normal">flights</span>
          </div>
        </div>

        <div className="p-6 bg-surface border border-border rounded-2xl">
          <div className="flex items-center justify-between text-muted mb-2">
            <span className="text-xs uppercase font-medium">Total Charter Volume</span>
            <DollarSign className="w-4 h-4 text-gold" />
          </div>
          <div className="font-serif text-3xl font-bold text-gold">
            {formatCurrency(totalFleetValue)}
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-4 border-b border-border/60 pb-4 mb-6">
        <button
          onClick={() => setActiveTab('fleet')}
          className={`text-sm font-medium tracking-wide pb-2 relative transition-colors ${
            activeTab === 'fleet' ? 'text-gold' : 'text-muted hover:text-white'
          }`}
        >
          Fleet Inventory ({jets.length})
          {activeTab === 'fleet' && (
            <motion.div
              layoutId="adminTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
            />
          )}
        </button>

        <button
          onClick={() => setActiveTab('bookings')}
          className={`text-sm font-medium tracking-wide pb-2 relative transition-colors ${
            activeTab === 'bookings' ? 'text-gold' : 'text-muted hover:text-white'
          }`}
        >
          All Charter Bookings ({bookings.length})
          {activeTab === 'bookings' && (
            <motion.div
              layoutId="adminTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-[2px] bg-gold"
            />
          )}
        </button>
      </div>

      {/* TAB 1: FLEET MANAGEMENT */}
      {activeTab === 'fleet' && (
        <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-lg">
          <div className="p-5 border-b border-border/80 flex items-center justify-between">
            <h3 className="font-serif text-lg font-bold text-white">
              Aircraft Inventory Roster
            </h3>
            <button
              onClick={loadFleet}
              className="text-xs text-muted hover:text-white flex items-center gap-1.5"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Refresh Fleet</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-muted-light">
              <thead className="bg-surface-card text-[11px] uppercase tracking-wider text-muted border-b border-border">
                <tr>
                  <th className="py-3.5 px-5">Aircraft</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Capacity</th>
                  <th className="py-3.5 px-4">Cruise Speed</th>
                  <th className="py-3.5 px-4">Rate / Hour</th>
                  <th className="py-3.5 px-4">Charter Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loadingJets ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} columns={7} />
                  ))
                ) : jets.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="p-8 text-center text-muted">
                      No aircraft found in database. Click &apos;Add New Jet&apos; to seed an airframe.
                    </td>
                  </tr>
                ) : (
                  jets.map((jet) => (
                    <tr key={jet.id} className="hover:bg-surface-card/50 transition-colors">
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={jet.image_url}
                            alt={jet.name}
                            className="w-12 h-9 rounded-lg object-cover bg-surface-card shrink-0 border border-border"
                          />
                          <div>
                            <div className="font-bold text-white text-sm">
                              {jet.name}
                            </div>
                            <div className="text-[11px] text-gold uppercase tracking-wider">
                              {jet.manufacturer}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <Badge variant={jet.category}>{jet.category}</Badge>
                      </td>

                      <td className="py-4 px-4 font-semibold text-white">
                        {jet.seats} pax
                      </td>

                      <td className="py-4 px-4 font-mono">
                        {jet.speed_kmh} km/h
                      </td>

                      <td className="py-4 px-4 font-serif font-bold text-gold text-sm">
                        {formatCurrency(jet.price_per_hour)}
                      </td>

                      <td className="py-4 px-4">
                        <button
                          onClick={() => handleToggleAvailability(jet)}
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all ${
                            jet.available
                              ? 'bg-emerald-950/60 text-emerald-400 border border-emerald-800/40 hover:bg-emerald-900/60'
                              : 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:bg-zinc-800'
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              jet.available ? 'bg-emerald-400' : 'bg-zinc-500'
                            }`}
                          />
                          {jet.available ? 'Available' : 'Maintenance'}
                        </button>
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEditJet(jet)}
                            className="p-1.5 text-muted hover:text-white rounded-lg hover:bg-surface-card transition-colors"
                            title="Edit aircraft"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmJet(jet)}
                            className="p-1.5 text-muted hover:text-red-400 rounded-lg hover:bg-red-950/20 transition-colors"
                            title="Delete aircraft"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: ALL CHARTER BOOKINGS */}
      {activeTab === 'bookings' && (
        <div className="bg-surface border border-border rounded-3xl overflow-hidden shadow-lg space-y-4">
          <div className="p-5 border-b border-border/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <h3 className="font-serif text-lg font-bold text-white">
              Global Flight Itineraries
            </h3>
            <div className="w-full sm:w-72">
              <Input
                placeholder="Search ref, passenger, city..."
                value={bookingSearch}
                onChange={(e) => setBookingSearch(e.target.value)}
                icon={Search}
                className="py-2 text-xs"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-muted-light">
              <thead className="bg-surface-card text-[11px] uppercase tracking-wider text-muted border-b border-border">
                <tr>
                  <th className="py-3.5 px-5">Ref Code</th>
                  <th className="py-3.5 px-4">Lead VIP</th>
                  <th className="py-3.5 px-4">Routing</th>
                  <th className="py-3.5 px-4">Flight Date</th>
                  <th className="py-3.5 px-4">Aircraft</th>
                  <th className="py-3.5 px-4">Air Time</th>
                  <th className="py-3.5 px-4">Total Charter</th>
                  <th className="py-3.5 px-5 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/50">
                {loadingBookings ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRowSkeleton key={i} columns={8} />
                  ))
                ) : filteredBookings.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="p-8 text-center text-muted">
                      No charter flight records found.
                    </td>
                  </tr>
                ) : (
                  filteredBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-surface-card/50 transition-colors">
                      <td className="py-4 px-5 font-mono font-bold text-gold">
                        {b.booking_ref}
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-medium text-white">{b.passenger_name}</div>
                        <div className="text-[11px] text-muted">{b.passenger_phone}</div>
                      </td>

                      <td className="py-4 px-4 font-semibold text-white">
                        {b.from_city} &rarr; {b.to_city}
                      </td>

                      <td className="py-4 px-4">
                        {new Date(b.flight_date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>

                      <td className="py-4 px-4">
                        {b.jet?.manufacturer} {b.jet?.name}
                      </td>

                      <td className="py-4 px-4 font-mono">
                        {formatFlightDuration(b.flight_hours)}
                      </td>

                      <td className="py-4 px-4 font-serif font-bold text-gold text-sm">
                        {formatCurrency(b.total_price)}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <Badge variant={b.status}>{b.status}</Badge>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ADD / EDIT JET MODAL */}
      <Modal
        isOpen={jetModalOpen}
        onClose={() => setJetModalOpen(false)}
        title={editingJet ? `Edit ${editingJet.name}` : 'Add Aircraft to Fleet'}
        subtitle="Manage technical specifications, charter rate, and passenger capacity"
        maxWidth="max-w-2xl"
      >
        <form onSubmit={handleSaveJet} className="space-y-4 py-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Model Name"
              placeholder="e.g. Global 7500"
              value={jetForm.name}
              onChange={(e) => setJetForm({ ...jetForm, name: e.target.value })}
              required
            />
            <Input
              label="Manufacturer"
              placeholder="e.g. Bombardier"
              value={jetForm.manufacturer}
              onChange={(e) => setJetForm({ ...jetForm, manufacturer: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Select
              label="Charter Category"
              options={CATEGORIES}
              value={jetForm.category}
              onChange={(e) => setJetForm({ ...jetForm, category: e.target.value })}
              placeholder=""
            />
            <Input
              label="Hourly Rate ($USD)"
              type="number"
              min="1000"
              step="100"
              placeholder="e.g. 14500"
              value={jetForm.price_per_hour}
              onChange={(e) => setJetForm({ ...jetForm, price_per_hour: e.target.value })}
              required
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Input
              label="Passenger Seats"
              type="number"
              min="1"
              max="30"
              value={jetForm.seats}
              onChange={(e) => setJetForm({ ...jetForm, seats: e.target.value })}
              required
            />
            <Input
              label="Max Range (km)"
              type="number"
              min="1000"
              value={jetForm.range_km}
              onChange={(e) => setJetForm({ ...jetForm, range_km: e.target.value })}
              required
            />
            <Input
              label="Cruising Speed (km/h)"
              type="number"
              min="500"
              value={jetForm.speed_kmh}
              onChange={(e) => setJetForm({ ...jetForm, speed_kmh: e.target.value })}
              required
            />
          </div>

          <Input
            label="Aircraft Visual Image URL (Unsplash or CDN)"
            placeholder="https://images.unsplash.com/..."
            value={jetForm.image_url}
            onChange={(e) => setJetForm({ ...jetForm, image_url: e.target.value })}
            required
          />

          <Input
            label="Cabin Amenities (Comma-separated)"
            placeholder="Ka-band Wi-Fi, Full Galley, Master Stateroom"
            value={jetForm.amenities}
            onChange={(e) => setJetForm({ ...jetForm, amenities: e.target.value })}
            required
          />

          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-medium tracking-wide uppercase text-muted-light/80">
              Aircraft Overview & Engineering Description
            </label>
            <textarea
              rows={3}
              placeholder="Provide a compelling executive overview of the cabin layout and capabilities..."
              value={jetForm.description}
              onChange={(e) => setJetForm({ ...jetForm, description: e.target.value })}
              required
              className="w-full bg-surface-card border border-border focus:border-gold rounded-xl p-3 text-xs text-white outline-none resize-none"
            />
          </div>

          <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
            <input
              type="checkbox"
              checked={jetForm.available}
              onChange={(e) => setJetForm({ ...jetForm, available: e.target.checked })}
              className="rounded accent-gold cursor-pointer"
            />
            <span className="text-xs text-white">Active & Available for Charter</span>
          </label>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setJetModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              size="sm"
              loading={savingJet}
            >
              {editingJet ? 'Save Changes' : 'Add to Fleet'}
            </Button>
          </div>
        </form>
      </Modal>

      {/* DELETE CONFIRMATION MODAL */}
      <Modal
        isOpen={Boolean(deleteConfirmJet)}
        onClose={() => setDeleteConfirmJet(null)}
        title="Remove Aircraft from Fleet"
        maxWidth="max-w-md"
      >
        <div className="space-y-4 py-2">
          <div className="flex items-start gap-3 p-4 bg-red-950/20 border border-red-800/40 rounded-xl text-xs text-red-300">
            <AlertTriangle className="w-5 h-5 text-red-400 shrink-0" />
            <p>
              Are you sure you want to permanently delete{' '}
              <strong className="text-white">
                {deleteConfirmJet?.manufacturer} {deleteConfirmJet?.name}
              </strong>?
              This action cannot be undone. Any active bookings referencing this jet will restrict deletion.
            </p>
          </div>

          <div className="pt-4 flex items-center justify-end gap-3 border-t border-border">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setDeleteConfirmJet(null)}
            >
              Keep Jet
            </Button>
            <Button
              variant="danger"
              size="sm"
              onClick={handleDeleteJet}
            >
              Confirm Deletion
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
