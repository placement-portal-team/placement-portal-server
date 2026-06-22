require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { technicalPrompt } = require('../prompts/technicalAgent');
const { hrPrompt } = require('../prompts/hrAgent');
const { roadmapPrompt } = require('../prompts/roadmapAgent');

const PROMPT_VERSION = 'v1.3';

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

      if (!result?.response?.text) {
         throw new Error('Invalid Gemini response');
      }

      const parsed = this._parseJSON(result.response.text());
      this._validateSchema(parsed, type);
      return parsed;
    } catch (err) {
      const isLastAttempt = attempt === retries;
      if (isLastAttempt) {
        console.error(`[GeminiService] ${type} agent failed after ${retries + 1} attempts:`, err.message);
        throw err;
      }
      const delay = Math.pow(2, attempt) * 1000;
      console.warn(`[GeminiService] ${type} agent attempt ${attempt + 1} failed. Retrying in ${delay}ms...`);
      await new Promise(res => setTimeout(res, delay));
    }
  }
}

  // Fallback content if Gemini fails after all retries

_fallbackContent(type) {



  if (type === 'technical') {
    return {
      questions: [
        { id: 1, question: "Walk me through a technical project you've built from scratch.", topic: "General", difficulty: "Easy", hint: "Focus on your architecture decisions and the challenges you solved." },
        { id: 2, question: "How would you design a URL shortening service like bit.ly?", topic: "System Design", difficulty: "Medium", hint: "Think about the data model, hashing strategy, and scale." },
        { id: 3, question: "Explain the difference between SQL and NoSQL databases. When would you choose each?", topic: "Databases", difficulty: "Medium", hint: "Consider structure, scalability, and consistency requirements." }
      ]
    };
  }
  if (type === 'hr') {
    return {
      questions: [
        { id: 1, question: "Tell me about a time you had to debug a difficult problem under pressure.", category: "Behavioural", starTip: "STAR: Describe what the bug was, the deadline, your debugging process, and the outcome." },
        { id: 2, question: "Describe a situation where you had to learn a new technology quickly.", category: "Situational", starTip: "STAR: What was the technology, why was it urgent, how did you approach learning it, what did you deliver?" },
        { id: 3, question: "Tell me about a time you disagreed with a teammate's technical decision.", category: "Behavioural", starTip: "Focus on how you communicated respectfully and reached a resolution." }
      ]
    };
  }
  return {
    roadmap: {
      week1: [
        { day: "Day 1-2", topic: "Review the job description and identify skill gaps", resources: ["Job description analysis", "Company engineering blog"], priority: "High" },
        { day: "Day 3-4", topic: "Data structures and algorithms practice", resources: ["LeetCode Easy/Medium", "NeetCode roadmap"], priority: "High" },
        { day: "Day 5-7", topic: "System design fundamentals", resources: ["System Design Primer — GitHub", "Gaurav Sen YouTube"], priority: "High" }
      ],
      week2: [
        { day: "Day 8-9", topic: "Company-specific preparation", resources: ["Glassdoor interview reviews", "company engineering blog"], priority: "High" },
        { day: "Day 10-11", topic: "Mock interviews", resources: ["Pramp.com", "Interviewing.io"], priority: "High" },
        { day: "Day 12-14", topic: "Behavioural questions and STAR method", resources: ["Big Interview platform", "LinkedIn Learning"], priority: "Medium" }
      ]
    }
  };
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

}

module.exports = new GeminiService();