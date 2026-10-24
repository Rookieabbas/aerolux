# ✈️ AeroLux — Sovereign Private Jet Charter Platform

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38B2AC.svg)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL%20%2B%20Auth%20%2B%20RLS-3ECF8E.svg)](https://supabase.com/)
[![License](https://img.shields.io/badge/License-MIT-gold.svg)](LICENSE)

> **AeroLux** is an ultra-luxury private aviation charter platform engineered for discerning travelers, executives, and VIP flight brokers. Built on a serverless architecture powered exclusively by **Supabase (PostgreSQL, Supabase Auth, Row Level Security, and automated DB triggers)** and a high-performance **React + Vite** frontend styled in dark luxury aesthetic with **Framer Motion** animations.

---

## 🌟 Live Demo & Preview

- **Live Production URL:** https://aerolux-peach.vercel.app/
- **GitHub Repository:** `https://github.com/your-username/aerolux`

```
┌────────────────────────────────────────────────────────────────────────┐
│                        AEROLUX FLIGHT MANIFEST                         │
│  DEL ────────────✈──────────── DXB  |  BOMBARDIER GLOBAL 7500         │
│  Distance: 2,192 km | Flight Time: 2h 14m | Status: CONFIRMED VIP      │
│  Perforated Boarding Pass with Instant High-Resolution PDF Download    │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Key Features

### 1. 🛡️ Robust Supabase Backend (Zero Node Server)
- **Zero Express / Node Backend:** The client communicates directly with PostgreSQL via Supabase client using only public `anon` credentials.
- **Enforced Security (RLS):** Row Level Security enabled across all tables (`profiles`, `cities`, `jets`, `bookings`). No user can access or modify another client's flights.
- **Server-Side Trigger Calculations:** Flight distances (Haversine formula), air time hours, total charter pricing, and unique booking references (`AX-XXXXXX`) are computed exclusively within a PostgreSQL database trigger.
- **Double-Booking Prevention:** A PostgreSQL **partial unique index** guarantees no aircraft can be double-booked on the same departure date while its status is `Confirmed`.

### 2. 💎 Dark Luxury Design System
- **Color Palette:** Ultra-deep obsidian background (`#0a0a0a`), surface slate (`#141414`), charcoal borders (`#262626`), and luminous antique gold (`#d4af37` / `#f0c75e`).
- **Typography:** Serif editorial headings using **Playfair Display**, paired with crisp geometric **Inter** body text.
- **Framer Motion Micro-Interactions:** Staggered card reveals, soft gold hover lifts, animated progress stepper, and spring modal transitions.

### 3. 🔍 High-Performance Fleet Search & Filtering
- **Debounced Server-Side Search:** Real-time search by aircraft name or manufacturer with PostgreSQL `ilike`.
- **Granular Multi-Filter:** Filter by category (*Light, Midsize, Heavy, Ultra Long Range*), minimum passenger capacity, maximum price ceiling, and immediate availability.
- **Sort & Pagination:** Multi-axis sorting (Hourly Rate, Passenger Capacity, Range, Speed) with 9 aircraft per page.
- **URL Synchronization:** Filter parameters are automatically mirrored to URL search parameters (`?category=Heavy&minSeats=8&sort=price_per_hour:asc`) for shareable bookmarks and browser history integrity.

### 4. 🎫 4-Step Animated Booking Stepper & VIP Boarding Pass
1. **Step 1 — Route & Schedule:** Choose departure and arrival metropolitan hubs (Delhi, Mumbai, Dubai, London, New York, etc.), select future date, and passenger count. Live client-side Haversine avionics estimate flight time and cost instantly.
2. **Step 2 — Lead Passenger Details:** Register lead VIP contact information and bespoke culinary/ground transportation requests.
3. **Step 3 — Itinerary Review:** Comprehensive cost breakdown with transparent fee structure and charter agreement authorization.
4. **Step 4 — VIP Boarding Pass Ticket:** Perforated dual-section ticket with tear-off stub, flight route codes, booking reference, and one-click PDF generation via **html2canvas + jsPDF**.

### 5. 👑 Executive Admin Deck (`/admin`)
- Accessible strictly to users whose profile has `role = 'admin'` (enforced in both frontend routing and PostgreSQL RLS).
- **Fleet Inventory Management:** Create, edit, toggle maintenance availability, or remove aircraft via modal dialogs.
- **All Flights Overview:** Read-only global audit table of all charter bookings placed across the system.

---

## 🛠️ Tech Stack

| Layer | Technology | Description |
|---|---|---|
| **Frontend Framework** | React 18 + Vite 5 | Lightning-fast ESM dev server and optimized production build |
| **Routing** | React Router v6 | Declarative client routing with protected and admin-guarded routes |
| **Styling** | Tailwind CSS 3.4 | Utility-first custom dark luxury color palette & typography |
| **Motion** | Framer Motion 11 | Silky spring transitions, staggered entrances, and stepper progress |
| **Icons** | Lucide React | Clean, scalable luxury aviation icons |
| **Notifications** | React Hot Toast | Elegant dark theme notifications with gold accents |
| **Ticket Export** | html2canvas + jsPDF | Client-side vector PDF generation of official boarding passes |
| **Database & Auth** | Supabase (PostgreSQL 15) | Relational database, Auth, RLS, Functions & DB Triggers |

---

## 📁 Repository Structure

```
aerolux/
├── client/
│   ├── public/
│   │   └── favicon.svg           # Custom gold aviation crest
│   ├── src/
│   │   ├── components/           # Reusable UI components
│   │   │   ├── AdminRoute.jsx    # Guard for admin role
│   │   │   ├── Badge.jsx         # Status and category pills
│   │   │   ├── Button.jsx        # Gold gradient & outline buttons
│   │   │   ├── ErrorBoundary.jsx # Luxury error recovery
│   │   │   ├── Footer.jsx        # Rich footer with concierge & certifications
│   │   │   ├── Input.jsx         # Dark luxury input with icon slots
│   │   │   ├── JetCard.jsx       # Aircraft card with hover lift & specs
│   │   │   ├── Modal.jsx         # Framer Motion animated dialog
│   │   │   ├── Navbar.jsx        # Sticky blurred navbar & user drawer
│   │   │   ├── ProtectedRoute.jsx# Auth verification guard
│   │   │   ├── Select.jsx        # Custom dark styled select dropdown
│   │   │   ├── Skeleton.jsx      # Shimmer skeleton loaders
│   │   │   ├── Stepper.jsx       # 4-step progress indicator
│   │   │   └── Ticket.jsx        # Boarding-pass component with PDF export
│   │   ├── context/
│   │   │   └── AuthContext.jsx   # Supabase auth state & profile synchronization
│   │   ├── hooks/
│   │   │   ├── useBookings.js    # User & admin booking queries and mutations
│   │   │   ├── useDebounce.js    # Search debouncing hook
│   │   │   └── useJets.js        # Server-side filtered query builder
│   │   ├── lib/
│   │   │   └── supabaseClient.js # Configured Supabase client
│   │   ├── pages/
│   │   │   ├── AdminPage.jsx     # Fleet & bookings admin management
│   │   │   ├── BookingFlowPage.jsx # 4-step charter dispatch workflow
│   │   │   ├── BookingsPage.jsx  # User flight history & modifications
│   │   │   ├── JetDetailPage.jsx # Aircraft specs & live route calculator
│   │   │   ├── JetsPage.jsx      # Fleet catalog with search, filter & sort
│   │   │   ├── LandingPage.jsx   # Hero, quick search, featured jets, stats
│   │   │   ├── LoginPage.jsx     # VIP member login
│   │   │   ├── NotFoundPage.jsx  # Luxury 404
│   │   │   └── SignupPage.jsx    # VIP registration
│   │   ├── services/
│   │   │   ├── bookings.js       # Supabase calls for bookings CRUD
│   │   │   ├── cities.js         # Cities network query & fallback seed
│   │   │   └── jets.js           # Jets catalog queries and admin mutations
│   │   ├── utils/
│   │   │   └── haversine.js      # Client Great-Circle distance & pricing math
│   │   ├── App.jsx               # Routes and toaster setup
│   │   ├── index.css             # Tailwind base & custom luxury scrollbars
│   │   └── main.jsx              # React DOM initialization
│   ├── .env.example              # Environment variables template
│   ├── index.html                # HTML entry with Google Playfair/Inter fonts
│   ├── package.json              # NPM dependencies
│   ├── postcss.config.js         # PostCSS configuration
│   ├── tailwind.config.js        # Custom luxury theme extensions
│   ├── vercel.json               # SPA rewrite rule for Vercel
│   └── vite.config.js            # Vite configuration
├── supabase/
│   ├── schema.sql                # Complete PostgreSQL schema, triggers & RLS
│   └── seed.sql                  # 15 global cities + 10 realistic luxury jets
├── .gitignore                    # Node modules, dist, environment exclusions
└── README.md                     # Comprehensive documentation
```

---

## 🗄️ Database Architecture & Schema Summary

### Tables
1. **`profiles`**
   - `id` (uuid, primary key, references `auth.users.id` on delete cascade)
   - `full_name` (text), `phone` (text), `role` (text check: `'user'`, `'admin'`)
   - `created_at`, `updated_at` (timestamptz)
2. **`cities`**
   - `id` (uuid, primary key), `code` (text unique, e.g., `'DEL'`, `'DXB'`), `name` (text), `country` (text)
   - `lat` (numeric), `lng` (numeric), `created_at` (timestamptz)
3. **`jets`**
   - `id` (uuid, primary key), `name` (text), `manufacturer` (text), `category` (text check: `'Light'`, `'Midsize'`, `'Heavy'`, `'Ultra Long Range'`)
   - `seats` (int), `range_km` (int), `speed_kmh` (int), `price_per_hour` (numeric)
   - `image_url` (text), `amenities` (text[]), `description` (text), `available` (boolean)
4. **`bookings`**
   - `id` (uuid, primary key), `booking_ref` (text unique, e.g., `'AX-8F2D1A'`)
   - `user_id` (uuid references `profiles.id`), `jet_id` (uuid references `jets.id`)
   - `from_city` (text), `to_city` (text), `flight_date` (date), `passengers` (int)
   - `distance_km` (numeric), `flight_hours` (numeric), `total_price` (numeric)
   - `passenger_name` (text), `passenger_phone` (text), `special_requests` (text)
   - `status` (text check: `'Confirmed'`, `'Cancelled'`), `created_at` (timestamptz)

---

## 🔒 Row Level Security (RLS) Policies

All tables have RLS explicitly enabled:

```sql
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.jets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
```

- **`cities`**: Anyone can view cities (`SELECT USING (true)`).
- **`jets`**: Anyone can view jets (`SELECT USING (true)`). Only users with `is_admin() = true` can `INSERT`, `UPDATE`, or `DELETE`.
- **`profiles`**: Users can view and update their own profile (`auth.uid() = id`), while administrators can view all profiles.
- **`bookings`**: Regular users can create and view their own bookings (`auth.uid() = user_id`) and cancel their own flights (`UPDATE status = 'Cancelled'`). Admins can query all bookings across the platform.

---

## ⚡ Technical Highlights

### 1. Database-Enforced Business Logic Trigger
The client never computes or trusts the final booking price. When `bookings` receives an `INSERT` or `UPDATE`, the PostgreSQL trigger `process_booking_before_write()` executes:
- **Passenger Seat Validation:** Ensures `passengers <= jet.seats`.
- **Date Check:** Ensures `flight_date >= current_date`.
- **Route Validation:** Checks that `from_city <> to_city` and verifies both cities against the `cities` table.
- **Haversine Distance:** Calculates great-circle route distance:
  $$\text{Distance} = 2 \cdot R \cdot \arcsin\left(\sqrt{\sin^2\left(\frac{\Delta \text{lat}}{2}\right) + \cos(\text{lat}_1)\cos(\text{lat}_2)\sin^2\left(\frac{\Delta \text{lng}}{2}\right)}\right)$$
- **Total Price:** Computes `flight_hours = distance_km / jet.speed_kmh` and multiplies by `price_per_hour`.
- **Booking Reference Generation:** Automatically assigns a randomized uppercase code (e.g. `AX-B83DA1`).

### 2. Double-Booking Prevention with Partial Unique Index
```sql
CREATE UNIQUE INDEX idx_bookings_jet_date_confirmed
  ON public.bookings (jet_id, flight_date)
  WHERE status = 'Confirmed';
```
This PostgreSQL partial index guarantees that two confirmed charters cannot occupy the same aircraft on the same day. If a user cancels, the partial constraint releases automatically.

---

## 🚀 Local Setup Guide

### Prerequisites
- **Node.js** (v18 or higher)
- **NPM** or **Yarn**
- A free **Supabase** account ([supabase.com](https://supabase.com))

### Step 1: Clone the Repository
```bash
git clone https://github.com/your-username/aerolux.git
cd aerolux/client
```

### Step 2: Configure Supabase Database
1. Go to your [Supabase Dashboard](https://supabase.com/dashboard) and create a new project.
2. Open the **SQL Editor** in the left sidebar.
3. Open `supabase/schema.sql`, paste the entire script, and click **Run**.
4. Open `supabase/seed.sql`, paste the seed script, and click **Run**.

### Step 3: Configure Auth Settings (For Seamless Demo)
1. In the Supabase Dashboard, navigate to **Authentication > Providers > Email**.
2. Toggle **Confirm email** to **OFF** (this allows instant sign-in without waiting for email verification).
3. Under **Authentication > URL Configuration**, ensure `http://localhost:5173` is listed under **Site URL** and **Redirect URLs**.

### Step 4: Configure Local Environment Variables
In the `client/` folder, copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Open `client/.env` and insert your Supabase project credentials (found under **Project Settings > API**):
```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 5: Install Dependencies & Launch
```bash
cd client
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 👑 Promoting a User to Admin

To access the `/admin` Operations Deck:
1. Register an account in the web app (e.g., `admin@aerolux.vip`).
2. Open the **SQL Editor** in Supabase and run:
```sql
UPDATE public.profiles
SET role = 'admin'
WHERE id IN (SELECT id FROM auth.users WHERE email = 'admin@aerolux.vip');
```
3. Refresh the AeroLux app. You will now see the **Admin Deck** icon in the navbar with full access to `/admin`.

---

## ☁️ Deployment Guide

### Deploying the Frontend to Vercel

1. **Push your code to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "feat: initial AeroLux private aviation release"
   git branch -M main
   git remote add origin https://github.com/your-username/aerolux.git
   git push -u origin main
   ```

2. **Import into Vercel:**
   - Log in to [Vercel](https://vercel.com) and click **Add New Project**.
   - Select your `aerolux` repository.
   - Set **Root Directory** to `client`.
   - Ensure the Framework Preset is set to **Vite**.

3. **Set Environment Variables in Vercel:**
   - Add `VITE_SUPABASE_URL` = your Supabase URL.
   - Add `VITE_SUPABASE_ANON_KEY` = your Supabase anon key.
   - Click **Deploy**.

4. **Update Supabase Redirects:**
   - After Vercel completes the build, copy your production domain (e.g. `https://aerolux.vercel.app`).
   - Go to Supabase Dashboard > **Authentication > URL Configuration**.
   - Set **Site URL** to `https://aerolux.vercel.app`.
   - Add `https://aerolux.vercel.app/**` to **Redirect URLs**.

---

## 📄 Environment Variables Reference

| Variable | Required | Description |
|---|---|---|
| `VITE_SUPABASE_URL` | **Yes** | Your Supabase Project API URL (`https://xyz.supabase.co`) |
| `VITE_SUPABASE_ANON_KEY` | **Yes** | Your Supabase anonymous public key (safe for client-side use) |

> ⚠️ **Security Notice:** Never embed the Supabase `service_role` key in frontend code or environment variables. AeroLux relies strictly on Row Level Security and the `anon` key.

---

## 📜 License
Distributed under the MIT License. See `LICENSE` for more information.
