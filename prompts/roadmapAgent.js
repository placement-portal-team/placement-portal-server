const roadmapPrompt = (role, skills, jobDescription) => `
You are a technical career coach. Create a 2-week study roadmap for:
Role: ${role}
Candidate's current skills: ${skills.join(', ')}
Job description: ${jobDescription}

Respond ONLY with valid JSON:
{
  "roadmap": {
    "week1": [
      { "day": "Day 1-2", "topic": "...", "resources": ["..."], "priority": "High | Medium" }
    ],
    "week2": [
      { "day": "Day 8-9", "topic": "...", "resources": ["..."], "priority": "High | Medium" }
    ]
  }
}
`;

module.exports = { roadmapPrompt };