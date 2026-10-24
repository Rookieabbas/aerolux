-- ==============================================================================
-- AeroLux Private Jet Charter - Database Schema
-- Run this script in the Supabase SQL Editor.
-- ==============================================================================

-- 1. Enable required extensions
create extension if not exists "uuid-ossp";

-- 2. Drop existing objects cleanly if rerunning
drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists trg_validate_and_calculate_booking on public.bookings;
drop function if exists public.handle_new_user();
drop function if exists public.process_booking_before_write();
drop function if exists public.calculate_haversine_distance(numeric, numeric, numeric, numeric);
drop function if exists public.is_admin();

-- 3. PROFILES TABLE
create table if not exists public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  full_name text not null default 'VIP Passenger',
  phone text default '',
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- 4. CITIES TABLE
create table if not exists public.cities (
  id uuid primary key default uuid_generate_v4(),
  code text unique not null,
  name text unique not null,
  country text not null,
  lat numeric not null,
  lng numeric not null,
  created_at timestamptz not null default now()
);

-- 5. JETS TABLE
create table if not exists public.jets (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  manufacturer text not null,
  category text not null check (category in ('Light', 'Midsize', 'Heavy', 'Ultra Long Range')),
  seats int not null check (seats > 0),
  range_km int not null check (range_km > 0),
  speed_kmh int not null check (speed_kmh > 0),
  price_per_hour numeric not null check (price_per_hour > 0),
  image_url text not null,
  amenities text[] not null default '{}',
  description text not null,
  available boolean not null default true,
  created_at timestamptz not null default now()
);

-- 6. BOOKINGS TABLE
create table if not exists public.bookings (
  id uuid primary key default uuid_generate_v4(),
  booking_ref text unique,
  user_id uuid references public.profiles(id) on delete cascade not null,
  jet_id uuid references public.jets(id) on delete restrict not null,
  from_city text not null,
  to_city text not null,
  flight_date date not null,
  passengers int not null check (passengers > 0),
  distance_km numeric not null default 0,
  flight_hours numeric not null default 0,
  total_price numeric not null default 0,
  passenger_name text not null,
  passenger_phone text not null,
  special_requests text,
  status text not null default 'Confirmed' check (status in ('Confirmed', 'Cancelled')),
  created_at timestamptz not null default now()
);

-- 7. DOUBLE-BOOKING PREVENTION
-- Partial unique index prevents booking the same jet on the same date unless cancelled
create unique index if not exists idx_bookings_jet_date_confirmed
  on public.bookings (jet_id, flight_date)
  where status = 'Confirmed';

-- 8. HELPER FUNCTION: is_admin() (SECURITY DEFINER)
create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
stable
as $$
  select coalesce(
    (select role = 'admin' from public.profiles where id = auth.uid()),
    false
  );
$$;

-- 9. HAVERSINE DISTANCE FORMULA (Earth radius = 6371 km)
create or replace function public.calculate_haversine_distance(
  lat1 numeric,
  lng1 numeric,
  lat2 numeric,
  lng2 numeric
)
returns numeric
language plpgsql
immutable
as $$
declare
  r constant numeric := 6371.0; -- Earth radius in kilometers
  dlat numeric;
  dlng numeric;
  a numeric;
  c numeric;
begin
  dlat := radians(lat2 - lat1);
  dlng := radians(lng2 - lng1);
  a := sin(dlat / 2.0)^2 + cos(radians(lat1)) * cos(radians(lat2)) * sin(dlng / 2.0)^2;
  
  if a > 1.0 then
    a := 1.0;
  end if;
  
  c := 2.0 * atan2(sqrt(a), sqrt(1.0 - a));
  return round(r * c, 2);
end;
$$;

-- 10. BUSINESS LOGIC TRIGGER FUNCTION FOR BOOKINGS
create or replace function public.process_booking_before_write()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  jet_record record;
  from_city_rec record;
  to_city_rec record;
  computed_dist numeric;
  computed_hours numeric;
  computed_total numeric;
begin
  -- 1. If an existing booking is being updated to 'Cancelled', skip route/date recalculation
  if (tg_op = 'UPDATE' and new.status = 'Cancelled' and old.status = 'Confirmed') then
    return new;
  end if;

  -- 2. Validate jet existence and status
  select seats, speed_kmh, price_per_hour, available, name
  into jet_record
  from public.jets
  where id = new.jet_id;

  if not found then
    raise exception 'Aircraft not found. Please choose an active jet from the fleet.';
  end if;

  if not jet_record.available then
    raise exception 'Aircraft "%" is currently in scheduled maintenance or unavailable.', jet_record.name;
  end if;

  -- 3. Validate passenger capacity
  if new.passengers > jet_record.seats then
    raise exception 'Passenger count (%) exceeds aircraft capacity of % seats.', new.passengers, jet_record.seats;
  end if;

  -- 4. Validate flight date is not in the past
  if new.flight_date < current_date then
    raise exception 'Flight date cannot be in the past. Please select today or a future date.';
  end if;

  -- 5. Lookup departure city
  select name, code, lat, lng
  into from_city_rec
  from public.cities
  where lower(trim(name)) = lower(trim(new.from_city))
     or lower(trim(code)) = lower(trim(new.from_city))
  limit 1;

  if not found then
    raise exception 'Departure city "%" is not serviced by the AeroLux network.', new.from_city;
  end if;

  -- 6. Lookup destination city
  select name, code, lat, lng
  into to_city_rec
  from public.cities
  where lower(trim(name)) = lower(trim(new.to_city))
     or lower(trim(code)) = lower(trim(new.to_city))
  limit 1;

  if not found then
    raise exception 'Arrival city "%" is not serviced by the AeroLux network.', new.to_city;
  end if;

  -- 7. Validate departure <> arrival
  if lower(trim(from_city_rec.name)) = lower(trim(to_city_rec.name)) then
    raise exception 'Departure and arrival cities cannot be identical.';
  end if;

  -- Canonicalize city names
  new.from_city := from_city_rec.name;
  new.to_city := to_city_rec.name;

  -- 8. Compute distance via Haversine formula
  computed_dist := public.calculate_haversine_distance(
    from_city_rec.lat,
    from_city_rec.lng,
    to_city_rec.lat,
    to_city_rec.lng
  );

  -- Minimum realistic charter flight distance threshold (50 km)
  if computed_dist < 50 then
    computed_dist := 50;
  end if;
  new.distance_km := computed_dist;

  -- 9. Compute flight hours = distance / speed (minimum 0.5 hours charter time)
  computed_hours := round((computed_dist / jet_record.speed_kmh)::numeric, 2);
  if computed_hours < 0.5 then
    computed_hours := 0.50;
  end if;
  new.flight_hours := computed_hours;

  -- 10. Compute total charter price
  computed_total := round(computed_hours * jet_record.price_per_hour, 2);
  new.total_price := computed_total;

  -- 11. Generate booking reference on INSERT if not supplied
  if tg_op = 'INSERT' or new.booking_ref is null or length(trim(new.booking_ref)) = 0 then
    new.booking_ref := 'AX-' || upper(substr(md5(random()::text || clock_timestamp()::text), 1, 6));
  end if;

  return new;
end;
$$;

create trigger trg_validate_and_calculate_booking
  before insert or update on public.bookings
  for each row execute function public.process_booking_before_write();

-- 11. AUTH USER CREATION TRIGGER (Auto-create profile)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', 'VIP Passenger'),
    coalesce(new.raw_user_meta_data->>'phone', ''),
    coalesce(new.raw_user_meta_data->>'role', 'user')
  )
  on conflict (id) do update set
    full_name = coalesce(excluded.full_name, profiles.full_name),
    phone = coalesce(excluded.phone, profiles.phone),
    updated_at = now();
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 12. ROW LEVEL SECURITY (RLS) POLICIES
alter table public.profiles enable row level security;
alter table public.cities enable row level security;
alter table public.jets enable row level security;
alter table public.bookings enable row level security;

-- PROFILES Policies
create policy "Users can view own profile or admin can view all"
  on public.profiles for select
  using (auth.uid() = id or public.is_admin());

create policy "Users can update their own profile"
  on public.profiles for update
  using (auth.uid() = id or public.is_admin())
  with check (auth.uid() = id or public.is_admin());

create policy "Users can insert their own profile"
  on public.profiles for insert
  with check (auth.uid() = id or public.is_admin());

-- CITIES Policies (public read)
create policy "Anyone can view cities"
  on public.cities for select
  using (true);

create policy "Admins can manage cities"
  on public.cities for all
  using (public.is_admin())
  with check (public.is_admin());

-- JETS Policies (public read, admin write)
create policy "Anyone can view jets"
  on public.jets for select
  using (true);

create policy "Admins can insert jets"
  on public.jets for insert
  with check (public.is_admin());

create policy "Admins can update jets"
  on public.jets for update
  using (public.is_admin())
  with check (public.is_admin());

create policy "Admins can delete jets"
  on public.jets for delete
  using (public.is_admin());

-- BOOKINGS Policies
create policy "Users can view own bookings or admin can view all"
  on public.bookings for select
  using (auth.uid() = user_id or public.is_admin());

create policy "Users can insert own bookings"
  on public.bookings for insert
  with check (auth.uid() = user_id);

create policy "Users can update own bookings or admin can update"
  on public.bookings for update
  using (auth.uid() = user_id or public.is_admin())
  with check (auth.uid() = user_id or public.is_admin());
