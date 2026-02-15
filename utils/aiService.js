const OpenAI = require("openai");

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getResumeImprovements(resumeText, jobDescription, missingSkills) {
  const prompt = `
You are a senior technical recruiter.

Resume:
${resumeText}

Job Description:
${jobDescription}

Missing Skills:
${missingSkills.join(", ")}

Tasks:
1. Explain why the resume score is low or high.
2. Suggest improvements.
3. Suggest how to include missing skills naturally.
4. Provide a short improved professional summary.
`;

  const response = await client.responses.create({
    model: "gpt-5.2",
    input: prompt,
  });

  return response.outer_text;
}

module.exports = { getResumeImprovements };