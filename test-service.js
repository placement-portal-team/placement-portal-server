const geminiService = require('./services/geminiService');

async function test() {
  console.log('Testing GeminiService.generatePrep()...');

  // const result = await geminiService.generatePrep({
  //   role: 'Software Engineer',
  //   company: 'Google',
  //   jobDescription: 'Build scalable distributed systems using Go and Python. Strong algorithms background required.',
  //   skills: ['Python', 'JavaScript', 'React', 'SQL']
  // });


  // console.log('\n--- Technical Questions ---');
  // console.log(result.technicalQuestions.slice(0, 2));
  // console.log('\n--- HR Questions ---');
  // console.log(result.hrQuestions.slice(0, 2));
  // console.log('\n--- Roadmap Week 1 ---');
  // console.log(result.studyRoadmap.week1.slice(0, 2));
  // console.log('\n--- Metadata ---');
  // console.log({ promptVersion: result.promptVersion, generatedAt: result.generatedAt });


  const result = await geminiService.generatePrep({
  role: 'Software Engineer',
  company: 'Google',
  jobDescription: 'Build scalable distributed systems. Strong algorithms required.',
  skills: ['Python', 'JavaScript', 'React'],
  resumeText: `Built a full-stack e-commerce app using React and Node.js.
Implemented payment integration using Stripe API.
Led a team of 3 in a college hackathon and won 2nd place.
Interned at a startup where I built REST APIs using Express and MongoDB.`
});
console.log(result.technicalQuestions[0]);

}

test().catch(console.error);