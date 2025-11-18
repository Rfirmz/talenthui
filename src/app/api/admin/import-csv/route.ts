import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || '';

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
    // Check if Supabase is configured
    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Database not configured. Please set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_KEY environment variables.' },
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

    // Parse CSV header - handle quoted fields
    const parseCSVLine = (line: string): string[] => {
      const values: string[] = [];
      let current = '';
      let inQuotes = false;
      
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
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
      return values.map(v => v.replace(/^"|"$/g, ''));
    };
    
    const headers = parseCSVLine(lines[0]);
    
    // Parse CSV rows
    const candidates = [];
    const errors = [];
    
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      try {
        const values = parseCSVLine(line);
        const row: { [key: string]: string } = {};
        
        headers.forEach((header, index) => {
          row[header] = values[index] || '';
        });

        const firstName = (row['First name'] || '').trim();
        const lastName = (row['Last name'] || '').trim();
        const fullName = `${firstName} ${lastName}`.trim();
        
        if (!fullName || fullName.length < 2) {
          errors.push(`Row ${i}: Missing or invalid name`);
          continue;
        }

        const location = parseLocation(row['Location'] || row['City'] || '');
        const skills = parseSkills(row['Skills'] || '');
        const education = parseEducation(row['Education'] || '');
        
        // Extract school - prioritize Hawaii schools, but include any school
        let school = education[0] || null;
        const hawaiiSchools = ['University of Hawaii', 'Hawaii Pacific', 'Chaminade', 'Brigham Young University Hawaii'];
        for (const edu of education) {
          for (const hs of hawaiiSchools) {
            if (edu.includes(hs)) {
              school = edu;
              break;
            }
          }
          if (school) break;
        }
        
        // Determine island - if not in Hawaii, default to Oahu or use location
        let island = location.island;
        if (!island) {
          // Check if they have Hawaii education or connection
          const hasHawaiiEducation = education.some(edu => 
            hawaiiSchools.some(hs => edu.includes(hs))
          );
          const locationStr = (row['Location'] || row['City'] || '').toLowerCase();
          if (hasHawaiiEducation || locationStr.includes('hawaii')) {
            island = 'Oahu'; // Default to Oahu for Hawaii-connected people
          } else {
            island = 'Oahu'; // Default to Oahu for all
          }
        }
        
        // Create bio from available info
        let bio = '';
        const title = (row['Current Title'] || '').trim();
        const company = (row['Current Org Name'] || '').trim();
        
        if (title && company) {
          bio = `${title} at ${company}`;
        } else if (title) {
          bio = title;
        } else if (company) {
          bio = `Professional at ${company}`;
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
          bio = 'Professional';
        }
        
        // Build candidate object - only include fields that exist
        const candidate: any = {
          full_name: fullName,
          current_title: title || null,
          current_company: company || null,
          island: island,
          city: location.city || null,
          school: school || null,
          bio: bio,
          avatar_url: '/avatars/placeholder.svg',
          pay_band: 0,
          visibility: true,
        };
        
        // Only add these if they exist
        const linkedin = (row['LinkedIn'] || '').trim();
        if (linkedin) candidate.linkedin_url = linkedin;
        
        const github = (row['GitHub'] || '').trim();
        if (github) candidate.github_url = github;
        
        const twitter = (row['X'] || '').trim();
        if (twitter) candidate.twitter_url = twitter;
        
        candidates.push(candidate);
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
      
      // Try to insert each profile individually to handle errors gracefully
      for (const candidate of batch) {
        try {
          const { error } = await supabase
            .from('profiles')
            .upsert(candidate, { 
              onConflict: 'full_name',
              ignoreDuplicates: false 
            });
          
          if (error) {
            // If full_name conflict doesn't work, try without conflict resolution
            const { error: insertError } = await supabase
              .from('profiles')
              .insert(candidate);
            
            if (insertError) {
              importErrors.push(`${candidate.full_name}: ${insertError.message}`);
            } else {
              imported++;
            }
          } else {
            imported++;
          }
        } catch (err: any) {
          importErrors.push(`${candidate.full_name}: ${err.message}`);
        }
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

