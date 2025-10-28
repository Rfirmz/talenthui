'use client';

import { Profile } from '@/types';
import { mockCompanies } from '@/data/companies';

interface ProfileCardProps {
  profile: Profile;
  onClick?: (profile: Profile) => void;
}

export default function ProfileCard({ profile, onClick }: ProfileCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick(profile);
    }
  };

  // Find the company logo for this profile's company
  const companyLogo = profile.company 
    ? mockCompanies.find(c => c.name.toLowerCase() === profile.company?.toLowerCase())?.logo_url
    : null;

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-200 cursor-pointer hover:scale-105"
      onClick={handleClick}
    >
      <div className="flex items-center space-x-4">
        <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
          <span className="text-primary-600 font-bold text-xl">
            {profile.full_name?.split(' ').map(n => n[0]).join('') || '?'}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{profile.full_name || 'No name'}</h3>
          <p className="text-primary-600 font-normal">{profile.current_title || 'No title'}</p>
          <div className="flex items-center space-x-2">
            {companyLogo && companyLogo !== '/avatars/placeholder.svg' && companyLogo.startsWith('http') ? (
              <img 
                src={companyLogo} 
                alt={`${profile.company} logo`}
                className="w-4 h-4 object-contain"
                onError={(e) => {
                  // Hide logo if it fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : null}
            <p className="text-gray-600 text-sm">{profile.company || 'No company'}</p>
          </div>
          <p className="text-gray-500 text-sm">
            {[profile.city, profile.island].filter(Boolean).join(', ') || 'No location'}
          </p>
          <p className="text-gray-500 text-sm">{profile.school || 'No school'}</p>
        </div>
      </div>
      <div className="mt-4">
        <p className="text-gray-700 text-sm line-clamp-2">{profile.bio || 'No bio available'}</p>
      </div>
      <div className="mt-4 flex space-x-2">
        {profile.linkedin_url && (
          <a 
            href={profile.linkedin_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            LinkedIn
          </a>
        )}
        {profile.github_url && (
          <a 
            href={profile.github_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 text-sm"
            onClick={(e) => e.stopPropagation()}
          >
            GitHub
          </a>
        )}
      </div>
      <div className="mt-3 text-xs text-gray-400 text-center">
        Click to view full profile
      </div>
    </div>
  );
}
