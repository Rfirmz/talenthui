const fs = require('fs');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

function parseLocation(location) {
  if (!location) return { city: null, island: null };
  
  const parts = location.split(',').map(p => p.trim());
  const city = parts[0] || null;
  
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
  
  const island = city ? islandMap[city] || null : null;
  return { city, island };
}

function parseSchool(educationString) {
  if (!educationString || educationString === 'N/A') return null;
  const schools = educationString.split(',').map(s => s.trim()).filter(s => s.length > 0);
  return schools[0] || null; // Return first school
}

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
  
  // Pick a random template
  const template = templates[Math.floor(Math.random() * templates.length)];
  
  // Clean up the template if any values are missing
  return template
    .replace(/at\s+null/g, '')
    .replace(/null\s+/g, '')
    .replace(/\s+\./g, '.')
    .replace(/\.\s+\./g, '.')
    .replace(/\|\s+null/g, '')
    .replace(/null\s+\|/g, '')
    .trim();
}

async function importCandidates(csvPath, limit = 1000) {
  const candidates = [];
  let count = 0;

  console.log(`🚀 TalentHui Import - Matching Your Database Schema\n`);
  console.log(`📂 Reading: ${csvPath}`);
  console.log(`🎯 Limit: ${limit} candidates\n`);

  return new Promise((resolve, reject) => {
    fs.createReadStream(csvPath)
      .pipe(csv())
      .on('data', (row) => {
        if (count >= limit) return;
        
        const location = parseLocation(row['Location']);
        
        // Only import Hawaii-based candidates
        if (location.island) {
          const firstName = row['First name'] || '';
          const lastName = row['Last name'] || '';
          const fullName = `${firstName} ${lastName}`.trim();
          
          if (!fullName) return; // Skip if no name
          
          const title = row['Current Title'] || 'Professional';
          const company = row['Current Org Name'] || 'Hawaii Tech';
          const school = parseSchool(row['Education']) || 'University';
          const island = location.island || 'Hawaii';
          
          // Match EXACT columns from your database
          const candidate = {
            full_name: fullName,
            current_title: title,
            company: company,  // Note: company not current_company!
            email: row['Personal Email'] || row['Work Email'] || null,
            city: location.city,
            island: location.island,
            school: school === 'University' ? null : school,
            linkedin_url: row['LinkedIn'] || null,
            github_url: row['GitHub'] || null,
            twitter_url: row['X'] || null,
            bio: generateBio(title, company, school, island),
            avatar_url: '/avatars/placeholder.svg',
            pay_band: 0, // Default to unemployed for imported profiles
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
        console.log(`\n📊 Total Hawaii candidates: ${candidates.length}\n`);
        
        if (candidates.length === 0) {
          console.log('⚠️  No candidates found with Hawaii locations');
          resolve(0);
          return;
        }
        
        try {
          const batchSize = 50; // Smaller batches
          let imported = 0;
          let skipped = 0;
          
          for (let i = 0; i < candidates.length; i += batchSize) {
            const batch = candidates.slice(i, i + batchSize);
            
            const { data, error } = await supabase
              .from('profiles')
              .insert(batch)
              .select();
            
            if (error) {
              // Check if it's a duplicate error
              if (error.code === '23505') {
                skipped += batch.length;
                console.log(`⚠️  Batch ${Math.floor(i / batchSize) + 1}: Duplicates skipped`);
              } else {
                console.error(`❌ Batch ${Math.floor(i / batchSize) + 1} error:`, error.message);
              }
            } else {
              const count = data ? data.length : batch.length;
              imported += count;
              console.log(`✅ Batch ${Math.floor(i / batchSize) + 1}: ${count} candidates imported`);
            }
          }
          
          console.log(`\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━`);
          console.log(`✅ Successfully imported: ${imported} candidates`);
          if (skipped > 0) {
            console.log(`⚠️  Skipped (duplicates): ${skipped}`);
          }
          console.log(`━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n`);
          console.log(`🎉 Visit: http://localhost:3000/profiles\n`);
          
          resolve(imported);
        } catch (error) {
          console.error('❌ Import error:', error);
          reject(error);
        }
      })
      .on('error', (error) => {
        console.error('❌ CSV read error:', error);
        reject(error);
      });
  });
}

const csvPath = process.argv[2] || '/Users/rafaelfirme/Downloads/Talent Hui Database - Consolidated (Mat).csv';
const limit = parseInt(process.argv[3]) || 1000;

importCandidates(csvPath, limit)
  .then((count) => {
    if (count > 0) {
      console.log('🚀 Import complete! Start your dev server:');
      console.log('   npm run dev\n');
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Import failed:', error.message);
    process.exit(1);
  });

