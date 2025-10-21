'use client';

import { useState, useMemo } from 'react';
import { mockSchools } from '@/data/schools';
import { universityLeaderboard, highSchoolLeaderboard } from '@/data/leaderboard';
import SchoolCard from '@/components/cards/SchoolCard';
import LeaderboardTable from '@/components/ui/LeaderboardTable';
import SearchBar from '@/components/ui/SearchBar';
import FilterDropdown from '@/components/ui/FilterDropdown';

export default function SchoolsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [islandFilter, setIslandFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'schools' | 'universities' | 'high_schools'>('schools');

  // Get unique values for filters
  const islands = Array.from(new Set(mockSchools.map(s => s.island))).sort();

  // Filter schools based on search and filters
  const filteredSchools = useMemo(() => {
    return mockSchools.filter(school => {
      const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           school.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesIsland = !islandFilter || school.island === islandFilter;

      return matchesSearch && matchesIsland;
    });
  }, [searchTerm, islandFilter]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Hawaii's Educational Institutions
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore Hawaii's universities and colleges. See where our talented professionals 
            got their start and discover the alumni network.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b-2 border-gray-300">
            <nav className="-mb-px flex space-x-12">
              <button
                onClick={() => setActiveTab('schools')}
                className={`py-4 px-6 border-b-4 font-bold text-lg transition-all duration-200 ${
                  activeTab === 'schools'
                    ? 'border-primary-500 text-primary-600 bg-primary-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                All Schools
              </button>
              <button
                onClick={() => setActiveTab('universities')}
                className={`py-4 px-6 border-b-4 font-bold text-lg transition-all duration-200 ${
                  activeTab === 'universities'
                    ? 'border-primary-500 text-primary-600 bg-primary-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                University Leaderboard
              </button>
              <button
                onClick={() => setActiveTab('high_schools')}
                className={`py-4 px-6 border-b-4 font-bold text-lg transition-all duration-200 ${
                  activeTab === 'high_schools'
                    ? 'border-primary-500 text-primary-600 bg-primary-50'
                    : 'border-transparent text-gray-600 hover:text-gray-800 hover:border-gray-400 hover:bg-gray-50'
                }`}
              >
                High School Leaderboard
              </button>
            </nav>
          </div>
        </div>

        {/* Search and Filters - Only show for schools tab */}
        {activeTab === 'schools' && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <SearchBar
                  placeholder="Search by school name or description..."
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
        )}

        {/* Content based on active tab */}
        {activeTab === 'schools' && (
          <>
            {/* Results Count */}
            <div className="mb-6">
              <p className="text-gray-600">
                Showing {filteredSchools.length} of {mockSchools.length} schools
              </p>
            </div>

            {/* Schools Grid */}
            {filteredSchools.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredSchools.map((school) => (
                  <SchoolCard key={school.id} school={school} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No schools found</h3>
                <p className="text-gray-600">
                  Try adjusting your search terms or filters to find more schools.
                </p>
              </div>
            )}
          </>
        )}

        {activeTab === 'universities' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">University Leaderboard</h2>
              <p className="text-gray-600">
                Top universities by alumni count in Talent Hui
              </p>
            </div>
            <LeaderboardTable 
              entries={universityLeaderboard} 
              title="University Rankings"
              showMetrics={true}
            />
          </div>
        )}

        {activeTab === 'high_schools' && (
          <div className="space-y-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">High School Leaderboard</h2>
              <p className="text-gray-600">
                Top high schools by alumni count in Talent Hui
              </p>
            </div>
            <LeaderboardTable 
              entries={highSchoolLeaderboard} 
              title="High School Rankings"
              showMetrics={true}
            />
          </div>
        )}
      </div>
    </div>
  );
}
