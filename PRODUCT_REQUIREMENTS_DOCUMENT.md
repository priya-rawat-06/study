# Product Requirements Document (PRD)

## Project Title
**THE MIGHTY THINK TANK**  
*AI-Powered Adaptive Learning Management & Exam Preparation Studio*

---

## 1. Document Overview
* **Document Owner:** Development Team
* **Product Name:** THE MIGHTY THINK TANK
* **Version:** 1.0.0
* **Target Release Date:** Q3 2026
* **Status:** Complete / Production-Ready

---

## 2. Product Vision & Objectives

### 2.1 Vision Statement
To empower students and lifelong learners by transforming raw, complex learning materials into personalized, interactive, and structured study trajectories using cutting-edge artificial intelligence.

### 2.2 Core Objectives
* **Reduce Study Friction:** Eliminate the overhead of manually creating study schedules, flashcards, and summary notes.
* **Enhance Retention:** Implement evidence-based learning techniques like active recall, spaced learning, and interactive testing.
* **Provide 24/7 Academic Support:** Offer real-time AI-powered tutoring contextually aware of the student's current study plan.
* **Track Mastery:** Measure progress across days, subjects, and specific difficulty tiers.

---

## 3. Target Audience & User Personas

### Persona 1: High School & University Students
* **Goal:** Prepare for midterms/finals across multiple subjects without feeling overwhelmed.
* **Pain Point:** Lack of time management structure; difficulty digesting large syllabus documents.

### Persona 2: Professional Certification Candidates
* **Goal:** Pass rigorous licensing or technical exams (e.g., AWS, PMP, CPA) alongside a job.
* **Pain Point:** Need efficient daily micro-learning sessions (1–2 hours/day) that yield maximum retention.

---

## 4. Key Product Features & Functional Requirements

### 4.1 AI Plan Generator (`PlanCreatorModal`)
* **Description:** Allows users to input study parameters to auto-generate a comprehensive learning module.
* **Inputs Required:**
  * Exam / Subject Title
  * Target Deadline Date
  * Daily Study Allocation (Hours per day)
  * Focus Level / Intensity (Relaxed, Moderate, Intensive)
  * Raw Source Text / Syllabus Topics
* **Output Generated:**
  * Multi-day study roadmap broken into daily actionable tasks.
  * Topic-specific markdown notes.
  * Active recall flashcard deck.
  * Interactive multiple-choice quiz bank.

### 4.2 Interactive Study Schedule (`ScheduleView`)
* **Description:** Day-by-day roadmap displaying daily study tasks, estimated completion times, and status toggles.
* **Features:**
  * Filter by completed vs. pending days.
  * Expand daily topics to view nested tasks.
  * Direct action buttons to jump into corresponding notes, flashcards, or quizzes for that day.

### 4.3 Active Recall Flashcard Trainer (`FlashcardTrainer`)
* **Description:** Interactive card-flipping study interface.
* **Features:**
  * Front side: Question / Concept; Back side: Clear, concise explanation.
  * Self-assessment buttons: **Easy**, **Medium**, **Hard**.
  * Dynamic progress bar and deck mastery metrics.
  * Category and mastery filters.

### 4.4 Self-Assessment Quiz Engine (`QuizEngine`)
* **Description:** Interactive testing system to validate knowledge retention.
* **Features:**
  * Multiple-choice questions with option feedback.
  * Optional AI hints for stuck questions.
  * Detailed answer explanations post-submission.
  * Final score breakdown with retry options.

### 4.5 Embedded AI Tutor (`AITutorChat`)
* **Description:** Context-aware chat assistant available directly within the study workspace.
* **Features:**
  * Grounded in the selected study plan's content.
  * Clarifies complex concepts, provides analogies, and solves practice problems.
  * Suggested follow-up prompt chips for quick inquiry.

### 4.6 Pomodoro Focus Timer (`FocusTimer`)
* **Description:** Productivity tool integrated into the navigation bar.
* **Features:**
  * Configurable intervals: Focus (25m), Short Break (5m), Long Break (15m).
  * Audio alerts upon session completion.
  * Daily focus streak counter.

---

## 5. Technical Architecture & Tech Stack

### 5.1 Architecture Model
* **Decoupled Full-Stack:** Frontend Single-Page Application (SPA) paired with a lightweight Node.js/Express REST API backend.

### 5.2 Technology Stack
* **Frontend:** React 18, TypeScript, Vite, Tailwind CSS, Lucide React icons, Motion animations.
* **Backend:** Node.js, Express.js, TypeScript (`tsx`), Dotenv.
* **AI Engine:** Google Gemini 3.6 Flash SDK (`@google/genai`) with structured JSON schema responses.

### 5.3 API Specifications

| Endpoint | Method | Purpose |
| :--- | :--- | :--- |
| `/api/generate-plan` | `POST` | Generates study plan, schedule, flashcards, notes, and quizzes via Gemini API. |
| `/api/tutor-chat` | `POST` | Handles real-time student questions using Gemini conversational capabilities. |
| `/api/plans` | `GET` | Retrieves saved study plans from persistent server storage. |

---

## 6. Non-Functional Requirements

### 6.1 Performance & Latency
* Initial page load under 1.5 seconds.
* AI generation request response time optimized using Gemini Flash 3.6 fast inference.

### 6.2 Usability & Accessibility
* Responsive across desktop, tablet, and mobile screens.
* WCAG AA contrast standards with warm, eye-friendly neutral color palette.
* Clean, non-distracting UI layout.

### 6.3 Reliability & Persistence
* Auto-saves user progress, quiz scores, and flashcard mastery ratings to local storage and server records.

---

## 7. Success Metrics & Key Performance Indicators (KPIs)
* **Plan Completion Rate:** % of generated days completed by users.
* **Quiz Retention Score:** Average improvement between initial and second attempt quiz scores.
* **Daily Active Engagement:** Average focus timer minutes per session.
