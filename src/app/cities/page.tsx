'use client';

import { useState, useMemo } from 'react';
import { mockCities } from '@/data/cities';
import CityCard from '@/components/cards/CityCard';
import SearchBar from '@/components/ui/SearchBar';
import FilterDropdown from '@/components/ui/FilterDropdown';

export default function CitiesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [islandFilter, setIslandFilter] = useState('');

  // Get unique values for filters
  const islands = Array.from(new Set(mockCities.map(c => c.island))).sort();

  // Filter cities based on search and filters
  const filteredCities = useMemo(() => {
    return mockCities.filter(city => {
      const matchesSearch = city.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesIsland = !islandFilter || city.island === islandFilter;

      return matchesSearch && matchesIsland;
    });
  }, [searchTerm, islandFilter]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hawaii's Cities & Towns
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore talent and opportunities across Hawaii's diverse communities. 
            From bustling Honolulu to charming small towns, discover what each location offers.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2">
              <SearchBar
                placeholder="Search by city name..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </div>
            <FilterDropdown
              label="Island"
              options={islands}
              value={islandFilter}
              onChange={setIslandFilter}
            />
          </div>
          <div className="mt-4">
            <button
              onClick={() => {
                setSearchTerm('');
                setIslandFilter('');
              }}
              className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredCities.length} of {mockCities.length} cities
          </p>
        </div>

        {/* Cities Grid */}
        {filteredCities.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCities.map((city) => (
              <CityCard key={city.id} city={city} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏝️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No cities found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find more cities.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
