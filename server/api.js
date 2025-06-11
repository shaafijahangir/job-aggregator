// server/api.js
import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/jobs', (req, res) => {
  try {
    const civicJobsPath = path.join(__dirname, '../data/civicjobsJobs.json');
    const remotiveJobsPath = path.join(__dirname, '../data/remotiveJobs.json');

    const civicJobs = JSON.parse(fs.readFileSync(civicJobsPath, 'utf-8'));
    const remotiveJobs = JSON.parse(fs.readFileSync(remotiveJobsPath, 'utf-8'));

    // Combine both datasets
    const allJobs = [...civicJobs, ...remotiveJobs];

    res.json(allJobs);
    console.log(`✅ Served ${allJobs.length} combined jobs`);
  } catch (err) {
    console.error('❌ Failed to load job data:', err);
    res.status(500).json({ error: 'Failed to load combined job data.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Unified Job API running at http://localhost:${PORT}/api/jobs`);
});
