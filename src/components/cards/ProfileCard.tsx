'use client';

import { useState } from 'react';
import { Profile } from '@/types';
import { mockCompanies } from '@/data/companies';

interface ProfileCardProps {
  profile: Profile;
  onClick?: (profile: Profile) => void;
}

export default function ProfileCard({ profile, onClick }: ProfileCardProps) {
  const [avatarError, setAvatarError] = useState(false);
  const [companyLogoError, setCompanyLogoError] = useState(false);

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
    !profile.avatar_url.includes('placeholder') &&
    !avatarError;

  // Get initials for fallback
  const getInitials = (name: string) => {
    if (!name) return '?';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Truncate long job titles
  const truncateTitle = (title: string, maxLength: number = 40) => {
    if (!title) return 'No title';
    return title.length > maxLength ? title.substring(0, maxLength) + '...' : title;
  };

  // Get skills array
  const skills = (profile as any).skills || [];
  const yearsExp = (profile as any).years_experience || 0;

  return (
    <div 
      className="bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-200 cursor-pointer hover:scale-105"
      onClick={handleClick}
    >
      <div className="flex items-start space-x-4">
        {/* Standardized Avatar */}
        <div className="flex-shrink-0">
          <img
            src={hasRealAvatar ? profile.avatar_url : '/avatars/placeholder.svg'}
            alt={profile.full_name || 'Profile'}
            className="w-20 h-20 rounded-full object-cover border-[3px] border-primary-200 shadow-sm"
            onError={() => setAvatarError(true)}
          />
        </div>
        
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{profile.full_name || 'No name'}</h3>
          
          {/* Job Title - Truncated */}
          <p className="text-primary-600 font-medium text-sm mt-1 truncate">
            {truncateTitle(profile.current_title || 'No title')}
          </p>
          
          {/* Company */}
          <div className="flex items-center space-x-2 mt-1">
            {companyLogo && companyLogo !== '/avatars/placeholder.svg' && companyLogo.startsWith('http') && !companyLogoError ? (
              <img 
                src={companyLogo} 
                alt={`${companyName} logo`}
                className="w-4 h-4 object-contain flex-shrink-0"
                onError={() => setCompanyLogoError(true)}
              />
            ) : null}
            <p className="text-gray-600 text-sm truncate">{companyName || 'No company'}</p>
          </div>
          
          {/* Location Intent Tags */}
          <div className="flex flex-wrap gap-1 mt-2">
            {profile.current_city && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-600 text-white">
                <svg className="w-3 h-3 mr-1 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                </svg>
                {profile.current_city}
              </span>
            )}
            {profile.hometown && profile.hometown !== profile.current_city && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-purple-600 text-white">
                <svg className="w-3 h-3 mr-1 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
                </svg>
                {profile.hometown}
              </span>
            )}
            {profile.island && (
              <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-600 text-white">
                <svg className="w-3 h-3 mr-1 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                {profile.island}
              </span>
            )}
          </div>

          {/* Experience & Skills */}
          <div className="mt-3 space-y-1">
            {yearsExp > 0 && (
              <p className="text-gray-600 text-xs">
                <span className="font-medium">{yearsExp} years</span> experience
              </p>
            )}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {skills.slice(0, 3).map((skill: string, idx: number) => (
                  <span key={idx} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                    {skill}
                  </span>
                ))}
                {skills.length > 3 && (
                  <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium text-gray-500">
                    +{skills.length - 3} more
                  </span>
                )}
              </div>
            )}
          </div>
          
          {/* Bio - Minimum quality check */}
          {profile.bio && profile.bio.length >= 20 ? (
            <p className="text-gray-700 text-sm line-clamp-2 mt-3">{profile.bio}</p>
          ) : profile.bio && profile.bio.length < 20 ? (
            <p className="text-gray-400 text-xs italic mt-3">Bio too short</p>
          ) : null}
        </div>
      </div>
      
      {/* Social Links */}
      <div className="mt-4 flex space-x-3 pt-3 border-t border-gray-100">
        {profile.linkedin_url && (
          <a 
            href={profile.linkedin_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            LinkedIn →
          </a>
        )}
        {profile.github_url && (
          <a 
            href={profile.github_url} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-gray-700 text-sm font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            GitHub →
          </a>
        )}
      </div>
    </div>
  );
}
