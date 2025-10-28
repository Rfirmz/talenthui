'use client';

import { Company } from '@/types';
import Link from 'next/link';

interface CompanyCardProps {
  company: Company;
}

export default function CompanyCard({ company }: CompanyCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200 cursor-pointer group">
      <Link href={`/companies/${company.slug}`} className="block">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden">
            {company.logo_url && company.logo_url !== '/avatars/placeholder.svg' ? (
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
                    parent.innerHTML = `<span class="text-secondary-600 font-bold text-lg">${company.name.split(' ').map(n => n[0]).join('')}</span>`;
                    parent.className = 'w-16 h-16 bg-secondary-100 rounded-lg flex items-center justify-center';
                  }
                }}
              />
            ) : (
              <span className="text-secondary-600 font-bold text-lg">
                {company.name.split(' ').map(n => n[0]).join('')}
              </span>
            )}
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900 group-hover:text-primary-600 transition-colors">{company.name}</h3>
            <p className="text-gray-600 text-sm">{company.industry}</p>
            <p className="text-gray-500 text-sm">{company.city}, {company.island}</p>
            <p className="text-gray-500 text-sm">{company.size} employees</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-700 text-sm line-clamp-2">{company.description}</p>
        </div>
      </Link>
      <div className="mt-4 flex justify-end items-center">
        <div className="flex space-x-2">
          {company.website && (
            <a 
              href={company.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-primary-600 hover:text-primary-700 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              Website →
            </a>
          )}
          {company.linkedin_url && (
            <a 
              href={company.linkedin_url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 hover:text-blue-700 text-sm"
              onClick={(e) => e.stopPropagation()}
            >
              LinkedIn →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
