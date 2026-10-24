import { useState, useEffect, useCallback } from 'react';
import toast from 'react-hot-toast';
import { getUserBookings, getAllBookings, cancelBooking, updateBooking } from '../services/bookings';
import { useAuth } from '../context/AuthContext';

/**
 * Custom hook to manage bookings state and mutations.
 * @param {boolean} isAdminView
 */
export function useBookings(isAdminView = false) {
  const { user, isAdmin } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = useCallback(async () => {
    if (!user) {
      setBookings([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      let result;
      if (isAdminView && isAdmin) {
        result = await getAllBookings();
      } else {
        result = await getUserBookings(user.id);
      }

      if (result.error) {
        setError(result.error);
      } else {
        setBookings(result.data || []);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [user, isAdmin, isAdminView]);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  const handleCancelBooking = async (bookingId) => {
    try {
      const { data, error } = await cancelBooking(bookingId);
      if (error) {
        toast.error(error.message || 'Failed to cancel flight.');
        return false;
      }
      toast.success('Charter flight cancelled successfully.');
      // Update local state smoothly
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, status: 'Cancelled' } : b))
      );
      return true;
    } catch (err) {
      toast.error(err.message || 'An error occurred while cancelling flight.');
      return false;
    }
  };

  const handleUpdateBooking = async (bookingId, updateData) => {
    try {
      const { data, error } = await updateBooking(bookingId, updateData);
      if (error) {
        toast.error(error.message || 'Failed to update flight booking.');
        return false;
      }
      toast.success('Flight itinerary updated successfully.');
      setBookings((prev) =>
        prev.map((b) => (b.id === bookingId ? { ...b, ...data } : b))
      );
      return true;
    } catch (err) {
      toast.error(err.message || 'An error occurred while updating booking.');
      return false;
    }
  };

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings,
    cancelBooking: handleCancelBooking,
    updateBooking: handleUpdateBooking,
  };
}
