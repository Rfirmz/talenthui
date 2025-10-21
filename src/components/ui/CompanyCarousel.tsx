'use client';

import Image from 'next/image';

// All company logos from the company_photos directory
const companyLogos = [
  "/images/company_photos/bayze_logo.jpeg",
  "/images/company_photos/download.png",
  "/images/company_photos/hitechweek_logo.jpeg",
  "/images/company_photos/HTDC-Logo-new-transparent.png",
  "/images/company_photos/reef_ai_logo.jpeg",
  "/images/company_photos/unnamed-3.png"
];

export default function CompanyCarousel() {
  // Duplicate logos for seamless loop
  const duplicatedLogos = [...companyLogos, ...companyLogos, ...companyLogos];

  return (
    <div className="relative w-full overflow-hidden bg-gray-50 py-8">
      <div className="flex gap-8 animate-scroll">
        {duplicatedLogos.map((logo, index) => (
          <div key={index} className="flex-shrink-0">
            <div className="relative w-32 h-32 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center p-4 hover:shadow-xl transition-shadow duration-300">
              <Image
                src={logo}
                alt={`Company logo ${index + 1}`}
                width={120}
                height={120}
                className="object-contain max-w-full max-h-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
