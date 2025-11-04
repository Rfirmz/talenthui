const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
function loadEnvFile() {
  const envPath = path.join(__dirname, '..', '.env.local');
  if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf8');
    envContent.split('\n').forEach(line => {
      const match = line.match(/^([^=]+)=(.*)$/);
      if (match) {
        const key = match[1].trim();
        const value = match[2].trim().replace(/^["']|["']$/g, '');
        process.env[key] = value;
      }
    });
  }
}

loadEnvFile();

// Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function runMigration() {
  try {
    console.log('🚀 Running migration to add education and location fields...\n');
    
    // Read the migration file
    const migrationPath = path.join(__dirname, '..', 'migration-add-education-location-fields.sql');
    if (!fs.existsSync(migrationPath)) {
      console.error('❌ Migration file not found:', migrationPath);
      process.exit(1);
    }
    
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration using Supabase RPC (if available) or direct SQL
    // Note: Supabase JS client doesn't support arbitrary SQL execution
    // This is a guide - you'll need to run it in the Supabase SQL Editor
    
    console.log('⚠️  Note: The Supabase JS client cannot execute arbitrary SQL.');
    console.log('📝 Please run the following SQL in your Supabase SQL Editor:\n');
    console.log('─'.repeat(60));
    console.log(migrationSQL);
    console.log('─'.repeat(60));
    console.log('\n📋 Steps:');
    console.log('1. Go to your Supabase Dashboard');
    console.log('2. Navigate to SQL Editor');
    console.log('3. Copy and paste the SQL above');
    console.log('4. Click "Run" to execute the migration\n');
    
    // Try to verify if columns exist
    console.log('🔍 Checking if columns already exist...\n');
    const { data, error } = await supabase
      .from('profiles')
      .select('id')
      .limit(1);
    
    if (error && error.message.includes('column') && error.message.includes('does not exist')) {
      console.log('❌ Confirmed: Database is missing required columns.');
      console.log('   You MUST run the migration SQL above.\n');
    } else if (!error) {
      // Try to check if columns exist by attempting a select
      const testQuery = await supabase
        .from('profiles')
        .select('college, high_school, current_city, hometown')
        .limit(1);
      
      if (testQuery.error && testQuery.error.message.includes('college')) {
        console.log('❌ The "college" column is missing.');
        console.log('   You MUST run the migration SQL above.\n');
      } else if (testQuery.error && testQuery.error.message.includes('column')) {
        console.log('❌ Some columns are missing.');
        console.log('   You MUST run the migration SQL above.\n');
      } else {
        console.log('✅ Columns appear to exist. Migration may have already been run.');
        console.log('   If you\'re still seeing errors, try refreshing your browser.\n');
      }
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

runMigration().then(() => {
  process.exit(0);
});

