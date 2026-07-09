require('dotenv').config();

const { GoogleGenerativeAI } = require('@google/generative-ai');

const { technicalPrompt } = require('../prompts/technicalAgent');
const { hrPrompt } = require('../prompts/hrAgent');
const { roadmapPrompt } = require('../prompts/roadmapAgent');
const { oaPrompt } = require('../prompts/oaAgent');

const PROMPT_VERSION = 'v1.4';

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
      model: 'gemini-2.5-flash'
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
    if (type === 'technical') {
      return {
        questions: [
          {
            id: 1,
            question:
              "Walk me through a technical project you've built from scratch.",
            topic: 'General',
            difficulty: 'Easy',
            hint:
              'Focus on your architecture decisions and the challenges you solved.'
          },
          {
            id: 2,
            question:
              'How would you design a URL shortening service like bit.ly?',
            topic: 'System Design',
            difficulty: 'Medium',
            hint:
              'Think about the data model, hashing strategy, and scale.'
          },
          {
            id: 3,
            question:
              'Explain the difference between SQL and NoSQL databases. When would you choose each?',
            topic: 'Databases',
            difficulty: 'Medium',
            hint:
              'Consider structure, scalability, and consistency requirements.'
          }
        ]
      };
    }

    if (type === 'hr') {
      return {
        questions: [
          {
            id: 1,
            question:
              'Tell me about a time you had to debug a difficult problem under pressure.',
            category: 'Behavioural',
            starTip:
              'STAR: Describe the bug, deadline, debugging process, and outcome.'
          },
          {
            id: 2,
            question:
              'Describe a situation where you had to learn a new technology quickly.',
            category: 'Situational',
            starTip:
              'Explain what you learned, why it was urgent, your approach, and the result.'
          },
          {
            id: 3,
            question:
              "Tell me about a time you disagreed with a teammate's technical decision.",
            category: 'Behavioural',
            starTip:
              'Focus on respectful communication and how you reached a resolution.'
          }
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
      if (
        !parsed.questions ||
        !Array.isArray(parsed.questions)
      ) {
        throw new Error(
          'Technical agent: missing questions array'
        );
      }

      parsed.questions.forEach(question => {
        if (
          !question.question ||
          !question.difficulty
        ) {
          throw new Error(
            'Technical agent: missing required fields'
          );
        }
      });
    }

    if (type === 'hr') {
      if (
        !parsed.questions ||
        !Array.isArray(parsed.questions)
      ) {
        throw new Error(
          'HR agent: missing questions array'
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
    currentStage
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
              resume
            ),
            'roadmap'
          );

        return {
          agentType: 'roadmap',
          stage: currentStage,
          usedFallback: result.usedFallback,
          studyRoadmap: result.data.roadmap
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
              resume
            ),
            'oa'
          );

        return {
          agentType: 'oa',
          stage: currentStage,
          usedFallback: result.usedFallback,
          practiceQuestions:
            result.data.practiceQuestions,
          focusTopics: result.data.focusTopics,
          oaStrategy: result.data.oaStrategy,
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
              resume
            ),
            'technical'
          );

        return {
          agentType: 'technical',
          stage: currentStage,
          usedFallback: result.usedFallback,
          technicalQuestions:
            result.data.questions,
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
              resume
            ),
            'hr'
          );

        return {
          agentType: 'hr',
          stage: currentStage,
          usedFallback: result.usedFallback,
          hrQuestions: result.data.questions,
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
              resume
            ),
            'roadmap'
          );

        return {
          agentType: 'roadmap',
          stage: currentStage,
          usedFallback: result.usedFallback,
          studyRoadmap: result.data.roadmap,
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
    resumeText
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
            resume
          ),
          'technical'
        ),

        this._callWithFallback(
          hrPrompt(
            role,
            company,
            resume
          ),
          'hr'
        ),

        this._callWithFallback(
          roadmapPrompt(
            role,
            userSkills,
            jobDescription,
            resume
          ),
          'roadmap'
        ),

        this._callWithFallback(
          oaPrompt(
            role,
            company,
            jobDescription,
            userSkills,
            resume
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

      technicalQuestions:
        technical.data.questions,

      hrQuestions:
        hr.data.questions,

      studyRoadmap:
        roadmap.data.roadmap,

      oaPreparation: {
        practiceQuestions:
          oa.data.practiceQuestions,
        focusTopics:
          oa.data.focusTopics,
        oaStrategy:
          oa.data.oaStrategy
      },
      promptVersion: PROMPT_VERSION,
      generatedAt: new Date()
    };
  }

  // Main AI orchestration method
  async generatePrep({
    role,
    company,
    jobDescription,
    skills,
    resumeText,
    currentStage,
    mode = 'stage'
  }) {
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
        resumeText
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
        currentStage
      });
    }

    throw new Error(
      `Unsupported preparation mode: ${mode}`
    );
  }

  isStale(savedPromptVersion) {
    return savedPromptVersion !== PROMPT_VERSION;
  }
}

module.exports = new GeminiService();