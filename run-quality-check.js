require('dotenv').config();
const axios = require('axios');
const { testCases } = require('./test-cases-v2');

const BASE_URL = 'http://localhost:5000';
const TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI2YTMxMGEwOTU4OWEzYmNlYjZkZDMxNWYiLCJlbWFpbCI6InRlc3RAZXhhbXBsZS5jb20iLCJpYXQiOjE3ODIxMTI4MTgsImV4cCI6MTc4MjcxNzYxOH0.VstpZGedUyVPEzBQpI_MSuj852yZkDJTBJvoLQgdOdc'; // log in via Postman/curl first, copy the token

async function runCase(tc, index) {
  console.log(`\n===== Case ${index + 1}: ${tc.role} @ ${tc.companyName} =====`);

  // Step 1: create the application
  const appRes = await axios.post(`${BASE_URL}/api/applications`, {
    companyName: tc.companyName,
    role: tc.role,
    source: tc.source,
    jobDescription: tc.jobDescription
  }, { headers: { Authorization: `Bearer ${TOKEN}` } });

  const applicationId = appRes.data.data._id;

  // Step 2: call your AI prepare route
  const prepRes = await axios.post(`${BASE_URL}/api/ai/prepare`, {
    applicationId,
    jdText: tc.jobDescription,
    resumeText: tc.resumeText
  }, { headers: { Authorization: `Bearer ${TOKEN}` } });

  const result = prepRes.data.data;
  console.log('Technical Q1:', result.technicalQuestions[0]?.question);
  console.log('HR Q1:', result.hrQuestions[0]?.question);
  console.log('Roadmap Day 1 topic:', result.studyRoadmap.week1[0]?.topic);
}

async function main() {
  for (let i = 0; i < testCases.length; i++) {
    await runCase(testCases[i], i);
  }
}

main().catch(err => console.error(err.response?.data || err.message));