
import React, { useState } from 'react';
import { JobFilters } from './JobFilters';
import { JobList } from './JobList';
import { JobDetailModal } from './JobDetailModal';
import { CoverLetterGenerator } from './CoverLetterGenerator';
import { JobStats } from './JobStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw, FileText } from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import { Job } from '@/lib/types';

interface Filters {
  keywords: string;
  location: string;
  source: string;
  dateRange: string;
}

export const JobDashboard = () => {
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [filters, setFilters] = useState<Filters>({
    keywords: '',
    location: '',
    source: '',
    dateRange: ''
  });

  const { refetch } = useJobs(filters);

  const handleFiltersChange = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  const handleRefreshJobs = () => {
    refetch();
    console.log('Refreshing jobs from API...');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
              <p className="text-muted-foreground mt-1">
                Discover opportunities across BC
              </p>
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" className="flex items-center space-x-2">
                <FileText className="h-4 w-4" />
                <span>Cover Letter</span>
              </Button>
              <Button onClick={handleRefreshJobs} className="flex items-center space-x-2">
                <RefreshCw className="h-4 w-4" />
                <span>Refresh</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <JobStats />
        
        {/* Main Content */}
        <Tabs defaultValue="jobs" className="mt-8">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="jobs">Job Search</TabsTrigger>
            <TabsTrigger value="cover-letter">Cover Letters</TabsTrigger>
          </TabsList>
          
          <TabsContent value="jobs" className="mt-8">
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
              {/* Sidebar Filters */}
              <div className="lg:col-span-1">
                <div className="sticky top-24">
                  <JobFilters onFiltersChange={handleFiltersChange} />
                </div>
              </div>
              
              {/* Main Job List */}
              <div className="lg:col-span-3">
                <JobList onJobSelect={setSelectedJob} filters={filters} />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="cover-letter" className="mt-8">
            <CoverLetterGenerator />
          </TabsContent>
        </Tabs>

        {/* Job Detail Modal */}
        {selectedJob && (
          <JobDetailModal 
            job={selectedJob} 
            onClose={() => setSelectedJob(null)}
            onGenerateCoverLetter={() => {
              setSelectedJob(null);
            }}
          />
        )}
      </div>
    </div>
  );
};
