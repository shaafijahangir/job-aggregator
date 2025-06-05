
export interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  postedDate: string;
  daysAgo: number;
  salary?: string;
  description: string;
  tags: string[];
  source: string;
  sourceUrl: string;
  isBookmarked: boolean;
}

export async function fetchJobs(): Promise<Job[]> {
  try {
    // This will connect to your Express API once it's running
    const response = await fetch('http://localhost:3001/api/jobs');
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    const data = await response.json();
    
    // Transform the scraped data to match our Job interface
    return data.map((job: any, index: number) => ({
      id: `job-${index}`,
      title: job.title || 'Unknown Title',
      company: job.company || 'CivicJobs BC',
      location: job.location || 'Unknown Location',
      type: 'Full-time',
      postedDate: job.postedDate || 'Recently',
      daysAgo: calculateDaysAgo(job.postedDate),
      description: job.description || 'No description available',
      tags: extractTags(job.title, job.description),
      source: 'CivicJobs BC',
      sourceUrl: job.url || '#',
      isBookmarked: false,
    }));
  } catch (error) {
    console.error('Error fetching jobs:', error);
    // Return mock data as fallback
    return getMockJobs();
  }
}

function calculateDaysAgo(postedDate: string): number {
  if (!postedDate) return 0;
  
  const today = new Date();
  const postDate = new Date(postedDate);
  const diffTime = Math.abs(today.getTime() - postDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  
  return diffDays;
}

function extractTags(title: string, description: string): string[] {
  const text = `${title} ${description}`.toLowerCase();
  const tags = [];
  
  if (text.includes('analyst') || text.includes('analysis')) tags.push('Analysis');
  if (text.includes('developer') || text.includes('development')) tags.push('Development');
  if (text.includes('system') || text.includes('systems')) tags.push('Systems');
  if (text.includes('government') || text.includes('municipal')) tags.push('Government');
  if (text.includes('remote')) tags.push('Remote');
  if (text.includes('it') || text.includes('technology')) tags.push('IT');
  
  return tags.length > 0 ? tags : ['General'];
}

function getMockJobs(): Job[] {
  return [
    {
      id: "1",
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
      id: "2",
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
    }
  ];
}
