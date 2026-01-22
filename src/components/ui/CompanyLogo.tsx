'use client';

import { useState } from 'react';

interface CompanyLogoProps {
  logoUrl: string | null | undefined;
  companyName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function CompanyLogo({ logoUrl, companyName, size = 'md', className = '' }: CompanyLogoProps) {
  const [imageError, setImageError] = useState(false);
  
console.log('CompanyLogo props:', { logoUrl, companyName, size, className });

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-2xl',
    lg: 'text-3xl'
  };

  const initials = companyName.split(' ').map(n => n[0]).join('').slice(0, 2);

  if (imageError || !logoUrl || logoUrl === '' || logoUrl === '/avatars/placeholder.svg') {
    return (
      <div className={`${sizeClasses[size]} bg-gray-200 rounded-lg flex items-center justify-center ${className}`}>
        <span className={`text-gray-600 font-bold ${textSizes[size]}`}>
          {initials}
        </span>
      </div>
    );
  }

  return (
    <div className={`${sizeClasses[size]} bg-white rounded-lg flex items-center justify-center border border-gray-200 overflow-hidden ${className}`}>
      <img 
        src={logoUrl} 
        alt={`${companyName} logo`}
        className="w-full h-full object-contain"
        onError={() => setImageError(true)}
      />
    </div>
  );
}

