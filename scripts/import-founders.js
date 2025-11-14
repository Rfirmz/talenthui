const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local if it exists
const envPath = path.join(__dirname, '..', '.env.local');
if (fs.existsSync(envPath)) {
  const envFile = fs.readFileSync(envPath, 'utf8');
  envFile.split('\n').forEach(line => {
    const match = line.match(/^([^=:#]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim().replace(/^["']|["']$/g, '');
      if (!process.env[key]) {
        process.env[key] = value;
      }
    }
  });
}

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
    'Kula': 'Maui',
    'Waimanalo': 'Oahu',
    'Honokaa': 'Big Island',
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

// Helper to parse education websites
function parseEducationWebsites(educationWebsiteString) {
  if (!educationWebsiteString || educationWebsiteString === 'N/A') return [];
  return educationWebsiteString.split(',').map(s => s.trim()).filter(s => s.length > 0 && s !== 'N/A');
}

// Helper to parse education LinkedIn
function parseEducationLinkedin(educationLinkedinString) {
  if (!educationLinkedinString || educationLinkedinString === 'N/A') return [];
  return educationLinkedinString.split(',').map(s => s.trim()).filter(s => s.length > 0 && s !== 'N/A');
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

// Helper to normalize LinkedIn URL for duplicate detection
function normalizeLinkedInUrl(url) {
  if (!url) return null;
  // Remove trailing slashes and normalize
  return url.trim().toLowerCase().replace(/\/$/, '');
}

// Helper to normalize email for duplicate detection
function normalizeEmail(email) {
  if (!email) return null;
  return email.trim().toLowerCase();
}

// Read and parse CSV file
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const candidates = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const location = parseLocation(row['Location']);
        const skills = parseSkills(row['Skills']);
        const education = parseEducation(row['Education']);
        const educationWebsites = parseEducationWebsites(row['Education Website'] || '');
        const educationLinkedin = parseEducationLinkedin(row['Education LinkedIn'] || '');
        
        const firstName = row['First name'] || '';
        const lastName = row['Last name'] || '';
        const fullName = `${firstName} ${lastName}`.trim();
        
        if (!firstName || !lastName) {
          return; // Skip rows without names
        }
        
        const linkedinUrl = row['LinkedIn'] || null;
        const personalEmail = row['Personal Email'] || null;
        const workEmail = row['Work Email'] || null;
        const email = personalEmail || workEmail || null;
        
        const candidate = {
          full_name: fullName,
          email: email,
          
          current_title: row['Current Title'] || null,
          current_company: row['Current Org Name'] || null,
          company: row['Current Org Name'] || null, // Also set company for compatibility
          
          city: location.city,
          current_city: location.city,
          island: location.island,
          
          school: education[0] || null, // Primary school
          college: education.length > 1 ? education[1] : null, // Second school as college
          
          linkedin_url: linkedinUrl,
          github_url: row['GitHub'] || null,
          twitter_url: row['X'] || null,
          
          bio: null, // Will be filled in by users
          avatar_url: '/avatars/placeholder.svg',
          visibility: true,
          
          // For duplicate detection
          _linkedin_normalized: normalizeLinkedInUrl(linkedinUrl),
          _email_normalized: normalizeEmail(email),
        };
        
        candidates.push(candidate);
      })
      .on('end', () => {
        console.log(`✓ Read ${candidates.length} candidates from ${filePath}`);
        resolve(candidates);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Remove duplicates based on LinkedIn URL or email
function removeDuplicates(candidates) {
  const seen = new Map();
  const unique = [];
  let duplicatesRemoved = 0;
  
  for (const candidate of candidates) {
    // Check for duplicates by LinkedIn URL first, then email, then full name
    const key = candidate._linkedin_normalized || candidate._email_normalized || candidate.full_name?.toLowerCase();
    
    if (!key) {
      duplicatesRemoved++;
      continue;
    }
    
    if (!seen.has(key)) {
      seen.set(key, true);
      delete candidate._linkedin_normalized;
      delete candidate._email_normalized;
      unique.push(candidate);
    } else {
      duplicatesRemoved++;
    }
  }
  
  console.log(`✓ Removed ${duplicatesRemoved} duplicates`);
  return unique;
}

async function importFounders() {
  const csvPath1 = '/Users/rafaelfirme/Downloads/Hawaii Tech Founders & CEOs part 1.csv';
  const csvPath2 = '/Users/rafaelfirme/Downloads/Hawaii Tech Founders & CEOs part 2.csv';
  
  console.log('🚀 TalentHui Founders Import Script\n');
  console.log('═══════════════════════════════════════════\n');
  
  try {
    // Read both CSV files
    console.log('📂 Reading CSV files...\n');
    const [candidates1, candidates2] = await Promise.all([
      readCSV(csvPath1),
      readCSV(csvPath2)
    ]);
    
    // Combine and remove duplicates
    console.log('\n🔄 Combining and removing duplicates...\n');
    const allCandidates = [...candidates1, ...candidates2];
    const uniqueCandidates = removeDuplicates(allCandidates);
    
    console.log(`\n📊 Total unique candidates to import: ${uniqueCandidates.length}\n`);
    
    if (uniqueCandidates.length === 0) {
      console.log('❌ No candidates to import');
      return;
    }
    
    // Insert in batches of 100
    const batchSize = 100;
    let imported = 0;
    
    for (let i = 0; i < uniqueCandidates.length; i += batchSize) {
      const batch = uniqueCandidates.slice(i, i + batchSize);
      
      // Check for existing profiles by email or LinkedIn URL to avoid duplicates
      const emails = batch.map(c => c.email).filter(Boolean);
      const linkedinUrls = batch.map(c => c.linkedin_url).filter(Boolean);
      
      // Query existing profiles
      let existingProfiles = [];
      if (emails.length > 0 || linkedinUrls.length > 0) {
        let query = supabase.from('profiles').select('email, linkedin_url');
        if (emails.length > 0) {
          query = query.in('email', emails);
        }
        if (linkedinUrls.length > 0) {
          query = query.in('linkedin_url', linkedinUrls);
        }
        const { data: existing } = await query;
        existingProfiles = existing || [];
      }
      
      // Filter out profiles that already exist
      const existingEmails = new Set(existingProfiles.map(p => p.email?.toLowerCase()).filter(Boolean));
      const existingLinkedIn = new Set(existingProfiles.map(p => p.linkedin_url?.toLowerCase()).filter(Boolean));
      
      const newBatch = batch.filter(candidate => {
        const emailMatch = candidate.email && existingEmails.has(candidate.email.toLowerCase());
        const linkedinMatch = candidate.linkedin_url && existingLinkedIn.has(candidate.linkedin_url.toLowerCase());
        return !emailMatch && !linkedinMatch;
      });
      
      if (newBatch.length === 0) {
        console.log(`✓ Batch ${Math.floor(i / batchSize) + 1}: All profiles already exist, skipping`);
        continue;
      }
      
      const { data, error } = await supabase
        .from('profiles')
        .insert(newBatch);
      
      if (error) {
        console.error(`❌ Error importing batch ${Math.floor(i / batchSize) + 1}:`, error);
      } else {
        imported += newBatch.length;
        console.log(`✓ Imported batch ${Math.floor(i / batchSize) + 1} (${imported}/${uniqueCandidates.length})`);
      }
    }
    
    console.log(`\n✅ Successfully imported ${imported} founders to Supabase!`);
    console.log(`🔗 View them at your Supabase dashboard or /profiles page\n`);
    
  } catch (error) {
    console.error('❌ Error during import:', error);
    throw error;
  }
}

// Main execution
importFounders()
  .then(() => {
    console.log('✅ Import completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  });

