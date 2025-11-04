'use client';

import { useState, useMemo, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { mockProfiles } from '@/data/profiles';
import ProfileCard from '@/components/cards/ProfileCard';
import ProfileModal from '@/components/modals/ProfileModal';
import SearchBar from '@/components/ui/SearchBar';
import FilterDropdown from '@/components/ui/FilterDropdown';
import Pagination from '@/components/ui/Pagination';
import Link from 'next/link';

export default function ProfilesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [islandFilter, setIslandFilter] = useState('');
  const [cityFilter, setCityFilter] = useState('');
  const [schoolFilter, setSchoolFilter] = useState('');
  const [profiles, setProfiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [useRealData, setUseRealData] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 24; // Show 24 profiles per page

  // Load profiles from Supabase
  useEffect(() => {
    const loadProfiles = async () => {
      try {
        setIsLoading(true);
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('visibility', true)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error loading profiles:', error);
          setError('Failed to load profiles');
          setUseRealData(false);
        } else {
          // Map current_company to company for compatibility
          const mappedData = (data || []).map(profile => ({
            ...profile,
            company: profile.current_company || profile.company || '',
          }));
          
          // Sort to put Rafael Firme first
          const sortedData = mappedData.sort((a, b) => {
            if (a.full_name?.toLowerCase().includes('rafael firme')) return -1;
            if (b.full_name?.toLowerCase().includes('rafael firme')) return 1;
            return 0;
          });
          setProfiles(sortedData);
          setUseRealData(true);
        }
      } catch (err) {
        console.error('Error loading profiles:', err);
        setError('Failed to load profiles');
        setUseRealData(false);
      } finally {
        setIsLoading(false);
      }
    };

    loadProfiles();
  }, []);

  const handleProfileClick = (profile: any) => {
    setSelectedProfile(profile);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProfile(null);
  };

  // Get unique values for filters
  const currentProfiles = useRealData ? profiles : mockProfiles;
  const islands = Array.from(new Set(currentProfiles.map(p => p.island).filter(Boolean))).sort();
  const cities = Array.from(new Set(currentProfiles.map(p => p.city).filter(Boolean))).sort();
  const schools = Array.from(new Set(currentProfiles.map(p => p.school).filter(Boolean))).sort();

  // Filter profiles based on search and filters
  const filteredProfiles = useMemo(() => {
    return currentProfiles.filter(profile => {
      const matchesSearch = profile.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           profile.current_title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           profile.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           profile.bio?.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesIsland = !islandFilter || profile.island === islandFilter;
      const matchesCity = !cityFilter || profile.city === cityFilter;
      const matchesSchool = !schoolFilter || profile.school === schoolFilter;

      return matchesSearch && matchesIsland && matchesCity && matchesSchool;
    });
  }, [currentProfiles, searchTerm, islandFilter, cityFilter, schoolFilter]);

  // Paginate filtered profiles
  const paginatedProfiles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredProfiles.slice(startIndex, endIndex);
  }, [filteredProfiles, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, islandFilter, cityFilter, schoolFilter]);

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

        {/* Data Source Toggle and Results Count */}
        <div className="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <p className="text-gray-600">
              Showing {paginatedProfiles.length} of {filteredProfiles.length} professionals
              {filteredProfiles.length !== currentProfiles.length && ` (${currentProfiles.length} total)`}
            </p>
            {error && (
              <span className="text-red-600 text-sm">({error})</span>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Data source:</span>
            <span className={`px-2 py-1 rounded text-xs font-medium ${
              useRealData 
                ? 'bg-green-100 text-green-800' 
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {useRealData ? 'Supabase' : 'Mock Data'}
            </span>
            {!useRealData && (
              <Link 
                href="/profile/edit"
                className="text-primary-600 hover:text-primary-800 text-sm font-medium"
              >
                Create your profile →
              </Link>
            )}
          </div>
        </div>

        {/* Loading State */}
        {isLoading ? (
          <div className="text-center py-12">
            <div className="text-primary-600 text-lg">Loading profiles...</div>
          </div>
        ) : (
          /* Profiles Grid */
          filteredProfiles.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedProfiles.map((profile) => (
                  <ProfileCard 
                    key={profile.id} 
                    profile={profile} 
                    onClick={handleProfileClick}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              {filteredProfiles.length > itemsPerPage && (
                <Pagination
                  totalItems={filteredProfiles.length}
                  itemsPerPage={itemsPerPage}
                  currentPage={currentPage}
                  onPageChange={setCurrentPage}
                />
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <div className="text-gray-400 text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No profiles found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or filters to find more professionals.
              </p>
              {!useRealData && (
                <Link 
                  href="/profile/edit"
                  className="inline-block bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Be the first to create a profile
                </Link>
              )}
            </div>
          )
        )}

        {/* Profile Modal */}
        <ProfileModal
          profile={selectedProfile}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      </div>
    </div>
  );
}
