'use client';

import { useState, useMemo } from 'react';
import { mockCompanies } from '@/data/companies';
import SearchBar from '@/components/ui/SearchBar';
import FilterDropdown from '@/components/ui/FilterDropdown';
import Pagination from '@/components/ui/Pagination';
import CompanyLogo from '@/components/ui/CompanyLogo';
import Link from 'next/link';

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [islandFilter, setIslandFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const itemsPerPage = 20; // Show 20 companies per page

  // Standardized company size ranges
  const standardizedSizes = ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'];
  
  // Helper to normalize company size to standard ranges
  const normalizeSize = (size: string): string => {
    if (!size) return '';
    const sizeLower = size.toLowerCase().trim();
    
    // Extract numbers if present
    const numbers = sizeLower.match(/\d+/);
    if (!numbers) {
      // Handle text-based sizes
      if (sizeLower.includes('startup') || sizeLower.includes('1-10')) return '1-10';
      if (sizeLower.includes('small') || sizeLower.includes('11-50')) return '11-50';
      if (sizeLower.includes('medium') || sizeLower.includes('51-200')) return '51-200';
      if (sizeLower.includes('large') || sizeLower.includes('201-500')) return '201-500';
      if (sizeLower.includes('enterprise') || sizeLower.includes('501-1000')) return '501-1000';
      if (sizeLower.includes('500+') || sizeLower.includes('1000+')) return '1000+';
      return size;
    }
    
    const num = parseInt(numbers[0]);
    if (num <= 10) return '1-10';
    if (num <= 50) return '11-50';
    if (num <= 200) return '51-200';
    if (num <= 500) return '201-500';
    if (num <= 1000) return '501-1000';
    return '1000+';
  };

  // Better industry categorization
  const categorizeIndustry = (industry: string): string => {
    if (!industry) return 'Other';
    const ind = industry.toLowerCase().trim();
    
    // Technology
    if (ind.includes('tech') || ind.includes('software') || ind.includes('ai') || 
        ind.includes('data') || ind.includes('cloud') || ind.includes('saas') ||
        ind.includes('internet') || ind.includes('digital')) return 'Technology';
    
    // Healthcare
    if (ind.includes('health') || ind.includes('medical') || ind.includes('hospital') ||
        ind.includes('pharma') || ind.includes('biotech')) return 'Healthcare';
    
    // Finance
    if (ind.includes('finance') || ind.includes('banking') || ind.includes('insurance') ||
        ind.includes('financial') || ind.includes('fintech')) return 'Finance';
    
    // Education
    if (ind.includes('education') || ind.includes('school') || ind.includes('university') ||
        ind.includes('learning') || ind.includes('training')) return 'Education';
    
    // Hospitality & Tourism
    if (ind.includes('hospitality') || ind.includes('tourism') || ind.includes('hotel') ||
        ind.includes('resort') || ind.includes('travel')) return 'Hospitality & Tourism';
    
    // Government & Defense
    if (ind.includes('government') || ind.includes('defense') || ind.includes('federal') ||
        ind.includes('military')) return 'Government & Defense';
    
    // Engineering & Construction
    if (ind.includes('engineering') || ind.includes('construction') || ind.includes('architecture')) 
      return 'Engineering & Construction';
    
    // Non-profit
    if (ind.includes('non-profit') || ind.includes('nonprofit') || ind.includes('foundation')) 
      return 'Non-profit';
    
    return industry; // Keep original if no match
  };

  // Get unique values for filters
  const industries = Array.from(new Set(mockCompanies.map(c => categorizeIndustry(c.industry)))).sort();
  const islands = Array.from(new Set(mockCompanies.map(c => c.island).filter((island): island is string => island !== null))).sort();
  const sizes = standardizedSizes;

  // Filter companies based on search and filters
  const filteredCompanies = useMemo(() => {
    return mockCompanies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.industry.toLowerCase().includes(searchTerm.toLowerCase());
      
      const normalizedIndustry = categorizeIndustry(company.industry);
      const normalizedSize = normalizeSize(company.size);
      
      const matchesIndustry = !industryFilter || normalizedIndustry === industryFilter;
      const matchesIsland = !islandFilter || company.island === islandFilter;
      const matchesSize = !sizeFilter || normalizedSize === sizeFilter;

      return matchesSearch && matchesIndustry && matchesIsland && matchesSize;
    });
  }, [searchTerm, industryFilter, islandFilter, sizeFilter]);

  // Paginate filtered companies
  const paginatedCompanies = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return filteredCompanies.slice(startIndex, endIndex);
  }, [filteredCompanies, currentPage, itemsPerPage]);

  // Reset to first page when filters change
  const handleFilterChange = (setter: (value: string) => void) => (value: string) => {
    setter(value);
    setCurrentPage(1);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-semibold text-gray-900 mb-4">
            Hawaii's Top Employers
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover companies that are hiring Hawaii's best talent. 
            From startups to established corporations, find your next opportunity.
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <SearchBar
                placeholder="Search by company name, industry, or description..."
                value={searchTerm}
                onChange={setSearchTerm}
              />
            </div>
            <FilterDropdown
              label="Industry"
              options={industries}
              value={industryFilter}
              onChange={handleFilterChange(setIndustryFilter)}
            />
            <FilterDropdown
              label="Island"
              options={islands}
              value={islandFilter}
              onChange={handleFilterChange(setIslandFilter)}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FilterDropdown
              label="Company Size"
              options={sizes}
              value={sizeFilter}
              onChange={handleFilterChange(setSizeFilter)}
            />
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setIndustryFilter('');
                  setIslandFilter('');
                  setSizeFilter('');
                  setCurrentPage(1);
                }}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Results Count and View Toggle */}
        <div className="mb-6 flex justify-between items-center">
          <p className="text-gray-600">
            Showing {paginatedCompanies.length} of {filteredCompanies.length} companies
            {filteredCompanies.length !== mockCompanies.length && ` (${mockCompanies.length} total)`}
          </p>
          <div className="flex gap-2">
            <button
              onClick={() => setViewMode('table')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'table'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Table View
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                viewMode === 'grid'
                  ? 'bg-primary-600 text-white'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              Grid View
            </button>
          </div>
        </div>

        {/* Companies List/Table */}
        {paginatedCompanies.length > 0 ? (
          <>
            {viewMode === 'table' ? (
              <div className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Company
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Industry
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Size
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Links
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {paginatedCompanies.map((company) => (
                      <tr key={company.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link href={`/companies/${company.slug}`} className="flex items-center group">
                            <div className="mr-3">
                              <CompanyLogo 
                                logoUrl={company.logo_url} 
                                companyName={company.name}
                                size="sm"
                                className="h-10 w-10"
                              />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 group-hover:text-primary-600">
                                {company.name}
                              </div>
                              <div className="text-sm text-gray-500 line-clamp-1">
                                {company.description.substring(0, 60)}...
                              </div>
                            </div>
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                            {categorizeIndustry(company.industry)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {company.city && company.island 
                            ? `${company.city}, ${company.island}`
                            : company.city || company.island || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {normalizeSize(company.size)} employees
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <div className="flex space-x-3">
                            {company.website && (
                              <a
                                href={company.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary-600 hover:text-primary-900"
                                title="Website"
                              >
                                <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd" />
                                </svg>
                              </a>
                            )}
                            {company.linkedin_url && (
                              <a
                                href={company.linkedin_url}
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
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                {paginatedCompanies.map((company) => (
                  <Link
                    key={company.id}
                    href={`/companies/${company.slug}`}
                    className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                  >
                    <div className="mb-4">
                      <CompanyLogo 
                        logoUrl={company.logo_url} 
                        companyName={company.name}
                        size="sm"
                        className="h-16 w-16"
                      />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{company.name}</h3>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{company.description}</p>
                    <div className="flex flex-wrap gap-2 mb-2">
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {categorizeIndustry(company.industry)}
                      </span>
                      <span className="px-2 py-1 bg-gray-100 text-gray-800 text-xs rounded-full">
                        {normalizeSize(company.size)} employees
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">
                      {company.city && company.island 
                        ? `${company.city}, ${company.island}`
                        : company.city || company.island || 'Location not specified'}
                    </p>
                  </Link>
                ))}
              </div>
            )}
            
            {/* Pagination */}
            <Pagination
              totalItems={filteredCompanies.length}
              itemsPerPage={itemsPerPage}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">🏢</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No companies found</h3>
            <p className="text-gray-600">
              Try adjusting your search terms or filters to find more companies.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
