
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Building, Star, ExternalLink, RefreshCw } from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';

interface JobListProps {
  onJobSelect: (job: any) => void;
  filters: {
    keywords: string;
    location: string;
    source: string;
    dateRange: string;
  };
}

export const JobList = ({ onJobSelect, filters }: JobListProps) => {
  const { jobs, isLoading, error, refetch, totalJobs } = useJobs(filters);

  const handleQuickApply = (job: any) => {
    window.open(job.sourceUrl, '_blank');
  };

  if (isLoading) {
    return (
      <div className="text-center py-12">
        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
        <p className="text-gray-500">Loading jobs...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">Error loading jobs. Using mock data.</p>
        <Button onClick={() => refetch()} variant="outline">
          <RefreshCw className="h-4 w-4 mr-2" />
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-6 text-sm">
          <button className="text-blue-600 border-b-2 border-blue-600 pb-1">
            All Jobs ({jobs.length})
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            Saved ({jobs.filter(j => j.isBookmarked).length})
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            Applied (0)
          </button>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>

      {jobs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No jobs match your current filters.</p>
          <p className="text-sm mt-2">Try adjusting your search criteria.</p>
        </div>
      ) : (
        jobs.map((job) => (
          <Card 
            key={job.id} 
            className="hover:shadow-md transition-all duration-200 cursor-pointer border border-gray-200"
            onClick={() => onJobSelect(job)}
          >
            <CardContent className="p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 hover:text-blue-600">
                      {job.title}
                    </h3>
                    <button className="text-gray-400 hover:text-yellow-500">
                      <Star className={`h-4 w-4 ${job.isBookmarked ? 'fill-current text-yellow-500' : ''}`} />
                    </button>
                    <button className="text-gray-400 hover:text-blue-500">
                      <ExternalLink className="h-4 w-4" />
                    </button>
                    <span className="text-blue-600 text-sm font-medium">View</span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <div className="flex items-center space-x-1">
                      <Building className="h-4 w-4" />
                      <span>{job.company}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{job.postedDate}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 mb-3 line-clamp-2">
                    {job.description}
                  </p>
                  
                  <div className="flex flex-wrap gap-2 mb-3">
                    {job.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                      {job.salary && (
                        <span className="font-semibold text-green-600 text-sm">{job.salary}</span>
                      )}
                      <span className="text-xs text-gray-500">Source: {job.source}</span>
                    </div>
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log('Generate cover letter for:', job.title);
                        }}
                        className="text-xs"
                      >
                        📄 Generate Cover Letter
                      </Button>
                      <Button 
                        variant="default" 
                        size="sm" 
                        onClick={(e) => {
                          e.stopPropagation();
                          handleQuickApply(job);
                        }}
                        className="bg-gray-900 hover:bg-gray-800 text-xs"
                      >
                        Apply
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))
      )}
    </div>
  );
};
