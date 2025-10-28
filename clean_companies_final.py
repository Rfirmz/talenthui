#!/usr/bin/env python3
import re

def clean_companies_file():
    """Remove companies without names from the companies.ts file"""
    
    # Read the current file
    with open('/Users/rafaelfirme/talenthui/src/data/companies.ts', 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all company objects using regex
    # Look for the pattern: { ... } where each company object is between braces
    company_pattern = r'\{\s*id:\s*"[^"]+",\s*[^}]*\}'
    companies = re.findall(company_pattern, content, re.DOTALL)
    
    print(f"Found {len(companies)} potential companies")
    
    # Filter companies that have names
    valid_companies = []
    for company in companies:
        if 'name:' in company:
            valid_companies.append(company)
        else:
            print(f"Removing company without name: {company[:100]}...")
    
    print(f"Keeping {len(valid_companies)} companies with names")
    
    # Rebuild the file
    new_content = """import { Company } from '@/types';

export const mockCompanies: Company[] = [
"""
    
    for i, company in enumerate(valid_companies):
        if i > 0:
            new_content += ",\n"
        new_content += "  " + company
    
    new_content += "\n];"
    
    # Write the cleaned file
    with open('/Users/rafaelfirme/talenthui/src/data/companies.ts', 'w', encoding='utf-8') as f:
        f.write(new_content)
    
    print(f"Successfully cleaned companies file. Kept {len(valid_companies)} companies with names.")

if __name__ == '__main__':
    clean_companies_file()
