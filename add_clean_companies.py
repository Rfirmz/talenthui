#!/usr/bin/env python3
import json
import re
import csv

def add_clean_companies():
    """Add new companies from CSV, ensuring they all have names"""
    
    companies = {}
    
    with open('/Users/rafaelfirme/Downloads/pacific_ebol/pacific_bol.csv', 'r', encoding='utf-8') as file:
        reader = csv.DictReader(file)
        
        for row in reader:
            company_name = row.get('Company Name', '').strip()
            if not company_name:
                continue
            
            # Use company name as key to avoid duplicates
            if company_name in companies:
                continue
            
            # Extract basic info
            website = row.get('Website', '').strip()
            if website and not website.startswith(('http://', 'https://')):
                website = 'https://' + website
            
            city = row.get('City', '').strip()
            state = row.get('State', '').strip()
            employees = row.get('Employees', '').strip()
            classification = row.get('Classification', '').strip()
            business_info = row.get('Business Info', '').strip()
            
            # Only include Hawaii companies
            if state.upper() != 'HI':
                continue
            
            # Determine island from city
            island = 'Unknown'
            if city:
                city_lower = city.lower()
                if any(oahu in city_lower for oahu in ['honolulu', 'kapolei', 'ewa beach', 'waipahu', 'kaneohe', 'kailua', 'waianae', 'nanakuli', 'pearl city', 'aiea', 'mililani', 'wahiawa', 'laie', 'haleiwa']):
                    island = 'Oahu'
                elif any(hawaii in city_lower for hawaii in ['hilo', 'kailua-kona', 'kamuela', 'waimea', 'keaau', 'volcano', 'pahoa', 'honokaa', 'naalehu', 'ocean view']):
                    island = 'Hawaii'
                elif any(maui in city_lower for maui in ['kahului', 'wailuku', 'kihei', 'lahaina', 'makawao', 'paia', 'haiku', 'hana', 'lanai city']):
                    island = 'Maui'
                elif any(kauai in city_lower for kauai in ['lihue', 'kapaa', 'hanalei', 'kalaheo', 'koloa', 'waimea', 'hanapepe', 'kekaha']):
                    island = 'Kauai'
            
            # Create slug
            slug = re.sub(r'[^\w\s-]', '', company_name.lower())
            slug = re.sub(r'[-\s]+', '-', slug)
            slug = slug.strip('-')
            
            # Determine company size
            size = 'Unknown'
            if employees:
                try:
                    emp_count = int(employees)
                    if emp_count < 10:
                        size = '1-10'
                    elif emp_count < 50:
                        size = '10-50'
                    elif emp_count < 100:
                        size = '50-100'
                    elif emp_count < 500:
                        size = '100-500'
                    elif emp_count < 1000:
                        size = '500-1000'
                    else:
                        size = '1000+'
                except (ValueError, TypeError):
                    pass
            
            # Categorize industry
            industry = 'Other'
            classification_lower = classification.lower()
            business_lower = business_info.lower()
            
            if any(term in classification_lower for term in ['technology', 'software', 'it', 'tech', 'computer', 'digital', 'ai', 'data']):
                industry = 'Technology'
            elif any(term in classification_lower for term in ['healthcare', 'medical', 'health', 'hospital', 'clinic']):
                industry = 'Healthcare'
            elif any(term in classification_lower for term in ['education', 'school', 'university', 'college', 'academy']):
                industry = 'Education'
            elif any(term in classification_lower for term in ['bank', 'financial', 'credit', 'finance', 'insurance']):
                industry = 'Financial Services'
            elif any(term in classification_lower for term in ['travel', 'tourism', 'entertainment', 'hotel', 'resort', 'restaurant']):
                industry = 'Tourism/Hospitality'
            elif any(term in classification_lower for term in ['government', 'public', 'federal', 'state', 'county']):
                industry = 'Government'
            elif any(term in classification_lower for term in ['nonprofit', 'non-profit', 'charity', 'foundation']):
                industry = 'Nonprofit'
            elif any(term in classification_lower for term in ['construction', 'real estate', 'contractor', 'building']):
                industry = 'Construction/Real Estate'
            elif any(term in classification_lower for term in ['retail', 'grocery', 'store', 'shopping']):
                industry = 'Retail'
            elif any(term in classification_lower for term in ['manufacturing', 'production', 'factory']):
                industry = 'Manufacturing'
            elif any(term in classification_lower for term in ['energy', 'power', 'electric', 'solar', 'renewable']):
                industry = 'Energy'
            elif any(term in classification_lower for term in ['agriculture', 'farming', 'food', 'agricultural']):
                industry = 'Agriculture'
            
            # Create company object
            company = {
                'name': company_name,
                'slug': slug,
                'description': business_info or f"{company_name} is a company based in {city}, {state}.",
                'logo_url': '',
                'industry': industry,
                'size': size,
                'island': island,
                'city': city,
                'website': website,
                'linkedin_url': '',
                'type': 'Public Company',
                'contacts': []
            }
            
            companies[company_name] = company
    
    print(f"Found {len(companies)} Hawaii companies from CSV")
    
    # Read existing companies to get the last ID
    with open('/Users/rafaelfirme/talenthui/src/data/companies.ts', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find the last company ID
    last_id_match = re.search(r'id: "(\d+)"', content)
    if last_id_match:
        last_id = int(last_id_match.group(1))
        start_id = last_id + 1
    else:
        start_id = 120
    
    # Format new companies for TypeScript
    new_companies_ts = []
    for i, (name, company) in enumerate(companies.items()):
        company_id = start_id + i
        
        # Escape quotes in description
        description = company['description'].replace('"', '\\"')
        
        company_ts = f'''  {{
    id: "{company_id}",
    name: "{company['name']}",
    slug: "{company['slug']}",
    description: "{description}",
    logo_url: "{company['logo_url']}",
    industry: "{company['industry']}",
    size: "{company['size']}",
    island: "{company['island']}",
    city: "{company['city']}",
    website: "{company['website']}",
    linkedin_url: "{company['linkedin_url']}",
    type: "{company['type']}",
    contacts: []
  }}'''
        
        new_companies_ts.append(company_ts)
    
    # Insert new companies before the closing bracket
    insert_pos = content.rfind('];')
    if insert_pos == -1:
        print("Error: Could not find insertion point")
        return
    
    # Add comma before the first new company
    new_companies_str = ',\n' + ',\n'.join(new_companies_ts)
    
    # Insert new companies
    new_content = content[:insert_pos] + new_companies_str + '\n' + content[insert_pos:]
    
    # Write updated content
    with open('/Users/rafaelfirme/talenthui/src/data/companies.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Successfully added {len(companies)} new companies to companies.ts")
    print(f"Company IDs range from {start_id} to {start_id + len(companies) - 1}")

if __name__ == '__main__':
    add_clean_companies()
