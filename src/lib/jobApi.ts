// src/lib/jobApi.ts
import { Job } from './types';
export * from './types';

export async function fetchJobs(): Promise<Job[]> {
  try {
    console.log('🔄 Fetching jobs…');

    // Prefer merged output; fallback to civic-only file
    const res = await fetch('/data/allJobs.json', { cache: 'no-store' })
      .catch(() => fetch('/data/civicjobsJobs.json', { cache: 'no-store' }));

    if (!res || !res.ok) throw new Error(`Fetch failed: ${res?.status}`);

    const raw = await res.json();
    if (!Array.isArray(raw)) throw new Error('JSON is not an array');

    const jobs: Job[] = raw.map((j: any, idx: number) => normalizeCivic(j, idx));

    console.log(`🎉 Total jobs loaded: ${jobs.length}`);
    return jobs;
  } catch (err) {
    console.error('❌ Error fetching jobs:', err);
    return getMockJobs();
  }
}

/* ---------- Normalization ---------- */

function normalizeCivic(j: any, idx: number): Job {
  const title = j.position || j.title || 'Unknown Title';
  const company = j.company || 'Unknown Company';
  const location = j.location || 'Unknown Location';
  const description = j.description || '';
  const postedRaw = j.postedDate || 'Recently';
  const source = j.source || 'CivicJobs BC';
  const sourceUrl = j.url || j.sourceUrl || '#';

  return {
    id: String(j.id || `civic-${idx}`),
    title,
    company,
    location,
    type: inferType(description),
    postedDate: postedRaw,                 // keep raw label for UI
    daysAgo: calculateDaysAgo(postedRaw),  // derived for sorting/filtering
    description,
    tags: extractTags(title, description, ''),
    source,
    sourceUrl,
    isBookmarked: false,
  };
}

/* ---------- Helpers ---------- */

function calculateDaysAgo(postedDate: string): number {
  if (!postedDate) return 0;
  const s = postedDate.trim().toLowerCase();

  // common formats: "12 hrs ago", "13 hrs ago", "yesterday", "3 days ago"
  if (s.includes('hr')) return 0;
  if (s.includes('yesterday')) return 1;
  const m = s.match(/^(\d+)\s+day/);
  if (m) {
    const n = parseInt(m[1], 10);
    return Number.isFinite(n) ? n : 0;
  }
  // If it's an ISO date, compute difference
  const d = new Date(postedDate);
  if (!isNaN(d.getTime())) {
    const ms = Date.now() - d.getTime();
    return Math.max(0, Math.floor(ms / (1000 * 60 * 60 * 24)));
  }
  return 0;
}

function inferType(text: string = ''): string {
  const t = text.toLowerCase();
  if (t.includes('part time')) return 'Part-time';
  if (t.includes('full time')) return 'Full-time';
  if (t.includes('temporary')) return 'Temporary';
  if (t.includes('permanent')) return 'Permanent';
  if (t.includes('contract')) return 'Contract';
  return 'Unknown';
}

function extractTags(title = '', desc = '', extra = ''): string[] {
  const text = `${title} ${desc} ${extra}`.toLowerCase();
  const tags: string[] = [];
  if (/\banalyst\b/.test(text)) tags.push('Analysis');
  if (/\b(developer|engineer)\b/.test(text)) tags.push('Development');
  if (/\bmanager\b/.test(text)) tags.push('Management');
  if (/\bplanner\b/.test(text)) tags.push('Planning');
  if (/\bsystem(s)?\b/.test(text)) tags.push('Systems');
  if (/\bdata\b/.test(text)) tags.push('Data');
  if (/\bsenior\b/.test(text)) tags.push('Senior');

  if (text.includes('remote')) tags.push('Remote');
  if (text.includes('part time')) tags.push('Part-time');
  if (text.includes('full time')) tags.push('Full-time');
  if (text.includes('temporary')) tags.push('Temporary');
  if (text.includes('permanent')) tags.push('Permanent');

  if (/(government|municipal|city)\b/.test(text)) tags.push('Government');
  if (/\b(it|technology)\b/.test(text)) tags.push('IT');

  return tags.length ? tags : ['General'];
}

/* ---------- Fallback ---------- */

function getMockJobs(): Job[] {
  return [
    {
      id: 'mock-1',
      title: 'Data Loading Error - Using Mock Data',
      company: 'System',
      location: 'Local',
      type: 'Full-time',
      postedDate: 'Now',
      daysAgo: 0,
      description: 'Unable to load job data from /public/data.',
      tags: ['System', 'Error'],
      source: 'Mock Data',
      sourceUrl: '#',
      isBookmarked: false,
    },
  ];
}
