// Quick setup checker for TalentHui

console.log('🔍 Checking TalentHui Setup...\n');

// Check environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

let hasIssues = false;

console.log('📋 Environment Variables:');
console.log('─────────────────────────────────────');

if (supabaseUrl) {
  console.log('✅ NEXT_PUBLIC_SUPABASE_URL is set');
} else {
  console.log('❌ NEXT_PUBLIC_SUPABASE_URL is missing');
  hasIssues = true;
}

if (supabaseAnonKey) {
  console.log('✅ NEXT_PUBLIC_SUPABASE_ANON_KEY is set');
} else {
  console.log('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY is missing');
  hasIssues = true;
}

if (supabaseServiceKey) {
  console.log('✅ SUPABASE_SERVICE_KEY is set');
} else {
  console.log('❌ SUPABASE_SERVICE_KEY is missing');
  hasIssues = true;
}

console.log('\n');

if (hasIssues) {
  console.log('⚠️  Issues Found!\n');
  console.log('Next steps:');
  console.log('1. Create a Supabase project at https://supabase.com');
  console.log('2. Create a .env.local file in the project root');
  console.log('3. Add the following to .env.local:\n');
  console.log('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url');
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key');
  console.log('SUPABASE_SERVICE_KEY=your_service_key');
  console.log('NEXT_PUBLIC_ADMIN_PASSWORD=talenthui2024\n');
  console.log('Get your keys from: Supabase Dashboard → Settings → API\n');
  process.exit(1);
}

// Test Supabase connection
console.log('🔌 Testing Supabase Connection...');
console.log('─────────────────────────────────────');

const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkConnection() {
  try {
    // Try to query the profiles table
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      if (error.code === '42P01') {
        console.log('⚠️  Profiles table does not exist');
        console.log('\nNext step:');
        console.log('1. Go to your Supabase Dashboard → SQL Editor');
        console.log('2. Create a new query');
        console.log('3. Copy the entire contents of supabase-setup.sql');
        console.log('4. Paste and click "Run"');
        console.log('5. Run this check again\n');
        return false;
      } else {
        console.log('❌ Error connecting to Supabase:', error.message);
        return false;
      }
    }
    
    console.log('✅ Successfully connected to Supabase');
    console.log(`✅ Profiles table exists (${count || 0} profiles currently)\n`);
    
    if (count === 0) {
      console.log('📊 Database is ready but empty');
      console.log('\nNext step - Import candidates:');
      console.log('node scripts/import-candidates.js "/Users/rafaelfirme/Downloads/Talent Hui Database - Consolidated (Mat).csv" 1000\n');
    } else {
      console.log('🎉 Setup complete! You have data in your database.\n');
      console.log('If profiles aren\'t showing on the website:');
      console.log('1. Make sure your dev server is running: npm run dev');
      console.log('2. Visit http://localhost:3000/profiles');
      console.log('3. Check browser console for errors\n');
    }
    
    return true;
  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
    return false;
  }
}

checkConnection().then(success => {
  if (success) {
    console.log('✅ All checks passed!\n');
  }
  process.exit(success ? 0 : 1);
});

