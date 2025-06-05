// scripts/scrapeCivicJobs.js
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();
await page.goto('https://remotive.com/', { waitUntil: 'domcontentloaded' });

await page.screenshot({ path: 'debug.png', fullPage: true });

const jobs = await page.$$eval('.job-row', rows => {
  return rows.map(row => {
    const title = row.querySelector('.job-title')?.innerText.trim();
    const location = row.querySelector('.job-location')?.innerText.trim();
    const url = row.querySelector('a')?.href;
    const date = row.querySelector('.job-post-date')?.innerText.trim();
    return { title, location, url, postedDate: date, source: 'CivicJobs BC' };
  });
});




const outputPath = path.join(__dirname, '../data/civicjobs.json');
writeFileSync(outputPath, JSON.stringify(jobs, null, 2));
console.log(`✅ Scraped ${jobs.length} jobs to ${outputPath}`);

await browser.close();
