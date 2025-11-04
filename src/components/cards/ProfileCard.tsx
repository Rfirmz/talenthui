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

  // Get company name - check both current_company and company fields
  const companyName = profile.company || (profile as any).current_company || '';
  
  // Find the company logo for this profile's company
  const companyLogo = companyName
    ? mockCompanies.find(c => c.name === companyName)?.logo_url || null
    : null;

  // Check if we have a real avatar (not placeholder)
  const hasRealAvatar = profile.avatar_url && 
    profile.avatar_url !== '/avatars/placeholder.svg' && 
    !profile.avatar_url.includes('placeholder');

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-200 cursor-pointer hover:scale-105"
      onClick={handleClick}
    >
      <div className="flex items-center space-x-4">
        {hasRealAvatar ? (
          <img 
            src={profile.avatar_url} 
            alt={profile.full_name || 'Profile'}
            className="w-16 h-16 rounded-full object-cover border-2 border-primary-100"
            onError={(e) => {
              // Fallback to initials if image fails to load
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const parent = target.parentElement;
              if (parent) {
                const initialsDiv = document.createElement('div');
                initialsDiv.className = 'w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center';
                initialsDiv.innerHTML = `<span class="text-primary-600 font-bold text-xl">${profile.full_name?.split(' ').map(n => n[0]).join('') || '?'}</span>`;
                parent.appendChild(initialsDiv);
              }
            }}
          />
        ) : (
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-primary-600 font-bold text-xl">
              {profile.full_name?.split(' ').map(n => n[0]).join('') || '?'}
            </span>
          </div>
        )}
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{profile.full_name || 'No name'}</h3>
          <div className="flex items-center space-x-2">
            {companyLogo && companyLogo !== '/avatars/placeholder.svg' && companyLogo.startsWith('http') ? (
              <img 
                src={companyLogo} 
                alt={`${companyName} logo`}
                className="w-4 h-4 object-contain"
                onError={(e) => {
                  // Hide logo if it fails to load
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
            ) : null}
            <p className="text-gray-600 text-sm font-medium">{companyName || 'No company'}</p>
          </div>
          <p className="text-primary-600 font-normal text-sm">{profile.current_title || 'No title'}</p>
          
          {/* Location - Show current_city or fallback to city/island */}
          {(profile.current_city || profile.city || profile.island) && (
            <p className="text-gray-500 text-sm">
              {profile.current_city || [profile.city, profile.island].filter(Boolean).join(', ')}
              {profile.hometown && profile.hometown !== profile.current_city && (
                <span className="text-gray-400"> (from {profile.hometown})</span>
              )}
            </p>
          )}
          
          {/* Education - Show college or fallback to school, with high school if available */}
          {(profile.college || profile.school || profile.high_school) && (
            <p className="text-gray-500 text-sm">
              {profile.college || profile.school}
              {profile.high_school && (
                <span className="text-gray-400 text-xs block ml-4">High School: {profile.high_school}</span>
              )}
            </p>
          )}
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
