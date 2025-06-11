
import React, { useState } from 'react';
import { Search } from 'lucide-react';

interface SearchFiltersProps {
  onFiltersChange: (filters: {
    keywords: string;
    location: string;
    source: string;
    dateRange: string;
  }) => void;
}

export const SearchFilters = ({ onFiltersChange }: SearchFiltersProps) => {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [source, setSource] = useState('');
  const [dateRange, setDateRange] = useState('');

  const handleFilterChange = () => {
    onFiltersChange({
      keywords,
      location,
      source,
      dateRange,
    });
  };

  React.useEffect(() => {
    handleFilterChange();
  }, [keywords, location, source, dateRange]);

  return (
    <div className="bg-white p-4 rounded-lg border border-gray-200">
      <h3 className="font-semibold text-gray-900 mb-4">Search Jobs</h3>
      
      <div className="space-y-4">
        <div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Keywords, company, or skills..."
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <select 
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Locations</option>
            <option value="Victoria, BC">Victoria, BC</option>
            <option value="Vancouver, BC">Vancouver, BC</option>
            <option value="Saanich, BC">Saanich, BC</option>
            <option value="Langford, BC">Langford, BC</option>
            <option value="Mill Bay, BC">Mill Bay, BC</option>
            <option value="Remote">Remote</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Date Posted</label>
          <select 
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Any time</option>
            <option value="1">Last 24 hours</option>
            <option value="3">Last 3 days</option>
            <option value="7">Last week</option>
            <option value="30">Last month</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Source</label>
          <select 
            value={source}
            onChange={(e) => setSource(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">All Sources</option>
            <option value="CivicJobs BC">CivicJobs BC</option>
            <option value="Remotive">Remotive</option>
            <option value="Going Global">Going Global</option>
            <option value="Glassdoor">Glassdoor</option>
            <option value="Jobs Bear">Jobs Bear</option>
            <option value="Job Diagnosis">Job Diagnosis</option>
            <option value="WorkBC">WorkBC</option>
          </select>
        </div>

        <button
          onClick={handleFilterChange}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
        >
          Apply Filters
        </button>
      </div>
    </div>
  );
};
