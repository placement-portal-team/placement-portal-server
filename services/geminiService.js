require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { technicalPrompt } = require('../prompts/technicalAgent');
const { hrPrompt } = require('../prompts/hrAgent');
const { roadmapPrompt } = require('../prompts/roadmapAgent');

const PROMPT_VERSION = 'v1.1';

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY is not set in environment variables');
    }
    this.genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  }

  // Safely parse JSON — strips markdown fences if present
  _parseJSON(text) {
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  }

  // Call Gemini with retry logic (2 retries, exponential backoff)
  async _callWithRetry(prompt, type, retries = 2) {
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const result = await this.model.generateContent(prompt);
      const parsed = this._parseJSON(result.response.text());
      this._validateSchema(parsed, type);
      return parsed;
    } catch (err) {
      if (attempt === retries) throw err;
      const delay = Math.pow(2, attempt) * 1000;
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

  // Fallback content if Gemini fails after all retries
  _fallbackContent(type) {
    if (type === 'technical') {
      return { questions: [{ id: 1, question: "Tell us about your experience with the tech stack mentioned in the JD.", topic: "General", difficulty: "Easy", hint: "Be specific about projects you've worked on." }] };
    }
    if (type === 'hr') {
      return { questions: [{ id: 1, question: "Tell me about yourself.", category: "Behavioural", starTip: "Keep it professional and relevant to the role." }] };
    }
    return { roadmap: { week1: [{ day: "Day 1-3", topic: "Review job description requirements", resources: ["Official documentation"], priority: "High" }], week2: [{ day: "Day 8-10", topic: "Mock interviews and practice problems", resources: ["LeetCode", "Pramp"], priority: "High" }] } };
  }

  // Validate that parsed JSON has expected shape
_validateSchema(parsed, type) {
  if (type === 'technical') {
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('Technical agent: missing questions array');
    }
    parsed.questions.forEach(q => {
      if (!q.question || !q.difficulty) throw new Error('Technical agent: missing required fields');
    });
  }
  if (type === 'hr') {
    if (!parsed.questions || !Array.isArray(parsed.questions)) {
      throw new Error('HR agent: missing questions array');
    }
  }
  if (type === 'roadmap') {
    if (!parsed.roadmap || !parsed.roadmap.week1) {
      throw new Error('Roadmap agent: missing roadmap.week1');
    }
  }
  return true;
}

  // Main method — call all 3 agents and return combined result
 async generatePrep({ role, company, jobDescription, skills, resumeText }) {
  if (!role || !company || !jobDescription) {
    throw new Error('role, company, and jobDescription are required');
  }
  const userSkills = skills || [];
  const resume = resumeText || '';

  const [technical, hr, roadmap] = await Promise.allSettled([
    this._callWithRetry(
      technicalPrompt(role, company, jobDescription, userSkills, resume),
      'technical'
    ),
    this._callWithRetry(
      hrPrompt(role, company, resume),
      'hr'
    ),
    this._callWithRetry(
      roadmapPrompt(role, userSkills, jobDescription, resume),
      'roadmap'
    )
  ]);

  return {
    technicalQuestions: technical.status === 'fulfilled'
      ? technical.value.questions
      : this._fallbackContent('technical').questions,
    hrQuestions: hr.status === 'fulfilled'
      ? hr.value.questions
      : this._fallbackContent('hr').questions,
    studyRoadmap: roadmap.status === 'fulfilled'
      ? roadmap.value.roadmap
      : this._fallbackContent('roadmap').roadmap,
    promptVersion: PROMPT_VERSION,
    generatedAt: new Date()
  };
}

    return {
      technicalQuestions: technical.status === 'fulfilled' ? technical.value.questions : this._fallbackContent('technical').questions,
      hrQuestions: hr.status === 'fulfilled' ? hr.value.questions : this._fallbackContent('hr').questions,
      studyRoadmap: roadmap.status === 'fulfilled' ? roadmap.value.roadmap : this._fallbackContent('roadmap').roadmap,
      promptVersion: PROMPT_VERSION,
      generatedAt: new Date()
    };
  }
}

module.exports = new GeminiService();