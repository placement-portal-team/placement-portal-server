jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn().mockReturnValue({
      generateContent: jest.fn()
    })
  }))
}));

const { GoogleGenerativeAI } = require('@google/generative-ai');
process.env.GEMINI_API_KEY = 'test-key-123';

describe('GeminiService', () => {
  let geminiService;
  let mockGenerateContent;

  beforeEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
    const { GoogleGenerativeAI: GAI } = require('@google/generative-ai');
    mockGenerateContent = jest.fn();
    GAI.mockImplementation(() => ({
      getGenerativeModel: () => ({ generateContent: mockGenerateContent })
    }));
    geminiService = require('../services/geminiService');
  });

  test('generatePrep returns all 3 agents on success', async () => {
    mockGenerateContent
      .mockResolvedValueOnce({ response: { text: () =>
        JSON.stringify({ questions: [{ id:1, question:"Q1", topic:"T", difficulty:"Easy", hint:"H" }] })
      }})
      .mockResolvedValueOnce({ response: { text: () =>
        JSON.stringify({ questions: [{ id:1, question:"Q2", category:"Behavioural", starTip:"S" }] })
      }})
      .mockResolvedValueOnce({ response: { text: () =>
        JSON.stringify({ roadmap: { week1: [{ day:"Day 1", topic:"Arrays", resources:["LC"], priority:"High" }], week2: [] } })
      }});

    const result = await geminiService.generatePrep({
      role: 'SWE', company: 'Google',
      jobDescription: 'Build systems', skills: ['Python']
    });

    expect(result.technicalQuestions).toHaveLength(1);
    expect(result.hrQuestions).toHaveLength(1);
    expect(result.studyRoadmap.week1).toHaveLength(1);
    expect(result.promptVersion).toBe('v1.2');
  });

  test('generatePrep uses fallback when one agent fails', async () => {
    mockGenerateContent
      .mockRejectedValueOnce(new Error('API error'))
      .mockRejectedValueOnce(new Error('API error'))
      .mockRejectedValueOnce(new Error('API error'))
      .mockResolvedValueOnce({ response: { text: () =>
        JSON.stringify({ questions: [{ id:1, question:"Q2", category:"Behavioural", starTip:"S" }] })
      }})
      .mockResolvedValueOnce({ response: { text: () =>
        JSON.stringify({ questions: [{ id:1, question:"Q2", category:"Behavioural", starTip:"S" }] })
      }})
      .mockResolvedValueOnce({ response: { text: () =>
        JSON.stringify({ roadmap: { week1: [], week2: [] } })
      }});

    const result = await geminiService.generatePrep({
      role: 'SWE', company: 'TCS',
      jobDescription: 'Build APIs', skills: ['JS']
    });

    expect(result.technicalQuestions.length).toBeGreaterThan(0);
  });

  test('generatePrep throws if required fields missing', async () => {
    await expect(geminiService.generatePrep({ role: 'SWE' }))
      .rejects.toThrow('role, company, and jobDescription are required');
  });

  test('generatePrep throws if GEMINI_API_KEY missing', () => {
  const original = process.env.GEMINI_API_KEY;

  jest.resetModules();

  jest.mock('dotenv', () => ({
    config: jest.fn()
  }));

  delete process.env.GEMINI_API_KEY;

  expect(() => require('../services/geminiService'))
    .toThrow('GEMINI_API_KEY is not set');

  process.env.GEMINI_API_KEY = original;
});
});