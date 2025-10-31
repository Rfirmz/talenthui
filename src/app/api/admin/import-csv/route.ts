import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY!;

// Helper function to parse location
function parseLocation(location: string) {
  if (!location) return { city: null, state: null, island: null };
  
  const parts = location.split(',').map(p => p.trim());
  const city = parts[0] || null;
  const state = parts[1] || null;
  
  // Map cities to islands
  const islandMap: { [key: string]: string } = {
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
function createUsername(firstName: string, lastName: string) {
  if (!firstName || !lastName) return null;
  return `${firstName.toLowerCase()}-${lastName.toLowerCase()}`
    .replace(/[^a-z0-9-]/g, '')
    .substring(0, 50);
}

// Helper to parse skills from comma-separated string
function parseSkills(skillsString: string) {
  if (!skillsString || skillsString === 'N/A') return [];
  return skillsString.split(',').map(s => s.trim()).filter(s => s.length > 0);
}

// Helper to parse education array
function parseEducation(educationString: string) {
  if (!educationString || educationString === 'N/A') return [];
  return educationString.split(',').map(s => s.trim()).filter(s => s.length > 0);
}

// Helper to calculate years of experience
function estimateYearsExperience(skills: string[]) {
  if (!skills || skills.length === 0) return 0;
  if (skills.length > 20) return 8;
  if (skills.length > 15) return 6;
  if (skills.length > 10) return 4;
  if (skills.length > 5) return 2;
  return 1;
}

export async function POST(request: NextRequest) {
  try {
    // Check if Supabase credentials are available
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase credentials not configured' },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Get the form data
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file content
    const fileContent = await file.text();
    const lines = fileContent.split('\n');
    
    if (lines.length < 2) {
      return NextResponse.json(
        { error: 'CSV file is empty or invalid' },
        { status: 400 }
      );
    }

    // Parse CSV header
    const headers = lines[0].split(',').map(h => h.trim().replace(/"/g, ''));
    
    // Parse CSV rows
    const candidates = [];
    const errors = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        // Simple CSV parsing (for complex CSVs, use a library)
        const values = line.match(/(".*?"|[^,]+)(?=\s*,|\s*$)/g) || [];
        const row: { [key: string]: string } = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index]?.replace(/^"|"$/g, '').trim() || '';
        });

        const location = parseLocation(row['Location'] || '');
        
        // Only import if Hawaii location
        if (location.state === 'Hawaii' || location.island) {
          const firstName = row['First name'] || '';
          const lastName = row['Last name'] || '';
          const fullName = `${firstName} ${lastName}`.trim();
          
          if (!firstName || !lastName) {
            errors.push(`Row ${i}: Missing first or last name`);
            continue;
          }

          const skills = parseSkills(row['Skills'] || '');
          const education = parseEducation(row['Education'] || '');
          const educationWebsites = parseEducation(row['Education Website'] || '');
          const educationLinkedin = parseEducation(row['Education LinkedIn'] || '');
          
          const candidate = {
            first_name: firstName,
            last_name: lastName,
            full_name: fullName,
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
            category: row['Category'] || null,
            
            country: row['Country'] || 'United States',
            state: location.state || 'Hawaii',
            city: location.city,
            island: location.island,
            location: row['Location'] || null,
            
            school: education[0] || null,
            education: education.length > 0 ? education : null,
            education_websites: educationWebsites.length > 0 ? educationWebsites : null,
            education_linkedin: educationLinkedin.length > 0 ? educationLinkedin : null,
            
            skills: skills.length > 0 ? skills : null,
            years_experience: estimateYearsExperience(skills),
            
            linkedin_url: row['LinkedIn'] || null,
            github_url: row['GitHub'] || null,
            twitter_url: row['X'] || null,
            
            avatar_url: '/avatars/placeholder.svg',
            visibility: true,
          };
          
          candidates.push(candidate);
        }
      } catch (err: any) {
        errors.push(`Row ${i}: ${err.message}`);
      }
    }

    if (candidates.length === 0) {
      return NextResponse.json(
        { error: 'No valid candidates found in CSV', errors },
        { status: 400 }
      );
    }

    // Insert candidates in batches
    const batchSize = 100;
    let imported = 0;
    const importErrors = [];

    for (let i = 0; i < candidates.length; i += batchSize) {
      const batch = candidates.slice(i, i + batchSize);
      
      const { data, error } = await supabase
        .from('profiles')
        .upsert(batch, { 
          onConflict: 'username',
          ignoreDuplicates: false 
        });
      
      if (error) {
        importErrors.push(`Batch ${Math.floor(i / batchSize) + 1}: ${error.message}`);
      } else {
        imported += batch.length;
      }
    }

    return NextResponse.json({
      success: true,
      imported,
      total: candidates.length,
      errors: [...errors, ...importErrors],
    });

  } catch (error: any) {
    console.error('Import error:', error);
    return NextResponse.json(
      { error: 'Import failed', details: error.message },
      { status: 500 }
    );
  }
}

