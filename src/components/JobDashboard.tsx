
import React, { useState } from 'react';
import { JobFilters } from './JobFilters';
import { JobList } from './JobList';
import { JobDetailModal } from './JobDetailModal';
import { CoverLetterGenerator } from './CoverLetterGenerator';
import { JobStats } from './JobStats';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';

interface Filters {
  keywords: string;
  location: string;
  source: string;
  dateRange: string;
}

export const JobDashboard = () => {
  const [selectedJob, setSelectedJob] = useState(null);
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Job Aggregation Dashboard</h1>
          <p className="text-gray-600 mt-1">BC Government & Tech Opportunities</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 flex items-center space-x-2">
            <span>📄</span>
            <span>Generate Cover Letter</span>
          </button>
          <Button 
            onClick={handleRefreshJobs}
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Refresh Jobs</span>
          </Button>
        </div>
      </div>

      <JobStats />
      
      <Tabs defaultValue="jobs" className="mt-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="jobs">Job Search</TabsTrigger>
          <TabsTrigger value="cover-letter">Cover Letter Gen</TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <JobFilters onFiltersChange={handleFiltersChange} />
            </div>
            <div className="lg:col-span-3">
              <JobList onJobSelect={setSelectedJob} filters={filters} />
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="cover-letter" className="mt-6">
          <CoverLetterGenerator />
        </TabsContent>
      </Tabs>

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
  );
};
