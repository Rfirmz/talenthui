// Pay band estimation based on title and company
// Pay bands: 0=Unemployed, 1=$10-20k, 2=$30-50k, 3=$50-70k, 4=$70-90k, 
//            5=$90-110k, 6=$110-130k, 7=$130-150k, 8=$150k+

export function estimatePayBand(title: string | null, company: string | null): number {
  if (!title && !company) {
    return 0; // Unemployed
  }

  const titleLower = (title || '').toLowerCase();
  const companyLower = (company || '').toLowerCase();

  // High-tier companies (Big Tech, Finance, etc.) - higher pay
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

  // Executive titles - high pay
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
    return isHighTier ? 8 : 7; // $150k+ or $130-150k
  }

  // Senior Manager / Principal
  if (titleLower.includes('principal') || titleLower.includes('senior manager') ||
      titleLower.includes('lead ') || titleLower.includes('staff ')) {
    const isHighTier = highTierCompanies.some(c => companyLower.includes(c));
    return isHighTier ? 7 : 6; // $130-150k or $110-130k
  }

  // Manager level
  if (titleLower.includes('manager') && !titleLower.includes('senior')) {
    const isHighTier = highTierCompanies.some(c => companyLower.includes(c));
    return isHighTier ? 6 : 5; // $110-130k or $90-110k
  }

  // Senior Engineer / Senior roles
  if (titleLower.includes('senior') && (
      titleLower.includes('engineer') || titleLower.includes('developer') ||
      titleLower.includes('scientist') || titleLower.includes('analyst') ||
      titleLower.includes('architect') || titleLower.includes('consultant'))) {
    const isHighTier = highTierCompanies.some(c => companyLower.includes(c));
    return isHighTier ? 7 : 6; // $130-150k or $110-130k
  }

  // Software Engineer / Developer (mid-level)
  if (titleLower.includes('software engineer') || titleLower.includes('engineer') ||
      titleLower.includes('developer') || titleLower.includes('programmer')) {
    const isHighTier = highTierCompanies.some(c => companyLower.includes(c));
    const isMidTier = midTierCompanies.some(c => companyLower.includes(c));
    if (isHighTier) return 6; // $110-130k
    if (isMidTier) return 5; // $90-110k
    return 4; // $70-90k
  }

  // Data Scientist / ML Engineer
  if (titleLower.includes('data scientist') || titleLower.includes('machine learning') ||
      titleLower.includes('ml engineer') || titleLower.includes('ai engineer')) {
    const isHighTier = highTierCompanies.some(c => companyLower.includes(c));
    return isHighTier ? 7 : 6; // $130-150k or $110-130k
  }

  // Analyst roles
  if (titleLower.includes('analyst')) {
    const isHighTier = highTierCompanies.some(c => companyLower.includes(c));
    return isHighTier ? 5 : 4; // $90-110k or $70-90k
  }

  // Accountant / Controller / Finance
  if (titleLower.includes('accountant') || titleLower.includes('controller') ||
      titleLower.includes('auditor') || titleLower.includes('cpa')) {
    return 5; // $90-110k
  }

  // Recruiter / HR
  if (titleLower.includes('recruiter') || titleLower.includes('talent acquisition') ||
      titleLower.includes('hr ') || titleLower.includes('human resources')) {
    return 4; // $70-90k
  }

  // If has company but no clear title match, estimate based on company tier
  if (company) {
    const isHighTier = highTierCompanies.some(c => companyLower.includes(c));
    const isMidTier = midTierCompanies.some(c => companyLower.includes(c));
    if (isHighTier) return 6; // $110-130k
    if (isMidTier) return 5; // $90-110k
    return 4; // $70-90k default
  }

  // If has title but no company, estimate based on title
  if (title) {
    if (titleLower.includes('senior') || titleLower.includes('lead') || titleLower.includes('principal')) {
      return 6; // $110-130k
    }
    if (titleLower.includes('manager') || titleLower.includes('director')) {
      return 5; // $90-110k
    }
    return 4; // $70-90k default
  }

  return 0; // Unemployed
}

