// server/route/ai/generateCoverLetter.ts
import { Router, Request, Response } from 'express';
import { coherePrompt } from '../../utils/coherePrompt';

const router = Router();

router.post('/generate-cover-letter', async (req, res) => {
  const { description } = req.body;

  if (!description) {
    return res.status(400).json({ error: 'Missing job description' });
  }

  try {
    const letter = await coherePrompt(description);
    return res.json({ success: true, content: letter });
  } catch (err) {
    console.error('❌ Error generating cover letter:', err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
});

export default router;
