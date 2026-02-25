const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function extractSkillsFromJobDescription(jobDescription) {
  const prompt = `
Extract only technical skills, tools, frameworks, and required qualifications 
from this job description ${jobDescription}. Ignore soft skills and marketing text.
Return as a coma seprated keywords`;

  const response = await client.responses.create({
    model: "gpt-5.2",
    input: prompt,
  });


  return response.output_text;
}

async function extractSkillsFromResume(resumeText) {
  const prompt = `
Extract only technical skills, tools, frameworks, and required qualifications 
from this resume ${resumeText}. Ignore soft skills and marketing text.
Return as a coma seprated keywords`;

  const response = await client.responses.create({
    model: "gpt-5.2",
    input: prompt,
  });


  return response.output_text;
}

async function getResumeImprovements(resumeText, jobDescription, missingSkills) {
  const prompt = `
You are a senior technical recruiter.

Resume:
${resumeText}

Job Description:
${jobDescription}

Missing Skills:
${missingSkills.join(", ")}

Return structured HTML with:
1. Explain why the resume score is low or high.
2. Suggest improvements.
3. Suggest how to include missing skills naturally.
4. Provide a short improved professional summary.
`;

  const response = await client.responses.create({
    model: "gpt-5.2",
    input: prompt,
  });


  return response.output_text;
}

async function generateResume(resumeText, jobDescription) {
  const prompt = `
You are an expert resume writer.

Resume:
${resumeText}

Job Description:
${jobDescription}

Rewrite this resume to:
- Be ATS optimized
- Include strong action verbs
- Quantify achievements where possible
- Improve clarity and professionalism
- Keep it concise

Return structured HTML with:
- Professional Summary
- Experience
- Skills
- Education
`;

  const response = await client.responses.create({
    model: "gpt-5.2",
    input: prompt,
  });


  return response.output_text;
}

module.exports = { extractSkillsFromJobDescription, extractSkillsFromResume, getResumeImprovements, generateResume };