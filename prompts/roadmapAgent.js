const roadmapPrompt = (role, skills, jobDescription, resumeText) => `
You are a technical career coach. Create a 2-week personalised study roadmap.

Role: ${role}
Job description: ${jobDescription}
Candidate background: ${resumeText ? resumeText.slice(0, 500) : 'Not provided'}

CRITICAL INSTRUCTION — Read this carefully:

1. CALIBRATE to the candidate's experience level based on their background:
   - If they are a fresher with no internship and only college projects:
     Start with fundamentals. Build up gradually. Include beginner-friendly resources.
   - If they have internship experience or strong projects:
     Skip basics. Focus on advanced topics, system design, and company-specific preparation.
   - If they are a competitive programmer (Codeforces, LeetCode 300+ problems):
     Skip all DSA basics entirely. Focus only on hard problems, system design, and mock interviews.

2. ROLE TYPE matters for content:
   - Coding roles: DSA, system design, language-specific concepts.
   - QA roles: testing frameworks, automation, test planning.
   - Product Manager: product thinking, metrics, case study practice, SQL basics.
   - Cloud/Support: certification prep, hands-on labs, troubleshooting scenarios.

3. Make topics SPECIFIC to this candidate, not generic advice that works for anyone.

Example output format (use this EXACT structure):
{
  "roadmap": {
    "week1": [
      {
        "day": "Day 1-2",
        "topic": "React Hooks deep dive — useEffect, useCallback, custom hooks",
        "resources": ["Official React docs", "Kent C. Dodds blog"],
        "priority": "High"
      }
    ],
    "week2": [
      {
        "day": "Day 8-9",
        "topic": "System design basics — load balancing, caching, databases",
        "resources": ["System Design Primer on GitHub", "Gaurav Sen YouTube"],
        "priority": "High"
      }
    ]
  }
}

Generate the full 2-week roadmap. Do not write anything before or after the JSON.
`;

module.exports = { roadmapPrompt };




//==================================just run the server(npm run dev) and then on another separate terminal run node run-quality-check.js  ===================================

// const roadmapPrompt = (role, skills, jobDescription, resumeText) => `
// You are a technical career coach. Create a 2-week personalised study roadmap.

// Role: ${role}
// Job description: ${jobDescription}
// Candidate background: ${resumeText ? resumeText.slice(0, 500) : 'Not provided'}

// IMPORTANT: Calibrate the roadmap to the candidate's CURRENT level based on their
// background. If they describe themselves as a beginner with limited project
// experience, start with fundamentals and build up gradually. If they show strong
// existing experience (internships, competitive programming, multiple real projects),
// skip basics and focus on advanced topics, company-specific prep, and mock interviews.

// Respond ONLY with this exact JSON structure, nothing else:
// {
//   "roadmap": {
//     "week1": [ { "day": "...", "topic": "...", "resources": ["..."], "priority": "High|Medium" } ],
//     "week2": [ { "day": "...", "topic": "...", "resources": ["..."], "priority": "High|Medium" } ]
//   }
// }
// `;

// module.exports = { roadmapPrompt };