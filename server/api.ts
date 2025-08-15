// server/api.ts or server/index.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import scrapeJobsRouter from './route/api/scrapeJobs.js';
import generateCoverLetterRouter from './route/ai/generateCoverLetter';
import generateResumeRouter from './route/ai/generateResume';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/api', scrapeJobsRouter);
app.use('/api/ai', generateCoverLetterRouter); // POST to /api/ai/generate-cover-letter
app.use('/api/ai', generateResumeRouter);

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
