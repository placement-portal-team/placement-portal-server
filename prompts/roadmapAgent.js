const roadmapPrompt = (role, skills, jobDescription, resumeText) => `
You are a technical career coach. Create a 2-week personalised study roadmap.

Role: ${role}
Candidate skills: ${skills.join(', ')}
Job description: ${jobDescription}
Candidate background: ${resumeText ? resumeText.slice(0, 500) : 'Not provided'}

Focus on gaps between the candidate's current skills and what the job requires.

Here is an example of the EXACT output format required:
{
  "roadmap": {
    "week1": [
      {
        "day": "Day 1-2",
        "topic": "Arrays and Strings",
        "resources": ["LeetCode Easy", "GeeksforGeeks Arrays"],
        "priority": "High"
      }
    ],
    "week2": [
      {
        "day": "Day 8-9",
        "topic": "System Design basics",
        "resources": ["System Design Primer on GitHub"],
        "priority": "Medium"
      }
    ]
  }
}

Generate the full 2-week roadmap. Do not write anything before or after the JSON.
`;

module.exports = { roadmapPrompt };