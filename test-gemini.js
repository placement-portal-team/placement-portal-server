require('dotenv').config();
//console.log(process.env.GEMINI_API_KEY);                                DEBUGGING
const { GoogleGenerativeAI } = require('@google/generative-ai');

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function test() {
  const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
  const result = await model.generateContent(
    'Reply ONLY with valid JSON: { "status": "ok", "message": "Gemini connected" }'
  );
  console.log(result.response.text());
}

test().catch(console.error);