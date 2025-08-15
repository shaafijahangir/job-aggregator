import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Building, ExternalLink, Bookmark } from 'lucide-react';
import { Job } from '@/lib/types';

interface JobCardProps {
  job: Job;
  onJobSelect: (job: Job) => void;
  onBookmark?: (job: Job) => void;
  saved?: boolean; // optional external control for “saved” styling
}

export const JobCard = ({ job, onJobSelect, onBookmark, saved = false }: JobCardProps) => {
  const isSaved = saved || job.isBookmarked;
  const hasUrl = Boolean(job?.sourceUrl && job.sourceUrl !== '#');

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    onBookmark?.(job);
  };

  const handleOpenSource = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (hasUrl) window.open(job.sourceUrl, '_blank', 'noopener,noreferrer');
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onJobSelect(job);
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onKeyDown={handleKey}
      onClick={() => onJobSelect(job)}
      className={`group transition-all duration-200 cursor-pointer border animate-fade-in
        ${isSaved ? 'border-yellow-300 bg-yellow-50' : 'border-border hover:border-primary/20 hover:shadow-md'}`}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1 pr-4">
            <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
              {job.title}
            </h3>

            <div className="flex items-center space-x-4 mt-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <Building className="h-4 w-4" />
                <span className="font-medium">{job.company}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MapPin className="h-4 w-4" />
                <span>{job.location}</span>
              </div>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={handleBookmark}
            className="shrink-0 h-8 w-8"
            aria-label={isSaved ? 'Unsave job' : 'Save job'}
            title={isSaved ? 'Unsave job' : 'Save job'}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current text-yellow-500' : ''}`} />
          </Button>
        </div>

        <p className="text-sm text-muted-foreground mb-4 line-clamp-2 whitespace-pre-line">
          {job.description}
        </p>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 mb-4">
          {(job.tags ?? []).slice(0, 3).map((tag, index) => (
            <Badge key={`${job.id}-tag-${index}`} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {Array.isArray(job.tags) && job.tags.length > 3 && (
            <Badge variant="outline" className="text-xs">+{job.tags.length - 3} more</Badge>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{job.postedDate}</span>
            <span>•</span>
            <span>{job.source}</span>
          </div>

          {job.salary && (
            <span className="text-sm font-semibold text-green-600 dark:text-green-400">
              {job.salary}
            </span>
          )}
        </div>

        {/* Hover actions */}
        <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                // plug into your generator flow
                console.log('Generate cover letter for:', job.title);
              }}
              className="flex-1 text-xs"
            >
              Cover Letter
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleOpenSource}
              disabled={!hasUrl}
              className="flex-1 text-xs"
              aria-label={hasUrl ? `Apply on ${job.source}` : 'No link available'}
              title={hasUrl ? `Apply on ${job.source}` : 'No link available'}
            >
              <ExternalLink className="h-3 w-3 mr-1" />
              Apply
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
