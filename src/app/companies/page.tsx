'use client';

import { useState, useMemo } from 'react';
import { mockCompanies } from '@/data/companies';
import CompanyCard from '@/components/cards/CompanyCard';
import SearchBar from '@/components/ui/SearchBar';
import FilterDropdown from '@/components/ui/FilterDropdown';

export default function CompaniesPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('');
  const [islandFilter, setIslandFilter] = useState('');
  const [sizeFilter, setSizeFilter] = useState('');

  // Get unique values for filters
  const industries = Array.from(new Set(mockCompanies.map(c => c.industry))).sort();
  const islands = Array.from(new Set(mockCompanies.map(c => c.island))).sort();
  const sizes = Array.from(new Set(mockCompanies.map(c => c.size))).sort();

  // Filter companies based on search and filters
  const filteredCompanies = useMemo(() => {
    return mockCompanies.filter(company => {
      const matchesSearch = company.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           company.industry.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesIndustry = !industryFilter || company.industry === industryFilter;
      const matchesIsland = !islandFilter || company.island === islandFilter;
      const matchesSize = !sizeFilter || company.size === sizeFilter;

      return matchesSearch && matchesIndustry && matchesIsland && matchesSize;
    });
  }, [searchTerm, industryFilter, islandFilter, sizeFilter]);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
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
              onChange={setIndustryFilter}
            />
            <FilterDropdown
              label="Island"
              options={islands}
              value={islandFilter}
              onChange={setIslandFilter}
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <FilterDropdown
              label="Company Size"
              options={sizes}
              value={sizeFilter}
              onChange={setSizeFilter}
            />
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setIndustryFilter('');
                  setIslandFilter('');
                  setSizeFilter('');
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
            Showing {filteredCompanies.length} of {mockCompanies.length} companies
          </p>
        </div>

        {/* Companies Grid */}
        {filteredCompanies.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} />
            ))}
          </div>
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
