/**
 * Haversine formula calculation for AeroLux Client.
 * Matches the Postgres trigger in /supabase/schema.sql exactly.
 */

const EARTH_RADIUS_KM = 6371;

/**
 * Calculates Great-Circle distance in kilometers between two lat/lng coordinates.
 * @param {number} lat1
 * @param {number} lng1
 * @param {number} lat2
 * @param {number} lng2
 * @returns {number} distance in kilometers (rounded to 2 decimals)
 */
export function calculateDistance(lat1, lng1, lat2, lng2) {
  if (lat1 == null || lng1 == null || lat2 == null || lng2 == null) {
    return 0;
  }

  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;

  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);

  const clampedA = Math.min(1, Math.max(0, a));
  const c = 2 * Math.atan2(Math.sqrt(clampedA), Math.sqrt(1 - clampedA));

  let distance = EARTH_RADIUS_KM * c;
  // Floor threshold to match DB minimum charter route
  if (distance < 50 && distance > 0) {
    distance = 50;
  }

  return Math.round(distance * 100) / 100;
}

/**
 * Calculates flight hours given distance and jet cruising speed.
 * @param {number} distanceKm
 * @param {number} speedKmh
 * @returns {number} flight hours (min 0.5h, rounded to 2 decimals)
 */
export function calculateFlightHours(distanceKm, speedKmh) {
  if (!distanceKm || !speedKmh || speedKmh <= 0) return 0;
  let hours = distanceKm / speedKmh;
  if (hours < 0.5) hours = 0.5;
  return Math.round(hours * 100) / 100;
}

/**
 * Calculates estimated charter price.
 * @param {number} flightHours
 * @param {number} pricePerHour
 * @returns {number} total estimated price in USD
 */
export function calculateEstimatedPrice(flightHours, pricePerHour) {
  if (!flightHours || !pricePerHour) return 0;
  return Math.round(flightHours * pricePerHour * 100) / 100;
}

/**
 * Formats a numeric price into a luxury USD currency string.
 * @param {number} amount
 * @returns {string} e.g. "$14,500"
 */
export function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return '$0';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats flight duration into human-readable hours and minutes.
 * @param {number} decimalHours
 * @returns {string} e.g. "2h 45m"
 */
export function formatFlightDuration(decimalHours) {
  if (!decimalHours || isNaN(decimalHours)) return '0h 00m';
  const totalMinutes = Math.round(decimalHours * 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes.toString().padStart(2, '0')}m`;
}
