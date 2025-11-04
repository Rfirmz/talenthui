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

async function deleteProfile(fullName) {
  try {
    console.log(`🔍 Searching for profile: "${fullName}"...`);
    
    // First, find the profile
    const { data: profiles, error: searchError } = await supabase
      .from('profiles')
      .select('id, full_name, email')
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

    if (profiles.length > 1) {
      console.log(`⚠️  Found ${profiles.length} profiles matching "${fullName}":`);
      profiles.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.full_name} - ${p.email || 'no email'} - ID: ${p.id}`);
      });
      console.log(`\n❌ Multiple matches found. Please be more specific or delete by ID.`);
      return;
    }

    const profile = profiles[0];
    console.log(`\n📋 Found profile:`);
    console.log(`   ID: ${profile.id}`);
    console.log(`   Name: ${profile.full_name}`);
    console.log(`   Email: ${profile.email || 'N/A'}`);

    // Delete the profile
    console.log(`\n🗑️  Deleting profile...`);
    const { error: deleteError } = await supabase
      .from('profiles')
      .delete()
      .eq('id', profile.id);

    if (deleteError) {
      console.error('❌ Error deleting profile:', deleteError);
      return;
    }

    console.log(`✅ Successfully deleted profile: "${profile.full_name}"`);
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Get the name from command line arguments
const fullName = process.argv[2] || 'Rafael Firme';

console.log('🚀 Starting profile deletion...\n');
deleteProfile(fullName).then(() => {
  console.log('\n✨ Done!');
  process.exit(0);
});

