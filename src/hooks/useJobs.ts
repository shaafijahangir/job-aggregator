
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchJobs, Job } from '@/lib/jobApi';

export const useJobs = (filters: {
  keywords: string;
  location: string;
  source: string;
  dateRange: string;
}) => {
  const { data: jobs = [], isLoading, error, refetch } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
  });

  const filteredJobs = jobs.filter(job => {
    // Keywords filter
    if (filters.keywords) {
      const searchText = filters.keywords.toLowerCase();
      const jobText = `${job.title} ${job.company} ${job.description} ${job.tags.join(' ')}`.toLowerCase();
      if (!jobText.includes(searchText)) return false;
    }

    // Location filter
    if (filters.location && !job.location.includes(filters.location)) {
      return false;
    }

    // Source filter
    if (filters.source && job.source !== filters.source) {
      return false;
    }

    // Date range filter
    if (filters.dateRange) {
      const daysLimit = parseInt(filters.dateRange);
      if (job.daysAgo > daysLimit) return false;
    }

    return true;
  });

  return {
    jobs: filteredJobs,
    isLoading,
    error,
    refetch,
    totalJobs: jobs.length
  };
};
