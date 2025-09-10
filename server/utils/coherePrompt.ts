import { CohereClient } from 'cohere-ai';
import { config } from 'dotenv';
config();

const cohere = new CohereClient({ token: process.env.COHERE_API_KEY! });

export async function generateCoverLetter(
  description: string, 
  profile?: string, 
  jobTitle?: string,
  companyName?: string
) {
  const defaultProfile = "Hi, I'm Shaafi. I hold a Bachelor of Computer Science from the University of Victoria with experience in full-stack development, automation, and cloud technologies.";
  
  const prompt = `
You are an expert cover letter writer. Write a professional, engaging cover letter that feels natural and conversational.

REQUIREMENTS:
- Start with a strong opening that mentions the specific role and shows genuine interest
- Connect the candidate's technical background to the job requirements with specific examples
- Highlight quick learning ability and adaptability with concrete examples
- Include Bachelor of Computer Science from University of Victoria
- End with enthusiasm and request for interview
- Keep it concise and professional (under 400 words)
- Use natural, conversational tone - avoid overly formal language
- No bullet points, citations, or em-dashes

WRITING STYLE:
- Be specific about technologies and achievements
- Use active voice
- Show personality while remaining professional
- Connect technical skills to business impact
- Mention the company/role specifically when possible

Job Title: ${jobTitle || 'the position'}
Company: ${companyName || 'your organization'}

Candidate Background:
${profile || defaultProfile}

Job Description:
${description}

Write only the cover letter content starting with "Dear Hiring Team," or similar greeting.
`;

  const resp = await cohere.generate({
    model: 'command-r-plus',
    prompt,
    maxTokens: 500,
    temperature: 0.7, // Slightly higher for more natural variation
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
- SUMMARY (2—3 lines)
- CORE SKILLS (comma-separated tech, tools, methodologies)
- EXPERIENCE (2—3 roles or projects). For each:
  • Title — Company — Year range  
  • 3—5 bullets aligning to the JD
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

// Helper function to extract job title from job description if not provided
export function extractJobTitle(description: string): string {
  // Simple regex patterns to find job titles
  const patterns = [
    /(?:position|role|job)\s*:\s*([^\n\r]+)/i,
    /(?:title|position)\s*:\s*([^\n\r]+)/i,
    /we're\s+looking\s+for\s+(?:a|an)\s+([^\n\r,.]+)/i,
    /hiring\s+(?:a|an)\s+([^\n\r,.]+)/i
  ];
  
  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      return match[1].trim().replace(/[^\w\s]/g, '').trim();
    }
  }
  
  return 'Position';
}

// Helper function to extract company name from job description
export function extractCompanyName(description: string): string {
  const patterns = [
    /(?:company|organization)\s*:\s*([^\n\r]+)/i,
    /(?:at|with|for)\s+([A-Z][a-zA-Z\s&]+?)(?:\s+is|\s+we|\s+has|\s+offers|,|\.|$)/,
    /([A-Z][a-zA-Z\s&]+?)\s+is\s+(?:seeking|looking|hiring)/i
  ];
  
  for (const pattern of patterns) {
    const match = description.match(pattern);
    if (match && match[1]) {
      const company = match[1].trim().replace(/[^\w\s&]/g, '').trim();
      if (company.length > 2 && company.length < 50) {
        return company;
      }
    }
  }
  
  return '';
}