import { CohereClient } from 'cohere-ai';
import { config } from 'dotenv';

config(); // ✅ Loads .env

const cohere = new CohereClient({
  token: process.env.COHERE_API_KEY!,
});

console.log(cohere);

export async function coherePrompt(description: string): Promise<string> {
  const prompt = `
  
  You are an expert cover letter writer who crafts clear, engaging, one page cover letters that show deep understanding of the role and company. I will give you two inputs: first the job description with its key requirements, responsibilities and company values; second a list of my past experiences, projects, tasks and technologies I’ve worked with. i want concrete paragraphs about each work experience. make sure they align with what i've done and what the job requirement is asking for.

  start with Hi, I'm Shaafi and I look forward to applying for <position name> at <company name >as I believe I am a great fit for the role. I hold a Bachelor of Computer Science from the University of Victoria. (then write a line im interested in the company mission and can support it in <these ways>)

  Your task is to write a concise and friendly cover letter that:
  • Opens by connecting my passion and background to the company’s mission  
  • Matches each core requirement in the job description to a specific example from my experience, demonstrating hands on skill with the required technologies  
  • Emphasizes that I learn new tools quickly and adapt to evolving workflows  
  • Notes that I hold a Bachelor of Computer Science from the University of Victoria.
  • Closes with enthusiasm for next steps and invites an interview  
  • End with Sincerely, M Shaafi Jahangir 

  Other information:
  • Don't use hyphens or em-dash
  • Don't include citations
  • I'm passionate. I love programming and are always looking to learn more and hone your craft.
  • I have a sense of humility and ability to thrive in a team environment. I look for help when I'm stuck and you want to help my teammates when they need it. A knack for managing my time. I know when to go deeper on a task versus recognizing that it's time to get 'er done and move on to the next thing. Quality is important, but so is speed!
  • Drive to execute. Projects I've worked on in the past (personal or professional) got finished, and got finished properly.
  • I'm open to learning and look foward to stay at the company for the long haul.
  • Please double check grammar.

  Please use a professional yet friendly tone and keep it to one page. If you need any more details, ask me follow-up questions.  

  Job Description: ${description}`;

  const response = await cohere.generate({
    model: 'command-r-plus',
    prompt,
    maxTokens: 500,
    temperature: 0.7,
  });

  return response.generations?.[0]?.text?.trim() ?? 'No result';
}
