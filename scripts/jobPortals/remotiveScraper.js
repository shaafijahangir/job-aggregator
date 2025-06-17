// scripts/jobPortals/scrapeRemotiveJobs.js
// tbd: scrape description from job portal to show in app

import { chromium } from 'playwright';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function scrapeRemotiveJobs() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://remotive.com/', { waitUntil: 'load' });
  await page.waitForSelector('.job-tile', { timeout: 10000 });

  const rawJobs = await page.$$eval('.job-tile', (tiles) => {
    return tiles.map(tile => {
      const position = tile.querySelector('span.remotive-bold')?.innerText.trim();
      const url = tile.querySelector('a[href^="https://remotive.com/remote-jobs"]')?.href || '#';
      const location = tile.innerText.includes('Worldwide') ? 'Worldwide' : 'Remote';
      const company = tile.querySelector('span.tw-block.md\\:tw-hidden')?.innerText.trim() || 'Unknown';

      if (!position || url === '#') return null;

      return {
        id: crypto.randomUUID(),
        company,
        location,
        position,
        source: 'Remotive',
        url
      };
    }).filter(Boolean);
  });

  const jobs = [];

  for (const job of rawJobs) {
    if (!job.url || job.url === '#' || !job.url.startsWith('https://remotive.com/remote-jobs')) continue;

    const jobPage = await browser.newPage();
    try {
      const response = await jobPage.goto(job.url, { waitUntil: 'load', timeout: 15000 });
      if (!response || !response.ok()) throw new Error(`❌ Navigation failed for ${job.url}`);

      await jobPage.waitForSelector('div.tw-mt-8', { timeout: 10000 });

      // 📅 Posted Date + 📍 Location
      try {
        const postedLine = await jobPage.$eval('p.tw-mt-4.tw-text-sm', el => el.innerText.trim());

        const dateMatch = postedLine.match(/^([A-Za-z]{3,9} \d{1,2}, \d{4})/);
        const locationMatch = postedLine.match(/📍Location:\s*(.+?)\./);

        if (dateMatch) job.postedDate = dateMatch[1];
        if (locationMatch) job.location = locationMatch[1].trim();
      } catch {
        job.postedDate = 'Unknown';
      }

      // 📄 Description fix
      const description = await jobPage.evaluate(() => {
        const startEl = document.querySelector('div.tw-mt-8');
        if (!startEl) return 'Description not found.';

        const content = [];
        let current = startEl.nextElementSibling;

        while (current) {
          const text = current.innerText?.trim();
          if (/About the Company/i.test(text)) break;
          if (text && text.length > 2) content.push(text);
          current = current.nextElementSibling;
        }

        return content.join('\n\n');
      });

      job.description = description;

    } catch (err) {
      console.warn(`⚠️ Failed to scrape ${job.url}:`, err.message);
      job.description = 'Description not available.';
    } finally {
      await jobPage.close();
    }

    jobs.push(job);
  }

  const outputPath = path.resolve('data/remotiveJobs.json');
  fs.writeFileSync(outputPath, JSON.stringify(jobs, null, 2));
  console.log(`✅ Scraped ${jobs.length} jobs to ${outputPath}`);

  await browser.close();
  return jobs;
}

// to print:
const remotiveJobs = await scrapeRemotiveJobs();
// console.log(`✅ Scraped ${remotiveJobs.length} from Remotive`);
