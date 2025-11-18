const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Load environment variables from .env.local
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

// Supabase credentials (will use env variables)
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Helper function to parse location
function parseLocation(location) {
  if (!location) return { city: null, state: null, island: null };
  
  const parts = location.split(',').map(p => p.trim());
  let city = parts[0] || null;
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
    'Lanai City': 'Lanai',
    'Laie': 'Oahu',
    'Kula': 'Maui',
    'Keaau': 'Big Island',
    'Santa Clara': null, // Not in Hawaii
    'San Francisco': null,
    'Austin': null,
    'Jefferson City': null,
    'Seattle': null,
    'New York': null,
    'Huntington Beach': null,
    'State College': null,
    'Monmouth Junction': null,
    'San Jose': null,
    'Tucson': null,
    'Arlington': null,
    'Red Bank': null,
    'Fort Worth': null,
    'Phoenix': null,
    'Peoria': null,
    'San Antonio': null,
    'Aurora': null,
    'Sacramento': null,
    'Orange': null,
    'Las Vegas': null,
    'Azusa': null,
    'Plano': null,
    'Eatontown': null,
    'Hawaiian Gardens': null,
    'Bristol': null,
    'Oak Harbor': null,
    'Menlo Park': null,
    'San Mateo': null,
    'Irvine': null,
    'Tacoma': null,
    'Salt Lake': null,
    'Washington': null,
    'Stafford': null,
  };
  
  let island = null;
  if (city && islandMap[city] !== undefined) {
    island = islandMap[city];
    if (!island) {
      // Not in Hawaii, skip
      return { city: null, state: null, island: null };
    }
  } else if (state === 'Hawaii') {
    // If state is Hawaii but city not in map, default to Oahu
    island = 'Oahu';
    if (!city) city = 'Honolulu';
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

// Extract school from education (prioritize Hawaii schools)
function extractSchool(education) {
  if (!education) return null;
  
  const schools = parseEducation(education);
  
  // Priority: Hawaii schools first
  const hawaiiSchools = [
    'University of Hawaii at Manoa',
    'University of Hawaii at Hilo',
    'Hawaii Pacific University',
    'Chaminade University',
    'Brigham Young University Hawaii',
    'University of Hawaii',
    'University of Hawaii - West Oahu',
    'University of HAWAI\'I - Shidler College of Business',
    'University of HAWAI\'I System'
  ];
  
  for (const school of schools) {
    for (const hawaiiSchool of hawaiiSchools) {
      if (school.includes(hawaiiSchool) || hawaiiSchool.includes(school)) {
        return hawaiiSchool;
      }
    }
  }
  
  // If no Hawaii school found, return first school
  return schools[0] || null;
}

// Helper to calculate years of experience
function estimateYearsExperience(skills) {
  if (!skills || skills.length === 0) return 0;
  if (skills.length > 20) return 8;
  if (skills.length > 15) return 6;
  if (skills.length > 10) return 4;
  if (skills.length > 5) return 2;
  return 1;
}

// Parse CSV function (handles quoted fields with commas)
function parseCSV(csv) {
  const lines = csv.split('\n').filter(l => l.trim());
  if (lines.length === 0) return [];
  
  const headers = [];
  let currentHeader = '';
  let inQuotes = false;
  
  // Parse headers
  for (let i = 0; i < lines[0].length; i++) {
    const char = lines[0][i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      headers.push(currentHeader.trim());
      currentHeader = '';
    } else {
      currentHeader += char;
    }
  }
  headers.push(currentHeader.trim());
  
  const rows = [];
  
  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const values = [];
    let current = '';
    inQuotes = false;
    
    for (let j = 0; j < lines[i].length; j++) {
      const char = lines[i][j];
      if (char === '"') {
        inQuotes = !inQuotes;
      } else if (char === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    values.push(current.trim());
    
    const row = {};
    headers.forEach((header, idx) => {
      row[header] = (values[idx] || '').replace(/^"|"$/g, '');
    });
    rows.push(row);
  }
  
  return rows;
}

async function importProfiles() {
  console.log('📂 Reading CSV files...\n');
  
  // Read CSV files
  const financeCSV = fs.readFileSync('/Users/rafaelfirme/Downloads/Hawaii Finance _ Accounting - public accounting roots.csv', 'utf8');
  const recruitersCSV = fs.readFileSync('/Users/rafaelfirme/Downloads/Hawaii recruiters.csv', 'utf8');
  
  // Parse CSV files
  const financeRows = parseCSV(financeCSV);
  const recruiterRows = parseCSV(recruitersCSV);
  
  console.log(`Found ${financeRows.length} finance profiles and ${recruiterRows.length} recruiter profiles\n`);
  
  // Get existing profiles to avoid duplicates
  console.log('🔍 Checking for existing profiles...');
  const { data: existingProfiles, error: fetchError } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('visibility', true);
  
  if (fetchError) {
    console.error('❌ Error fetching existing profiles:', fetchError);
    console.log('Continuing anyway - duplicates will be handled by database constraints...\n');
  }
  
  const existingNames = new Set((existingProfiles || []).map(p => (p.full_name || '').toLowerCase()));
  const existingUsernames = new Set();
  
  console.log(`Found ${existingNames.size} existing profiles\n`);
  
  // Convert to profiles
  const candidates = [];
  const skipped = [];
  
  const allRows = [...financeRows, ...recruiterRows];
  
  for (const row of allRows) {
    const firstName = (row['First name'] || '').trim();
    const lastName = (row['Last name'] || '').trim();
    const fullName = `${firstName} ${lastName}`.trim();
    
    if (!fullName) {
      skipped.push({ name: 'Unknown', reason: 'Missing name' });
      continue;
    }
    
    // Check for duplicates
    if (existingNames.has(fullName.toLowerCase())) {
      skipped.push({ name: fullName, reason: 'Duplicate name' });
      continue;
    }
    
    const location = parseLocation(row['Location'] || row['City'] || '');
    
    // Skip if not in Hawaii
    if (!location.island) {
      skipped.push({ name: fullName, reason: 'Not in Hawaii' });
      continue;
    }
    
    const skills = parseSkills(row['Skills'] || '');
    const education = parseEducation(row['Education'] || '');
    const educationWebsites = parseEducation(row['Education Website'] || '');
    const educationLinkedin = parseEducation(row['Education LinkedIn'] || '');
    
    let username = createUsername(firstName, lastName);
    
    if (!username) {
      skipped.push({ name: fullName, reason: 'Could not generate username' });
      continue;
    }
    
    // Check for duplicate username
    if (existingUsernames.has(username.toLowerCase())) {
      // Append number to make unique
      let counter = 1;
      const baseUsername = username;
      while (existingUsernames.has(username.toLowerCase())) {
        username = `${baseUsername}${counter}`;
        counter++;
      }
    }
    existingUsernames.add(username.toLowerCase());
    
    // Create bio from available info
    let bio = '';
    if (row['Current Title'] && row['Current Org Name']) {
      bio = `${row['Current Title']} at ${row['Current Org Name']}`;
    } else if (row['Current Title']) {
      bio = row['Current Title'];
    } else if (row['Current Org Name']) {
      bio = `Professional at ${row['Current Org Name']}`;
    }
    
    if (skills.length > 0 && skills[0] !== 'N/A') {
      const skillList = skills.slice(0, 3).join(', ');
      if (bio) {
        bio += `. Skills: ${skillList}`;
      } else {
        bio = `Skills: ${skillList}`;
      }
    }
    
    if (!bio) {
      bio = 'Professional in Hawaii';
    }
    
    const candidate = {
      full_name: fullName,
      username: username,
      current_title: row['Current Title'] || null,
      company: row['Current Org Name'] || null,
      island: location.island,
      city: location.city,
      school: extractSchool(row['Education'] || '') || null,
      bio: bio,
      linkedin_url: row['LinkedIn'] || null,
      github_url: row['GitHub'] || null,
      twitter_url: row['X'] || null,
      avatar_url: '/avatars/placeholder.svg',
      pay_band: 0,
    };
    
    candidates.push(candidate);
  }
  
  console.log(`✅ Prepared ${candidates.length} profiles for import`);
  console.log(`⏭️  Skipped ${skipped.length} profiles (duplicates or not in Hawaii)\n`);
  
  if (candidates.length === 0) {
    console.log('❌ No profiles to import');
    return;
  }
  
  // Insert candidates in batches
  const batchSize = 100;
  let imported = 0;
  const importErrors = [];
  
  console.log(`📤 Importing ${candidates.length} profiles in batches of ${batchSize}...\n`);
  
  for (let i = 0; i < candidates.length; i += batchSize) {
    const batch = candidates.slice(i, i + batchSize);
    const batchNum = Math.floor(i / batchSize) + 1;
    const totalBatches = Math.ceil(candidates.length / batchSize);
    
    console.log(`Importing batch ${batchNum}/${totalBatches} (${batch.length} profiles)...`);
    
    // Use insert with ignoreDuplicates to handle conflicts gracefully
    const { data, error } = await supabase
      .from('profiles')
      .upsert(batch, { 
        onConflict: 'username',
        ignoreDuplicates: true 
      });
    
    if (error) {
      console.error(`❌ Error importing batch ${batchNum}:`, error.message);
      importErrors.push(`Batch ${batchNum}: ${error.message}`);
    } else {
      imported += batch.length;
      console.log(`✅ Batch ${batchNum} imported successfully`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('📊 Import Summary:');
  console.log(`✅ Successfully imported: ${imported} profiles`);
  console.log(`⏭️  Skipped: ${skipped.length} profiles`);
  if (importErrors.length > 0) {
    console.log(`❌ Errors: ${importErrors.length} batches had errors`);
    importErrors.forEach(err => console.log(`   - ${err}`));
  }
  console.log('='.repeat(50));
}

// Run the import
importProfiles().catch(console.error);

