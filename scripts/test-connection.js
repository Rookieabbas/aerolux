const url = 'https://yrpujfknyhhlarjpzium.supabase.co';
const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlycHVqZmtueWhobGFyanB6aXVtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTI4MTMwNjgsImV4cCI6MjEwODM4OTA2OH0.rTHSZDdIUp1xDE0xsBxuknlKJXF1xsHJIksDyH0PXl8';

async function inspect() {
  const resJets = await fetch(`${url}/rest/v1/jets?select=name,manufacturer,category,seats,price_per_hour`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  });
  const jets = await resJets.json();
  console.log(`\n✈️ Jets in Supabase (${jets.length}):`);
  jets.forEach(j => console.log(`  - ${j.manufacturer} ${j.name} (${j.category}, ${j.seats} seats, $${j.price_per_hour}/hr)`));

  const resCities = await fetch(`${url}/rest/v1/cities?select=name,code,country`, {
    headers: { 'apikey': key, 'Authorization': `Bearer ${key}` }
  });
  const cities = await resCities.json();
  console.log(`\n🌍 Cities in Supabase (${cities.length}):`);
  console.log('  ' + cities.map(c => `${c.name} (${c.code})`).join(', '));
}

inspect();
