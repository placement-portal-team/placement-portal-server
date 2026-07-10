const hrPrompt = (role, company, resumeText,jobDescription,eventContext) => `
You are an HR interview coach. Generate 6 behavioural questions.

Role: ${role}
Company: ${company}
Candidate background: ${resumeText ? resumeText.slice(0, 500) : 'Not provided'}
Job Description: ${jobDescription}

UPCOMING INTERVIEW CONTEXT:

Event type: ${eventContext?.nextEventType || "Not provided"}
Days remaining: ${
  eventContext?.daysRemaining !== null &&
  eventContext?.daysRemaining !== undefined
    ? eventContext.daysRemaining
    : "Not provided"
}

URGENCY INSTRUCTION:

Calibrate the behavioural preparation based on the time remaining.

- 0 to 1 days remaining:
  Focus on the highest-probability HR questions.
  Prioritize questions that can be answered using the candidate's existing experiences.
  Help the candidate rapidly prepare strong STAR stories.

- 2 to 3 days remaining:
  Focus on common behavioural questions, company motivation,
  teamwork, conflict, deadlines, failures, and leadership.

- 4 to 7 days remaining:
  Provide broader behavioural coverage and identify different experiences
  from the candidate's background that can be converted into STAR answers.

- 8 or more days remaining:
  Include broader behavioural and situational preparation.

- If no event date is provided:
  Generate normal HR interview preparation.

At least 3 questions should be connected to the candidate's actual projects,
internships, technical work, or experiences when sufficient resume context exists.

Use the EXACT JSON structure shown below:
{
  "questions": [
    {
      "id": 1,
      "question": "Tell me about a time you had to meet a tight deadline.",
      "category": "Behavioural",
      "starTip": "Use STAR: Situation, Task, Action, Result."
    }
  ],
  "hrStrategy": [
    "Research the company and connect your motivation to the role.",
    "Prepare STAR stories from projects, teamwork, failures, and leadership experiences."
  ]
}

Generate 8-10 questions. Generate compulsory HRStratergy based on role,comapany and Job description.Do not write anything before or after the JSON.
`;

module.exports = { hrPrompt };

// Use the EXACT JSON structure shown below:

// {
//   "practiceQuestions": [
//     {
//       "id": 1,
//       "question": "Given an array of integers, find the length of the longest subarray containing at most two distinct values.",
//       "topic": "Sliding Window",
//       "difficulty": "Medium",
//       "reason": "Sliding window patterns are commonly tested in coding assessments for software engineering roles."
//     }
//   ],
//   "focusTopics": [
//     {
//       "topic": "Sliding Window",
//       "priority": "High",
//       "reason": "The role requires strong problem solving and data structure knowledge."
//     }
//   ],
//   "oaStrategy": [
//     "Scan all coding problems before starting and identify the easiest problem first.",
//     "Reserve the final 10 minutes for testing edge cases and reviewing complexity."
//   ]
// }
// "id": 1,
//       "question": "Tell me about a time you had to meet a tight deadline.",
//       "category": "Behavioural",
//       "starTip": "Use STAR: Situation, Task, Action, Result."