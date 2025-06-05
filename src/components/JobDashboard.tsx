
import React, { useState } from 'react';
import { JobFilters } from './JobFilters';
import { JobList } from './JobList';
import { JobDetailModal } from './JobDetailModal';
import { CoverLetterGenerator } from './CoverLetterGenerator';
import { StatsCards } from './StatsCards';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export const JobDashboard = () => {
  const [selectedJob, setSelectedJob] = useState(null);
  const [showCoverLetterGen, setShowCoverLetterGen] = useState(false);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <StatsCards />
      
      <Tabs defaultValue="jobs" className="mt-8">
        <TabsList className="grid w-full grid-cols-2 max-w-md">
          <TabsTrigger value="jobs">Job Search</TabsTrigger>
          <TabsTrigger value="cover-letter">Cover Letter Gen</TabsTrigger>
        </TabsList>
        
        <TabsContent value="jobs" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <JobFilters />
            </div>
            <div className="lg:col-span-3">
              <JobList onJobSelect={setSelectedJob} />
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
            setShowCoverLetterGen(true);
            setSelectedJob(null);
          }}
        />
      )}
    </div>
  );
};
