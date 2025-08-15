// src/lib/ai.ts
export async function apiGenerateCoverLetter(description: string, profile?: string) {
  const res = await fetch('http://localhost:3001/api/ai/generate-cover-letter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, profile }),
  });
  const data = await res.json();
  if (!data?.success) throw new Error(data?.error || 'Failed to generate cover letter');
  return data.content as string;
}

export async function apiGenerateResume(description: string, profile?: string) {
  const res = await fetch('http://localhost:3001/api/ai/generate-resume', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ description, profile }),
  });
  const data = await res.json();
  if (!data?.success) throw new Error(data?.error || 'Failed to generate resume');
  return data.content as string;
}
