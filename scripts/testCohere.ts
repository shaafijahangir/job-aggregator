// scripts/testCohere.ts
import 'dotenv/config'; // ✅ Load .env variables
import { coherePrompt } from '../server/utils/coherePrompt.js'; // 👈 notice the `.js` if using ESM

async function test() {
  const dummyDescription = `
  We are hiring a passionate frontend developer who can work with React and Tailwind. You will help build accessible, scalable UIs for civic platforms.
  `;

  const result = await coherePrompt(dummyDescription);
  console.log('📝 Cover Letter:\n', result);
}

test().catch(console.error);
