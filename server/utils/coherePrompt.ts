// server/utils/coherePrompt.ts
import { CohereClient } from 'cohere-ai';
import { config } from 'dotenv';
config();

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY! });

export async function generateCoverLetter(description: string, profile?: string) {
  const prompt = `
You are an expert cover letter writer who crafts clear, engaging, one-page cover letters.

Write a concise, friendly cover letter that:
- Connects the candidate's background to the company's mission
- Maps the core requirements in the job description to specific examples from experience
- Emphasizes quick learning & adaptability
- Notes the candidate holds a Bachelor of Computer Science from the University of Victoria
- Ends with enthusiasm for next steps and an interview request
- No citations, no em-dashes/hyphens

Candidate:
${profile ?? "Hi, I'm Shaafi. I hold a Bachelor of Computer Science from the University of Victoria."}

Job Description:
${description}

Keep it to one page. Double-check grammar. Output only the final letter text.
`;

  const resp = await cohere.generate({
    model: 'command-r-plus',
    prompt,
    maxTokens: 600,
    temperature: 0.6,
  });

  return resp.generations?.[0]?.text?.trim() ?? 'No result';
}

export async function generateResume(description: string, profile?: string) {
  const prompt = `
You are an expert technical resume writer. Generate a targeted, one-page resume
as plain text for the candidate tailored to the job description. Use concise bullet
points with measurable impact when possible. Do not include contact details header;
start at the SUMMARY. No citations.

Candidate:
${profile ?? "M. Shaafi Jahangir — BSc, Computer Science (University of Victoria). Projects + internships in web dev, data, automation."}

Job Description:
${description}

Sections:
- SUMMARY (2–3 lines)
- CORE SKILLS (comma-separated tech, tools, methodologies)
- EXPERIENCE (2–3 roles or projects). For each:
  • Title — Company — Year range  
  • 3–5 bullets aligning to the JD
- EDUCATION (BSc, University of Victoria)
- OPTIONAL: CERTIFICATIONS if relevant

Return only the resume text. Double-check grammar.
`;

  const resp = await cohere.generate({
    model: 'command-r-plus',
    prompt,
    maxTokens: 700,
    temperature: 0.5,
  });

  return resp.generations?.[0]?.text?.trim() ?? 'No result';
}
