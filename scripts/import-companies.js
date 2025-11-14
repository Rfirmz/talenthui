const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');

// Helper to create slug from name
function createSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 100);
}

// Helper to parse location and extract city/island
function parseLocation(location) {
  if (!location) return { city: null, island: null };
  
  const locationLower = location.toLowerCase();
  
  // Map cities to islands
  const islandMap = {
    'honolulu': 'Oahu',
    'aiea': 'Oahu',
    'pearl city': 'Oahu',
    'kaneohe': 'Oahu',
    'kailua': 'Oahu',
    'mililani': 'Oahu',
    'waipahu': 'Oahu',
    'ewa beach': 'Oahu',
    'kapolei': 'Oahu',
    'hilo': 'Big Island',
    'kailua-kona': 'Big Island',
    'kona': 'Big Island',
    'waimea': 'Big Island',
    'kahului': 'Maui',
    'wailuku': 'Maui',
    'kihei': 'Maui',
    'lahaina': 'Maui',
    'lihue': 'Kauai',
    'kapaa': 'Kauai',
  };
  
  // Check if location contains Hawaii or Honolulu
  let city = null;
  let island = null;
  
  if (locationLower.includes('honolulu')) {
    city = 'Honolulu';
    island = 'Oahu';
  } else if (locationLower.includes('hawaii')) {
    // Try to extract city from location
    const parts = location.split(',').map(p => p.trim());
    city = parts[0] || null;
    if (city) {
      island = islandMap[city.toLowerCase()] || null;
    }
    if (!island) {
      island = 'Oahu'; // Default to Oahu if Hawaii mentioned
    }
  } else {
    // Check if any city matches
    for (const [cityName, islandName] of Object.entries(islandMap)) {
      if (locationLower.includes(cityName)) {
        city = cityName.charAt(0).toUpperCase() + cityName.slice(1);
        island = islandName;
        break;
      }
    }
  }
  
  return { city, island };
}

// Helper to determine industry from category or name
function determineIndustry(category, name, summary) {
  if (category) {
    return category;
  }
  
  const nameLower = (name || '').toLowerCase();
  const summaryLower = (summary || '').toLowerCase();
  const combined = nameLower + ' ' + summaryLower;
  
  if (combined.includes('defense') || combined.includes('military') || combined.includes('dod') || combined.includes('government')) {
    return 'Defense & Government';
  }
  if (combined.includes('healthcare') || combined.includes('medical') || combined.includes('health')) {
    return 'Healthcare';
  }
  if (combined.includes('education') || combined.includes('school') || combined.includes('learning')) {
    return 'Education';
  }
  if (combined.includes('energy') || combined.includes('solar') || combined.includes('renewable')) {
    return 'Energy';
  }
  if (combined.includes('retail') || combined.includes('ecommerce') || combined.includes('shopping')) {
    return 'Retail';
  }
  if (combined.includes('gaming') || combined.includes('game') || combined.includes('esports')) {
    return 'Gaming';
  }
  if (combined.includes('travel') || combined.includes('tourism') || combined.includes('hotel') || combined.includes('booking')) {
    return 'Travel & Tourism';
  }
  if (combined.includes('ai') || combined.includes('artificial intelligence') || combined.includes('machine learning')) {
    return 'Technology';
  }
  if (combined.includes('saas') || combined.includes('software') || combined.includes('platform') || combined.includes('tech')) {
    return 'Technology';
  }
  
  return 'Technology'; // Default
}

// Helper to determine company size
function determineSize(summary) {
  if (!summary) return 'Unknown';
  
  const summaryLower = summary.toLowerCase();
  
  if (summaryLower.includes('series c') || summaryLower.includes('$1b') || summaryLower.includes('1.1b')) {
    return '500+';
  }
  if (summaryLower.includes('series b') || summaryLower.includes('$50m')) {
    return '100-500';
  }
  if (summaryLower.includes('series a') || summaryLower.includes('seed')) {
    return '10-50';
  }
  if (summaryLower.includes('stealth')) {
    return '1-10';
  }
  
  return '10-50'; // Default
}

// Read and parse CSV file
function readCSV(filePath) {
  return new Promise((resolve, reject) => {
    const companies = [];
    
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (row) => {
        const name = row['name']?.trim();
        if (!name) return; // Skip rows without names
        
        const domain = row['domain']?.trim() || '';
        const summary = row['summary']?.trim() || '';
        const category = row['category']?.trim() || '';
        const location = row['location']?.trim() || '';
        
        const { city, island } = parseLocation(location);
        const industry = determineIndustry(category, name, summary);
        const size = determineSize(summary);
        
        // Build website URL
        let website = '';
        if (domain) {
          if (domain.startsWith('http')) {
            website = domain;
          } else {
            website = `https://${domain}`;
          }
        }
        
        const company = {
          name: name,
          slug: createSlug(name),
          description: summary || `${name} is a company${location ? ` based in ${location}` : ''}.`,
          logo_url: '',
          industry: industry,
          size: size,
          island: island,
          city: city,
          website: website,
          linkedin_url: '',
          type: 'Public Company',
          contacts: [],
          domain: domain.toLowerCase(), // For duplicate detection
        };
        
        companies.push(company);
      })
      .on('end', () => {
        console.log(`✓ Read ${companies.length} companies from ${filePath}`);
        resolve(companies);
      })
      .on('error', (error) => {
        reject(error);
      });
  });
}

// Remove duplicates based on name or domain
function removeDuplicates(newCompanies, existingCompanies) {
  const existingNames = new Set(existingCompanies.map(c => c.name.toLowerCase()));
  const existingDomains = new Set(existingCompanies.map(c => {
    if (c.website) {
      try {
        const url = new URL(c.website);
        return url.hostname.replace(/^www\./, '');
      } catch (e) {
        return null;
      }
    }
    return null;
  }).filter(Boolean));
  
  const unique = [];
  const seenNames = new Set();
  const seenDomains = new Set();
  let duplicatesRemoved = 0;
  
  for (const company of newCompanies) {
    const nameLower = company.name.toLowerCase();
    const domain = company.domain;
    
    // Check if duplicate by name
    if (existingNames.has(nameLower) || seenNames.has(nameLower)) {
      duplicatesRemoved++;
      continue;
    }
    
    // Check if duplicate by domain
    if (domain && (existingDomains.has(domain) || seenDomains.has(domain))) {
      duplicatesRemoved++;
      continue;
    }
    
    seenNames.add(nameLower);
    if (domain) {
      seenDomains.add(domain);
    }
    
    // Remove domain from company object (it was just for duplicate detection)
    delete company.domain;
    unique.push(company);
  }
  
  console.log(`✓ Removed ${duplicatesRemoved} duplicates`);
  return unique;
}

async function importCompanies() {
  const csvPath = '/Users/rafaelfirme/Downloads/master_companies.csv';
  const companiesFilePath = path.join(__dirname, '..', 'src', 'data', 'companies.ts');
  
  console.log('🚀 TalentHui Companies Import Script\n');
  console.log('═══════════════════════════════════════════\n');
  
  try {
    // Read CSV file
    console.log('📂 Reading CSV file...\n');
    const newCompanies = await readCSV(csvPath);
    
    // Read existing companies file
    console.log('📂 Reading existing companies file...\n');
    const companiesFileContent = fs.readFileSync(companiesFilePath, 'utf8');
    
    // Extract existing companies using regex
    const companyMatches = companiesFileContent.matchAll(/{\s*id:\s*"[^"]+",\s*name:\s*"([^"]+)",/g);
    const existingCompanies = [];
    for (const match of companyMatches) {
      existingCompanies.push({ name: match[1] });
    }
    
    // Also try to extract from the actual structure
    // This is a simpler approach - just check names
    const existingCompanyNames = new Set();
    const nameRegex = /name:\s*"([^"]+)"/g;
    let nameMatch;
    while ((nameMatch = nameRegex.exec(companiesFileContent)) !== null) {
      existingCompanyNames.add(nameMatch[1].toLowerCase());
    }
    
    // Remove duplicates
    console.log('🔄 Removing duplicates...\n');
    const uniqueCompanies = newCompanies.filter(company => {
      const nameLower = company.name.toLowerCase();
      return !existingCompanyNames.has(nameLower);
    });
    
    console.log(`✓ Removed ${newCompanies.length - uniqueCompanies.length} duplicates`);
    console.log(`📊 Total unique companies to add: ${uniqueCompanies.length}\n`);
    
    if (uniqueCompanies.length === 0) {
      console.log('❌ No new companies to add');
      return;
    }
    
    // Find the last company ID
    const lastIdMatch = companiesFileContent.match(/id:\s*"(\d+)"/g);
    let lastId = 1397; // Default starting ID
    if (lastIdMatch && lastIdMatch.length > 0) {
      const lastIdStr = lastIdMatch[lastIdMatch.length - 1].match(/"(\d+)"/)[1];
      lastId = parseInt(lastIdStr, 10);
    }
    
    // Generate TypeScript code for new companies
    const newCompaniesCode = uniqueCompanies.map((company, index) => {
      const companyId = lastId + index + 1;
      const description = company.description.replace(/"/g, '\\"');
      
      return `  {
    id: "${companyId}",
    name: "${company.name.replace(/"/g, '\\"')}",
    slug: "${company.slug}",
    description: "${description}",
    logo_url: "${company.logo_url}",
    industry: "${company.industry}",
    size: "${company.size}",
    island: ${company.island ? `"${company.island}"` : 'null'},
    city: ${company.city ? `"${company.city}"` : 'null'},
    website: "${company.website}",
    linkedin_url: "${company.linkedin_url}",
    type: "${company.type}",
    contacts: []
  }`;
    }).join(',\n');
    
    // Insert new companies before the closing bracket
    const insertPos = companiesFileContent.lastIndexOf('];');
    if (insertPos === -1) {
      throw new Error('Could not find end of companies array');
    }
    
    // Add comma if needed
    const beforeInsert = companiesFileContent.substring(0, insertPos).trim();
    const needsComma = !beforeInsert.endsWith(',') && !beforeInsert.endsWith('[');
    const comma = needsComma ? ',\n' : '\n';
    
    const newContent = 
      companiesFileContent.substring(0, insertPos) +
      comma +
      newCompaniesCode +
      '\n' +
      companiesFileContent.substring(insertPos);
    
    // Write updated file
    fs.writeFileSync(companiesFilePath, newContent, 'utf8');
    
    console.log(`✅ Successfully added ${uniqueCompanies.length} companies to companies.ts!`);
    console.log(`🔗 They will appear on page 2+ of the companies list\n`);
    
  } catch (error) {
    console.error('❌ Error during import:', error);
    throw error;
  }
}

// Main execution
importCompanies()
  .then(() => {
    console.log('✅ Import completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Import failed:', error);
    process.exit(1);
  });

