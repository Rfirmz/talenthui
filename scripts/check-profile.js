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
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkProfile(fullName) {
  try {
    console.log(`🔍 Searching for profile: "${fullName}"...\n`);
    
    // Search for the profile - select all fields first to see what exists
    const { data: profiles, error: searchError } = await supabase
      .from('profiles')
      .select('*')
      .ilike('full_name', `%${fullName}%`)
      .limit(10);

    if (searchError) {
      console.error('❌ Error searching for profile:', searchError);
      return;
    }

    if (!profiles || profiles.length === 0) {
      console.log(`❌ No profile found with name "${fullName}"`);
      return;
    }

    console.log(`✅ Found ${profiles.length} profile(s) matching "${fullName}":\n`);
    profiles.forEach((p, i) => {
      console.log(`${i + 1}. Profile Details:`);
      console.log(`   ID: ${p.id}`);
      console.log(`   Name: ${p.full_name || 'N/A'}`);
      console.log(`   Email: ${p.email || 'N/A'}`);
      console.log(`   Title: ${p.current_title || 'N/A'}`);
      console.log(`   Company: ${p.current_company || p.company || 'N/A'}`);
      console.log(`   Location: ${[p.current_city, p.city, p.island].filter(Boolean).join(', ') || 'N/A'}`);
      console.log(`   School: ${p.school || p.college || 'N/A'}`);
      console.log(`   Created: ${p.created_at ? new Date(p.created_at).toLocaleString() : 'N/A'}`);
      console.log('');
    });
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Get the name from command line arguments
const fullName = process.argv[2] || 'Rafael Firme';

checkProfile(fullName).then(() => {
  process.exit(0);
});

