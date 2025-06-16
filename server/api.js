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
    const allJobsPath = path.join(__dirname, '../data/allJobs.json');
    const allJobs = JSON.parse(fs.readFileSync(allJobsPath, 'utf-8'));

    res.json(allJobs);
    console.log(`✅ Served ${allJobs.length} jobs`);
  } catch (err) {
    console.error('❌ Failed to serve jobs:', err);
    res.status(500).json({ error: 'Failed to load allJobs.json' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Unified Job API running at http://localhost:${PORT}/api/jobs`);
});
