import { createClient } from '@supabase/supabase-js';

const url = 'https://yrpujfknyhhlarjpzium.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlycHVqZmtueWhobGFyanB6aXVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4MTMwNjgsImV4cCI6MjEwODM4OTA2OH0.rTHSZDdIUp1xDE0xsBxuknlKJXF1xsHJIksDyH0PXl8';

const supabase = createClient(url, key);

async function checkProfiles() {
  const { data, error } = await supabase.from('profiles').select('*');
  console.log('Profiles in DB:', { data, error });

  const { data: bData, error: bErr } = await supabase.from('bookings').select('*');
  console.log('Bookings in DB:', { data: bData, error: bErr });
}

checkProfiles();
