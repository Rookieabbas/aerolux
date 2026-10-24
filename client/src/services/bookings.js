import { supabase } from '../lib/supabaseClient';

/**
 * Fetch all bookings belonging to the currently logged in user.
 */
export async function getUserBookings(userId) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        jet:jets (
          id,
          name,
          manufacturer,
          category,
          image_url,
          seats,
          speed_kmh,
          price_per_hour
        )
      `)
      .eq('user_id', userId)
      .order('flight_date', { ascending: false });

    return { data: data || [], error };
  } catch (err) {
    console.error('getUserBookings error:', err);
    return { data: [], error: err };
  }
}

/**
 * Admin: Fetch all bookings across all users.
 */
export async function getAllBookings() {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        jet:jets (
          id,
          name,
          manufacturer,
          category,
          image_url
        ),
        profile:profiles (
          id,
          full_name,
          phone
        )
      `)
      .order('created_at', { ascending: false });

    return { data: data || [], error };
  } catch (err) {
    console.error('getAllBookings error:', err);
    return { data: [], error: err };
  }
}

/**
 * Fetch a single booking by ID with jet details.
 */
export async function getBookingById(bookingId) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .select(`
        *,
        jet:jets (
          id,
          name,
          manufacturer,
          category,
          image_url,
          seats,
          speed_kmh,
          price_per_hour
        )
      `)
      .eq('id', bookingId)
      .single();

    return { data, error };
  } catch (err) {
    console.error('getBookingById error:', err);
    return { data: null, error: err };
  }
}

/**
 * Create a new booking.
 * Note: Database triggers validate inputs, prevent double booking,
 * look up cities, calculate distance, flight hours, and total price.
 */
export async function createBooking(bookingData) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .insert([bookingData])
      .select(`
        *,
        jet:jets (
          id,
          name,
          manufacturer,
          category,
          image_url,
          seats,
          speed_kmh,
          price_per_hour
        )
      `)
      .single();

    if (error) {
      return { data: null, error: formatBookingError(error) };
    }

    return { data, error: null };
  } catch (err) {
    console.error('createBooking exception:', err);
    return { data: null, error: formatBookingError(err) };
  }
}

/**
 * Update an existing booking (e.g., date, passengers, passenger info, special requests).
 */
export async function updateBooking(id, updateData) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update(updateData)
      .eq('id', id)
      .select(`
        *,
        jet:jets (
          id,
          name,
          manufacturer,
          category,
          image_url
        )
      `)
      .single();

    if (error) {
      return { data: null, error: formatBookingError(error) };
    }

    return { data, error: null };
  } catch (err) {
    console.error('updateBooking exception:', err);
    return { data: null, error: formatBookingError(err) };
  }
}

/**
 * Cancel a booking (updates status to 'Cancelled').
 */
export async function cancelBooking(id) {
  try {
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'Cancelled' })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return { data: null, error: formatBookingError(error) };
    }

    return { data, error: null };
  } catch (err) {
    console.error('cancelBooking exception:', err);
    return { data: null, error: formatBookingError(err) };
  }
}

/**
 * Translates Postgres / Supabase database trigger errors and constraint violations
 * into user-friendly error messages.
 */
function formatBookingError(err) {
  if (!err) return new Error('An unexpected error occurred. Please try again.');
  const message = err.message || err.details || String(err);

  if (message.includes('idx_bookings_jet_date_confirmed') || message.includes('duplicate key value')) {
    return new Error('This aircraft is already chartered for the selected date. Please choose another date or private jet.');
  }
  if (message.includes('exceeds aircraft capacity')) {
    return new Error(message.replace('raise exception', '').trim());
  }
  if (message.includes('Flight date cannot be in the past')) {
    return new Error('Flight date cannot be in the past. Please select a valid future date.');
  }
  if (message.includes('Departure and arrival cities cannot be identical')) {
    return new Error('Departure and arrival cities cannot be identical.');
  }
  if (message.includes('currently in scheduled maintenance or unavailable')) {
    return new Error('This aircraft is temporarily unavailable for charter. Please select another aircraft.');
  }
  if (message.includes('row-level security policy')) {
    return new Error('You do not have permission to perform this action. Please log in.');
  }

  return new Error(message);
}
