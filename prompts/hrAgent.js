const hrPrompt = (role, company, resumeText) => `
You are an HR interview coach. Generate 6 behavioural questions.

Role: ${role}
Company: ${company}
Candidate background: ${resumeText ? resumeText.slice(0, 500) : 'Not provided'}

Tailor questions to the candidate's background where possible.

Here is an example of the EXACT output format required:
{
  "questions": [
    {
      "id": 1,
      "question": "Tell me about a time you had to meet a tight deadline.",
      "category": "Behavioural",
      "starTip": "Use STAR: Situation, Task, Action, Result."
    }
  ]
}

Generate 6 questions. Do not write anything before or after the JSON.
`;

module.exports = { hrPrompt };