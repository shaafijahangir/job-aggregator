
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

export interface JobFilters {
  keywords: string;
  location: string;
  source: string;
  dateRange: string;
}
