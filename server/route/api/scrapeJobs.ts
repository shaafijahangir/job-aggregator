// server/route/api/scrapeJobs.ts
import { Router } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { execFile } from 'child_process';

const router = Router();

function runScript(): Promise<{ code: number; stdout: string; stderr: string }> {
  return new Promise((resolve, reject) => {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    const projectRoot = path.resolve(__dirname, '..', '..'); // → /server

    // scripts/scrapeJobPortals.js should write to public/data/*.json
    const scriptPath = path.join(projectRoot, 'scripts', 'scrapeJobPortals.js');

    execFile(process.execPath, [scriptPath], { cwd: projectRoot }, (err, stdout, stderr) => {
      if (err) return reject({ code: err.code ?? 1, stdout, stderr });
      resolve({ code: 0, stdout, stderr });
    });
  });
}

router.post('/scrape/jobs', async (_req, res) => {
  try {
    const result = await runScript();
    res.status(200).json({ ok: true, ...result });
  } catch (e: any) {
    res.status(500).json({ ok: false, error: e?.stderr || e?.message || 'scrape failed' });
  }
});

export default router;
