const { createClient } = require('@supabase/supabase-js');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Pay band estimation function (same as in TypeScript file)
function estimatePayBand(title, company) {
  if (!title && !company) {
    return 0; // Unemployed
  }

  const titleLower = (title || '').toLowerCase();
  const companyLower = (company || '').toLowerCase();

  // High-tier companies
  const highTierCompanies = [
    'google', 'microsoft', 'apple', 'amazon', 'meta', 'facebook', 'netflix',
    'uber', 'airbnb', 'salesforce', 'oracle', 'adobe', 'nvidia', 'tesla',
    'goldman sachs', 'morgan stanley', 'jpmorgan', 'jpm', 'mckinsey', 'bain',
    'boston consulting', 'bcg', 'deloitte', 'pwc', 'ey', 'kpmg', 'ey.com',
    'okta', 'servicenow', 'roblox', 'epic games', 'disney', 'warner',
    'tiktok', 'bytedance', 'snap', 'twitter', 'x.com', 'linkedin',
    'stripe', 'square', 'paypal', 'visa', 'mastercard', 'american express'
  ];

  // Mid-tier companies
  const midTierCompanies = [
    'cisco', 'ibm', 'intel', 'hp', 'dell', 'vmware', 'red hat',
    'atlassian', 'splunk', 'workday', 'servicenow', 'snowflake',
    'bank of hawaii', 'first hawaiian', 'hawaiian airlines', 'hawaiian electric'
  ];

  // Executive titles
  if (titleLower.includes('ceo') || titleLower.includes('chief executive') ||
      titleLower.includes('president') || titleLower.includes('founder') ||
      titleLower.includes('co-founder') || titleLower.includes('cofounder') ||
      titleLower.includes('chief technology') || titleLower.includes('cto') ||
      titleLower.includes('chief financial') || titleLower.includes('cfo') ||
      titleLower.includes('chief operating') || titleLower.includes('coo') ||
      titleLower.includes('chief product') || titleLower.includes('cpo') ||
      titleLower.includes('vice president') || titleLower.includes('vp ') ||
      titleLower.includes('senior vice president') || titleLower.includes('svp') ||
      titleLower.includes('executive vice president') || titleLower.includes('evp')) {
    return 8; // $150k+
  }

  // Director level
  if (titleLower.includes('director') || titleLower.includes('head of')) {
    const isHighTier = highTierCompanies.some(c => companyLower.includes(c));
    return isHighTier ? 8 : 7;
  }

  // Senior Manager / Principal
  if (titleLower.includes('principal') || titleLower.includes('senior manager') ||
      titleLower.includes('lead ') || titleLower.includes('staff ')) {
    const isHighTier = highTierCompanies.some(c => companyLower.includes(c));
    return isHighTier ? 7 : 6;
  }

  // Manager level
  if (titleLower.includes('manager') && !titleLower.includes('senior')) {
    const isHighTier = highTierCompanies.some(c => companyLower.includes(c));
    return isHighTier ? 6 : 5;
  }

  // Senior Engineer / Senior roles
  if (titleLower.includes('senior') && (
      titleLower.includes('engineer') || titleLower.includes('developer') ||
      titleLower.includes('scientist') || titleLower.includes('analyst') ||
      titleLower.includes('architect') || titleLower.includes('consultant'))) {
    const isHighTier = highTierCompanies.some(c => companyLower.includes(c));
    return isHighTier ? 7 : 6;
  }

  // Software Engineer / Developer
  if (titleLower.includes('software engineer') || titleLower.includes('engineer') ||
      titleLower.includes('developer') || titleLower.includes('programmer')) {
    const isHighTier = highTierCompanies.some(c => companyLower.includes(c));
    const isMidTier = midTierCompanies.some(c => companyLower.includes(c));
    if (isHighTier) return 6;
    if (isMidTier) return 5;
    return 4;
  }

  // Data Scientist / ML Engineer
  if (titleLower.includes('data scientist') || titleLower.includes('machine learning') ||
      titleLower.includes('ml engineer') || titleLower.includes('ai engineer')) {
    const isHighTier = highTierCompanies.some(c => companyLower.includes(c));
    return isHighTier ? 7 : 6;
  }

  // Analyst roles
  if (titleLower.includes('analyst')) {
    const isHighTier = highTierCompanies.some(c => companyLower.includes(c));
    return isHighTier ? 5 : 4;
  }

  // Accountant / Controller / Finance
  if (titleLower.includes('accountant') || titleLower.includes('controller') ||
      titleLower.includes('auditor') || titleLower.includes('cpa')) {
    return 5;
  }

  // Recruiter / HR
  if (titleLower.includes('recruiter') || titleLower.includes('talent acquisition') ||
      titleLower.includes('hr ') || titleLower.includes('human resources')) {
    return 4;
  }

  // If has company but no clear title match
  if (company) {
    const isHighTier = highTierCompanies.some(c => companyLower.includes(c));
    const isMidTier = midTierCompanies.some(c => companyLower.includes(c));
    if (isHighTier) return 6;
    if (isMidTier) return 5;
    return 4;
  }

  // If has title but no company
  if (title) {
    if (titleLower.includes('senior') || titleLower.includes('lead') || titleLower.includes('principal')) {
      return 6;
    }
    if (titleLower.includes('manager') || titleLower.includes('director')) {
      return 5;
    }
    return 4;
  }

  return 0; // Unemployed
}

async function updatePayBands() {
  console.log('🔍 Fetching profiles with pay_band = 0 and a company...\n');
  
  // Get all profiles with pay_band = 0 that have a company
  const { data: profiles, error } = await supabase
    .from('profiles')
    .select('id, full_name, current_title, current_company, pay_band')
    .eq('pay_band', 0)
    .not('current_company', 'is', null);

  if (error) {
    console.error('❌ Error fetching profiles:', error);
    return;
  }

  console.log(`Found ${profiles.length} profiles to update\n`);

  let updated = 0;
  const errors = [];

  // Update in batches
  const batchSize = 100;
  for (let i = 0; i < profiles.length; i += batchSize) {
    const batch = profiles.slice(i, i + batchSize);
    
    for (const profile of batch) {
      const estimatedPayBand = estimatePayBand(
        profile.current_title,
        profile.current_company
      );

      if (estimatedPayBand > 0) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ pay_band: estimatedPayBand })
          .eq('id', profile.id);

        if (updateError) {
          errors.push(`${profile.full_name}: ${updateError.message}`);
        } else {
          updated++;
          if (updated % 50 === 0) {
            console.log(`✓ Updated ${updated} profiles...`);
          }
        }
      }
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Update Summary:');
  console.log(`✅ Successfully updated: ${updated} profiles`);
  if (errors.length > 0) {
    console.log(`❌ Errors: ${errors.length}`);
    errors.slice(0, 10).forEach(err => console.log(`   - ${err}`));
    if (errors.length > 10) {
      console.log(`   ... and ${errors.length - 10} more errors`);
    }
  }
  console.log('='.repeat(50));
}

updatePayBands().catch(console.error);

