import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pkg from 'pg';
const { Client } = pkg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runSetup() {
  const connectionString = process.env.DATABASE_URL || process.argv[2];

  if (!connectionString) {
    console.error('\n❌ ERROR: Database connection string missing.');
    console.log('\nUsage:');
    console.log('  node scripts/setup-db.js "postgresql://postgres.[REF]:[PASSWORD]@aws-0-[REGION].pooler.supabase.com:6543/postgres"\n');
    console.log('You can find this connection string in your Supabase Dashboard:');
    console.log('  Project Settings > Database > Connection String (URI / Nodejs / Pooler)\n');
    process.exit(1);
  }

  console.log('\n======================================================');
  console.log('🚀 AEROLUX — AUTOMATED SUPABASE DATABASE SETUP');
  console.log('======================================================\n');
  console.log('Connecting to PostgreSQL database...');

  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false },
  });

  try {
    await client.connect();
    console.log('✅ Connected successfully to Supabase PostgreSQL database.\n');

    // 1. Run Schema
    const schemaPath = path.resolve(__dirname, '../supabase/schema.sql');
    console.log(`📄 Executing schema: ${schemaPath}...`);
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    await client.query(schemaSql);
    console.log('✅ Schema executed successfully: Tables, Triggers, Functions & RLS configured.\n');

    // 2. Run Seed
    const seedPath = path.resolve(__dirname, '../supabase/seed.sql');
    console.log(`🌱 Executing seed data: ${seedPath}...`);
    const seedSql = fs.readFileSync(seedPath, 'utf8');
    await client.query(seedSql);
    console.log('✅ Seed data inserted successfully.\n');

    // 3. Verification Queries
    console.log('🔍 Verifying database installation...');
    const citiesCount = await client.query('SELECT count(*) FROM public.cities');
    const jetsCount = await client.query('SELECT count(*) FROM public.jets');
    const triggersCount = await client.query(`
      SELECT count(*) FROM information_schema.triggers 
      WHERE trigger_name IN ('on_auth_user_created', 'trg_validate_and_calculate_booking')
    `);

    console.log('------------------------------------------------------');
    console.log(`  ✈️  Cities in Route Network : ${citiesCount.rows[0].count} cities seeded`);
    console.log(`  🛩️  Active Aircraft in Fleet : ${jetsCount.rows[0].count} private jets ready`);
    console.log(`  🛡️  Automated DB Triggers   : ${triggersCount.rows[0].count} triggers operational`);
    console.log('------------------------------------------------------\n');
    console.log('🎉 SUPABASE SETUP COMPLETE! AeroLux database is 100% operational.\n');

  } catch (err) {
    console.error('\n❌ Setup error:', err.message);
    process.exit(1);
  } finally {
    await client.end();
  }
}

runSetup();
