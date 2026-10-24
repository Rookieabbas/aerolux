-- ==============================================================================
-- AeroLux Private Jet Charter - Seed Data
-- Run this script in the Supabase SQL Editor after running schema.sql.
-- ==============================================================================

-- 1. SEED CITIES (15 Global & Domestic Metropolitan Hubs with Exact Airport Coordinates)
insert into public.cities (code, name, country, lat, lng) values
  ('DEL', 'Delhi', 'India', 28.5562, 77.1000),
  ('BOM', 'Mumbai', 'India', 19.0896, 72.8656),
  ('BLR', 'Bengaluru', 'India', 13.1986, 77.7066),
  ('LKO', 'Lucknow', 'India', 26.7606, 80.8893),
  ('GOI', 'Goa', 'India', 15.3808, 73.8314),
  ('HYD', 'Hyderabad', 'India', 17.2403, 78.4294),
  ('DXB', 'Dubai', 'United Arab Emirates', 25.2532, 55.3657),
  ('LHR', 'London', 'United Kingdom', 51.4700, -0.4543),
  ('SIN', 'Singapore', 'Singapore', 1.3644, 103.9915),
  ('JFK', 'New York', 'United States', 40.6413, -73.7781),
  ('CDG', 'Paris', 'France', 49.0097, 2.5479),
  ('HND', 'Tokyo', 'Japan', 35.5494, 139.7798),
  ('ZRH', 'Zurich', 'Switzerland', 47.4582, 8.5555),
  ('SYD', 'Sydney', 'Australia', -33.9399, 151.1753),
  ('LAX', 'Los Angeles', 'United States', 33.9416, -118.4085)
on conflict (code) do update set
  name = excluded.name,
  country = excluded.country,
  lat = excluded.lat,
  lng = excluded.lng;

-- 2. SEED JETS (10 Realistic Luxury Charter Aircraft Across 4 Categories)
insert into public.jets (
  name,
  manufacturer,
  category,
  seats,
  range_km,
  speed_kmh,
  price_per_hour,
  image_url,
  amenities,
  description,
  available
) values
(
  'Global 7500',
  'Bombardier',
  'Ultra Long Range',
  16,
  14260,
  982,
  14500,
  'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80',
  ARRAY['Master Stateroom Suite', 'Full Galley with Chef Induction', 'Ka-band Ultra High Speed Wi-Fi', 'En-Suite Lavatory with Shower', 'Club Seating & Conference Suite', 'Air Purification System'],
  'The flagship of luxury private aviation. The Bombardier Global 7500 features four true living spaces, a dedicated crew suite, and unparalleled intercontinental endurance for non-stop global travel.',
  true
),
(
  'G650ER',
  'Gulfstream',
  'Ultra Long Range',
  14,
  13890,
  956,
  13800,
  'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?auto=format&fit=crop&w=1600&q=80',
  ARRAY['16 Iconic Panoramic Windows', '100% Fresh Air Replenishment', 'Private VIP Stateroom', 'High-Definition Entertainment System', 'Full Forward Galley & Espresso Bar', 'Satellite Telephony'],
  'Renowned as the pinnacle of speed and poise, the Gulfstream G650ER flies farther and faster than nearly any civilian aircraft while maintaining the lowest cabin altitude in the skies.',
  true
),
(
  'Falcon 8X',
  'Dassault',
  'Heavy',
  12,
  11945,
  900,
  11200,
  'https://images.unsplash.com/photo-1520437358207-323b43b50729?auto=format&fit=crop&w=1600&q=80',
  ARRAY['Tri-Jet Redundancy & Short Field Access', 'Ultra-Quiet Acoustic Insulation', 'Custom Three-Lounge Layout', 'Skylight Galley Concept', 'High-Speed Broadband Internet'],
  'The Falcon 8X tri-jet marries fighter-jet aerodynamic DNA with supreme quietness and flexibility. Unmatched capability into challenging short runways like London City and Aspen.',
  true
),
(
  'Challenger 350',
  'Bombardier',
  'Midsize',
  9,
  5926,
  870,
  6800,
  'https://images.unsplash.com/photo-1519074069444-1ba4fff16def?auto=format&fit=crop&w=1600&q=80',
  ARRAY['Handcrafted Ergonomic Leather Seats', 'In-Flight Accessible Luggage Bay', 'Touchscreen Cabin Management System', 'Microwave & Convection Oven', 'High-Speed Wi-Fi'],
  'The best-selling super-midsize business jet for a decade. Features a stand-up flat-floor cabin, exceptional climb performance, and supreme comfort on cross-continental charter routes.',
  true
),
(
  'Citation Longitude',
  'Cessna',
  'Midsize',
  8,
  6482,
  895,
  6500,
  'https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&w=1600&q=80',
  ARRAY['Lowest In-Class Cabin Altitude', 'Wireless Cabin Audio & Video', 'Walk-in Baggage Compartment', 'Wet Galley with Cold Storage', 'Double Club Seating'],
  'Engineered for maximum passenger wellness and quiet productivity. The Citation Longitude combines transcontinental range with sophisticated interior detailing and generous legroom.',
  true
),
(
  'Praetor 600',
  'Embraer',
  'Midsize',
  9,
  7441,
  863,
  7200,
  'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?auto=format&fit=crop&w=1600&q=80',
  ARRAY['Full Fly-By-Wire Active Turbulence Reduction', 'HEPA Medical-Grade Air Filtration', 'Berthable Club Seats', 'Stone Flooring in Wet Galley', 'High-Capacity Cargo Storage'],
  'The Praetor 600 bridges the gap between super-midsize efficiency and large-cabin luxury. Features full fly-by-wire turbulence cancellation technology for the smoothest possible journey.',
  true
),
(
  'PC-24',
  'Pilatus',
  'Light',
  6,
  3610,
  815,
  4600,
  'https://images.unsplash.com/photo-1569154941061-e231b4725ef1?auto=format&fit=crop&w=1600&q=80',
  ARRAY['Pallet-Sized Cargo Door Access', 'Unpaved Strip & Remote Field Capability', 'Private Lavatory with Pocket Door', 'Swiveling Executive Armchairs', 'In-Flight Power Outlets'],
  'The Swiss Super Versatile Jet. Designed to access over 20,000 unpaved or short airstrips worldwide without sacrificing executive style, speed, or passenger refinement.',
  true
),
(
  'Phenom 300E',
  'Embraer',
  'Light',
  7,
  3723,
  839,
  4900,
  'https://images.unsplash.com/photo-1474302770737-173ee21bab63?auto=format&fit=crop&w=1600&q=80',
  ARRAY['Bespoke Bossa Nova Interior Style', 'Oversized Windows & Natural Daylight', 'Enclosed Lavatory with Sink', 'Multi-Zone Climate Controls', 'Generous Baggage Capacity'],
  'The best-selling single-pilot light business jet for 12 consecutive years. Renowned for class-leading speed, exceptional operating economics, and best-in-class cabin pressurization.',
  true
),
(
  'Citation CJ4 Gen2',
  'Cessna',
  'Light',
  6,
  4010,
  835,
  4400,
  'https://images.unsplash.com/photo-1542296332-2e4473faf563?auto=format&fit=crop&w=1600&q=80',
  ARRAY['Cool Ambient LED Mood Lighting', 'Foldaway Executive Writing Desks', 'Refreshment Center & Ice Drawer', 'Direct In-Flight Wi-Fi', 'Ergonomic Articulating Seats'],
  'The ultimate expression of light jet capability. Perfect for regional executive travel, weekend escapes, and swift point-to-point charters with supreme reliability.',
  true
),
(
  'Global 6000',
  'Bombardier',
  'Heavy',
  13,
  11112,
  907,
  11900,
  'https://images.unsplash.com/photo-1559268950-2d7ceb2efa3a?auto=format&fit=crop&w=1600&q=80',
  ARRAY['Three Distinct Luxurious Cabin Zones', 'Aft Private Stateroom Suite', 'Dedicated Crew Rest Area', 'State-of-the-Art HD Entertainment', 'Full Hot Food Preparation Galley'],
  'Engineered for long-haul intercontinental comfort. The Bombardier Global 6000 combines expansive cabin dimensions, ultra-quiet flight experience, and outstanding range performance.',
  true
);

-- ==============================================================================
-- INSTRUCTIONS TO PROMOTE A USER TO ADMIN:
--
-- 1. Sign up a user in the AeroLux web application (e.g. admin@aerolux.vip).
-- 2. Find the user UUID either in the Supabase Dashboard (Authentication > Users)
--    or by running:
--    SELECT id, email FROM auth.users WHERE email = 'admin@aerolux.vip';
-- 3. Execute the SQL command below replacing <user-uuid> with the actual UUID:
--
--    UPDATE public.profiles
--    SET role = 'admin'
--    WHERE id = '<user-uuid>';
--
-- Quick one-liner helper by email:
--    UPDATE public.profiles
--    SET role = 'admin'
--    WHERE id IN (SELECT id FROM auth.users WHERE email = 'admin@aerolux.vip');
-- ==============================================================================
