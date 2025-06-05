
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Building, Bookmark, ExternalLink } from 'lucide-react';

const mockJobs = [
  {
    id: 1,
    title: "Systems Analyst II",
    company: "City of Victoria",
    location: "Victoria, BC",
    type: "Full-time",
    postedDate: "2 days ago",
    salary: "$65,000 - $75,000",
    description: "We are seeking a Systems Analyst to support our IT infrastructure and business process optimization...",
    tags: ["Government", "IT", "Analysis"],
    source: "CivicInfo BC",
    isBookmarked: false,
  },
  {
    id: 2,
    title: "Software Developer",
    company: "BC Tech Association",
    location: "Vancouver, BC",
    type: "Full-time",
    postedDate: "1 day ago",
    salary: "$80,000 - $95,000",
    description: "Join our team building innovative solutions for BC's tech ecosystem...",
    tags: ["Tech", "Development", "React"],
    source: "BC Tech Jobs",
    isBookmarked: true,
  },
  {
    id: 3,
    title: "Business Process Automation Specialist",
    company: "District of Saanich",
    location: "Saanich, BC",
    type: "Contract",
    postedDate: "3 days ago",
    salary: "$70,000 - $80,000",
    description: "Lead automation initiatives and process improvement projects...",
    tags: ["Government", "Automation", "Process"],
    source: "Municipal Jobs",
    isBookmarked: false,
  },
  {
    id: 4,
    title: "Full Stack Developer",
    company: "StartupJobs Victoria",
    location: "Victoria, BC",
    type: "Full-time",
    postedDate: "1 day ago",
    salary: "$75,000 - $90,000",
    description: "Work with cutting-edge technologies in a fast-paced startup environment...",
    tags: ["Startup", "Full Stack", "Innovation"],
    source: "StartupJobs",
    isBookmarked: false,
  },
  {
    id: 5,
    title: "IT Project Coordinator",
    company: "City of Langford",
    location: "Langford, BC",
    type: "Full-time",
    postedDate: "4 days ago",
    salary: "$60,000 - $70,000",
    description: "Coordinate IT projects and support digital transformation initiatives...",
    tags: ["Government", "Project Management", "IT"],
    source: "Municipal Jobs",
    isBookmarked: true,
  }
];

export const JobList = ({ onJobSelect }) => {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">
          Available Positions ({mockJobs.length})
        </h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-500">Sort by:</span>
          <select className="text-sm border-gray-300 rounded-md">
            <option>Most Recent</option>
            <option>Salary (High to Low)</option>
            <option>Relevance</option>
          </select>
        </div>
      </div>

      {mockJobs.map((job) => (
        <Card 
          key={job.id} 
          className="hover:shadow-lg transition-all duration-200 cursor-pointer border-l-4 border-l-transparent hover:border-l-blue-500"
          onClick={() => onJobSelect(job)}
        >
          <CardHeader className="pb-3">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                <CardTitle className="text-lg mb-1 hover:text-blue-600 transition-colors">
                  {job.title}
                </CardTitle>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
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
              </div>
              <Button variant="ghost" size="sm">
                <Bookmark className={`h-4 w-4 ${job.isBookmarked ? 'fill-current text-blue-600' : ''}`} />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 mb-4 line-clamp-2">
              {job.description}
            </p>
            
            <div className="flex flex-wrap gap-2 mb-4">
              {job.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <span className="font-semibold text-green-600">{job.salary}</span>
                <Badge variant="outline">{job.type}</Badge>
                <span className="text-xs text-gray-500">via {job.source}</span>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  console.log('Quick apply to:', job.title);
                }}>
                  Quick Apply
                </Button>
                <Button variant="ghost" size="sm" onClick={(e) => {
                  e.stopPropagation();
                  window.open('#', '_blank');
                }}>
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
