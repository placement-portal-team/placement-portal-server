const technicalPrompt = (role, company, jobDescription, skills, resumeText) => `
You are a technical interview coach. Generate 8 interview questions for the candidate below.

Role: ${role}
Company: ${company}
Job Description: ${jobDescription}
Candidate's resume: ${resumeText ? resumeText.slice(0, 800) : 'Not provided'}

CRITICAL INSTRUCTION — Read this carefully before generating questions:

1. ROLE TYPE matters. Adjust question type based on the role:
   - Software Engineer / Backend / Frontend / ML Engineer / DevOps:
     Ask about data structures, algorithms, system design, and specific technologies in the JD.
   - QA / Testing roles:
     Ask about test case design, testing methodologies, bug reporting, and automation tools.
   - Product Manager or any non-coding role:
     Ask about product thinking, prioritisation frameworks, stakeholder communication,
     data interpretation, and technical literacy. Do NOT ask coding or algorithm questions.
   - Cloud / Support roles:
     Ask about cloud concepts, networking basics, troubleshooting approaches, and the specific
     platform mentioned in the JD (e.g. Azure, AWS).

2. RESUME matters. At least 3 of your 8 questions MUST directly reference something from the
   candidate's resume — their specific projects, tools they mentioned, or experiences they described.
   Do not generate questions that could apply to any random candidate.

3. The example below shows the EXACT JSON format. Do not change the structure.

Example output:
{
  "questions": [
    {
      "id": 1,
      "question": "In your placement portal project, how did you handle JWT expiry on the frontend without forcing the user to log in again?",
      "topic": "Authentication / Frontend",
      "difficulty": "Medium",
      "hint": "Think about refresh tokens and Axios interceptors."
    }
  ]
}

Generate 8 questions following this EXACT format. Do not write anything before or after the JSON.
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