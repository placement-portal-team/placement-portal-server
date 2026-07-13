require('dotenv').config();



const { GoogleGenerativeAI } = require('@google/generative-ai');

const { technicalPrompt } = require('../prompts/technicalAgent');
const { hrPrompt } = require('../prompts/hrAgent');
const { roadmapPrompt } = require('../prompts/roadmapAgent');
const { oaPrompt } = require('../prompts/oaAgent');

const PROMPT_VERSION = 'v1.6';

class GeminiService {
  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error(
        'GEMINI_API_KEY is not set in environment variables'
      );
    }

    this.genAI = new GoogleGenerativeAI(
      process.env.GEMINI_API_KEY
    );

    this.model = this.genAI.getGenerativeModel({
      model: 'gemini-3.5-flash'
    });
  }

  // Safely parse Gemini JSON response
  _parseJSON(text) {
    const clean = text
      .replace(/```json|```/g, '')
      .trim();

    return JSON.parse(clean);
  }

  // Call Gemini with retry logic
  async _callWithRetry(prompt, type, retries = 2) {
    for (
      let attempt = 0;
      attempt <= retries;
      attempt++
    ) {
      try {
        const result = await this.model.generateContent(
          prompt
        );

        if (!result?.response?.text) {
          throw new Error(
            'Invalid Gemini response'
          );
        }

        const parsed = this._parseJSON(
          result.response.text()
        );

        this._validateSchema(parsed, type);

        return parsed;

      } catch (err) {
        const isLastAttempt =
          attempt === retries;

        if (isLastAttempt) {
          console.error(
            `[GeminiService] ${type} agent failed after ${retries + 1} attempts:`,
            err.message
          );

          throw err;
        }

        const delay =
          Math.pow(2, attempt) * 1000;

        console.warn(
          `[GeminiService] ${type} agent attempt ${attempt + 1} failed. Retrying in ${delay}ms...`
        );

        await new Promise(resolve =>
          setTimeout(resolve, delay)
        );
      }
    }
  }

  // Call Gemini and use fallback if all retries fail
  async _callWithFallback(prompt, type) {
    try {
      const data = await this._callWithRetry(
        prompt,
        type
      );

      return {
        data,
        usedFallback: false
      };

    } catch (error) {
      console.warn(
        `[GeminiService] Using fallback content for ${type} agent`
      );

      return {
        data: this._fallbackContent(type),
        usedFallback: true
      };
    }
  }

  // Fallback content
  _fallbackContent(type) {
   if (type === "technical") {
  return {
   technicalQuestions: [
  {
    id: 1,
    question:
      "Given an array of integers, find the longest consecutive sequence in O(n) time complexity.",
    topic: "Data Structures & Algorithms",
    difficulty: "Medium",
    hint:
      "Think about using a HashSet to achieve linear time complexity."
  },
  {
    id: 2,
    question:
      "Design an LRU Cache supporting get() and put() operations in O(1) time.",
    topic: "Data Structures & Algorithms",
    difficulty: "Hard",
    hint:
      "Combine a HashMap with a Doubly Linked List to maintain constant-time operations."
  },
  {
    id: 3,
    question:
      "Explain the differences between SQL and NoSQL databases. When would you choose one over the other?",
    topic: "Database Management Systems",
    difficulty: "Medium",
    hint:
      "Compare schema design, scalability, consistency, and common use cases."
  },
  {
    id: 4,
    question:
      "Explain how JWT authentication works in a full-stack web application.",
    topic: "Backend Development",
    difficulty: "Medium",
    hint:
      "Discuss token generation, verification, expiration, and secure storage."
  },
  {
    id: 5,
    question:
      "Walk me through a challenging project you've built and explain the key technical decisions you made.",
    topic: "Projects",
    difficulty: "Medium",
    hint:
      "Focus on the problem statement, architecture, implementation challenges, and the final outcome."
  }
],
    technicalFocusTopics: [
      "Data Structures & Algorithms",
      "Object Oriented Programming",
      "Operating Systems",
      "Database Management Systems",
      "Computer Networks",
      "System Design Fundamentals",
      "SQL & NoSQL Databases",
      "Projects & Debugging"
    ],

    interviewStrategy: [
      "Understand the problem completely before proposing a solution.",
      "Explain your thought process while solving coding questions.",
      "Discuss time and space complexity before finalizing your answer.",
      "Use examples to justify design decisions whenever possible.",
      "Communicate clearly with the interviewer and ask clarifying questions.",
      "Validate your solution using edge cases before concluding."
    ]
  };
}

   if (type === "hr") {
  return {
    hrQuestions: [
      {
        id: 1,
        question: "Tell me about yourself.",
        category: "Introduction",
        starTip:
          "Provide a concise overview covering your education, projects, technical skills, and career goals."
      },
      {
        id: 2,
        question:
          "Describe a challenging situation you faced while working on a project.",
        category: "Behavioural",
        starTip:
          "Use the STAR method to explain the challenge, your actions, and the outcome."
      },
      {
        id: 3,
        question:
          "Tell me about a time you worked effectively in a team.",
        category: "Teamwork",
        starTip:
          "Highlight communication, collaboration, and your individual contribution."
      },
      {
        id: 4,
        question:
          "How do you handle tight deadlines or pressure?",
        category: "Situational",
        starTip:
          "Explain prioritization, planning, and maintaining quality under pressure."
      },
      {
        id: 5,
        question:
          "Why do you want to work with our company?",
        category: "Company Fit",
        starTip:
          "Connect your career goals with the company's products, culture, and growth opportunities."
      }
    ],

    hrStrategy: [
      "Use the STAR framework for behavioural questions.",
      "Support your answers with real project experiences.",
      "Maintain confidence while keeping answers concise.",
      "Research the company's products and recent developments before the interview.",
      "Demonstrate enthusiasm, willingness to learn, and a growth mindset.",
      "End the interview with thoughtful questions about the role or team."
    ]
  };
}
    if (type === 'oa') {
      return {
        practiceQuestions: [
          {
            id: 1,
            question:
              'Find the length of the longest substring without repeating characters.',
            topic: 'Sliding Window',
            difficulty: 'Medium',
            reason:
              'Tests a common coding assessment pattern involving dynamic window management.'
          },
          {
            id: 2,
            question:
              'Determine whether a linked list contains a cycle.',
            topic: 'Linked List',
            difficulty: 'Medium',
            reason:
              'Tests pointer manipulation and the fast and slow pointer pattern.'
          },
          {
            id: 3,
            question:
              'Find the maximum sum of a contiguous subarray.',
            topic: 'Arrays',
            difficulty: 'Medium',
            reason:
              'Tests array optimisation and dynamic problem-solving techniques.'
          }
        ],

        focusTopics: [
          {
            topic: 'Arrays and Strings',
            priority: 'High',
            reason:
              'Frequently tested in software engineering coding assessments.'
          },
          {
            topic:
              'Two Pointers and Sliding Window',
            priority: 'High',
            reason:
              'Common patterns for optimising array and string problems.'
          },
          {
            topic: 'Linked Lists',
            priority: 'Medium',
            reason:
              'Tests pointer handling and traversal techniques.'
          }
        ],

        oaStrategy: [
          'Scan all problems before starting and solve the easiest problem first.',
          'Check input constraints before choosing an algorithm.',
          'Test edge cases before submitting.',
          'Track time and avoid spending too long on one problem.',
          'Reserve the final few minutes for reviewing submissions.'
        ]
      };
    }

    return {
      roadmap: {
        week1: [
          {
            day: 'Day 1-2',
            topic:
              'Review the job description and identify skill gaps',
            resources: [
              'Job description analysis',
              'Company engineering blog'
            ],
            priority: 'High'
          },
          {
            day: 'Day 3-4',
            topic:
              'Data structures and algorithms practice',
            resources: [
              'LeetCode Easy/Medium',
              'NeetCode roadmap'
            ],
            priority: 'High'
          },
          {
            day: 'Day 5-7',
            topic:
              'System design fundamentals',
            resources: [
              'System Design Primer — GitHub',
              'Gaurav Sen YouTube'
            ],
            priority: 'High'
          }
        ],

        week2: [
          {
            day: 'Day 8-9',
            topic:
              'Company-specific preparation',
            resources: [
              'Glassdoor interview reviews',
              'Company engineering blog'
            ],
            priority: 'High'
          },
          {
            day: 'Day 10-11',
            topic: 'Mock interviews',
            resources: [
              'Pramp.com',
              'Interviewing.io'
            ],
            priority: 'High'
          },
          {
            day: 'Day 12-14',
            topic:
              'Behavioural questions and STAR method',
            resources: [
              'Big Interview platform',
              'LinkedIn Learning'
            ],
            priority: 'Medium'
          }
        ]
      }
    };
  }

  // Validate agent response schema
  _validateSchema(parsed, type) {
   if (type === 'technical') {
  if (!Array.isArray(parsed.technicalQuestions)) {
    throw new Error(
      'Technical agent: missing technicalQuestions array'
    );
  }

  if (!Array.isArray(parsed.focusTopics)) {
    throw new Error(
      'Technical agent: missing focusTopics array'
    );
  }

  if (!Array.isArray(parsed.interviewStrategy)) {
    throw new Error(
      'Technical agent: missing interviewStrategy array'
    );
  }
}
   if (type === 'hr') {
  if (!Array.isArray(parsed.questions)) {
    throw new Error(
      'HR agent: missing questions array'
    );
  }

  if (!Array.isArray(parsed.hrStrategy)) {
    throw new Error(
      'HR agent: missing hrStrategy array'
    );
  }
}

    if (type === 'roadmap') {
      if (
        !parsed.roadmap ||
        !parsed.roadmap.week1
      ) {
        throw new Error(
          'Roadmap agent: missing roadmap.week1'
        );
      }
    }

    if (type === 'oa') {
      if (
        !parsed.practiceQuestions ||
        !Array.isArray(
          parsed.practiceQuestions
        )
      ) {
        throw new Error(
          'OA agent: missing practiceQuestions array'
        );
      }

      if (
        !parsed.focusTopics ||
        !Array.isArray(parsed.focusTopics)
      ) {
        throw new Error(
          'OA agent: missing focusTopics array'
        );
      }

      if (
        !parsed.oaStrategy ||
        !Array.isArray(parsed.oaStrategy)
      ) {
        throw new Error(
          'OA agent: missing oaStrategy array'
        );
      }
    }

    return true;
  }

  // Generate preparation based on application stage
  async generateStagePrep({
  role,
  company,
  jobDescription,
  skills,
  resumeText,
  currentStage,
  eventContext
}) {
  const userSkills = skills || [];
  const resume = resumeText || '';

  switch (currentStage) {
    case 'Applied': {
      const result =
        await this._callWithFallback(
          roadmapPrompt(
            role,
            userSkills,
            jobDescription,
            resume,
            eventContext
          ),
          'roadmap'
        );

      return {
        agentType: 'roadmap',
        stage: currentStage,
        usedFallback: result.usedFallback,

        studyRoadmap:
          result.data.roadmap || {},

        urgencyBucket:
          eventContext.urgencyBucket,

        promptVersion: PROMPT_VERSION,
        generatedAt: new Date()
      };
    }

    case 'OA Scheduled': {
      const result =
        await this._callWithFallback(
          oaPrompt(
            role,
            company,
            jobDescription,
            userSkills,
            resume,
            eventContext
          ),
          'oa'
        );

      return {
        agentType: 'oa',
        stage: currentStage,
        usedFallback: result.usedFallback,

        practiceQuestions:
          result.data.practiceQuestions || [],

        focusTopics:
          result.data.focusTopics || [],

        oaStrategy:
          result.data.oaStrategy || [],

        urgencyBucket:
          eventContext.urgencyBucket,

        promptVersion: PROMPT_VERSION,
        generatedAt: new Date()
      };
    }

    case 'OA Cleared':
    case 'Technical Interview': {
      const result =
        await this._callWithFallback(
          technicalPrompt(
            role,
            company,
            jobDescription,
            userSkills,
            resume,
            eventContext
          ),
          'technical'
        );

      return {
        agentType: 'technical',
        stage: currentStage,
        usedFallback: result.usedFallback,

        technicalQuestions:
          result.data.technicalQuestions || [],

        technicalFocusTopics:
          result.data.focusTopics || [],

        interviewStrategy:
          result.data.interviewStrategy || [],

        urgencyBucket:
          eventContext.urgencyBucket,

        promptVersion: PROMPT_VERSION,
        generatedAt: new Date()
      };
    }

    case 'HR Interview': {
      const result =
        await this._callWithFallback(
          hrPrompt(
            role,
            company,
            jobDescription,
            resume,
            eventContext
          ),
          'hr'
        );

      return {
        agentType: 'hr',
        stage: currentStage,
        usedFallback: result.usedFallback,

        hrQuestions:
          result.data.questions || [],

        hrStrategy:
          result.data.hrStrategy || [],

        urgencyBucket:
          eventContext.urgencyBucket,

        promptVersion: PROMPT_VERSION,
        generatedAt: new Date()
      };
    }

    case 'Rejected':
    case 'Offered': {
      const result =
        await this._callWithFallback(
          roadmapPrompt(
            role,
            userSkills,
            jobDescription,
            resume,
            eventContext
          ),
          'roadmap'
        );

      return {
        agentType: 'roadmap',
        stage: currentStage,
        usedFallback: result.usedFallback,

        studyRoadmap:
          result.data.roadmap || {},

        urgencyBucket:
          eventContext.urgencyBucket,

        promptVersion: PROMPT_VERSION,
        generatedAt: new Date()
      };
    }

    default:
      throw new Error(
        `Unsupported application stage: ${currentStage}`
      );
  }
}

  // Generate complete preparation using all agents
 async generateFullPrep({
  role,
  company,
  jobDescription,
  skills,
  resumeText,
  eventContext
}) {
  const userSkills = skills || [];
  const resume = resumeText || '';

  const [technical, hr, roadmap, oa] =
    await Promise.all([
      this._callWithFallback(
        technicalPrompt(
          role,
          company,
          jobDescription,
          userSkills,
          resume,
          eventContext
        ),
        'technical'
      ),

      this._callWithFallback(
        hrPrompt(
          role,
          company,
          jobDescription,
          resume,
          eventContext
        ),
        'hr'
      ),

      this._callWithFallback(
        roadmapPrompt(
          role,
          userSkills,
          jobDescription,
          resume,
          eventContext
        ),
        'roadmap'
      ),

      this._callWithFallback(
        oaPrompt(
          role,
          company,
          jobDescription,
          userSkills,
          resume,
          eventContext
        ),
        'oa'
      )
    ]);

  return {
    agentType: 'full',

    usedFallback: {
      technical: technical.usedFallback,
      hr: hr.usedFallback,
      roadmap: roadmap.usedFallback,
      oa: oa.usedFallback
    },

    urgencyBucket:
      eventContext.urgencyBucket,

    technicalQuestions:
      technical.data.technicalQuestions || [],

    technicalFocusTopics:
      technical.data.focusTopics || [],

    interviewStrategy:
      technical.data.interviewStrategy || [],

    hrQuestions:
      hr.data.questions || [],

    hrStrategy:
      hr.data.hrStrategy || [],

    studyRoadmap:
      roadmap.data.roadmap || {},

    oaPreparation: {
      practiceQuestions:
        oa.data.practiceQuestions || [],

      focusTopics:
        oa.data.focusTopics || [],

      oaStrategy:
        oa.data.oaStrategy || []
    },

    promptVersion: PROMPT_VERSION,
    generatedAt: new Date()
  };
}
  getUrgencyBucket(nextEventDate) {
  if (!nextEventDate) {
    return "none";
  }

  const eventDate = new Date(nextEventDate);
  const currentDate = new Date();

  const difference =
    eventDate.getTime() - currentDate.getTime();

  const daysRemaining = Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );

  if (daysRemaining <= 1) {
    return "crash";
  }

  if (daysRemaining <= 3) {
    return "compressed";
  }

  if (daysRemaining <= 7) {
    return "focused";
  }

  if (daysRemaining <= 14) {
    return "broad";
  }

  return "normal";
}

  // Main AI orchestration method
async generatePrep({
  role,
  company,
  jobDescription,
  skills,
  resumeText,
  currentStage,
  nextEventType,
  nextEventDate,
  mode = 'stage'
}) {
  let daysRemaining = null;

if (nextEventDate) {
  const eventDate = new Date(nextEventDate);
  const currentDate = new Date();

  const difference =
    eventDate.getTime() - currentDate.getTime();

  daysRemaining = Math.ceil(
    difference / (1000 * 60 * 60 * 24)
  );
}

const urgencyBucket =
  this.getUrgencyBucket(nextEventDate);

const eventContext = {
  nextEventType: nextEventType || null,
  nextEventDate: nextEventDate || null,
  daysRemaining,
  urgencyBucket
};


    if (
      !role ||
      !company ||
      !jobDescription
    ) {
      throw new Error(
        'role, company, and jobDescription are required'
      );
    }

    if (mode === 'full') {
      return await this.generateFullPrep({
        role,
        company,
        jobDescription,
        skills,
        resumeText,
        eventContext
      });
    }

    if (mode === 'stage') {
      if (!currentStage) {
        throw new Error(
          'currentStage is required for stage preparation'
        );
      }

      return await this.generateStagePrep({
        role,
        company,
        jobDescription,
        skills,
        resumeText,
        currentStage,
        eventContext
      });
    }

    throw new Error(
      `Unsupported preparation mode: ${mode}`
    );
  }
  getPromptVersion() {
  return PROMPT_VERSION;
}

  isStale(savedPromptVersion) {
    return savedPromptVersion !== PROMPT_VERSION;
  }
}

module.exports = new GeminiService();