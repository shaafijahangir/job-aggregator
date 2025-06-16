// scripts/jobPortals/scrapeCivicJobs.js
import puppeteer from 'puppeteer-extra';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

puppeteer.use(StealthPlugin());

export async function scrapeCivicJobs() {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto('https://www.civicjobs.ca/jobs', {
    waitUntil: 'networkidle2',
    timeout: 60000
  });

  console.log('⏳ Waiting for job listings to appear...');
  await page.waitForFunction(() => {
    return document.querySelectorAll('div[id^="jobbox-"]').length > 0;
  }, { polling: 500, timeout: 0 });
  console.log('✅ Job listings found.');

  const jobs = await page.$$eval('div[id^="jobbox-"]', cards => {
    return cards.map(card => {
      const position = card.querySelector('span.fs-18')?.innerText.trim();
      const company = card.querySelector('p.text-muted.fs-14.mb-0')?.innerText.trim();

      const locationAndTime = card.querySelector('.mdi-map-marker')?.parentNode?.textContent.trim() || '';
      const [location, postedDate] = locationAndTime.split(/\s{2,}|\n/).map(str => str.trim());

      const description = `${(card.querySelector('.badge')?.innerText || '')} position at ${company}`;
      const url = card.querySelector('a')?.href;

      return {
        id: crypto.randomUUID(),
        company,
        location,
        position,
        description,
        postedDate,
        source: 'CivicJobs BC',
        url
      };
    });
  });

  const dataDir = path.resolve('data');
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir);

  const outputPath = path.resolve('data/civicjobsJobs.json');
  fs.writeFileSync(outputPath, JSON.stringify(jobs, null, 2));
  console.log(`✅ Scraped ${jobs.length} jobs to ${outputPath}`);

  await browser.close();
  return jobs;
}

// const remotiveJobs = await scrapeCivicJobs();
