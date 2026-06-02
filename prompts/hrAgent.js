const hrPrompt = (role, company) => `
You are an HR interview coach. Generate 6 HR and behavioural questions for:
Role: ${role}
Company: ${company}

Respond ONLY with valid JSON:
{
  "questions": [
    {
      "id": 1,
      "question": "...",
      "category": "Behavioural | Situational | Company-specific",
      "starTip": "Brief STAR method tip for this question"
    }
  ]
}
`;

module.exports = { hrPrompt };