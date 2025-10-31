const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

// Supabase credentials
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to parse location
function parseLocation(location) {
  if (!location) return { city: null, state: null, island: null };
  
  const parts = location.split(',').map(p => p.trim());
  const city = parts[0] || null;
  const state = parts[1] || null;
  
  const islandMap = {
    'Honolulu': 'Oahu', 'Aiea': 'Oahu', 'Pearl City': 'Oahu', 'Kaneohe': 'Oahu',
    'Kailua': 'Oahu', 'Mililani': 'Oahu', 'Mililani Town': 'Oahu', 'Waipahu': 'Oahu',
    'Ewa Beach': 'Oahu', 'Kapolei': 'Oahu', 'Waianae': 'Oahu', 'Haleiwa': 'Oahu',
    'Hilo': 'Big Island', 'Kailua-Kona': 'Big Island', 'Kona': 'Big Island',
    'Waimea': 'Big Island', 'Holualoa': 'Big Island',
    'Kahului': 'Maui', 'Wailuku': 'Maui', 'Kihei': 'Maui', 'Lahaina': 'Maui', 'Makawao': 'Maui',
    'Lihue': 'Kauai', 'Kapaa': 'Kauai', 'Kilauea': 'Kauai', 'Hanalei': 'Kauai',
    'Kaunakakai': 'Molokai', 'Lanai City': 'Lanai'
  };
  
  let island = null;
  if (city) {
    island = islandMap[city] || null;
  }
  
  return { city, state, island };
}

function createUsername(firstName, lastName) {
  if (!firstName || !lastName) return null;
  return `${firstName.toLowerCase()}-${lastName.toLowerCase()}`
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 50);
}

function parseSkills(skillsString) {
  if (!skillsString || skillsString === 'N/A') return [];
  return skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0);
}

async function importCandidates(csvPath, limit = 1000) {
  const candidates = [];
  let count = 0;

  console.log(`🚀 TalentHui Simple Import\n`);
  console.log(`📂 Reading CSV from: ${csvPath}`);
  console.log(`🎯 Importing up to ${limit} candidates...\n`);

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        if (count >= limit) return;
        
        const location = parseLocation(row['Location']);
        const skills = parseSkills(row['Skills']);
        
        if (location.state === 'Hawaii' || location.island) {
          const firstName = row['First name'] || '';
          const lastName = row['Last name'] || '';
          const fullName = `${firstName} ${lastName}`.trim();
          
          // ONLY include fields that definitely exist in the database
          const candidate = {
            // Basic info
            first_name: firstName || null,
            last_name: lastName || null,
            full_name: fullName || null,
            username: createUsername(firstName, lastName),
            
            // Professional info
            current_title: row['Current Title'] || null,
            current_company: row['Current Org Name'] || null,
            
            // Location
            city: location.city,
            island: location.island,
            
            // Social links
            linkedin_url: row['LinkedIn'] || null,
            github_url: row['GitHub'] || null,
            
            // Skills
            skills: skills.length > 0 ? skills : null,
            
            // UI fields
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
              console.error(`❌ Error importing batch ${i / batchSize + 1}:`, error.message);
            } else {
              imported += batch.length;
              console.log(`✓ Imported batch ${Math.floor(i / batchSize) + 1} (${imported}/${candidates.length})`);
            }
          }
          
          console.log(`\n✅ Successfully imported ${imported} candidates to Supabase!`);
          console.log(`🔗 View them at http://localhost:3000/profiles\n`);
          
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

const csvPath = process.argv[2] || '/Users/rafaelfirme/Downloads/Talent Hui Database - Consolidated (Mat).csv';
const limit = parseInt(process.argv[3]) || 1000;

importCandidates(csvPath, limit)
  .then(() => {
    console.log('✅ Import completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  });

