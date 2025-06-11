// scripts/scrapeJobPortals.js
import { scrapeCivicJobs } from './jobPortals/civicjobsScraper.js';
import { scrapeRemotiveJobs } from './jobPortals/remotiveScraper.js';


async function runAllScrapers() {
  console.log('🔄 Starting job scrapers...');
  
  //const civicJobs = await scrapeCivicJobs();
  const remotiveJobs = await scrapeRemotiveJobs();

  //console.log(`✅ Scraped ${civicJobs.length} from CivicJobs`);
  console.log(`✅ Scraped ${remotiveJobs.length} from Remotive`);

  console.log('🎉 All scraping completed');
}

runAllScrapers();


