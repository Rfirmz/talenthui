'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import Pagination from '@/components/ui/Pagination';

export default function SchoolDetailPage() {
  const params = useParams();
  const schoolSlug = params.schoolname as string;
  
  const [profiles, setProfiles] = useState<any[]>([]);
  const [schoolName, setSchoolName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20; // Show 20 profiles per page

  useEffect(() => {
    const loadSchoolProfiles = async () => {
      try {
        setIsLoading(true);
        
        // First, get all profiles to find the actual school name
        const { data: allProfiles, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('visibility', true)
          .not('school', 'is', null);

        if (error) {
          console.error('Error loading profiles:', error);
          return;
        }

        // Find profiles that match this school slug
        const matchingProfiles = allProfiles?.filter(profile => {
          const profileSlug = profile.school?.toLowerCase().replace(/[^a-z0-9]+/g, '-');
          return profileSlug === schoolSlug;
        }) || [];

        // Get the actual school name from the first matching profile
        if (matchingProfiles.length > 0) {
          setSchoolName(matchingProfiles[0].school);
        } else {
          // Decode slug to display name if no matches
          setSchoolName(schoolSlug.split('-').map(word => 
            word.charAt(0).toUpperCase() + word.slice(1)
          ).join(' '));
        }

        setProfiles(matchingProfiles);
      } catch (err) {
        console.error('Error loading school profiles:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadSchoolProfiles();
  }, [schoolSlug]);

  // Paginate profiles
  const paginatedProfiles = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return profiles.slice(startIndex, endIndex);
  }, [profiles, currentPage, itemsPerPage]);

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [currentPage]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-primary-600 text-lg">Loading school information...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/schools" 
            className="text-primary-600 hover:text-primary-800 text-sm font-medium mb-4 inline-block"
          >
            ← Back to Schools
          </Link>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {schoolName}
          </h1>
          <p className="text-lg text-gray-600">
            {profiles.length} alumni in Talent Hui
          </p>
        </div>

        {/* Alumni Count Summary */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <p className="text-sm text-gray-600 font-medium">Total Alumni</p>
              <p className="text-3xl font-bold text-primary-600">{profiles.length}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Islands Represented</p>
              <p className="text-3xl font-bold text-primary-600">
                {new Set(profiles.map(p => p.island).filter(Boolean)).size}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600 font-medium">Companies</p>
              <p className="text-3xl font-bold text-primary-600">
                {new Set(profiles.map(p => p.company).filter(Boolean)).size}
              </p>
            </div>
          </div>
        </div>

        {/* Alumni List Count */}
        <div className="mb-6 flex justify-between items-center">
          <h2 className="text-2xl font-semibold text-gray-900">Alumni Directory</h2>
          <p className="text-gray-600">
            Showing {paginatedProfiles.length} of {profiles.length} alumni
          </p>
        </div>

        {/* Alumni List - Row Format */}
        {profiles.length > 0 ? (
          <>
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Role
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Links
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProfiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center flex-shrink-0 mr-3">
                            <span className="text-primary-600 font-bold text-sm">
                              {profile.full_name?.split(' ').map((n: string) => n[0]).join('') || '?'}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {profile.full_name}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{profile.current_title || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">{profile.company || 'N/A'}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {[profile.city, profile.island].filter(Boolean).join(', ') || 'N/A'}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <div className="flex space-x-3">
                          {profile.linkedin_url && (
                            <a
                              href={profile.linkedin_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-900"
                              title="LinkedIn"
                            >
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd" />
                              </svg>
                            </a>
                          )}
                          {profile.github_url && (
                            <a
                              href={profile.github_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary-600 hover:text-primary-900"
                              title="GitHub"
                            >
                              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
                              </svg>
                            </a>
                          )}
                          {!profile.linkedin_url && !profile.github_url && (
                            <span className="text-gray-400">—</span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {profiles.length > itemsPerPage && (
              <Pagination
                totalItems={profiles.length}
                itemsPerPage={itemsPerPage}
                currentPage={currentPage}
                onPageChange={setCurrentPage}
              />
            )}
          </>
        ) : (
          <div className="text-center py-12 bg-white rounded-lg shadow-md">
            <div className="text-gray-400 text-6xl mb-4">🎓</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No alumni found</h3>
            <p className="text-gray-600">
              No profiles found for this school yet.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

