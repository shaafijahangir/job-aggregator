
import React from 'react';
import { Search } from 'lucide-react';

export const SearchFilters = () => {
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
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
          <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All Locations</option>
            <option>Victoria, BC</option>
            <option>Vancouver, BC</option>
            <option>Saanich, BC</option>
            <option>Langford, BC</option>
            <option>Remote</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Job Source</label>
          <select className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent">
            <option>All Sources</option>
            <option>BC Hydro</option>
            <option>Going Global</option>
            <option>Glassdoor</option>
            <option>Jobs Bear</option>
            <option>Job Diagnosis</option>
            <option>CivicInfo BC</option>
            <option>WorkBC</option>
          </select>
        </div>
      </div>
    </div>
  );
};
