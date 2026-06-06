require('dotenv').config();
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { technicalPrompt } = require('./prompts/technicalAgent');
const { hrPrompt } = require('./prompts/hrAgent');
const { roadmapPrompt } = require('./prompts/roadmapAgent');
const { combos } = require('./test-combos');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

function safeParseJSON(text) {
  try {
    const clean = text.replace(/```json|```/g, '').trim();
    return JSON.parse(clean);
  } catch (e) {
    return null;
  }
}

async function testCombo(combo, index) {
  console.log(`\n===== Combo ${index + 1}: ${combo.role} @ ${combo.company} =====`);
  const agents = [
    { name: 'Technical', prompt: technicalPrompt(combo.role, combo.company, combo.jd, combo.skills) },
    { name: 'HR', prompt: hrPrompt(combo.role, combo.company) },
    { name: 'Roadmap', prompt: roadmapPrompt(combo.role, combo.skills, combo.jd) }
  ];
  for (const agent of agents) {
    const result = await model.generateContent(agent.prompt);
    const parsed = safeParseJSON(result.response.text());
    if (parsed) {
      console.log(`  ✓ ${agent.name} agent — valid JSON`);
    } else {
      console.log(`  ✗ ${agent.name} agent — FAILED. Raw output:`);
      console.log('   ', result.response.text().slice(0, 150));
    }
  }
}

async function main() {
  for (let i = 0; i < combos.length; i++) {
    await testCombo(combos[i], i);
  }
  console.log('\n===== Done =====');
}

main().catch(console.error);