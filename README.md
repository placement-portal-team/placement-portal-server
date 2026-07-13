<div align="center">

# 🚀 PlaceMentor Backend

### AI-Powered Placement Tracker & Interview Preparation Platform

Production-ready REST API built with **Node.js, Express.js, MongoDB Atlas and Google's Gemini AI**

[![Node.js](https://img.shields.io/badge/Node.js-22.x-339933?logo=node.js&logoColor=white)]()
[![Express](https://img.shields.io/badge/Express.js-5.x-black?logo=express)]()
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb&logoColor=white)]()
[![JWT](https://img.shields.io/badge/Auth-JWT-blue)]()
[![Gemini](https://img.shields.io/badge/AI-Gemini-orange)]()
[![Render](https://img.shields.io/badge/Deploy-Render-5A67D8)]()

</div>

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

---

# 🏗️ Backend Architecture

The backend follows a modular layered architecture to ensure scalability, maintainability, and separation of concerns.

```
                    Client (React)

                           │

                           ▼

                Express Route Layer

                           │

                           ▼

                  Controller Layer

                           │

          ┌────────────────┴────────────────┐
          │                                 │
          ▼                                 ▼
    Business Logic                    AI Services

          │                                 │

          ▼                                 ▼

     MongoDB Models                 Gemini AI Agents

          │                                 │

          └──────────────┬──────────────────┘
                         │

                         ▼

                    MongoDB Atlas
```

### Architecture Highlights

- Modular MVC Architecture
- RESTful API Design
- JWT Protected Routes
- AI Service Layer
- MongoDB using Mongoose ODM
- Prompt-based AI Generation
- Resume Processing Pipeline
- Centralized Error Handling

---

# 📂 Project Structure

```
src
│
├── config
│   └── db.js
│
├── controllers
│   ├── applicationController.js
│   ├── authController.js
│   ├── aiController.js
│   └── resumeController.js
│
├── middleware
│   ├── authMiddleware.js
│   └── uploadMiddleware.js
│
├── models
│   ├── user.js
│   ├── application.js
│   ├── resume.js
│   └── aiPreparation.js
│
├── prompts
│   ├── roadmapAgent.js
│   ├── oaAgent.js
│   ├── technicalAgent.js
│   └── hrAgent.js
│
├── routes
│   ├── authRoutes.js
│   ├── applicationRoutes.js
│   ├── aiRoutes.js
│   └── resumeRoutes.js
│
├── services
│   └── geminiService.js
│
├── utils
│
├── app.js
└── server.js
```

---

# 🤖 AI Preparation Workflow

The AI Preparation module follows a multi-agent architecture.

```
User selects an Application
            │
            ▼
Fetch Resume + Job Description
            │
            ▼
Determine Current Interview Stage
            │
            ▼
Generate Prompt
            │
            ▼
───────────────────────────────────────
        Gemini AI Service
───────────────────────────────────────
            │
            ├──────────────┐
            │              │
            ▼              ▼

      OA Agent      Technical Agent

            │              │
            └──────┬───────┘
                   ▼

              HR Agent

                   │
                   ▼

          Roadmap Agent

                   │
                   ▼

      Merge AI Responses

                   │
                   ▼

     Save into MongoDB Cache

                   │
                   ▼

     Return Response to Client
```

---

# ⚡ AI Optimization Strategy

To reduce unnecessary API calls and improve response time, the backend implements multiple optimization techniques.

### Prompt Versioning

Every AI response is associated with a prompt version.

Whenever prompts are updated, cached responses become invalid automatically.

---

### Intelligent Caching

Generated interview preparation is cached in MongoDB.

If the same application requests AI preparation again without significant changes, cached content is returned instead of generating a new response.

---

### Retry Mechanism

Each AI request is automatically retried before reporting failure.

This helps recover from temporary API/network failures.

---

### Fallback Responses

If AI generation fails after retries, predefined fallback preparation content is returned, ensuring the application remains functional even when the AI service is unavailable.

---

### Force Regeneration

Users can bypass cached AI content and generate fresh interview preparation whenever required.
---

# 🔐 Authentication Flow

PlaceMentor uses **JWT (JSON Web Token)** based authentication to secure all protected endpoints.

### Authentication Workflow

```text
User Login/Register
        │
        ▼
Validate Credentials
        │
        ▼
Generate JWT Token
        │
        ▼
Return Token to Client
        │
        ▼
Store Token (Frontend)
        │
        ▼
Authorization Header

Bearer <JWT_TOKEN>

        │
        ▼
Authentication Middleware
        │
        ▼
Protected Route Access
```

### Protected Routes

The following endpoints require authentication:

- Applications API
- Resume API
- AI Preparation API
- Analytics API
- Profile API

---

# 🗄️ Database Design

The backend uses **MongoDB Atlas** with **Mongoose ODM**.

### User

Stores user authentication and profile information.

| Field | Description |
|--------|-------------|
| name | Full Name |
| email | Unique Email |
| password | Encrypted Password |

---

### Application

Tracks each job application.

| Field | Description |
|--------|-------------|
| companyName | Company Name |
| role | Applied Role |
| source | LinkedIn / Referral / Careers |
| currentStage | Current Interview Stage |
| statusHistory | Complete Stage Timeline |
| nextEventDate | Upcoming Interview Date |
| nextEventType | OA / Technical / HR |
| jobDescription | Complete JD |
| notes | User Notes |

---

### Resume

Stores uploaded resume metadata and extracted content.

| Field | Description |
|--------|-------------|
| originalName | Uploaded PDF Name |
| extractedText | Parsed Resume Content |
| uploadedAt | Upload Timestamp |

---

### AI Preparation

Stores generated interview preparation.

| Field | Description |
|--------|-------------|
| applicationId | Associated Job Application |
| mode | Stage / Full |
| agentType | Roadmap / OA / Technical / HR |
| promptVersion | AI Prompt Version |
| studyRoadmap | Generated Roadmap |
| technicalQuestions | Technical Interview Questions |
| hrQuestions | HR Questions |
| oaPreparation | Online Assessment Preparation |
| interviewStrategy | AI Strategy |
| generatedAt | Generation Timestamp |

---

# 📡 REST API Documentation

## Authentication

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | `/api/auth/register` | Register User |
| POST | `/api/auth/login` | Login User |
| GET | `/api/auth/profile` | Get User Profile |
| PUT | `/api/auth/profile` | Update Profile |
| PATCH | `/api/auth/change-password` | Change Password |

---

## Applications

| Method | Endpoint |
|---------|----------|
| GET | `/api/applications` |
| POST | `/api/applications` |
| GET | `/api/applications/:id` |
| PATCH | `/api/applications/:id` |
| PATCH | `/api/applications/:id/stage` |
| PATCH | `/api/applications/:id/event` |
| DELETE | `/api/applications/:id` |
| GET | `/api/applications/stats` |
| GET | `/api/applications/analytics` |

---

## AI Preparation

| Method | Endpoint |
|---------|----------|
| POST | `/api/ai/prepare` |
| GET | `/api/ai/history/:applicationId` |
| GET | `/api/ai/history/:applicationId/all` |

---

## Resume

| Method | Endpoint |
|---------|----------|
| POST | `/api/resume/upload` |
| GET | `/api/resume` |
| DELETE | `/api/resume` |

---

# 📨 Sample API Response

```json
{
  "success": true,
  "message": "Application created successfully",
  "data": {
    "_id": "...",
    "companyName": "Oracle",
    "role": "Software Development Engineer",
    "currentStage": "Applied"
  }
}
```

---

# ⚠️ Error Handling

The backend follows a consistent response structure.

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

### Error Response

```json
{
  "success": false,
  "message": "Detailed error message"
}
```

---

# 🔒 Security Features

- JWT Authentication
- Password Hashing using bcrypt
- Protected Routes
- CORS Configuration
- Input Validation
- Secure Environment Variables
- MongoDB Injection Protection via Mongoose
- Production-ready Deployment Configuration
---

# 🚀 Deployment

The backend is deployed on **Render** and connected to **MongoDB Atlas** for cloud database management.

### Production Stack

| Service | Platform |
|----------|----------|
| Backend API | Render |
| Database | MongoDB Atlas |
| AI Engine | Google Gemini API |
| Frontend | Vercel |

---

# ⚙️ Environment Variables

Create a `.env` file in the project root.

```env
PORT=5000

MONGO_URL=your_mongodb_connection_string

JWT_SECRET=your_jwt_secret

GEMINI_API_KEY=your_gemini_api_key

FRONTEND_URL=http://localhost:5173
```

> **Note:** Never commit your `.env` file. Use environment variables in production platforms such as Render.

---

# 💻 Local Setup

Clone the repository

```bash
git clone https://github.com/placement-portal-team/placement-portal-server.git
```

Navigate to the project

```bash
cd placement-portal-server
```

Install dependencies

```bash
npm install
```

Create your `.env`

```bash
touch .env
```

Run the development server

```bash
npm run dev
```

Backend will start on

```
http://localhost:5000
```

---

# 📈 Future Improvements

The project has been designed with scalability in mind. Planned enhancements include:

- Email Notifications for interview reminders
- Calendar Integration (Google Calendar)
- AI Resume Optimization
- Company-specific Interview Experience Database
- Role-based Access Control (Admin/User)
- AI Feedback after Mock Interviews
- Docker Containerization
- CI/CD Pipeline using GitHub Actions
- Unit & Integration Testing
- Rate Limiting and API Monitoring

---

# 🤝 Contributing

Contributions are welcome.

If you'd like to improve the project:

1. Fork the repository
2. Create a new feature branch

```bash
git checkout -b feature/feature-name
```

3. Commit your changes

```bash
git commit -m "Add new feature"
```

4. Push the branch

```bash
git push origin feature/feature-name
```

5. Open a Pull Request

---

# 👨‍💻 Author

**Rathna Sujith Reddy** ❤️

Final Year Computer Science Student

Indian Institute of Engineering Science and Technology (IIEST), Shibpur

GitHub:
https://github.com/sujithdnd29

---

# ⭐ Support

If you found this project useful, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future improvements.

---

<div align="center">

### Built with ❤️ using

Node.js • Express.js • MongoDB Atlas • Gemini AI • JWT • Render

</div>
