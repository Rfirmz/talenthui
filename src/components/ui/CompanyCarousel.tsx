'use client';

import { useState } from 'react';
import Image from 'next/image';
import { mockCompanies } from '@/data/companies';

export default function CompanyCarousel() {
  // Featured client companies (prioritize these)
  const featuredClientNames = [
    'Reef.ai', 
    'AEP Hawaii', 
    'Hawaii Technology Development Corporation',
    'Bayze',
    'Honolulu Tech Week',
    'Hawaii Technology Academy',
    'Hawaii Techies',
    'SAVON',
    'NogaTech IT Solutions'
  ];
  const featuredClients = mockCompanies.filter(company => 
    featuredClientNames.includes(company.name) &&
    company.logo_url && 
    company.logo_url !== '/avatars/placeholder.svg'
  );

  // Get other companies with real logos (not placeholder)
  const otherCompaniesWithLogos = mockCompanies.filter(company => 
    !featuredClientNames.includes(company.name) &&
    company.logo_url && 
    company.logo_url !== '/avatars/placeholder.svg' &&
    company.logo_url.startsWith('http')
  );

  // Prioritize featured clients, then add others
  const companiesWithLogos = [...featuredClients, ...otherCompaniesWithLogos.slice(0, 10)];

  // Duplicate companies for seamless loop
  const duplicatedCompanies = [...companiesWithLogos, ...companiesWithLogos, ...companiesWithLogos];

  return (
    <div className="relative w-full overflow-hidden bg-gray-50 py-8">
      <div className="flex gap-8 animate-scroll">
        {duplicatedCompanies.map((company, index) => (
          <CompanyLogoItem key={`${company.id}-${index}`} company={company} />
        ))}
      </div>
    </div>
  );
}

function CompanyLogoItem({ company }: { company: any }) {
  const [imageError, setImageError] = useState(false);
  const initials = company.name.split(' ').map((n: string) => n[0]).join('').slice(0, 2);
  const hasLogo = company.logo_url && company.logo_url !== '' && company.logo_url !== '/avatars/placeholder.svg';

  if (imageError || !hasLogo) {
    return (
      <div className="flex-shrink-0">
        <div className="relative w-32 h-32 bg-gray-200 rounded-lg shadow-lg border border-gray-200 flex items-center justify-center p-4 hover:shadow-xl transition-shadow duration-300">
          <span className="text-gray-600 font-bold text-2xl">{initials}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-shrink-0">
      <div className="relative w-32 h-32 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center p-4 hover:shadow-xl transition-shadow duration-300">
        <img
          src={company.logo_url}
          alt={`${company.name} logo`}
          className="w-full h-full object-contain"
          onError={() => setImageError(true)}
        />
      </div>
    </div>
  );
}
