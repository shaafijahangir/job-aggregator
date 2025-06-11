
// src/hooks/useJobs.ts

import { useQuery } from '@tanstack/react-query';
import { fetchJobs, Job, JobFilters } from '@/lib/jobApi';

export const useJobs = (filters: JobFilters) => {
  const {
    data: jobs = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['jobs'],
    queryFn: fetchJobs,
    refetchInterval: 1000 * 60 * 5, // every 5 minutes
  });

  const filteredJobs = jobs.filter((job) => {
    // Keyword match
    if (filters.keywords) {
      const search = filters.keywords.toLowerCase();
      const combined = `${job.title} ${job.company} ${job.description} ${job.tags.join(' ')}`.toLowerCase();
      if (!combined.includes(search)) return false;
    }

    // Location match
    if (filters.location && !job.location.includes(filters.location)) {
      return false;
    }

    // Source match
    if (filters.source && job.source !== filters.source) {
      return false;
    }

    // Date range match
    if (filters.dateRange) {
      const daysLimit = parseInt(filters.dateRange);
      if (job.daysAgo > daysLimit) return false;
    }

    return true;
  });

  return {
    jobs: filteredJobs,
    totalJobs: jobs.length,
    isLoading,
    error,
    refetch,
  };
};
