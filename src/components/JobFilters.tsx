
import React from 'react';
import { SearchFilters } from './SearchFilters';

interface JobFiltersProps {
  onFiltersChange: (filters: {
    keywords: string;
    location: string;
    source: string;
    dateRange: string;
  }) => void;
}

export const JobFilters = ({ onFiltersChange }: JobFiltersProps) => {
  return (
    <div className="space-y-6">
      <SearchFilters onFiltersChange={onFiltersChange} />
    </div>
  );
};
