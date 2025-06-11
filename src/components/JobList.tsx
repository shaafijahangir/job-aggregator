
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { JobCard } from './JobCard';
import { useJobs } from '@/hooks/useJobs';
import { Job } from '@/lib/types';

interface JobListProps {
  onJobSelect: (job: Job) => void;
  filters: {
    keywords: string;
    location: string;
    source: string;
    dateRange: string;
  };
}

export const JobList = ({ onJobSelect, filters }: JobListProps) => {
  const { jobs, isLoading, error, refetch } = useJobs(filters);

  const handleBookmark = (job: Job) => {
    // TODO: Implement bookmark functionality
    console.log('Bookmark job:', job.title);
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {/* Loading skeletons */}
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-card border border-border rounded-lg p-6 animate-pulse">
            <div className="space-y-3">
              <div className="h-5 bg-muted rounded w-3/4"></div>
              <div className="h-4 bg-muted rounded w-1/2"></div>
              <div className="h-4 bg-muted rounded w-full"></div>
              <div className="flex space-x-2">
                <div className="h-6 bg-muted rounded w-16"></div>
                <div className="h-6 bg-muted rounded w-20"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
          <p className="text-destructive mb-4">Error loading jobs</p>
          <Button onClick={() => refetch()} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-foreground">
            {jobs.length} Jobs Found
          </h2>
          <p className="text-muted-foreground">
            Showing results from BC job portals
          </p>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Job Cards */}
      {jobs.length === 0 ? (
        <div className="text-center py-16">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
              <RefreshCw className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your search criteria or check back later for new opportunities.
            </p>
            <Button onClick={() => refetch()} variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Jobs
            </Button>
          </div>
        </div>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <JobCard
              key={job.id}
              job={job}
              onJobSelect={onJobSelect}
              onBookmark={handleBookmark}
            />
          ))}
        </div>
      )}
    </div>
  );
};
