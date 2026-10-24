import { supabase } from '../lib/supabaseClient';

// Fallback seed cities to ensure flawless offline / initial preview experience
export const FALLBACK_CITIES = [
  { id: '1', code: 'DEL', name: 'Delhi', country: 'India', lat: 28.5562, lng: 77.1000 },
  { id: '2', code: 'BOM', name: 'Mumbai', country: 'India', lat: 19.0896, lng: 72.8656 },
  { id: '3', code: 'BLR', name: 'Bengaluru', country: 'India', lat: 13.1986, lng: 77.7066 },
  { id: '4', code: 'LKO', name: 'Lucknow', country: 'India', lat: 26.7606, lng: 80.8893 },
  { id: '5', code: 'GOI', name: 'Goa', country: 'India', lat: 15.3808, lng: 73.8314 },
  { id: '6', code: 'HYD', name: 'Hyderabad', country: 'India', lat: 17.2403, lng: 78.4294 },
  { id: '7', code: 'DXB', name: 'Dubai', country: 'United Arab Emirates', lat: 25.2532, lng: 55.3657 },
  { id: '8', code: 'LHR', name: 'London', country: 'United Kingdom', lat: 51.4700, lng: -0.4543 },
  { id: '9', code: 'SIN', name: 'Singapore', country: 'Singapore', lat: 1.3644, lng: 103.9915 },
  { id: '10', code: 'JFK', name: 'New York', country: 'United States', lat: 40.6413, lng: -73.7781 },
  { id: '11', code: 'CDG', name: 'Paris', country: 'France', lat: 49.0097, lng: 2.5479 },
  { id: '12', code: 'HND', name: 'Tokyo', country: 'Japan', lat: 35.5494, lng: 139.7798 },
  { id: '13', code: 'ZRH', name: 'Zurich', country: 'Switzerland', lat: 47.4582, lng: 8.5555 },
  { id: '14', code: 'SYD', name: 'Sydney', country: 'Australia', lat: -33.9399, lng: 151.1753 },
  { id: '15', code: 'LAX', name: 'Los Angeles', country: 'United States', lat: 33.9416, lng: -118.4085 },
];

/**
 * Fetch all available destination and departure cities.
 */
export async function getCities() {
  try {
    const { data, error } = await supabase
      .from('cities')
      .select('*')
      .order('name', { ascending: true });

    if (error) {
      console.warn('Using fallback cities due to Supabase fetch note:', error.message);
      return { data: FALLBACK_CITIES, error: null };
    }

    if (!data || data.length === 0) {
      return { data: FALLBACK_CITIES, error: null };
    }

    return { data, error: null };
  } catch (err) {
    console.error('getCities exception:', err);
    return { data: FALLBACK_CITIES, error: null };
  }
}
