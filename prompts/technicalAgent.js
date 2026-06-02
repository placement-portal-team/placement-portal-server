const technicalPrompt = (role, company, jobDescription, skills) => `
You are a technical interview coach. Generate 8 technical interview questions for:
Role: ${role}
Company: ${company}
Candidate skills: ${skills.join(', ')}
Job Description summary: ${jobDescription}

Respond ONLY with valid JSON in this exact format:
{
  "questions": [
    {
      "id": 1,
      "question": "...",
      "topic": "Data Structures / Algorithms / System Design / etc",
      "difficulty": "Easy | Medium | Hard",
      "hint": "One-line hint for the candidate"
    }
  ]
}
`;

module.exports = { technicalPrompt };
