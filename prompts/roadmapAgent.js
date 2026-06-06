const roadmapPrompt = (role, skills, jobDescription) => `
You are a technical career coach. Create a 2-week personalised study roadmap.

Role: ${role}
Candidate's current skills: ${skills.join(', ')}
Job description: ${jobDescription}

Here is an example of the EXACT output format required:
{
  "roadmap": {
    "week1": [
      {
        "day": "Day 1-2",
        "topic": "Arrays and Strings",
        "resources": ["LeetCode Easy problems", "GeeksforGeeks Arrays"],
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

Now generate a full 2-week roadmap following this EXACT format.
Do not write anything before or after the JSON. No explanation. No markdown.
`;

module.exports = { roadmapPrompt };