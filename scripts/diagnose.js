import { createClient } from '@supabase/supabase-js';

const url = 'https://yrpujfknyhhlarjpzium.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlycHVqZmtueWhobGFyanB6aXVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4MTMwNjgsImV4cCI6MjEwODM4OTA2OH0.rTHSZDdIUp1xDE0xsBxuknlKJXF1xsHJIksDyH0PXl8';

const supabase = createClient(url, key);

async function diagnose() {
  console.log('=== AEROLUX COMPREHENSIVE DIAGNOSTIC ===\n');

  // 1. Check Jets
  console.log('1. Checking jets table...');
  const { data: jets, error: jetsErr } = await supabase.from('jets').select('*');
  if (jetsErr) console.error('❌ Jets error:', jetsErr);
  else console.log(`✅ Jets found: ${jets.length}`);

  // 2. Check Cities
  console.log('\n2. Checking cities table...');
  const { data: cities, error: citiesErr } = await supabase.from('cities').select('*');
  if (citiesErr) console.error('❌ Cities error:', citiesErr);
  else console.log(`✅ Cities found: ${cities.length}`);

  // 3. Test Demo User Login
  console.log('\n3. Testing Demo User sign in...');
  const testEmail = 'vip.guest@aerolux.vip';
  const testPassword = 'AeroLuxVIP2025!';

  let authUser = null;
  const { data: signInData, error: signInErr } = await supabase.auth.signInWithPassword({
    email: testEmail,
    password: testPassword,
  });

  if (signInErr) {
    console.log('SignIn note:', signInErr.message);
    console.log('Attempting SignUp for demo user...');
    const { data: signUpData, error: signUpErr } = await supabase.auth.signUp({
      email: testEmail,
      password: testPassword,
      options: {
        data: {
          full_name: 'Lord Alexander Hamilton',
          phone: '+1 (555) 019-2834',
        }
      }
    });
    if (signUpErr) {
      console.error('❌ SignUp failed:', signUpErr.message);
    } else {
      console.log('✅ SignUp result:', signUpData.user ? `User created ID ${signUpData.user.id}` : 'No user returned');
      authUser = signUpData.user;
    }
  } else {
    console.log('✅ SignIn success! User ID:', signInData.user.id);
    authUser = signInData.user;
  }

  // 4. Test Profile row
  if (authUser) {
    console.log('\n4. Checking profile row for user:', authUser.id);
    const { data: profile, error: profErr } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', authUser.id)
      .maybeSingle();

    if (profErr) console.error('❌ Profile fetch error:', profErr.message);
    else console.log('Profile data:', profile);

    // 5. Test Booking Insert
    if (jets && jets.length > 0 && cities && cities.length > 1) {
      console.log('\n5. Testing Booking Insert for user...');
      const jet = jets[0];
      const today = new Date();
      today.setDate(today.getDate() + 5);
      const flightDate = today.toISOString().split('T')[0];

      const { data: booking, error: bookErr } = await supabase
        .from('bookings')
        .insert([{
          user_id: authUser.id,
          jet_id: jet.id,
          from_city: 'Delhi',
          to_city: 'Dubai',
          flight_date: flightDate,
          passengers: 2,
          passenger_name: 'Lord Alexander Hamilton',
          passenger_phone: '+1 (555) 019-2834',
          special_requests: 'Diagnostics VIP test flight',
          status: 'Confirmed'
        }])
        .select()
        .single();

      if (bookErr) {
        console.error('❌ Booking insert failed:', bookErr.message, bookErr.details, bookErr);
      } else {
        console.log('✅ Booking inserted successfully! Ref:', booking.booking_ref, 'Total Price:', booking.total_price);
      }
    }
  }

  console.log('\n=== DIAGNOSTIC FINISHED ===');
}

diagnose();
