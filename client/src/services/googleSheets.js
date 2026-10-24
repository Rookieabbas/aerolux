/**
 * Google Sheets Integration Service for AeroLux.
 * Allows syncing confirmed flight manifests directly to Google Sheets via Webhook
 * or exporting directly into Google Sheets CSV format.
 */

const GOOGLE_SHEETS_WEBHOOK_URL = import.meta.env.VITE_GOOGLE_SHEETS_WEBHOOK_URL || '';

/**
 * Sends a newly confirmed booking payload to Google Sheets via a Google Apps Script Webhook.
 * @param {Object} booking
 */
export async function syncBookingToGoogleSheets(booking) {
  if (!booking) return { success: false, error: 'No booking data' };

  const payload = {
    bookingRef: booking.booking_ref,
    passengerName: booking.passenger_name,
    passengerPhone: booking.passenger_phone,
    fromCity: booking.from_city,
    toCity: booking.to_city,
    flightDate: booking.flight_date,
    passengers: booking.passengers,
    aircraft: booking.jet?.name || 'Private Jet',
    flightHours: booking.flight_hours,
    totalPrice: booking.total_price,
    status: booking.status || 'Confirmed',
    timestamp: new Date().toISOString(),
  };

  // If a live webhook URL is configured, POST to Google Sheets
  if (GOOGLE_SHEETS_WEBHOOK_URL) {
    try {
      await fetch(GOOGLE_SHEETS_WEBHOOK_URL, {
        method: 'POST',
        mode: 'no-cors', // standard for Google Apps Script Web Apps
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });
      console.log('✅ Booking synced to Google Sheets successfully.');
      return { success: true, payload };
    } catch (err) {
      console.warn('Google Sheets sync warning:', err.message);
    }
  }

  // Fallback: Store in local synced log for demonstration
  try {
    const existing = JSON.parse(localStorage.getItem('aerolux_google_sheets_sync') || '[]');
    existing.unshift(payload);
    localStorage.setItem('aerolux_google_sheets_sync', JSON.stringify(existing));
  } catch (e) {
    // ignore
  }

  return { success: true, payload };
}

/**
 * Exports all user bookings into a clean CSV formatted specifically for Google Sheets.
 * Triggers a direct download that can be opened or imported directly in Google Sheets.
 * @param {Array} bookings
 */
export function exportBookingsToGoogleSheetsCSV(bookings = []) {
  if (!bookings || bookings.length === 0) return false;

  const headers = [
    'Booking Reference',
    'Primary Passenger',
    'Phone',
    'Departure City',
    'Arrival City',
    'Flight Date',
    'Passengers',
    'Aircraft Model',
    'Distance (km)',
    'Flight Hours',
    'Total Price ($USD)',
    'Status',
    'Created At',
  ];

  const rows = bookings.map((b) => [
    `"${b.booking_ref || ''}"`,
    `"${b.passenger_name || ''}"`,
    `"${b.passenger_phone || ''}"`,
    `"${b.from_city || ''}"`,
    `"${b.to_city || ''}"`,
    `"${b.flight_date || ''}"`,
    b.passengers || 1,
    `"${b.jet?.manufacturer || ''} ${b.jet?.name || ''}"`,
    b.distance_km || 0,
    b.flight_hours || 0,
    b.total_price || 0,
    `"${b.status || 'Confirmed'}"`,
    `"${b.created_at || new Date().toISOString()}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `AeroLux_GoogleSheets_Flight_Manifest_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  return true;
}
