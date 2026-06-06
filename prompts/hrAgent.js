const hrPrompt = (role, company) => `
You are an HR interview coach. Generate 6 HR and behavioural questions.

Role: ${role}
Company: ${company}

Here is an example of the EXACT output format required:
{
  "questions": [
    {
      "id": 1,
      "question": "Tell me about a time you had to meet a tight deadline.",
      "category": "Behavioural",
      "starTip": "Use the STAR method: describe the Situation, Task, Action you took, and Result."
    }
  ]
}

Now generate 6 questions following this EXACT format.
Do not write anything before or after the JSON. No explanation. No markdown.
`;

module.exports = { hrPrompt };