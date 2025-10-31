const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function generateBio(title, company, school, island) {
  const templates = [
    `${title} at ${company}. ${school} alumni based in ${island}.`,
    `Experienced ${title} working at ${company}. Graduated from ${school}.`,
    `${school} graduate working as ${title} at ${company} in ${island}.`,
    `Professional ${title} at ${company}. Proud ${school} alumni.`,
    `${title} based in ${island}, currently with ${company}. ${school} graduate.`,
    `${company} ${title} | ${school} Alumni | ${island} Based`,
    `${title} bringing expertise to ${company}. ${school} alumnus/a in ${island}.`,
  ];
  
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  return template
    .replace(/at\s+null/g, '')
    .replace(/null\s+/g, '')
    .replace(/\s+\./g, '.')
    .replace(/\.\s+\./g, '.')
    .replace(/\|\s+null/g, '')
    .replace(/null\s+\|/g, '')
    .trim();
}

async function addBios() {
  console.log('🚀 Adding bios to existing profiles...\n');
  
  try {
    // Get all profiles without bios
    const { data: profiles, error } = await supabase
      .from('profiles')
      .select('id, full_name, current_title, company, school, island, bio')
      .or('bio.is.null,bio.eq.');
    
    if (error) {
      console.error('❌ Error fetching profiles:', error);
      return;
    }
    
    if (!profiles || profiles.length === 0) {
      console.log('✅ All profiles already have bios!');
      return;
    }
    
    console.log(`📊 Found ${profiles.length} profiles without bios\n`);
    
    let updated = 0;
    
    // Update in batches
    for (const profile of profiles) {
      const title = profile.current_title || 'Professional';
      const company = profile.company || 'Hawaii Tech';
      const school = profile.school || 'University';
      const island = profile.island || 'Hawaii';
      
      const bio = generateBio(title, company, school, island);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ bio })
        .eq('id', profile.id);
      
      if (updateError) {
        console.error(`❌ Error updating ${profile.full_name}:`, updateError.message);
      } else {
        updated++;
        if (updated % 50 === 0) {
          console.log(`✓ Updated ${updated}/${profiles.length} profiles...`);
        }
      }
    }
    
    console.log(`\n✅ Successfully updated ${updated} profiles with bios!`);
    console.log(`🔗 Visit http://localhost:3000/profiles to see the changes\n`);
    
  } catch (err) {
    console.error('❌ Unexpected error:', err);
  }
}

addBios().then(() => {
  process.exit(0);
});

