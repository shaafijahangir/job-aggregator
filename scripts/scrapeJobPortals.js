import { scrapeCivicJobs } from './jobPortals/civicJobsScraper.js';
// import { scrapeRemotiveJobs } from './jobPortals/remotiveScraper.js';
import fs from 'fs';
import path from 'path';

async function runAllScrapers() {
  console.log('🔄 Starting all job scrapers...');

  const civicJobs = await scrapeCivicJobs();
  // const remotiveJobs = await scrapeRemotiveJobs();

  // const allJobs = [...civicJobs, ...remotiveJobs];
  const allJobs = civicJobs;

  const outputPath = path.resolve('data/allJobs.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true }); // make sure /scripts/data exists
  fs.writeFileSync(outputPath, JSON.stringify(allJobs, null, 2));

  console.log(`✅ Saved ${allJobs.length} jobs to ${outputPath}`);
}

runAllScrapers();
