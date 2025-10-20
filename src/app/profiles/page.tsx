'use client';

import { useState, useMemo } from 'react';
import { mockProfiles } from '@/data/profiles';
import ProfileCard from '@/components/cards/ProfileCard';
import SearchBar from '@/components/ui/SearchBar';
import FilterDropdown from '@/components/ui/FilterDropdown';

export default function ProfilesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [islandFilter, setIslandFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');

  // Get unique values for filters
  const islands = Array.from(new Set(mockProfiles.map(p => p.island))).sort();
  const cities = Array.from(new Set(mockProfiles.map(p => p.city))).sort();
  const schools = Array.from(new Set(mockProfiles.map(p => p.school))).sort();

  // Filter profiles based on search and filters
  const filteredProfiles = useMemo(() => {
    return mockProfiles.filter(profile => {
      const matchesSearch = profile.full_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           profile.current_title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           profile.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           profile.bio.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesIsland = !islandFilter || profile.island === islandFilter;
      const matchesCity = !cityFilter || profile.city === cityFilter;
      const matchesSchool = !schoolFilter || profile.school === schoolFilter;

      return matchesSearch && matchesIsland && matchesCity && matchesSchool;
    });
  }, [searchTerm, islandFilter, cityFilter, schoolFilter]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hawaii's Talent Directory
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover skilled professionals across the islands. Connect with talent that understands Hawaii's unique culture and values.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <SearchBar
                placeholder="Search by name, title, company, or bio..."
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
            <FilterDropdown
              label="City"
              options={cities}
              value={cityFilter}
              onChange={setCityFilter}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FilterDropdown
              label="School"
              options={schools}
              value={schoolFilter}
              onChange={setSchoolFilter}
            />
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setIslandFilter('');
                  setCityFilter('');
                  setSchoolFilter('');
                }}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing {filteredProfiles.length} of {mockProfiles.length} professionals
          </p>
        </div>

        {/* Profiles Grid */}
        {filteredProfiles.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProfiles.map((profile) => (
              <ProfileCard key={profile.id} profile={profile} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No profiles found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find more professionals.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
