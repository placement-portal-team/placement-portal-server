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
      "Given an unsorted array of integers, design an efficient algorithm to find the longest consecutive sequence. Explain your approach step by step, discuss why it achieves an O(n) time complexity, and mention any edge cases you would consider before finalizing your solution.",
    topic: "Data Structures & Algorithms",
    difficulty: "Medium",
    hint:
      "Consider using a HashSet to achieve linear time complexity while avoiding unnecessary repeated traversals."
  },
  {
    id: 2,
    question:
      "Design and implement an LRU (Least Recently Used) Cache that supports both get() and put() operations in constant O(1) time. Explain the choice of data structures, how cache eviction works, and why your implementation satisfies the required complexity.",
    topic: "Data Structures & Algorithms",
    difficulty: "Hard",
    hint:
      "Think about combining a HashMap with a Doubly Linked List to efficiently manage recently accessed elements."
  },
  {
    id: 3,
    question:
      "Compare SQL and NoSQL databases by discussing their underlying data models, scalability, consistency guarantees, and real-world use cases. Based on different application scenarios, explain when you would prefer one over the other.",
    topic: "Database Management Systems",
    difficulty: "Medium",
    hint:
      "Focus on schema flexibility, ACID properties, horizontal scaling, and practical examples."
  },
  {
    id: 4,
    question:
      "Authentication is an essential part of modern web applications. Explain how JWT-based authentication works from login to accessing protected APIs. Also discuss token expiration, refresh mechanisms, and security best practices for storing tokens on the client side.",
    topic: "Backend Development",
    difficulty: "Medium",
    hint:
      "Cover token generation, verification, authorization headers, expiration, and secure storage considerations."
  },
  {
    id: 5,
    question:
      "Walk me through one of your recent software projects from start to finish. Explain the overall architecture, important design decisions, technical challenges you encountered, debugging strategies you followed, and what improvements you would make if you were building the same project again.",
    topic: "Projects",
    difficulty: "Medium",
    hint:
      "Treat this like a real interview discussion rather than simply describing the project."
  }
],
    focusTopics: [
  {
    topic: "Data Structures & Algorithms",
    priority: "High",
    reason:
      "Revise common interview patterns including arrays, strings, linked lists, trees, graphs, and dynamic programming, as they form the foundation of most coding interviews."
  },
  {
    topic: "Object-Oriented Programming",
    priority: "High",
    reason:
      "Be comfortable explaining OOP principles, design patterns, and practical examples demonstrating encapsulation, inheritance, polymorphism, and abstraction."
  },
  {
    topic: "Database Management Systems",
    priority: "High",
    reason:
      "Review SQL queries, normalization, indexing, transactions, ACID properties, and query optimization techniques commonly discussed in technical interviews."
  },
  {
    topic: "Operating Systems",
    priority: "Medium",
    reason:
      "Understand processes, threads, synchronization, deadlocks, scheduling algorithms, and virtual memory concepts with practical examples."
  },
  {
    topic: "Computer Networks",
    priority: "Medium",
    reason:
      "Revise networking fundamentals including TCP/IP, HTTP/HTTPS, DNS, REST APIs, and the client-server communication model."
  },
  {
    topic: "System Design Fundamentals",
    priority: "Medium",
    reason:
      "Build a conceptual understanding of scalability, caching, database design, load balancing, and high-level architecture for backend systems."
  },
  {
    topic: "Backend Development",
    priority: "Medium",
    reason:
      "Strengthen concepts related to authentication, authorization, REST APIs, middleware, and secure backend application development."
  },
  {
    topic: "Projects & Debugging",
    priority: "High",
    reason:
      "Be prepared to explain your projects in depth, justify architectural decisions, discuss debugging approaches, and describe the technical challenges you solved."
  }
],


   interviewStrategy: [
  "Begin every coding question by confirming your understanding of the problem statement. Clarify assumptions whenever the requirements are ambiguous before writing any code.",
  
  "Think aloud while solving technical problems so the interviewer can understand your reasoning process. Interviewers often value problem-solving ability more than arriving at the final solution immediately.",
  
  "Before finalizing your solution, explain the time and space complexity, discuss possible optimizations, and compare alternative approaches if applicable.",
  
  "While discussing system design or project-related questions, justify your technology choices by explaining the trade-offs and the reasoning behind important architectural decisions.",
  
  "After completing your solution, walk through one or two representative test cases, including important edge cases, to demonstrate confidence in your implementation.",
  
  "Maintain clear communication throughout the interview, remain calm when facing unfamiliar questions, and treat interviewer hints as opportunities to refine your solution rather than signs of failure."
],
  };
}

   if (type === "hr") {
  return {
   questions: [
  {
    id: 1,
    question:
      "Tell me about yourself and walk me through your academic journey, technical skills, significant projects, and the experiences that have motivated you to pursue a career in software engineering.",
    category: "Introduction",
    starTip:
      "Keep the response structured, starting with your background, followed by projects, technical strengths, and ending with your career aspirations."
  },
  {
    id: 2,
    question:
      "Describe a challenging situation you faced while working on a technical project. Explain how you approached the problem, collaborated with others if necessary, and what you learned from the experience.",
    category: "Behavioural",
    starTip:
      "Use the STAR framework to describe the Situation, Task, Action, and Result while highlighting your problem-solving skills."
  },
  {
    id: 3,
    question:
      "Tell me about a time when you had to quickly learn a new technology, framework, or tool to complete a project or meet a deadline. How did you approach the learning process and what was the outcome?",
    category: "Learning Ability",
    starTip:
      "Emphasize curiosity, adaptability, and your ability to learn independently under time constraints."
  },
  {
    id: 4,
    question:
      "Imagine you disagree with a teammate regarding the technical implementation of a feature. How would you handle the disagreement while ensuring that the project continues to move forward effectively?",
    category: "Teamwork",
    starTip:
      "Focus on respectful communication, evaluating different perspectives, and making data-driven decisions."
  },
  {
    id: 5,
    question:
      "Why are you interested in joining our company, and how do you believe your technical background, projects, and long-term career goals align with the role you have applied for?",
    category: "Company Fit",
    starTip:
      "Connect your projects and skills with the company's products, engineering culture, and opportunities for growth."
  }
],

    hrStrategy: [
  "Answer behavioural questions using the STAR (Situation, Task, Action, Result) framework to provide structured and impactful responses.",
  
  "Support your answers with genuine experiences from academic projects, internships, hackathons, or leadership activities instead of hypothetical examples.",
  
  "Maintain a confident and conversational tone throughout the discussion while keeping your answers concise and relevant to the question being asked.",
  
  "Research the company's products, values, recent achievements, and engineering culture beforehand so you can provide thoughtful and personalized responses.",
  
  "When discussing challenges or failures, focus on the lessons learned, the improvements you made, and how the experience helped you grow professionally.",
  
  "Conclude the interview by asking meaningful questions about the team, the role, or upcoming projects to demonstrate genuine interest and curiosity."
],
  };
}
    if (type === "oa") {
  return {
    practiceQuestions: [
      {
        id: 1,
        question:
          "Given an array of integers, determine the length of the longest substring without repeating characters. Explain your approach, justify the chosen algorithm, and analyze its time and space complexity.",
        topic: "Sliding Window",
        difficulty: "Medium",
        reason:
          "This problem evaluates your understanding of one of the most frequently tested interview patterns involving efficient window expansion and contraction."
      },
      {
        id: 2,
        question:
          "Implement a function to detect whether a linked list contains a cycle. If a cycle exists, explain how you would identify the starting node of the cycle using an optimized approach.",
        topic: "Linked List",
        difficulty: "Medium",
        reason:
          "Tests your understanding of pointer manipulation and Floyd's Fast and Slow Pointer algorithm, a common coding interview topic."
      },
      {
        id: 3,
        question:
          "Find the maximum possible sum of any contiguous subarray within a given array. Discuss both the brute-force and optimized solutions before implementing the most efficient approach.",
        topic: "Arrays",
        difficulty: "Medium",
        reason:
          "Evaluates your understanding of Kadane's Algorithm and your ability to optimize brute-force solutions."
      },
      {
        id: 4,
        question:
          "Given a binary tree, perform a level-order traversal and return the nodes level by level. Explain the data structures used and analyze the complexity of your solution.",
        topic: "Trees",
        difficulty: "Medium",
        reason:
          "Frequently appears in online assessments to evaluate BFS traversal and queue implementation."
      },
      {
  id: 5,
  question:
    "Given two tables, Employees and Departments, write an SQL query to retrieve the names of employees whose salary is greater than the average salary of their respective department. Explain your approach and discuss how your query performs on large datasets.",
  topic: "SQL",
  difficulty: "Medium",
  reason:
    "Tests practical SQL skills including joins, aggregate functions, subqueries, and analytical thinking, which are frequently assessed in online coding rounds."
},
      {
        id: 6,
        question:
          "Design an algorithm to merge overlapping intervals efficiently. Explain your intuition, sorting strategy, and how you would handle corner cases.",
        topic: "Intervals",
        difficulty: "Medium",
        reason:
          "Tests sorting techniques and interval manipulation, a common pattern in coding assessments."
      }
    ],

    focusTopics: [
      {
        topic: "Arrays, Strings & Hashing",
        priority: "High",
        reason:
          "These topics form the foundation of many coding assessment problems and are frequently combined with optimization techniques."
      },
      {
        topic: "Two Pointers & Sliding Window",
        priority: "High",
        reason:
          "Mastering these patterns helps solve a large class of medium-level interview questions efficiently."
      },
      {
        topic: "Linked Lists & Fast-Slow Pointer",
        priority: "High",
        reason:
          "Commonly tested to evaluate pointer manipulation and optimized traversal techniques."
      },
      {
        topic: "Trees & Graph Traversals",
        priority: "Medium",
        reason:
          "Interviewers frequently assess recursion, BFS, DFS, and tree traversal strategies."
      },
      {
        topic: "Dynamic Programming",
        priority: "Medium",
        reason:
          "Understanding state transitions and optimization techniques is essential for solving advanced coding problems."
      },
      {
        topic: "Sorting, Greedy & Binary Search",
        priority: "Medium",
        reason:
          "These patterns frequently appear in online assessments due to their wide range of practical applications."
      },
       {
    topic: "SQL & Database Queries",
    priority: "High",
    reason:
      "Many online assessments include SQL problems involving joins, aggregation, window functions, grouping, and subqueries to evaluate database fundamentals."
  }
    ],

    oaStrategy: [
      "Before starting the assessment, spend the first few minutes reviewing every question and identify the ones you can solve confidently. Building momentum early improves both confidence and overall performance.",

      "Always consider the input constraints before choosing an algorithm. Selecting an efficient approach early can prevent unnecessary debugging and time loss.",

      "Write clean, modular code and validate your solution against sample inputs as well as edge cases before moving to the next problem.",

      "Avoid spending too much time on a single difficult question. If you're stuck, move ahead and return later after securing marks from easier problems.",

      "Reserve the final few minutes of the assessment to review your submissions, verify edge cases, and ensure that all intended solutions have been submitted successfully."
    ]
  };
}
return {
  roadmap: {
    week1: [
      {
        day: "Phase 1.1",
        topic:
          "Carefully review the job description and identify the technical skills, tools, and concepts expected for the role. Create a preparation checklist based on the identified requirements.",
        resources: [
          "Official Company Career Page",
          "Job Description",
          "Company Engineering Blog"
        ],
        priority: "High"
      },
      {
        day: "Phase 1.2",
        topic:
          "Strengthen your Data Structures and Algorithms fundamentals by solving problems covering arrays, strings, linked lists, trees, and common interview patterns.",
        resources: [
          "LeetCode",
          "NeetCode Roadmap",
          "Striver A2Z Sheet"
        ],
        priority: "High"
      },
      {
        day: "Phase 1.3",
        topic:
          "Revise core Computer Science subjects including Operating Systems, DBMS, Computer Networks, and Object-Oriented Programming. Focus on concepts commonly asked during technical interviews.",
        resources: [
          "GeeksforGeeks",
          "InterviewBit",
          "TakeUForward CS Notes"
        ],
        priority: "High"
      }
    ],

    week2: [
      {
        day: "Phase 2.1",
        topic:
          "Review your projects thoroughly, prepare to explain architectural decisions, technical challenges, implementation details, and improvements you would make in future iterations.",
        resources: [
          "Project Documentation",
          "GitHub Repository",
          "Personal Notes"
        ],
        priority: "High"
      },
      {
        day: "Phase 2.2",
        topic:
          "Practice mock technical interviews by solving coding problems under time constraints and explaining your thought process aloud while discussing solutions.",
        resources: [
          "Pramp",
          "Interviewing.io",
          "LeetCode Mock Assessments"
        ],
        priority: "High"
      },
      {
        day: "Phase 2.3",
        topic:
          "Prepare behavioural interview questions using the STAR framework, research the company's products and engineering culture, and conduct a final revision of all important concepts.",
        resources: [
          "Glassdoor Interview Experiences",
          "Company Website",
          "LinkedIn"
        ],
        priority: "Medium"
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