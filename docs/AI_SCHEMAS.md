## How Sujith's route calls GeminiService (Week 3)
## How to call GeminiService from Express (v1.2)

const geminiService = require('../services/geminiService');

// Inside POST /api/v1/ai/prepare route:
const result = await geminiService.generatePrep({
  role: application.role,           // string — from Application document
  company: application.companyName, // string — from Application document
  jobDescription: req.body.jdText,  // string — from request body
  skills: req.user.skills,          // string[] — from User document
  resumeText: req.body.resumeText   // string — parsed PDF text (optional, can be '')
});

// result is always safe to use — never throws, uses fallback on failure:
// {
//   technicalQuestions: Array,     // from Agent 1 (or fallback)
//   hrQuestions: Array,            // from Agent 2 (or fallback)
//   studyRoadmap: { week1, week2 },// from Agent 3 (or fallback)
//   promptVersion: "v1.2",
//   generatedAt: Date
// }

// Save to AIPreparation collection, then return to frontend.

# AI Agent JSON Schemas (v1.1)

These are the exact JSON structures returned by each Gemini agent.
Do not change these without updating the prompts AND notifying the team.

---

## Agent 1: Technical Questions

POST /api/v1/ai/prepare triggers this agent.

```json
{
  "questions": [
    {
      "id": 1,
      "question": "string — the interview question text",
      "topic": "string — e.g. Arrays, System Design, OOP",
      "difficulty": "Easy | Medium | Hard",
      "hint": "string — one-line hint for the candidate"
    }
  ]
}
```

Returns 8 questions per call.

---

## Agent 2: HR Questions

```json
{
  "questions": [
    {
      "id": 1,
      "question": "string — the HR/behavioural question",
      "category": "Behavioural | Situational | Company-specific",
      "starTip": "string — STAR method guidance for this question"
    }
  ]
}
```

Returns 6 questions per call.

---

## Agent 3: Study Roadmap

```json
{
  "roadmap": {
    "week1": [
      {
        "day": "string — e.g. Day 1-2",
        "topic": "string — what to study",
        "resources": ["string", "string"],
        "priority": "High | Medium"
      }
    ],
    "week2": [
      {
        "day": "string",
        "topic": "string",
        "resources": ["string"],
        "priority": "High | Medium"
      }
    ]
  }
}
```

---

## MongoDB storage (AIPreparation collection)

GeminiService stores the full result in the AIPreparation collection:

| Field | Type | Notes |
|---|---|---|
| userId | ObjectId | who requested it |
| applicationId | ObjectId | which job application |
| technicalQuestions | Array | from Agent 1 |
| hrQuestions | Array | from Agent 2 |
| studyRoadmap | Object | from Agent 3 |
| promptVersion | String | "v1.1" — tracks which prompt was used |
| generatedAt | Date | auto |