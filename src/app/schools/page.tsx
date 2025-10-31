'use client';

import { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { mockSchools } from '@/data/schools';
import { universityLeaderboard, highSchoolLeaderboard } from '@/data/leaderboard';
import SchoolCard from '@/components/cards/SchoolCard';
import LeaderboardTable from '@/components/ui/LeaderboardTable';
import SearchBar from '@/components/ui/SearchBar';
import FilterDropdown from '@/components/ui/FilterDropdown';
import Pagination from '@/components/ui/Pagination';

export default function SchoolsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [islandFilter, setIslandFilter] = useState('');
  const [activeTab, setActiveTab] = useState<'schools' | 'universities' | 'high_schools'>('schools');
  const [schools, setSchools] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [useRealData, setUseRealData] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18; // Show 18 schools per page (3x6 grid)

  // Load schools from Supabase profiles
  useEffect(() => {
    const loadSchools = async () => {
      try {
        setIsLoading(true);
        const { data: profiles, error } = await supabase
          .from('profiles')
          .select('school, island, city')
          .eq('visibility', true)
          .not('school', 'is', null);

        if (error) {
          console.error('Error loading schools:', error);
          setUseRealData(false);
        } else {
          // Count alumni per school and filter out high schools
          const schoolCounts = new Map<string, { count: number; island: string; city: string }>();
          
          profiles?.forEach(profile => {
            const schoolName = profile.school?.trim();
            if (!schoolName) return;
            
            // Filter out high schools (containing "High School", "High", or ending with "School" without "College" or "University")
            const isHighSchool = 
              /high\s+school/i.test(schoolName) ||
              /\bhigh\b$/i.test(schoolName) ||
              (/\bschool\b$/i.test(schoolName) && 
               !/college|university|institute|academy/i.test(schoolName));
            
            if (isHighSchool) return;
            
            if (schoolCounts.has(schoolName)) {
              const existing = schoolCounts.get(schoolName)!;
              existing.count++;
            } else {
              schoolCounts.set(schoolName, {
                count: 1,
                island: profile.island || 'Unknown',
                city: profile.city || 'Unknown'
              });
            }
          });

          // Convert to array and create school objects
          const schoolsArray = Array.from(schoolCounts.entries()).map(([name, data]) => ({
            id: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            name: name,
            slug: name.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
            island: data.island,
            city: data.city,
            logo_url: '', // No logo for now
            alumni_count: data.count,
            description: `${data.count} alumni in Talent Hui`
          }));

          // Sort by alumni count (descending)
          schoolsArray.sort((a, b) => b.alumni_count - a.alumni_count);
          
          setSchools(schoolsArray);
          setUseRealData(true);
        }
      } catch (err) {
        console.error('Error loading schools:', err);
        setUseRealData(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadSchools();
  }, []);

  // Get unique values for filters
  const currentSchools = useRealData ? schools : mockSchools;
  const islands = Array.from(new Set(currentSchools.map(s => s.island))).filter(Boolean).sort();

  // Filter schools based on search and filters
  const filteredSchools = useMemo(() => {
    return currentSchools.filter(school => {
      const matchesSearch = school.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           school.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesIsland = !islandFilter || school.island === islandFilter;

      return matchesSearch && matchesIsland;
    });
  }, [currentSchools, searchTerm, islandFilter]);

  // Paginate filtered schools
  const paginatedSchools = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredSchools.slice(startIndex, endIndex);
  }, [filteredSchools, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, islandFilter, activeTab]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

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
            <div className="mb-6 flex justify-between items-center">
              <p className="text-gray-600">
                Showing {paginatedSchools.length} of {filteredSchools.length} schools
                {filteredSchools.length !== currentSchools.length && ` (${currentSchools.length} total)`}
              </p>
              <span className={`px-2 py-1 rounded text-xs font-medium ${
                useRealData 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-yellow-100 text-yellow-800'
              }`}>
                {useRealData ? 'Real Data (No High Schools)' : 'Mock Data'}
              </span>
            </div>

            {/* Loading State */}
            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-primary-600 text-lg">Loading schools...</div>
              </div>
            ) : (
              /* Schools Grid */
              filteredSchools.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                    {paginatedSchools.map((school) => (
                      <SchoolCard key={school.id} school={school} />
                    ))}
                  </div>
                  
                  {/* Pagination */}
                  {filteredSchools.length > itemsPerPage && (
                    <Pagination
                      totalItems={filteredSchools.length}
                      itemsPerPage={itemsPerPage}
                      currentPage={currentPage}
                      onPageChange={setCurrentPage}
                    />
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="text-gray-400 text-6xl mb-4">🎓</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No schools found</h3>
                  <p className="text-gray-600">
                    Try adjusting your search terms or filters to find more schools.
                  </p>
                </div>
              )
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
            {isLoading ? (
              <div className="text-center py-12">
                <div className="text-primary-600 text-lg">Loading leaderboard...</div>
              </div>
            ) : useRealData && schools.length > 0 ? (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rank</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">University</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alumni Count</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {schools.slice(0, 20).map((school, index) => (
                      <tr key={school.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          #{index + 1}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {school.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {school.city}, {school.island}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {school.alumni_count} alumni
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <LeaderboardTable 
                entries={universityLeaderboard} 
                title="University Rankings"
                showMetrics={true}
              />
            )}
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
