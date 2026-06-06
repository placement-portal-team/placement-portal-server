const technicalPrompt = (role, company, jobDescription, skills) => `
You are a technical interview coach. Generate 8 technical interview questions.

Role: ${role}
Company: ${company}
Candidate skills: ${skills.join(', ')}
Job Description: ${jobDescription}

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

Now generate 8 questions following this EXACT format.
Do not write anything before or after the JSON. No explanation. No markdown.
`;

module.exports = { technicalPrompt };