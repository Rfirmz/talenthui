// Test Supabase connection with current credentials

const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://xoazqxmfxsxyqnakzkab.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhvYXpxeG1meHN4eXFuYWt6a2FiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA5OTc1NTQsImV4cCI6MjA3NjU3MzU1NH0.AdBnbFB4sFpFUGXgqhwyrtoYS5cS57l8fM59AFWcGMs';

console.log('🔍 Testing Supabase Connection...\n');

const supabase = createClient(supabaseUrl, supabaseAnonKey);

async function testConnection() {
  try {
    console.log('📡 Connecting to:', supabaseUrl);
    
    // Test connection by querying profiles table
    const { data, error, count } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true });
    
    if (error) {
      if (error.code === '42P01') {
        console.log('❌ Profiles table does NOT exist\n');
        console.log('You need to run the database migration!');
        console.log('\nSteps:');
        console.log('1. Go to: https://xoazqxmfxsxyqnakzkab.supabase.co');
        console.log('2. Click "SQL Editor" in left sidebar');
        console.log('3. Click "New Query"');
        console.log('4. Copy all contents from: supabase-setup.sql');
        console.log('5. Paste and click "Run"\n');
        return false;
      } else {
        console.log('❌ Error:', error.message);
        console.log('Code:', error.code);
        console.log('\nThis might be a permissions issue.\n');
        return false;
      }
    }
    
    console.log('✅ Connection successful!');
    console.log('✅ Profiles table exists');
    console.log(`📊 Current profile count: ${count || 0}\n`);
    
    if (count === 0) {
      console.log('⚠️  Table is empty - you need to import candidates\n');
      console.log('BUT FIRST - Add your SERVICE_ROLE key to .env.local:');
      console.log('\n1. Go to: https://xoazqxmfxsxyqnakzkab.supabase.co');
      console.log('2. Click Settings → API');
      console.log('3. Under "Project API keys" find "service_role"');
      console.log('4. Click "Reveal" to see the key');
      console.log('5. Add to .env.local:');
      console.log('   SUPABASE_SERVICE_KEY=your_service_role_key_here\n');
    } else {
      console.log('🎉 You already have data! Check if it displays at:');
      console.log('   http://localhost:3000/profiles\n');
    }
    
    return true;
    
  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
    return false;
  }
}

testConnection().then(() => {
  process.exit(0);
});

