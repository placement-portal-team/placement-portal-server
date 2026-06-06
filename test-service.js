const geminiService = require('./services/geminiService');

async function test() {
  console.log('Testing GeminiService.generatePrep()...');
  const result = await geminiService.generatePrep({
    role: 'Software Engineer',
    company: 'Google',
    jobDescription: 'Build scalable distributed systems using Go and Python. Strong algorithms background required.',
    skills: ['Python', 'JavaScript', 'React', 'SQL']
  });

  console.log('\n--- Technical Questions ---');
  console.log(result.technicalQuestions.slice(0, 2));
  console.log('\n--- HR Questions ---');
  console.log(result.hrQuestions.slice(0, 2));
  console.log('\n--- Roadmap Week 1 ---');
  console.log(result.studyRoadmap.week1.slice(0, 2));
  console.log('\n--- Metadata ---');
  console.log({ promptVersion: result.promptVersion, generatedAt: result.generatedAt });
}

test().catch(console.error);