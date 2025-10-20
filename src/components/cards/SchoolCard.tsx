import { School } from '@/types';
import Link from 'next/link';

interface SchoolCardProps {
  school: School;
}

export default function SchoolCard({ school }: SchoolCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200">
      <Link href={`/schools/${school.slug}`} className="block">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-accent-100 rounded-lg flex items-center justify-center">
            <span className="text-accent-600 font-bold text-lg">
              {school.name.split(' ').map(n => n[0]).join('')}
            </span>
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-medium text-gray-900">{school.name}</h3>
            <p className="text-gray-600 text-sm">{school.city}, {school.island}</p>
            <p className="text-gray-500 text-sm">{school.alumni_count} alumni on platform</p>
          </div>
        </div>
        <div className="mt-4">
          <p className="text-gray-700 text-sm line-clamp-2">{school.description}</p>
        </div>
      </Link>
      <div className="mt-4">
        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-normal bg-accent-100 text-accent-800">
          {school.alumni_count} Alumni
        </span>
      </div>
    </div>
  );
}
