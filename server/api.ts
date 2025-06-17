// server/api.ts or server/index.ts
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';

import generateCoverLetterRouter from './route/ai/generateCoverLetter';

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/ai', generateCoverLetterRouter); // POST to /api/ai/generate-cover-letter

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
