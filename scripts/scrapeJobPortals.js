// scripts/scrapeJobPortals.js
import { scrapeCivicJobs } from './jobPortals/civicJobsScraper.js';
// import { scrapeRemotiveJobs } from './jobPortals/remotiveScraper.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// Project root = two levels up from /scripts (adjust if your structure differs)
const projectRoot = path.resolve(__dirname, '..');

function out(...parts) {
  return path.join(projectRoot, 'public', 'data', ...parts);
}

async function runAllScrapers() {
  console.log('🔄 Starting all job scrapers...');

  const civicJobs = await scrapeCivicJobs();
  // const remotiveJobs = await scrapeRemotiveJobs();
  const allJobs = civicJobs; // or [...civicJobs, ...remotiveJobs]

  const outputPath = out('allJobs.json');
  fs.mkdirSync(path.dirname(outputPath), { recursive: true });
  fs.writeFileSync(outputPath, JSON.stringify(allJobs, null, 2));

  console.log(`✅ Saved ${allJobs.length} jobs to ${outputPath}`);
}

runAllScrapers();
