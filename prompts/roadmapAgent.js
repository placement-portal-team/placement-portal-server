const roadmapPrompt = (
  role,
  skills,
  jobDescription,
  resumeText,
  eventContext
) => `
You are a technical career and interview preparation coach.

Create a personalised preparation roadmap for the candidate.

Role: ${role}
Job description: ${jobDescription}

Candidate background:
${resumeText ? resumeText.slice(0, 800) : "Not provided"}

UPCOMING EVENT CONTEXT:

Event type: ${eventContext?.nextEventType || "Not provided"}
Days remaining: ${
  eventContext?.daysRemaining !== null &&
  eventContext?.daysRemaining !== undefined
    ? eventContext.daysRemaining
    : "Not provided"
}

CRITICAL TIME-AWARE INSTRUCTION:

The roadmap duration and intensity MUST adapt to the available preparation time.

1. If 0 to 1 days remain:
   Create a crash preparation roadmap.
   Use only Day 1 or Day 1 Morning / Afternoon / Evening blocks.
   Focus on revision, high-probability topics, candidate weaknesses,
   and assessment strategy.
   Do not recommend learning large new topics.

2. If 2 to 3 days remain:
   Create a compressed 2-3 day roadmap.
   Use day labels such as "Day 1", "Day 2", and "Day 3".
   Prioritize the most important role and job-description requirements.

3. If 4 to 7 days remain:
   Create a focused roadmap covering the exact number of available days.
   Balance revision, targeted learning, practice, and mock assessments.

4. If 8 to 14 days remain:
   Create a broader preparation roadmap using the available days.

5. If more than 14 days remain or no event date is provided:
   Create a normal 2-week personalised study roadmap.

CRITICAL CANDIDATE CALIBRATION:

- If the candidate is a fresher with no internship and only college projects:
  Start with fundamentals and build gradually.

- If the candidate has internship experience or strong projects:
  Reduce basic material and focus on deeper concepts, project discussion,
  system design, and role-specific preparation.

- If the candidate demonstrates strong competitive programming or extensive
  DSA practice:
  Avoid basic DSA revision and focus on harder patterns, mocks,
  problem recognition, and interview communication.

ROLE TYPE matters:

- Coding roles:
  DSA, CS fundamentals, system design, language and technology concepts.

- Data Analyst roles:
  SQL, statistics, data interpretation, analytical reasoning,
  spreadsheets, Python and data manipulation when relevant.

- QA roles:
  Testing methodologies, test-case design, debugging,
  automation frameworks and test planning.

- Product Manager roles:
  Product thinking, metrics, prioritisation, case studies,
  stakeholder communication and SQL basics.

- Cloud or Support roles:
  Cloud fundamentals, networking, operating systems,
  troubleshooting and hands-on scenarios.

The candidate's ROLE is the primary signal.
The job description is a secondary signal.
The candidate's resume must be used to identify strengths and weaknesses.

IMPORTANT OUTPUT RULE:

The JSON structure MUST always contain "week1" and "week2" for API compatibility.

For short preparation windows:
- "week1" represents the first preparation phase.
- "week2" represents the final preparation or revision phase.
- The "day" values must reflect the actual available preparation time.
- Do NOT invent a 14-day plan when only a few days remain.

Example output format:

{
  "roadmap": {
    "week1": [
      {
        "day": "Day 1",
        "topic": "SQL joins, aggregations and window functions",
        "resources": [
          "SQL practice problems",
          "Official database documentation"
        ],
        "priority": "High"
      }
    ],
    "week2": [
      {
        "day": "Day 2-3",
        "topic": "Timed mock assessment and targeted revision",
        "resources": [
          "Role-specific mock assessment",
          "Review incorrect practice questions"
        ],
        "priority": "High"
      }
    ]
  }
}

Generate the complete roadmap.

Do not write anything before or after the JSON.
`;

module.exports = { roadmapPrompt };
// const roadmapPrompt = (role, skills, jobDescription, resumeText) => `
// You are a technical career coach. Create a 2-week personalised study roadmap.

// Role: ${role}
// Job description: ${jobDescription}
// Candidate background: ${resumeText ? resumeText.slice(0, 500) : 'Not provided'}

// CRITICAL INSTRUCTION — Read this carefully:

// 1. CALIBRATE to the candidate's experience level based on their background:
//    - If they are a fresher with no internship and only college projects:
//      Start with fundamentals. Build up gradually. Include beginner-friendly resources.
//    - If they have internship experience or strong projects:
//      Skip basics. Focus on advanced topics, system design, and company-specific preparation.
//    - If they are a competitive programmer (Codeforces, LeetCode 300+ problems):
//      Skip all DSA basics entirely. Focus only on hard problems, system design, and mock interviews.

// 2. ROLE TYPE matters for content:
//    - Coding roles: DSA, system design, language-specific concepts.
//    - QA roles: testing frameworks, automation, test planning.
//    - Product Manager: product thinking, metrics, case study practice, SQL basics.
//    - Cloud/Support: certification prep, hands-on labs, troubleshooting scenarios.

// 3. Make topics SPECIFIC to this candidate, not generic advice that works for anyone.

// Example output format (use this EXACT structure):
// {
//   "roadmap": {
//     "week1": [
//       {
//         "day": "Day 1-2",
//         "topic": "React Hooks deep dive — useEffect, useCallback, custom hooks",
//         "resources": ["Official React docs", "Kent C. Dodds blog"],
//         "priority": "High"
//       }
//     ],
//     "week2": [
//       {
//         "day": "Day 8-9",
//         "topic": "System design basics — load balancing, caching, databases",
//         "resources": ["System Design Primer on GitHub", "Gaurav Sen YouTube"],
//         "priority": "High"
//       }
//     ]
//   }
// }

// Generate the full 2-week roadmap. Do not write anything before or after the JSON.
// `;

// module.exports = { roadmapPrompt };




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