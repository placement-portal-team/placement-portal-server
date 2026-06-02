require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { technicalPrompt } = require('./prompts/technicalAgent');
const { hrPrompt } = require('./prompts/hrAgent');
const { roadmapPrompt } = require('./prompts/roadmapAgent');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

async function testAgent(name, prompt) {
  console.log('\n--- Testing:', name, '---');
  const result = await model.generateContent(prompt);
  const text = result.response.text();
  try {
    const json = JSON.parse(text.replace(/```json|\n|```/g, '').trim());
    console.log('PASS - Valid JSON received');
    console.log(JSON.stringify(json, null, 2).slice(0, 400) + '...');
  } catch(e) {
    console.log('FAIL - Not valid JSON:', text.slice(0, 200));
  }
}

async function main() {
  const role = 'Software Engineer', company = 'TCS';
  const jd = 'Full stack development using React and Node.js';
  const skills = ['JavaScript', 'React', 'Node.js', 'MongoDB'];
  await testAgent('Technical Agent', technicalPrompt(role, company, jd, skills));
  await testAgent('HR Agent', hrPrompt(role, company));
  await testAgent('Roadmap Agent', roadmapPrompt(role, skills, jd));
}

main().catch(console.error);