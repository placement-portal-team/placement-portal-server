const technicalPrompt = (role, company, jobDescription, skills, resumeText) => `
You are a technical interview coach. Generate 8 technical interview questions.

Role: ${role}
Company: ${company}
Candidate skills: ${skills.join(', ')}
Job Description: ${jobDescription}
Candidate's resume summary: ${resumeText ? resumeText.slice(0, 800) : 'Not provided'}

Use the resume to ask questions about their actual projects and experience where relevant.

Here is an example of the EXACT output format required:
{
  "questions": [
    {
      "id": 1,
      "question": "Explain the difference between SQL and NoSQL databases.",
      "topic": "Databases",
      "difficulty": "Medium",
      "hint": "Think about structure, scalability, and use cases."
    }
  ]
}

Generate 8 questions. Do not write anything before or after the JSON.
`;

module.exports = { technicalPrompt };