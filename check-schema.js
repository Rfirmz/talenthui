const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://xoazqxmfxsxyqnakzkab.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseServiceKey) {
  console.log('❌ SUPABASE_SERVICE_KEY not found');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkSchema() {
  console.log('🔍 Checking database schema...\n');
  
  try {
    // Try to get one row to see what columns exist
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.log('❌ Error:', error.message);
      return;
    }
    
    if (data && data.length > 0) {
      console.log('✅ Found existing columns:');
      console.log('─────────────────────────────');
      Object.keys(data[0]).forEach(col => {
        console.log(`  • ${col}`);
      });
      console.log('\n');
    } else {
      console.log('⚠️  Table is empty, trying to detect columns...\n');
      
      // Try inserting a test row to see what columns are accepted
      const testProfile = {
        username: 'test-user-temp-' + Date.now(),
        full_name: 'Test User',
        visibility: false
      };
      
      const { data: inserted, error: insertError } = await supabase
        .from('profiles')
        .insert(testProfile)
        .select();
      
      if (insertError) {
        console.log('❌ Cannot determine schema:', insertError.message);
      } else if (inserted && inserted.length > 0) {
        console.log('✅ Detected columns:');
        console.log('─────────────────────────────');
        Object.keys(inserted[0]).forEach(col => {
          console.log(`  • ${col}`);
        });
        
        // Clean up test row
        await supabase
          .from('profiles')
          .delete()
          .eq('username', testProfile.username);
        
        console.log('\n(Test row cleaned up)');
      }
    }
    
    console.log('\n💡 Did you run the database migration?');
    console.log('If not, go to Supabase Dashboard → SQL Editor');
    console.log('and run the contents of supabase-setup.sql\n');
    
  } catch (err) {
    console.log('❌ Unexpected error:', err.message);
  }
}

checkSchema();

