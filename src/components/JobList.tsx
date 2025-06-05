
import React, { useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Building, Star, ExternalLink } from 'lucide-react';

const mockJobs = [
  {
    id: 1,
    title: "Systems Analyst",
    company: "City of Victoria",
    location: "Victoria, BC",
    type: "Full-time",
    postedDate: "2 days ago",
    daysAgo: 2,
    salary: "$65,000 - $80,000",
    description: "Seeking a Systems Analyst to support municipal IT infrastructure and digital transformation initiatives.",
    tags: ["Government", "IT", "Analysis"],
    source: "CivicJobs BC",
    sourceUrl: "https://www.civicjobs.ca/job/123",
    isBookmarked: false,
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "BC Tech Startup",
    location: "Vancouver, BC",
    type: "Full-time",
    postedDate: "1 day ago",
    daysAgo: 1,
    salary: "$70,000 - $90,000",
    description: "Join our growing team to build innovative web applications using React and Node.js.",
    tags: ["React", "Node.js", "Startup"],
    source: "BC Tech Association",
    sourceUrl: "https://www.bctechnology.com/job/456",
    isBookmarked: true,
  },
  {
    id: 3,
    title: "DevOps Engineer",
    company: "Saanich Municipality",
    location: "Saanich, BC",
    type: "Contract",
    postedDate: "3 days ago",
    daysAgo: 3,
    salary: "$80,000 - $95,000",
    description: "Automate deployment processes and maintain cloud infrastructure for municipal services.",
    tags: ["DevOps", "AWS", "Government"],
    source: "WorkBC",
    sourceUrl: "https://www.workbc.ca/job/789",
    isBookmarked: false,
  },
  {
    id: 4,
    title: "Software Developer",
    company: "Remote Tech Co",
    location: "Remote",
    type: "Full-time",
    postedDate: "5 hours ago",
    daysAgo: 0,
    salary: "$75,000 - $100,000",
    description: "Remote opportunity for experienced developer to work on cutting-edge projects.",
    tags: ["Remote", "JavaScript", "Python"],
    source: "Glassdoor",
    sourceUrl: "https://remotive.io/job/012",
    isBookmarked: false,
  }
];

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
  const filteredJobs = useMemo(() => {
    return mockJobs.filter(job => {
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
  }, [filters]);

  const handleQuickApply = (job: any) => {
    window.open(job.sourceUrl, '_blank');
  };

  return (
    <div className="space-y-1">
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-6 text-sm">
          <button className="text-blue-600 border-b-2 border-blue-600 pb-1">
            All Jobs ({filteredJobs.length})
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            Saved (1)
          </button>
          <button className="text-gray-500 hover:text-gray-700">
            Applied (0)
          </button>
        </div>
      </div>

      {filteredJobs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <p>No jobs match your current filters.</p>
          <p className="text-sm mt-2">Try adjusting your search criteria.</p>
        </div>
      ) : (
        filteredJobs.map((job) => (
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
                      <span className="font-semibold text-green-600 text-sm">{job.salary}</span>
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
