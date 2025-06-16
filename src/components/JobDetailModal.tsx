
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Clock, Building, DollarSign, ExternalLink, FileText } from 'lucide-react';

export const JobDetailModal = ({ job, onClose, onGenerateCoverLetter }) => {
  if (!job) return null;

  return (
    <Dialog open={!!job} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-foreground">{job.title}</DialogTitle>
          <div className="flex items-center space-x-4 text-muted-foreground">
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
              <span>Posted {job.postedDate}</span>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Job Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-secondary/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                <span className="font-medium text-foreground">Salary</span>
              </div>
              <p className="text-lg font-semibold text-green-600 dark:text-green-400">{job.salary}</p>
            </div>
            <div className="bg-secondary/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Clock className="h-5 w-5 text-blue-600" />
                <span className="font-medium text-foreground">Type</span>
              </div>
              <p className="text-lg font-semibold text-foreground">{job.type}</p>
            </div>
            <div className="bg-secondary/20 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <ExternalLink className="h-5 w-5 text-purple-600" />
                <span className="font-medium text-foreground">Source</span>
              </div>
              <p className="text-lg font-semibold text-foreground">{job.source}</p>
            </div>
          </div>

          {/* Tags */}
          <div>
            <h3 className="font-semibold mb-2 text-foreground">Skills & Categories</h3>
            <div className="flex flex-wrap gap-2">
              {job.tags.map((tag, index) => (
                <Badge key={index} variant="secondary">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Job Description */}
          <div>
            <h3 className="text-lg font-semibold mb-3 text-foreground">Job Description</h3>
            <div className="prose max-w-none">
              <p className="text-muted-foreground leading-relaxed mb-4">
                {job.description}
              </p>
              
              {/* Mock detailed job description */}
              <h4 className="font-semibold mt-6 mb-3 text-foreground">Key Responsibilities:</h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Analyze business requirements and translate them into technical specifications</li>
                <li>Design and implement system improvements and automation solutions</li>
                <li>Collaborate with cross-functional teams to deliver high-quality solutions</li>
                <li>Conduct system testing and user acceptance testing coordination</li>
                <li>Provide technical documentation and user training</li>
              </ul>

              <h4 className="font-semibold mt-6 mb-3 text-foreground">Required Qualifications:</h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Bachelor's degree in Computer Science, Information Systems, or related field</li>
                <li>3+ years of experience in systems analysis or similar role</li>
                <li>Strong analytical and problem-solving skills</li>
                <li>Experience with database management and SQL</li>
                <li>Excellent communication and documentation skills</li>
              </ul>

              <h4 className="font-semibold mt-6 mb-3 text-foreground">Preferred Qualifications:</h4>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
                <li>Experience with process automation tools</li>
                <li>Knowledge of Agile/Scrum methodologies</li>
                <li>Public sector experience an asset</li>
                <li>Project management certification</li>
              </ul>
            </div>
          </div>
        </div>

        <DialogFooter className="flex flex-col sm:flex-row gap-3">
          <Button 
            variant="outline" 
            onClick={onGenerateCoverLetter}
            className="flex items-center space-x-2"
          >
            <FileText className="h-4 w-4" />
            <span>Generate Cover Letter</span>
          </Button>
          <Button onClick={() => window.open('#', '_blank')} className="flex items-center space-x-2">
            <ExternalLink className="h-4 w-4" />
            <span>Apply on {job.source}</span>
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
