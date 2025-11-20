'use client';

import Image from 'next/image';
import { useState } from 'react';

interface AdvisorCardProps {
  name: string;
  role: string;
  imageSrc?: string;
  description: string;
  highlight?: string;
  highlightLine2?: string;
  subtitle?: string;
  fallbackInitial: string;
  colorVariant?: 'primary' | 'secondary' | 'accent';
}

export default function AdvisorCard({
  name,
  role,
  imageSrc,
  description,
  highlight,
  highlightLine2,
  subtitle,
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

  // Apply more zoom for Darius and Reid to remove black border
  const isDariusOrReid = imageSrc && (imageSrc.includes('darius') || imageSrc.includes('reid'));
  const scaleClass = isDariusOrReid ? 'scale-125' : 'scale-110';

  return (
    <div className="bg-white rounded-lg shadow-md p-6 text-center">
      <div className="w-32 h-32 mx-auto mb-4 rounded-full overflow-hidden shadow-md relative bg-gray-100">
        {imageSrc && !imageError ? (
          <div className={`w-full h-full ${scaleClass}`}>
            <Image
              src={imageSrc}
              alt={name}
              width={256}
              height={256}
              quality={100}
              className="w-full h-full object-cover object-center"
              style={{ objectPosition: 'center center' }}
              onError={() => setImageError(true)}
            />
          </div>
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradientClass} rounded-full flex items-center justify-center`}>
            <span className="text-white font-bold text-2xl">{fallbackInitial}</span>
          </div>
        )}
      </div>
      <h3 className="text-xl font-semibold text-gray-900 mb-2">{name}</h3>
      <p className="text-primary-600 font-medium mb-1">{role}</p>
      {subtitle && (
        <p className="text-primary-600 font-medium mb-2 text-sm">{subtitle}</p>
      )}
      {highlight && (
        <div className="mb-2">
          <p className="text-sm text-gray-700 font-semibold">{highlight}</p>
          {highlightLine2 && (
            <p className="text-sm text-gray-700 font-semibold">{highlightLine2}</p>
          )}
        </div>
      )}
      <p className="text-sm text-gray-500 italic">{description}</p>
    </div>
  );
}

