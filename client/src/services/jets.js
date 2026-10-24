import { supabase } from '../lib/supabaseClient';

export const FALLBACK_JETS = [
  {
    id: 'f1010000-0000-0000-0000-000000000001',
    name: 'Global 7500',
    manufacturer: 'Bombardier',
    category: 'Ultra Long Range',
    seats: 16,
    range_km: 14260,
    speed_kmh: 982,
    price_per_hour: 14500,
    image_url: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80',
    amenities: ['Master Stateroom Suite', 'Full Galley with Chef Induction', 'Ka-band Ultra High Speed Wi-Fi', 'En-Suite Lavatory with Shower', 'Club Seating & Conference Suite', 'Air Purification System'],
    description: 'The flagship of luxury private aviation. The Bombardier Global 7500 features four true living spaces, a dedicated crew suite, and unparalleled intercontinental endurance for non-stop global travel.',
    available: true,
  },
  {
    id: 'f1010000-0000-0000-0000-000000000002',
    name: 'G650ER',
    manufacturer: 'Gulfstream',
    category: 'Ultra Long Range',
    seats: 14,
    range_km: 13890,
    speed_kmh: 956,
    price_per_hour: 13800,
    image_url: 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1600&q=80',
    amenities: ['16 Iconic Panoramic Windows', '100% Fresh Air Replenishment', 'Private VIP Stateroom', 'High-Definition Entertainment System', 'Full Forward Galley & Espresso Bar', 'Satellite Telephony'],
    description: 'Renowned as the pinnacle of speed and poise, the Gulfstream G650ER flies farther and faster than nearly any civilian aircraft while maintaining the lowest cabin altitude in the skies.',
    available: true,
  },
  {
    id: 'f1010000-0000-0000-0000-000000000003',
    name: 'Falcon 8X',
    manufacturer: 'Dassault',
    category: 'Heavy',
    seats: 12,
    range_km: 11945,
    speed_kmh: 900,
    price_per_hour: 11200,
    image_url: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=1600&q=80',
    amenities: ['Tri-Jet Redundancy & Short Field Access', 'Ultra-Quiet Acoustic Insulation', 'Custom Three-Lounge Layout', 'Skylight Galley Concept', 'High-Speed Broadband Internet'],
    description: 'The Falcon 8X tri-jet marries fighter-jet aerodynamic DNA with supreme quietness and flexibility. Unmatched capability into challenging short runways like London City and Aspen.',
    available: true,
  },
  {
    id: 'f1010000-0000-0000-0000-000000000004',
    name: 'Challenger 350',
    manufacturer: 'Bombardier',
    category: 'Midsize',
    seats: 9,
    range_km: 5926,
    speed_kmh: 870,
    price_per_hour: 6800,
    image_url: 'https://images.unsplash.com/photo-1519074069444-1ba4fff16def?auto=format&fit=crop&w=1600&q=80',
    amenities: ['Handcrafted Ergonomic Leather Seats', 'In-Flight Accessible Luggage Bay', 'Touchscreen Cabin Management System', 'Microwave & Convection Oven', 'High-Speed Wi-Fi'],
    description: 'The best-selling super-midsize business jet for a decade. Features a stand-up flat-floor cabin, exceptional climb performance, and supreme comfort on cross-continental charter routes.',
    available: true,
  },
  {
    id: 'f1010000-0000-0000-0000-000000000005',
    name: 'Citation Longitude',
    manufacturer: 'Cessna',
    category: 'Midsize',
    seats: 8,
    range_km: 6482,
    speed_kmh: 895,
    price_per_hour: 6500,
    image_url: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1600&q=80',
    amenities: ['Lowest In-Class Cabin Altitude', 'Wireless Cabin Audio & Video', 'Walk-in Baggage Compartment', 'Wet Galley with Cold Storage', 'Double Club Seating'],
    description: 'Engineered for maximum passenger wellness and quiet productivity. The Citation Longitude combines transcontinental range with sophisticated interior detailing and generous legroom.',
    available: true,
  },
  {
    id: 'f1010000-0000-0000-0000-000000000006',
    name: 'Praetor 600',
    manufacturer: 'Embraer',
    category: 'Midsize',
    seats: 9,
    range_km: 7441,
    speed_kmh: 863,
    price_per_hour: 7200,
    image_url: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=1600&q=80',
    amenities: ['Full Fly-By-Wire Active Turbulence Reduction', 'HEPA Medical-Grade Air Filtration', 'Berthable Club Seats', 'Stone Flooring in Wet Galley', 'High-Capacity Cargo Storage'],
    description: 'The Praetor 600 bridges the gap between super-midsize efficiency and large-cabin luxury. Features full fly-by-wire turbulence cancellation technology for the smoothest possible journey.',
    available: true,
  },
  {
    id: 'f1010000-0000-0000-0000-000000000007',
    name: 'PC-24',
    manufacturer: 'Pilatus',
    category: 'Light',
    seats: 6,
    range_km: 3610,
    speed_kmh: 815,
    price_per_hour: 4600,
    image_url: 'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1600&q=80',
    amenities: ['Pallet-Sized Cargo Door Access', 'Unpaved Strip & Remote Field Capability', 'Private Lavatory with Pocket Door', 'Swiveling Executive Armchairs', 'In-Flight Power Outlets'],
    description: 'The Swiss Super Versatile Jet. Designed to access over 20,000 unpaved or short airstrips worldwide without sacrificing executive style, speed, or passenger refinement.',
    available: true,
  },
  {
    id: 'f1010000-0000-0000-0000-000000000008',
    name: 'Phenom 300E',
    manufacturer: 'Embraer',
    category: 'Light',
    seats: 7,
    range_km: 3723,
    speed_kmh: 839,
    price_per_hour: 4900,
    image_url: 'https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=1600&q=80',
    amenities: ['Bespoke Bossa Nova Interior Style', 'Oversized Windows & Natural Daylight', 'Enclosed Lavatory with Sink', 'Multi-Zone Climate Controls', 'Generous Baggage Capacity'],
    description: 'The best-selling single-pilot light business jet for 12 consecutive years. Renowned for class-leading speed, exceptional operating economics, and best-in-class cabin pressurization.',
    available: true,
  },
  {
    id: 'f1010000-0000-0000-0000-000000000009',
    name: 'Citation CJ4 Gen2',
    manufacturer: 'Cessna',
    category: 'Light',
    seats: 6,
    range_km: 4010,
    speed_kmh: 835,
    price_per_hour: 4400,
    image_url: 'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1600&q=80',
    amenities: ['Cool Ambient LED Mood Lighting', 'Foldaway Executive Writing Desks', 'Refreshment Center & Ice Drawer', 'Direct In-Flight Wi-Fi', 'Ergonomic Articulating Seats'],
    description: 'The ultimate expression of light jet capability. Perfect for regional executive travel, weekend escapes, and swift point-to-point charters with supreme reliability.',
    available: true,
  },
  {
    id: 'f1010000-0000-0000-0000-000000000010',
    name: 'Global 6000',
    manufacturer: 'Bombardier',
    category: 'Heavy',
    seats: 13,
    range_km: 11112,
    speed_kmh: 907,
    price_per_hour: 11900,
    image_url: 'https://images.unsplash.com/photo-1559268950-2d7ceb2efa3a?auto=format&fit=crop&w=1600&q=80',
    amenities: ['Three Distinct Luxurious Cabin Zones', 'Aft Private Stateroom Suite', 'Dedicated Crew Rest Area', 'State-of-the-Art HD Entertainment', 'Full Hot Food Preparation Galley'],
    description: 'Engineered for long-haul intercontinental comfort. The Bombardier Global 6000 combines expansive cabin dimensions, ultra-quiet flight experience, and outstanding range performance.',
    available: true,
  },
];

/**
 * Fetch jets with server-side filtering, sorting, and pagination via Supabase query builder.
 */
export async function getJets({
  search = '',
  category = 'All',
  minSeats = '',
  maxPrice = '',
  available = null,
  sortBy = 'price_per_hour',
  sortOrder = 'asc',
  page = 1,
  pageSize = 9,
} = {}) {
  try {
    let query = supabase.from('jets').select('*', { count: 'exact' });

    // Server-side debounced search: name or manufacturer using ilike
    if (search && search.trim()) {
      const term = `%${search.trim()}%`;
      query = query.or(`name.ilike.${term},manufacturer.ilike.${term}`);
    }

    // Category filter
    if (category && category !== 'All') {
      query = query.eq('category', category);
    }

    // Min seats filter
    if (minSeats !== '' && !isNaN(Number(minSeats))) {
      query = query.gte('seats', Number(minSeats));
    }

    // Max price filter
    if (maxPrice !== '' && !isNaN(Number(maxPrice))) {
      query = query.lte('price_per_hour', Number(maxPrice));
    }

    // Availability filter
    if (available !== null && available !== undefined && available !== '') {
      query = query.eq('available', available === 'true' || available === true);
    }

    // Sorting
    const isAscending = sortOrder.toLowerCase() === 'asc';
    query = query.order(sortBy, { ascending: isAscending });

    // Pagination
    const from = (page - 1) * pageSize;
    const to = from + pageSize - 1;
    query = query.range(from, to);

    const { data, count, error } = await query;

    if (error) {
      console.warn('Falling back to local client filter due to Supabase query response:', error.message);
      return filterFallbackJets({ search, category, minSeats, maxPrice, available, sortBy, sortOrder, page, pageSize });
    }

    if (!data || data.length === 0 && page === 1 && !search && category === 'All') {
      return filterFallbackJets({ search, category, minSeats, maxPrice, available, sortBy, sortOrder, page, pageSize });
    }

    return {
      data: data || [],
      count: count || (data ? data.length : 0),
      totalPages: Math.ceil((count || 0) / pageSize) || 1,
      currentPage: page,
      error: null,
    };
  } catch (err) {
    console.error('getJets error:', err);
    return filterFallbackJets({ search, category, minSeats, maxPrice, available, sortBy, sortOrder, page, pageSize });
  }
}

/**
 * Client-side fallback filter helper for initial setup or offline resilience.
 */
function filterFallbackJets({
  search = '',
  category = 'All',
  minSeats = '',
  maxPrice = '',
  available = null,
  sortBy = 'price_per_hour',
  sortOrder = 'asc',
  page = 1,
  pageSize = 9,
}) {
  let list = [...FALLBACK_JETS];

  if (search && search.trim()) {
    const s = search.toLowerCase().trim();
    list = list.filter(j => j.name.toLowerCase().includes(s) || j.manufacturer.toLowerCase().includes(s));
  }

  if (category && category !== 'All') {
    list = list.filter(j => j.category === category);
  }

  if (minSeats !== '' && !isNaN(Number(minSeats))) {
    list = list.filter(j => j.seats >= Number(minSeats));
  }

  if (maxPrice !== '' && !isNaN(Number(maxPrice))) {
    list = list.filter(j => j.price_per_hour <= Number(maxPrice));
  }

  if (available !== null && available !== undefined && available !== '') {
    const isAvail = available === 'true' || available === true;
    list = list.filter(j => j.available === isAvail);
  }

  const isAsc = sortOrder.toLowerCase() === 'asc';
  list.sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (typeof valA === 'string') return isAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    return isAsc ? (valA - valB) : (valB - valA);
  });

  const count = list.length;
  const from = (page - 1) * pageSize;
  const data = list.slice(from, from + pageSize);

  return {
    data,
    count,
    totalPages: Math.ceil(count / pageSize) || 1,
    currentPage: page,
    error: null,
  };
}

/**
 * Fetch single jet by UUID.
 */
export async function getJetById(id) {
  try {
    const { data, error } = await supabase
      .from('jets')
      .select('*')
      .eq('id', id)
      .maybeSingle();

    if (error) {
      console.warn('getJetById error:', error.message);
      const fallback = FALLBACK_JETS.find(j => j.id === id);
      if (fallback) return { data: fallback, error: null };
      return { data: null, error };
    }

    if (!data) {
      const fallback = FALLBACK_JETS.find(j => j.id === id);
      return { data: fallback || null, error: null };
    }

    return { data, error: null };
  } catch (err) {
    console.error('getJetById exception:', err);
    const fallback = FALLBACK_JETS.find(j => j.id === id);
    return { data: fallback || null, error: null };
  }
}

/**
 * Admin: Create a new jet aircraft.
 */
export async function createJet(jetData) {
  const { data, error } = await supabase
    .from('jets')
    .insert([jetData])
    .select()
    .single();

  return { data, error };
}

/**
 * Admin: Update an existing jet aircraft.
 */
export async function updateJet(id, jetData) {
  const { data, error } = await supabase
    .from('jets')
    .update(jetData)
    .eq('id', id)
    .select()
    .single();

  return { data, error };
}

/**
 * Admin: Delete a jet aircraft.
 */
export async function deleteJet(id) {
  const { data, error } = await supabase
    .from('jets')
    .delete()
    .eq('id', id);

  return { data, error };
}
