import { City } from '@/types';
import Link from 'next/link';

interface CityCardProps {
  city: City;
}

export default function CityCard({ city }: CityCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-200 p-6 border border-gray-200">
      <Link href={`/cities/${city.slug}`} className="block">
        <div className="text-center">
          <h3 className="text-xl font-medium text-gray-900 mb-2">{city.name}</h3>
          <p className="text-gray-600 text-sm mb-4">{city.island}</p>
          
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="text-2xl font-semibold text-primary-600">{city.talent_count}</div>
              <div className="text-sm text-gray-500">Talent</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-secondary-600">{city.company_count}</div>
              <div className="text-sm text-gray-500">Companies</div>
            </div>
          </div>
          
          <div className="text-center">
            <span className="text-accent-600 font-normal">
              Avg Salary: ${city.avg_salary.toLocaleString()}
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
}
