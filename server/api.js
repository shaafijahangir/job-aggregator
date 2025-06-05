// server/api.js
const express = require('express');
const fs = require('fs');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/jobs', (req, res) => {
  const jobsPath = path.join(__dirname, '../data/civicjobs.json');
  try {
    const jobs = JSON.parse(fs.readFileSync(jobsPath, 'utf-8'));
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to load job data.' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Job API running at http://localhost:${PORT}/api/jobs`);
});
