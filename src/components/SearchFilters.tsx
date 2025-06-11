
import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { JobFilters } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';

interface SearchFiltersProps {
  onFiltersChange: (filters: JobFilters) => void;
}

export const SearchFilters = ({ onFiltersChange }: SearchFiltersProps) => {
  const [keywords, setKeywords] = useState('');
  const [location, setLocation] = useState('');
  const [source, setSource] = useState('');
  const [dateRange, setDateRange] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);

  const handleFilterChange = () => {
    onFiltersChange({
      keywords,
      location,
      source,
      dateRange,
    });
  };

  const clearFilters = () => {
    setKeywords('');
    setLocation('');
    setSource('');
    setDateRange('');
    onFiltersChange({
      keywords: '',
      location: '',
      source: '',
      dateRange: '',
    });
  };

  const activeFiltersCount = [keywords, location, source, dateRange].filter(Boolean).length;

  React.useEffect(() => {
    handleFilterChange();
  }, [keywords, location, source, dateRange]);

  return (
    <div className="bg-card border border-border rounded-lg shadow-sm">
      {/* Mobile Filter Toggle */}
      <div className="p-4 border-b border-border lg:hidden">
        <Button
          variant="outline"
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full justify-between"
        >
          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4" />
            <span>Filters</span>
            {activeFiltersCount > 0 && (
              <Badge variant="secondary" className="text-xs">
                {activeFiltersCount}
              </Badge>
            )}
          </div>
        </Button>
      </div>

      {/* Filter Content */}
      <div className={`p-4 space-y-4 ${!isExpanded ? 'hidden lg:block' : ''}`}>
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search jobs, companies, skills..."
            value={keywords}
            onChange={(e) => setKeywords(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Location Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Location</label>
          <Select value={location} onValueChange={setLocation}>
            <SelectTrigger>
              <SelectValue placeholder="All Locations" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Locations</SelectItem>
              <SelectItem value="Victoria, BC">Victoria, BC</SelectItem>
              <SelectItem value="Vancouver, BC">Vancouver, BC</SelectItem>
              <SelectItem value="Saanich, BC">Saanich, BC</SelectItem>
              <SelectItem value="Langford, BC">Langford, BC</SelectItem>
              <SelectItem value="Remote">Remote</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Date Posted Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Date Posted</label>
          <Select value={dateRange} onValueChange={setDateRange}>
            <SelectTrigger>
              <SelectValue placeholder="Any time" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">Any time</SelectItem>
              <SelectItem value="1">Last 24 hours</SelectItem>
              <SelectItem value="3">Last 3 days</SelectItem>
              <SelectItem value="7">Last week</SelectItem>
              <SelectItem value="30">Last month</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Job Source Filter */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-foreground">Job Source</label>
          <Select value={source} onValueChange={setSource}>
            <SelectTrigger>
              <SelectValue placeholder="All Sources" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Sources</SelectItem>
              <SelectItem value="CivicJobs BC">CivicJobs BC</SelectItem>
              <SelectItem value="Remotive">Remotive</SelectItem>
              <SelectItem value="WorkBC">WorkBC</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Clear Filters */}
        {activeFiltersCount > 0 && (
          <Button variant="outline" onClick={clearFilters} className="w-full">
            <X className="h-4 w-4 mr-2" />
            Clear Filters
          </Button>
        )}
      </div>
    </div>
  );
};
