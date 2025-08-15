import React, { useEffect, useMemo, useState } from 'react';
import { useJobs } from '@/hooks/useJobs';
import { Job } from '@/lib/types';
import { JobCard } from '@/components/JobCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { onSavedChange, isJobSaved, toggleJobSaved, getAllSavedIds } from '@/lib/savedStore';
import { RefreshCw, Trash2, Search } from 'lucide-react';


export default function SavedPage() {
  const { jobs, isLoading, error, refetch } = useJobs({ keywords: '', location: '', source: '', dateRange: '' });
  const [tick, setTick] = useState(0);               // re-render on saved changes
  const [q, setQ] = useState('');                    // search query
  const [sortBy, setSortBy] = useState<'newest'|'oldest'|'title'|'company'>('newest');

  useEffect(() => onSavedChange(() => setTick(t => t + 1)), []);

  // Keep only saved jobs
  const savedJobs = useMemo<Job[]>(
    () => jobs.filter(j => isJobSaved(j.id)),
    [jobs, tick]
  );

  // Search
  const filtered = useMemo(() => {
    const query = q.trim().toLowerCase();
    if (!query) return savedJobs;
    return savedJobs.filter(j =>
      [j.title, j.company, j.location, j.description].some(s => (s || '').toLowerCase().includes(query))
    );
  }, [savedJobs, q]);

  // Sort
  const sorted = useMemo(() => {
    const arr = [...filtered];
    switch (sortBy) {
      case 'newest':  arr.sort((a, b) => (a.daysAgo ?? 0) - (b.daysAgo ?? 0)); break;  // fewer daysAgo first
      case 'oldest':  arr.sort((a, b) => (b.daysAgo ?? 0) - (a.daysAgo ?? 0)); break;
      case 'title':   arr.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'company': arr.sort((a, b) => a.company.localeCompare(b.company)); break;
    }
    return arr;
  }, [filtered, sortBy]);

  const clearAll = () => {
    const ids = getAllSavedIds();
    if (!ids.length) return;
    if (!confirm(`Remove ${ids.length} saved job${ids.length > 1 ? 's' : ''}?`)) return;
    ids.forEach(id => toggleJobSaved(id)); // toggling removes them
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold">Saved Jobs</h1>
          <p className="text-muted-foreground">{savedJobs.length} saved</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={e => setQ(e.target.value)}
              placeholder="Search saved jobs…"
              className="pl-8 w-64"
            />
          </div>

          <Select value={sortBy} onValueChange={v => setSortBy(v as any)}>
            <SelectTrigger className="w-44">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest first</SelectItem>
              <SelectItem value="oldest">Oldest first</SelectItem>
              <SelectItem value="title">Title A–Z</SelectItem>
              <SelectItem value="company">Company A–Z</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh data
          </Button>
          <Button variant="destructive" onClick={clearAll} disabled={!savedJobs.length}>
            <Trash2 className="h-4 w-4 mr-2" /> Clear all
          </Button>
        </div>
      </div>

      {isLoading && <p className="text-muted-foreground">Loading…</p>}
      {error && <p className="text-red-500">Failed to load jobs.</p>}

      {!isLoading && !error && (
        <>
          {sorted.length === 0 ? (
            <div className="rounded-md border p-10 text-center text-muted-foreground">
              {savedJobs.length === 0
                ? <>No saved jobs yet. Tap the ⭐ on any job to save it.</>
                : <>No results for “{q}”. Try a different search.</>}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {sorted.map(job => (
                <JobCard
                  key={job.id}
                  job={job}
                  saved                       // yellow style
                  onJobSelect={() => window.open(job.sourceUrl, '_blank', 'noopener,noreferrer')}
                  onBookmark={() => toggleJobSaved(job.id)}   // unsave from here
                />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
