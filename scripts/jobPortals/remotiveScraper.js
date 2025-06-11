// scripts/jobPortals/scrapeRemotiveJobs.js
import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function scrapeRemotiveJobs() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://remotive.com/', { waitUntil: 'domcontentloaded' });
  await page.waitForSelector('.job-tile', { timeout: 10000 });

  await page.screenshot({ path: path.join(__dirname, 'remotiveScraperDebug.png'), fullPage: true });

  const jobs = await page.$$eval('.job-tile', (tiles) => {
    return tiles
      .map(tile => {
        const title = tile.querySelector('span.remotive-bold')?.innerText.trim();
        const url = tile.closest('a')?.href || '#';
        const location = tile.innerText.includes('Worldwide') ? 'Worldwide' : 'Remote';

        // If title or url is missing, this card is probably invalid
        // Redundant code
        if (title === 'No title' || url.startsWith('htt')) return null;

        return {
          title,
          location,
          url,
          postedDate: 'Recently',
          company: 'Unknown',
          source: 'Remotive'
        };
      })
      .filter(Boolean); // Removes nulls
  });

  const outputPath = path.resolve('data/remotiveJobs.json');
  fs.writeFileSync(outputPath, JSON.stringify(jobs, null, 2));
  console.log(`✅ Scraped ${jobs.length} valid jobs to ${outputPath}`);

  await browser.close();
  return jobs;
}

// to print:
// const remotiveJobs = await scrapeRemotiveJobs();
// console.log(`✅ Scraped ${remotiveJobs.length} from Remotive`);