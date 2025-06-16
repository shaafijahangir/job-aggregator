import { scrapeCivicJobs } from './jobPortals/civicjobsScraper.js';
import { scrapeRemotiveJobs } from './jobPortals/remotiveScraper.js';
import fs from 'fs';
import path from 'path';

async function runAllScrapers() {
  console.log('🔄 Starting all job scrapers...');

  const civicJobs = await scrapeCivicJobs();
  const remotiveJobs = await scrapeRemotiveJobs();

  const allJobs = [...civicJobs, ...remotiveJobs];

  const outputPath = path.resolve('data/allJobs.json');
  fs.writeFileSync(outputPath, JSON.stringify(allJobs, null, 2));
  console.log(`✅ Merged ${allJobs.length} jobs into data/allJobs.json`);
}

runAllScrapers();