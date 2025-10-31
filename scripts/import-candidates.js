const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials (will use env variables)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY; // Service role key for admin operations

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to parse location
function parseLocation(location) {
  if (!location) return { city: null, state: null, island: null };
  
  const parts = location.split(',').map(p => p.trim());
  const city = parts[0] || null;
  const state = parts[1] || null;
  
  // Map cities to islands
  const islandMap = {
    'Honolulu': 'Oahu',
    'Aiea': 'Oahu',
    'Pearl City': 'Oahu',
    'Kaneohe': 'Oahu',
    'Kailua': 'Oahu',
    'Mililani': 'Oahu',
    'Mililani Town': 'Oahu',
    'Waipahu': 'Oahu',
    'Ewa Beach': 'Oahu',
    'Kapolei': 'Oahu',
    'Waianae': 'Oahu',
    'Haleiwa': 'Oahu',
    'Hilo': 'Big Island',
    'Kailua-Kona': 'Big Island',
    'Kona': 'Big Island',
    'Waimea': 'Big Island',
    'Holualoa': 'Big Island',
    'Kahului': 'Maui',
    'Wailuku': 'Maui',
    'Kihei': 'Maui',
    'Lahaina': 'Maui',
    'Makawao': 'Maui',
    'Lihue': 'Kauai',
    'Kapaa': 'Kauai',
    'Kilauea': 'Kauai',
    'Hanalei': 'Kauai',
    'Kaunakakai': 'Molokai',
    'Lanai City': 'Lanai'
  };
  
  let island = null;
  if (city) {
    island = islandMap[city] || null;
  }
  
  return { city, state, island };
}

// Helper to create username from name
function createUsername(firstName, lastName) {
  if (!firstName || !lastName) return null;
  return `${firstName.toLowerCase()}-${lastName.toLowerCase()}`
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 50);
}

// Helper to parse skills from comma-separated string
function parseSkills(skillsString) {
  if (!skillsString || skillsString === 'N/A') return [];
  return skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0);
}

// Helper to parse education array
function parseEducation(educationString) {
  if (!educationString || educationString === 'N/A') return [];
  return educationString.split(',').map(s => s.trim()).filter(s => s.length > 0);
}

// Helper to calculate years of experience (rough estimate based on skills count)
function estimateYearsExperience(skills) {
  if (!skills || skills.length === 0) return 0;
  // Rough heuristic: more skills often correlate with more experience
  if (skills.length > 20) return 8;
  if (skills.length > 15) return 6;
  if (skills.length > 10) return 4;
  if (skills.length > 5) return 2;
  return 1;
}

async function importCandidates(csvPath, limit = 1000) {
  const candidates = [];
  let count = 0;

  console.log(`📂 Reading CSV from: ${csvPath}`);
  console.log(`🎯 Importing up to ${limit} candidates...\n`);

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        if (count >= limit) return;
        
        const location = parseLocation(row['Location']);
        const skills = parseSkills(row['Skills']);
        const education = parseEducation(row['Education']);
        const educationWebsites = parseEducation(row['Education Website']);
        const educationLinkedin = parseEducation(row['Education LinkedIn']);
        
        // Only import if we have Hawaii location
        if (location.state === 'Hawaii' || location.island) {
          const firstName = row['First name'] || '';
          const lastName = row['Last name'] || '';
          const fullName = `${firstName} ${lastName}`.trim();
          
          const candidate = {
            first_name: firstName || null,
            last_name: lastName || null,
            full_name: fullName || null,
            username: createUsername(firstName, lastName),
            email: row['Personal Email'] || row['Work Email'] || null,
            personal_email: row['Personal Email'] || null,
            work_email: row['Work Email'] || null,
            phone: row['Phone Numbers'] || null,
            
            current_title: row['Current Title'] || null,
            current_company: row['Current Org Name'] || null,
            company_location: row['Current Org Location'] || null,
            company_address: row['Current Org Street Address'] || null,
            company_website: row['Current Org Website'] || null,
            company_linkedin: row['Current Org LinkedIn'] || null,
            
            country: row['Country'] || 'United States',
            state: location.state || 'Hawaii',
            city: location.city,
            island: location.island,
            location: row['Location'] || null,
            
            school: education[0] || null, // Primary school
            education: education.length > 0 ? education : null,
            education_websites: educationWebsites.length > 0 ? educationWebsites : null,
            education_linkedin: educationLinkedin.length > 0 ? educationLinkedin : null,
            
            skills: skills.length > 0 ? skills : null,
            years_experience: estimateYearsExperience(skills),
            
            linkedin_url: row['LinkedIn'] || null,
            github_url: row['GitHub'] || null,
            twitter_url: row['X'] || null,
            
            bio: null, // Will be filled in by users
            avatar_url: '/avatars/placeholder.svg',
            visibility: true,
          };
          
          candidates.push(candidate);
          count++;
          
          if (count % 100 === 0) {
            console.log(`✓ Processed ${count} candidates...`);
          }
        }
      })
      .on('end', async () => {
        console.log(`\n📊 Total candidates to import: ${candidates.length}\n`);
        
        try {
          // Insert in batches of 100
          const batchSize = 100;
          let imported = 0;
          
          for (let i = 0; i < candidates.length; i += batchSize) {
            const batch = candidates.slice(i, i + batchSize);
            
            const { data, error } = await supabase
              .from('profiles')
              .upsert(batch, { 
                onConflict: 'username',
                ignoreDuplicates: false 
              });
            
            if (error) {
              console.error(`❌ Error importing batch ${i / batchSize + 1}:`, error);
            } else {
              imported += batch.length;
              console.log(`✓ Imported batch ${Math.floor(i / batchSize) + 1} (${imported}/${candidates.length})`);
            }
          }
          
          console.log(`\n✅ Successfully imported ${imported} candidates to Supabase!`);
          console.log(`🔗 View them at your Supabase dashboard or /profiles page\n`);
          
          resolve(imported);
        } catch (error) {
          console.error('❌ Error during import:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('❌ Error reading CSV:', error);
        reject(error);
      });
  });
}

// Main execution
const csvPath = process.argv[2] || '/Users/rafaelfirme/Downloads/Talent Hui Database - Consolidated (Mat).csv';
const limit = parseInt(process.argv[3]) || 1000;

console.log('🚀 TalentHui Candidate Import Script\n');
console.log('═══════════════════════════════════════════\n');

importCandidates(csvPath, limit)
  .then(() => {
    console.log('✅ Import completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  });

