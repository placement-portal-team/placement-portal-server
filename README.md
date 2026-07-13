# 🚀 PlaceMentor Backend

<div align="center">

### AI-Powered Placement Tracker & Interview Preparation Platform

Production-ready REST API built with **Node.js, Express.js, MongoDB Atlas, and Google's Gemini AI**.

Designed to help students manage job applications, prepare for interviews with AI-generated content, track progress throughout the placement journey, and analyze their placement pipeline.

</div>

---

## 📖 Overview

PlaceMentor Backend powers the complete backend infrastructure for the AI-Powered Placement Tracker.

The system provides secure authentication, job application management, AI-powered interview preparation, resume parsing, analytics, and intelligent caching.

Unlike a traditional CRUD backend, PlaceMentor integrates multiple AI agents that generate company-specific and stage-aware preparation plans using Google's Gemini API.

---

## ✨ Features

### 🔐 Authentication

- JWT Authentication
- Secure Password Hashing (bcrypt)
- Protected Routes
- User Profile Management

---

### 📋 Application Management

- Create Job Applications
- Update Application Details
- Delete Applications
- Track Interview Stages
- Maintain Status History
- Upcoming Interview/Event Tracking

---

### 🤖 AI Interview Preparation

Multiple AI Agents generate personalized preparation content.

- 📚 Study Roadmap Agent
- 💻 Online Assessment (OA) Agent
- 🧠 Technical Interview Agent
- 💬 HR Interview Agent

Generation is based on:

- Company
- Role
- Current Interview Stage
- Resume
- Job Description

---

### 📄 Resume Processing

- PDF Resume Upload
- Automatic Text Extraction
- Resume Storage
- AI Context Enhancement

---

### 🧠 Intelligent AI System

- Prompt Versioning
- AI Response Caching
- Retry Mechanism
- Automatic Fallback Responses
- Regeneration Support

---

### 📊 Analytics

- Application Statistics
- Stage-wise Distribution
- Source-wise Distribution
- Interview Progress Analytics
- Dashboard Summary APIs

---

## ⚙️ Tech Stack

| Category | Technology |
|-----------|------------|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB Atlas |
| ODM | Mongoose |
| Authentication | JWT |
| Password Hashing | bcrypt |
| AI | Google Gemini API |
| File Upload | Multer |
| Resume Parsing | pdf-parse |
| Deployment | Render |
