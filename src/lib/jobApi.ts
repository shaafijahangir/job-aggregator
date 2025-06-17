
// src/lib/jobApi.ts
import { Job } from './types';

export * from './types';

export async function fetchJobs(): Promise<Job[]> {
  try {
    console.log('🔄 Fetching jobs from public data files...');
    
    // Fetch both data sources
    const [civicResponse/*, remotiveResponse*/] = await Promise.all([
      fetch('/data/civicjobsJobs.json'),
      //fetch('/data/remotiveJobs.json')
    ]);

    if (!civicResponse.ok/* || !remotiveResponse.ok*/) {
      throw new Error('Failed to fetch job data');
    }

    const civicData = await civicResponse.json();
    //const remotiveData = await remotiveResponse.json();

    console.log(`✅ Loaded ${civicData.length} CivicJobs jobs`);
    //console.log(`✅ Loaded ${civicData.length} CivicJobs and ${remotiveData.length} Remotive jobs`);

    // Transform CivicJobs data
    const civicJobs = civicData.map((job: any, index: number) => ({
      id: `civic-${index}`,
      title: job.jobTitle || 'Unknown Title',
      company: job.company || 'Unknown Company',
      location: job.location || 'Unknown Location',
      type: job.timeCommitment || 'Full-time',
      postedDate: job.postedDate || 'Recently',
      daysAgo: calculateDaysAgo(job.postedDate),
      description: `${job.timeCommitment} ${job.employmentType} position at ${job.company}`,
      tags: extractTags(job.jobTitle, job.timeCommitment, job.employmentType),
      source: job.source || 'CivicJobs BC',
      sourceUrl: job.url || '#',
      isBookmarked: false,
    }));
    
    /* 
    // Transform Remotive data
    const remotiveJobs = remotiveData.map((job: any, index: number) => ({
      id: `remotive-${index}`,
      title: job.title || 'Unknown Title',
      company: job.company || 'Remote Company',
      location: job.location || 'Remote',
      type: 'Full-time',
      postedDate: job.postedDate || 'Recently',
      daysAgo: 0,
      description: `Remote position: ${job.title}`,
      tags: extractTags(job.title, 'Remote', ''),
      source: job.source || 'Remotive',
      sourceUrl: job.url || '#',
      isBookmarked: false,
    }));
    */
   
    // Combine all jobs
    const allJobs = [...civicJobs/*, ...remotiveJobs*/];
    console.log(`🎉 Total jobs loaded: ${allJobs.length}`);
    
    return allJobs;
  } catch (error) {
    console.error('❌ Error fetching jobs:', error);
    return getMockJobs();
  }
}

function calculateDaysAgo(postedDate: string): number {
  if (!postedDate || postedDate === 'Recently') return 0;

  // Handle "X hrs ago", "yesterday", "X days ago" formats
  if (postedDate.includes('hrs ago')) {
    return 0;
  }
  if (postedDate.includes('yesterday')) {
    return 1;
  }
  if (postedDate.includes('days ago')) {
    const days = parseInt(postedDate.split(' ')[0]);
    return isNaN(days) ? 0 : days;
  }

  return 0;
}

function extractTags(title = '', type = '', employment = ''): string[] {
  const text = `${title} ${type} ${employment}`.toLowerCase();
  const tags: string[] = [];

  // Job type tags
  if (text.includes('analyst')) tags.push('Analysis');
  if (text.includes('developer') || text.includes('engineer')) tags.push('Development');
  if (text.includes('manager')) tags.push('Management');
  if (text.includes('planner')) tags.push('Planning');
  if (text.includes('system')) tags.push('Systems');
  if (text.includes('data')) tags.push('Data');
  if (text.includes('senior')) tags.push('Senior');

  // Work type tags
  if (text.includes('remote')) tags.push('Remote');
  if (text.includes('part time')) tags.push('Part-time');
  if (text.includes('full time')) tags.push('Full-time');
  if (text.includes('temporary')) tags.push('Temporary');
  if (text.includes('permanent')) tags.push('Permanent');

  // Industry tags
  if (text.includes('government') || text.includes('municipal') || text.includes('city')) tags.push('Government');
  if (text.includes('it') || text.includes('technology')) tags.push('IT');

  return tags.length ? tags : ['General'];
}

function getMockJobs(): Job[] {
  return [
    {
      id: "mock-1",
      title: "Data Loading Error - Using Mock Data",
      company: "System",
      location: "Local",
      type: "Full-time",
      postedDate: "Now",
      daysAgo: 0,
      description: "Unable to load job data from files. Please ensure the data files are in the public/data folder.",
      tags: ["System", "Error"],
      source: "Mock Data",
      sourceUrl: "#",
      isBookmarked: false,
    }
  ];
}
