'use client';

import { mockCompanies } from '@/data/companies';

export default function CompanyCarousel() {
  // Get companies with real logos (not placeholder)
  const companiesWithLogos = mockCompanies.filter(company => 
    company.logo_url && 
    company.logo_url !== '/avatars/placeholder.svg' &&
    company.logo_url.startsWith('http')
  );

  // Duplicate companies for seamless loop
  const duplicatedCompanies = [...companiesWithLogos, ...companiesWithLogos, ...companiesWithLogos];

  return (
    <div className="relative w-full overflow-hidden bg-gray-50 py-8">
      <div className="flex gap-8 animate-scroll">
        {duplicatedCompanies.map((company, index) => (
          <div key={`${company.id}-${index}`} className="flex-shrink-0">
            <div className="relative w-32 h-32 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center p-4 hover:shadow-xl transition-shadow duration-300">
              <img
                src={company.logo_url}
                alt={`${company.name} logo`}
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to initials if image fails to load
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  const parent = target.parentElement;
                  if (parent) {
                    parent.innerHTML = `<span class="text-secondary-600 font-bold text-2xl">${company.name.split(' ').map(n => n[0]).join('')}</span>`;
                    parent.className = 'relative w-32 h-32 bg-secondary-100 rounded-lg shadow-lg border border-gray-200 flex items-center justify-center p-4 hover:shadow-xl transition-shadow duration-300';
                  }
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
