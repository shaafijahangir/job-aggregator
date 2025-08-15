// server/route/ai/generateResume.ts
import { Router } from 'express';
import { generateResume } from '../../utils/coherePrompt';

const router = Router();

router.post('/generate-resume', async (req, res) => {
  const { description, profile } = req.body;
  if (!description) return res.status(400).json({ error: 'Missing job description' });

  try {
    const content = await generateResume(description, profile);
    res.json({ success: true, content });
  } catch (err) {
    console.error('❌ Resume error', err);
    res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
