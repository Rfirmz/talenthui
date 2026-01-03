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

async function deleteProfileByEmail(email) {
  try {
    console.log(`🔍 Searching for profile with email: "${email}"...`);
    
    // First, find the profile by email
    const { data: profiles, error: searchError } = await supabase
      .from('profiles')
      .select('id, full_name, email, avatar_url')
      .ilike('email', email)
      .limit(10);

    if (searchError) {
      console.error('❌ Error searching for profile:', searchError);
      return;
    }

    if (!profiles || profiles.length === 0) {
      console.log(`❌ No profile found with email "${email}"`);
      return;
    }

    // Filter for profiles with no avatar (placeholder or empty)
    const profilesWithoutAvatar = profiles.filter(p => 
      !p.avatar_url || 
      p.avatar_url === '/avatars/placeholder.svg' || 
      p.avatar_url.includes('placeholder')
    );

    if (profilesWithoutAvatar.length === 0) {
      console.log(`⚠️  Found ${profiles.length} profile(s) with email "${email}", but all have profile pictures.`);
      profiles.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.full_name} - Avatar: ${p.avatar_url || 'none'}`);
      });
      return;
    }

    if (profilesWithoutAvatar.length > 1) {
      console.log(`⚠️  Found ${profilesWithoutAvatar.length} profiles matching email "${email}" without profile pictures:`);
      profilesWithoutAvatar.forEach((p, i) => {
        console.log(`   ${i + 1}. ${p.full_name} - ID: ${p.id} - Avatar: ${p.avatar_url || 'none'}`);
      });
      console.log(`\n❌ Multiple matches found. Please delete by ID.`);
      return;
    }

    const profile = profilesWithoutAvatar[0];
    console.log(`\n📋 Found profile without avatar:`);
    console.log(`   ID: ${profile.id}`);
    console.log(`   Name: ${profile.full_name}`);
    console.log(`   Email: ${profile.email}`);
    console.log(`   Avatar: ${profile.avatar_url || 'none'}`);

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

    console.log(`✅ Successfully deleted profile: "${profile.full_name}" (${profile.email})`);
  } catch (error) {
    console.error('❌ Unexpected error:', error);
  }
}

// Get the email from command line arguments
const email = process.argv[2] || 'austiny808@gmail.com';

console.log('🚀 Starting profile deletion by email...\n');
deleteProfileByEmail(email).then(() => {
  console.log('\n✨ Done!');
  process.exit(0);
});


