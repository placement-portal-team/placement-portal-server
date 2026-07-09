const oaPrompt = (role, company, jobDescription, skills, resumeText) => `
You are an online assessment preparation coach. Create personalised OA preparation guidance for the candidate below.

Role: ${role}
Company: ${company}
Job Description: ${jobDescription}
Candidate skills: ${skills && skills.length ? skills.join(", ") : "Not provided"}
Candidate background: ${resumeText ? resumeText.slice(0, 800) : "Not provided"}

CRITICAL INSTRUCTION — Read this carefully before generating the preparation:

1. ROLE TYPE matters. Adjust the OA preparation based on the role:
   - Software Engineer / Backend / Frontend roles:
     Focus on data structures, algorithms, problem solving, and coding assessment patterns.
   - QA / Testing roles:
     Focus on testing aptitude, debugging, test case design, SQL, and automation concepts.
   - Product or analytical roles:
     Focus on logical reasoning, SQL, data interpretation, product aptitude, and case-based questions.
   - Cloud / Support roles:
     Focus on networking, operating systems, cloud fundamentals, troubleshooting, and technical aptitude.

2. JOB DESCRIPTION matters.
   Identify the most important skills and technologies from the job description and prioritise related OA topics.

3. CANDIDATE BACKGROUND matters.
   Calibrate question difficulty using the candidate's resume and skills.
   - For beginners or freshers with limited coding experience, prefer Easy and Medium questions.
   - For candidates with strong projects, internships, or significant coding practice, include more Medium and Hard questions.
   - Do not generate the same generic preparation for every candidate.

4. PRACTICE QUESTIONS should help the candidate prepare for the assessment.
   Generate questions or problem descriptions, not interview discussion questions.

5. OA STRATEGY should contain practical assessment-taking advice specific to the candidate and role.

Use the EXACT JSON structure shown below:

{
  "practiceQuestions": [
    {
      "id": 1,
      "question": "Given an array of integers, find the length of the longest subarray containing at most two distinct values.",
      "topic": "Sliding Window",
      "difficulty": "Medium",
      "reason": "Sliding window patterns are commonly tested in coding assessments for software engineering roles."
    }
  ],
  "focusTopics": [
    {
      "topic": "Sliding Window",
      "priority": "High",
      "reason": "The role requires strong problem solving and data structure knowledge."
    }
  ],
  "oaStrategy": [
    "Scan all coding problems before starting and identify the easiest problem first.",
    "Reserve the final 10 minutes for testing edge cases and reviewing complexity."
  ]
}

Generate 8 practice questions, 5 focus topics, and 5 OA strategy points.

Do not write anything before or after the JSON.
`;

module.exports = { oaPrompt };