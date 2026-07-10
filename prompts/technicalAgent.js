const technicalPrompt = (
  role,
  company,
  jobDescription,
  skills,
  resumeText,
  eventContext
) => `
You are a technical interview coach.

Generate personalized technical interview preparation for the candidate below.

Role: ${role}
Company: ${company}
Job Description: ${jobDescription}
Candidate's resume: ${
  resumeText
    ? resumeText.slice(0, 800)
    : 'Not provided'
}

UPCOMING INTERVIEW CONTEXT:

Event type: ${
  eventContext?.nextEventType ||
  "Not provided"
}

Days remaining: ${
  eventContext?.daysRemaining !== null &&
  eventContext?.daysRemaining !== undefined
    ? eventContext.daysRemaining
    : "Not provided"
}

URGENCY INSTRUCTION:

Calibrate the technical preparation based on the time remaining.

- 0 to 1 days remaining:
  Focus only on high-probability interview topics and the candidate's existing projects.
  Avoid obscure or highly advanced topics.
  Questions should help with rapid revision and interview readiness.

- 2 to 3 days remaining:
  Prioritize likely interview questions, resume-based questions,
  and major job-description requirements.
  Focus on weaknesses that can realistically be improved in a short time.

- 4 to 7 days remaining:
  Balance core technical concepts, resume-based questions,
  DSA or role-specific topics, and moderate system design where relevant.

- 8 or more days remaining:
  Include broader technical coverage and deeper conceptual questions.

- If no event date is provided:
  Generate normal technical interview preparation.

The candidate's ROLE is the primary signal.
The job description is a secondary signal.
The resume must be used for candidate-specific questions.

ROLE TYPE INSTRUCTIONS:

- Software Engineer / Backend / Frontend / ML Engineer / DevOps:
  Ask about data structures, algorithms, system design,
  projects, and technologies relevant to the job description.

- QA / Testing:
  Ask about test case design, testing methodologies,
  bug reporting, and automation tools.

- Product Manager or non-coding roles:
  Ask about product thinking, prioritisation,
  stakeholder communication, data interpretation,
  and technical literacy.
  Do NOT ask coding or algorithm questions.

- Cloud / Support:
  Ask about cloud concepts, networking,
  troubleshooting, and relevant cloud platforms.

RESUME PERSONALIZATION:

When sufficient resume context exists, directly reference the
candidate's projects, technologies, or experiences.

Do not generate generic questions that could apply to any candidate.

Return EXACTLY this JSON structure:

{
  "technicalQuestions": [
    {
      "id": 1,
      "question": "Explain how caching works in your AI-based project and what cache invalidation challenges you considered.",
      "topic": "Backend Systems",
      "difficulty": "Medium",
      "reason": "The candidate has backend and caching experience in their project."
    }
  ],
  "focusTopics": [
    {
      "topic": "Backend Systems",
      "priority": "High",
      "reason": "The role requires strong backend knowledge."
    }
  ],
  "interviewStrategy": [
    "Explain your initial approach before optimizing the solution.",
    "Discuss edge cases and time and space complexity.",
    "Connect technical answers to your actual project experience."
  ]
}

Generate 8-10 technicalQuestions.

Generate personalized focusTopics based on the role,
company, job description, and resume.

Generate interviewStrategy based on the role,
candidate background, and available preparation time.

Do not write markdown.
Do not use code fences.
Do not write anything before or after the JSON.
`;

module.exports = { technicalPrompt };





//====================================try it once with the commented part of roadmapAgent.js ===============================



// const technicalPrompt = (role, company, jobDescription, skills, resumeText) => `
// You are a technical interview coach. Generate 8 technical interview questions
// appropriate for the SPECIFIC role given below.

// Role: ${role}
// Company: ${company}
// Job Description: ${jobDescription}
// Candidate's resume summary: ${resumeText ? resumeText.slice(0, 800) : 'Not provided'}

// IMPORTANT: Tailor the TYPE of questions to the role.
// - Pure coding roles (Software Engineer, Backend Developer, ML Engineer):
//   focus on data structures, algorithms, system design, language concepts.
// - QA/Testing roles: focus on testing methodology, test case design, automation, bug triage.
// - Product Manager or non-coding roles: focus on technical literacy — communicating
//   with engineers, basic SQL/data concepts, product-technical tradeoffs.
//   Do NOT ask pure algorithm questions for non-coding roles.
// - DevOps/Cloud roles: focus on infrastructure, CI/CD, containers, cloud concepts.

// Use the resume to ask about actual projects where relevant.

// Respond ONLY with this exact JSON structure, nothing else:
// {
//   "questions": [
//     { "id": 1, "question": "...", "topic": "...", "difficulty": "Easy|Medium|Hard", "hint": "..." }
//   ]
// }
// `;

// module.exports = { technicalPrompt };