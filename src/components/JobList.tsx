// JobList.tsx
import React, { useEffect, useMemo, useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Building, Star, ExternalLink, RefreshCw } from 'lucide-react';
import { useJobs } from '@/hooks/useJobs';
import { isJobSaved, toggleJobSaved, onSavedChange } from '@/lib/savedStore';
import { isApplied, markApplied, unapply, onAppliedChange } from '@/lib/appliedStore';
import { apiGenerateCoverLetter, apiGenerateResume } from '@/lib/ai';
import jsPDF from 'jspdf';

interface JobListProps {
  onJobSelect: (job: any) => void;
  filters: { keywords: string; location: string; source: string; dateRange: string };
}

type TabKey = 'all' | 'saved' | 'applied';

function downloadPdf(filename: string, text: string) {
  const doc = new jsPDF();
  const lines = doc.splitTextToSize(text, 180);
  doc.text(lines, 10, 10);
  doc.save(filename);
}

export const JobList = ({ onJobSelect, filters }: JobListProps) => {
  const { jobs, isLoading, error, refetch } = useJobs(filters);

  const [tab, setTab] = useState<TabKey>('all');
  const [savedTick, setSavedTick] = useState(0);
  const [appliedTick, setAppliedTick] = useState(0);

  useEffect(() => onSavedChange(() => setSavedTick((t) => t + 1)), []);
  useEffect(() => onAppliedChange(() => setAppliedTick((t) => t + 1)), []);

  const savedCount = useMemo(
    () => jobs.filter((j) => isJobSaved(j.id)).length,
    [jobs, savedTick]
  );
  const appliedCount = useMemo(
    () => jobs.filter((j) => isApplied(j.id)).length,
    [jobs, appliedTick]
  );

  const visibleJobs = useMemo(() => {
    if (tab === 'saved') return jobs.filter((j) => isJobSaved(j.id));
    if (tab === 'applied') return jobs.filter((j) => isApplied(j.id));
    return jobs;
  }, [jobs, tab, savedTick, appliedTick]);

  const openSource = (e: React.MouseEvent, url?: string) => {
    e.stopPropagation();
    if (!url) return;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleGenerateCover = async (e: React.MouseEvent, job: any) => {
    e.stopPropagation();
    if (!job?.description) return alert('No description found for this job.');
    try {
      const content = await apiGenerateCoverLetter(job.description);
      downloadPdf(`${job.title}-cover-letter.pdf`, content);
    } catch (err) {
      console.error(err);
      alert('Failed to generate cover letter');
    }
  };

  const handleGenerateResume = async (e: React.MouseEvent, job: any) => {
    e.stopPropagation();
    if (!job?.description) return alert('No description found for this job.');
    try {
      const content = await apiGenerateResume(job.description);
      downloadPdf(`${job.title}-resume.pdf`, content);
    } catch (err) {
      console.error(err);
      alert('Failed to generate resume');
    }
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
      {/* Tabs + refresh */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-6 text-sm">
          <button
            className={`${tab === 'all' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'} pb-1`}
            onClick={() => setTab('all')}
          >
            All Jobs ({jobs.length})
          </button>
          <button
            className={`${tab === 'saved' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'} pb-1`}
            onClick={() => setTab('saved')}
          >
            Saved ({savedCount})
          </button>
          <button
            className={`${tab === 'applied' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'} pb-1`}
            onClick={() => setTab('applied')}
          >
            Applied ({appliedCount})
          </button>
        </div>
        <Button onClick={() => refetch()} variant="outline" size="sm">
          <RefreshCw className="h-4 w-4 mr-2" /> Refresh
        </Button>
      </div>

      {visibleJobs.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          {tab === 'saved'
            ? 'No saved jobs yet. Tap the ⭐ on any job to save it.'
            : tab === 'applied'
            ? 'No applied jobs yet. Use the checkbox on a job or click Apply.'
            : 'No jobs match your current filters.'}
        </div>
      ) : (
        visibleJobs.map((job) => {
          const hasUrl = Boolean(job?.sourceUrl && job.sourceUrl !== '#');
          const saved = isJobSaved(job.id);
          const applied = isApplied(job.id);

          return (
            <Card
              key={job.id}
              onClick={() => onJobSelect(job)}
              className={`relative transition-all duration-200 cursor-pointer border 
                ${saved ? 'border-yellow-300 bg-yellow-50' : 'border-gray-200 hover:shadow-md'}`}
            >
              {/* Applied checkbox — top-right */}
              <label
                className="absolute right-3 top-3 inline-flex items-center gap-2 text-xs select-none"
                onClick={(e) => e.stopPropagation()}
                title={applied ? 'Marked as applied' : 'Mark as applied'}
              >
                <input
                  type="checkbox"
                  checked={applied}
                  onChange={(e) => {
                    if (e.target.checked) markApplied(job.id, { sourceUrl: job.sourceUrl });
                    else unapply(job.id);
                  }}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className={`${applied ? 'text-blue-700' : 'text-gray-500'}`}>Applied</span>
              </label>

              <CardContent className="p-4">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h3 className="text-lg font-semibold text-foreground hover:text-primary">
                        {job.title}
                      </h3>

                      {/* bookmark toggle */}
                      <button
                        className={`transition-colors ${saved ? 'text-yellow-500' : 'text-gray-400 hover:text-yellow-500'}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleJobSaved(job.id);
                        }}
                        aria-label={saved ? 'Unsave job' : 'Save job'}
                        title={saved ? 'Unsave job' : 'Save job'}
                      >
                        <Star className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
                      </button>

                      {/* open original posting */}
                      <button
                        className={`text-gray-400 ${hasUrl ? 'hover:text-blue-600' : 'opacity-40 cursor-not-allowed'}`}
                        onClick={(e) => hasUrl && openSource(e, job.sourceUrl)}
                        aria-label={hasUrl ? `Open posting on ${job.source}` : 'No link available'}
                        title={hasUrl ? `Open posting on ${job.source}` : 'No link available'}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                    </div>

                    {/* meta row */}
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
                      {applied && (
                        <span className="ml-2 text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                          Applied
                        </span>
                      )}
                    </div>

                    <p className="text-gray-700 mb-3 line-clamp-2">{job.description}</p>

                    <div className="flex flex-wrap gap-2 mb-3">
                      {job.tags.map((tag: string, i: number) => (
                        <Badge key={i} variant="secondary" className="text-xs bg-gray-100 text-gray-700">
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

                      <div className="flex flex-wrap gap-2">
                        {/* Generate Cover Letter */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleGenerateCover(e, job)}
                          disabled={!job?.description}
                          className="text-xs"
                        >
                          📄 Generate Cover Letter
                        </Button>

                        {/* Generate Resume */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => handleGenerateResume(e, job)}
                          disabled={!job?.description}
                          className="text-xs"
                        >
                          📑 Generate Resume
                        </Button>

                        {/* Apply (only opens when NOT applied) */}
                        <Button
                          variant={applied ? 'secondary' : 'default'}
                          size="sm"
                          disabled={applied || !hasUrl}
                          title={applied ? 'Already marked as applied' : 'Open application link'}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (!applied && hasUrl) {
                              markApplied(job.id, { sourceUrl: job.sourceUrl });
                              window.open(job.sourceUrl, '_blank', 'noopener,noreferrer');
                            }
                          }}
                          className={`text-xs ${applied ? 'cursor-default' : 'bg-gray-900 hover:bg-gray-800'}`}
                        >
                          {applied ? 'Applied' : 'Apply'}
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
};
