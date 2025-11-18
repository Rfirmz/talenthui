const fs = require('fs');
const path = require('path');

// Helper to determine if a company is a startup
function isStartup(company) {
  const name = (company.name || '').toLowerCase();
  const description = (company.description || '').toLowerCase();
  const combined = name + ' ' + description;
  
  // Check for funding stage indicators
  const fundingIndicators = [
    'series a',
    'series b',
    'series c',
    'series d',
    'seed',
    'stealth',
    'startup',
    'early-stage',
    'early stage',
    'venture-backed',
    'vc-backed',
    'funded by',
    'raised',
    'funding',
    'accelerator',
    'incubator',
  ];
  
  // Check for startup indicators in name or description
  for (const indicator of fundingIndicators) {
    if (combined.includes(indicator)) {
      return true;
    }
  }
  
  // Check if name contains funding stage in parentheses
  if (name.includes('(series') || name.includes('(seed') || name.includes('(stealth')) {
    return true;
  }
  
  // Check size - very small companies are likely startups
  const size = company.size || '';
  if (size === '1-10' || size === '10-50') {
    // But exclude large established companies
    // If it's a tech company with small size and no clear public company indicators, it's likely a startup
    if (company.industry === 'Technology' || company.industry === 'Defense & Government') {
      // Check for indicators it's NOT a startup
      const notStartupIndicators = [
        'hospital',
        'university',
        'college',
        'school',
        'government',
        'federal',
        'state',
        'county',
        'established',
        'since',
        'founded in',
        'decades',
        'years of experience',
      ];
      
      let hasNotStartupIndicator = false;
      for (const indicator of notStartupIndicators) {
        if (combined.includes(indicator)) {
          hasNotStartupIndicator = true;
          break;
        }
      }
      
      if (!hasNotStartupIndicator) {
        // Small tech companies without established company indicators are likely startups
        return true;
      }
    }
  }
  
  return false;
}

// Helper to determine if a company is a private company (not startup, not public)
function isPrivateCompany(company) {
  const name = (company.name || '').toLowerCase();
  const description = (company.description || '').toLowerCase();
  const combined = name + ' ' + description;
  
  // Large companies that aren't startups are likely private companies
  const size = company.size || '';
  if (size === '100-500' || size === '500+') {
    // Check if it's clearly a public company
    const publicIndicators = [
      'nyse',
      'nasdaq',
      'publicly traded',
      'public company',
      'ticker',
      'stock symbol',
    ];
    
    for (const indicator of publicIndicators) {
      if (combined.includes(indicator)) {
        return false; // It's a public company
      }
    }
    
    // If it's large but not clearly public, it's likely private
    if (!isStartup(company)) {
      return true;
    }
  }
  
  return false;
}

async function updateCompanyTypes() {
  const companiesFilePath = path.join(__dirname, '..', 'src', 'data', 'companies.ts');
  
  console.log('🚀 TalentHui Company Type Update Script\n');
  console.log('═══════════════════════════════════════════\n');
  
  try {
    // Read the companies file
    console.log('📂 Reading companies file...\n');
    let content = fs.readFileSync(companiesFilePath, 'utf8');
    
    // Parse companies using regex
    const companyRegex = /{\s*id:\s*"([^"]+)",\s*name:\s*"([^"]+)",\s*slug:\s*"([^"]+)",\s*description:\s*"([^"]*)",\s*logo_url:\s*"([^"]*)",\s*industry:\s*"([^"]*)",\s*size:\s*"([^"]*)",\s*island:\s*(null|"[^"]*"),\s*city:\s*(null|"[^"]*"),\s*website:\s*"([^"]*)",\s*linkedin_url:\s*"([^"]*)",\s*type:\s*"([^"]*)",\s*contacts:\s*(\[[^\]]*\])\s*}/g;
    
    let match;
    let updatedCount = 0;
    let startupCount = 0;
    let privateCount = 0;
    
    // First pass: identify companies that need updating
    const updates = [];
    while ((match = companyRegex.exec(content)) !== null) {
      const company = {
        id: match[1],
        name: match[2],
        slug: match[3],
        description: match[4],
        logo_url: match[5],
        industry: match[6],
        size: match[7],
        island: match[8] === 'null' ? null : match[8].replace(/"/g, ''),
        city: match[9] === 'null' ? null : match[9].replace(/"/g, ''),
        website: match[10],
        linkedin_url: match[11],
        type: match[12],
        contacts: match[13],
        fullMatch: match[0],
        index: match.index,
      };
      
      const currentType = company.type;
      let newType = currentType;
      
      if (isStartup(company)) {
        newType = 'Startup';
        startupCount++;
      } else if (isPrivateCompany(company)) {
        newType = 'Private';
        privateCount++;
      }
      
      if (newType !== currentType) {
        updates.push({
          oldMatch: company.fullMatch,
          newType: newType,
          companyName: company.name,
        });
        updatedCount++;
      }
    }
    
    console.log(`📊 Analysis complete:`);
    console.log(`   - Companies to update: ${updatedCount}`);
    console.log(`   - Startups: ${startupCount}`);
    console.log(`   - Private companies: ${privateCount}\n`);
    
    if (updates.length === 0) {
      console.log('✅ No companies need type updates');
      return;
    }
    
    // Apply updates
    console.log('🔄 Updating company types...\n');
    for (const update of updates) {
      // Replace the type in the old match
      const newMatch = update.oldMatch.replace(
        /type:\s*"[^"]*"/,
        `type: "${update.newType}"`
      );
      content = content.replace(update.oldMatch, newMatch);
      console.log(`✓ Updated ${update.companyName}: ${update.newType}`);
    }
    
    // Write updated file
    fs.writeFileSync(companiesFilePath, content, 'utf8');
    
    console.log(`\n✅ Successfully updated ${updatedCount} company types!`);
    console.log(`   - ${startupCount} marked as Startup`);
    console.log(`   - ${privateCount} marked as Private\n`);
    
  } catch (error) {
    console.error('❌ Error during update:', error);
    throw error;
  }
}

// Main execution
updateCompanyTypes()
  .then(() => {
    console.log('✅ Update completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Update failed:', error);
    process.exit(1);
  });


