'use client';

import Image from 'next/image';
import { useState } from 'react';

interface AdvisorCardProps {
  name: string;
  role: string;
  imageSrc?: string;
  description: string;
  highlight?: string;
  fallbackInitial: string;
  colorVariant?: 'primary' | 'secondary' | 'accent';
}

export default function AdvisorCard({
  name,
  role,
  imageSrc,
  description,
  highlight,
  fallbackInitial,
  colorVariant = 'primary',
}: AdvisorCardProps) {
  const [imageError, setImageError] = useState(false);

  const gradientClasses = {
    primary: 'from-primary-400 to-primary-600',
    secondary: 'from-secondary-400 to-secondary-600',
    accent: 'from-accent-400 to-accent-600',
  };

  const textClasses = {
    primary: 'text-primary-600',
    secondary: 'text-secondary-600',
    accent: 'text-accent-600',
  };

  const gradientClass = gradientClasses[colorVariant];
  const textClass = textClasses[colorVariant];

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-md relative">
        {imageSrc && !imageError ? (
          <Image
            src={imageSrc}
            alt={name}
            width={128}
            height={128}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} rounded-full flex items-center justify-center`}>
            <span className="text-white font-bold text-2xl">{fallbackInitial}</span>
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{name}</h3>
      <p className="text-primary-600 font-medium mb-2">{role}</p>
      {highlight && (
        <p className="text-sm text-gray-700 mb-2 font-semibold">{highlight}</p>
      )}
      <p className="text-sm text-gray-500 italic">{description}</p>
    </div>
  );
}

