# Project Resource & Architecture Document
## THE MIGHTY THINK TANK
**AI-Powered Personalized Learning Management System & Exam Preparation Engine**

---

### Executive Summary
**THE MIGHTY THINK TANK** is a full-stack web application designed to help students transform raw course materials into structured study plans, personalized schedules, interactive flashcards, quizzes, and real-time AI tutor support. Powered by **Google Gemini 3.6 Flash**, the platform optimizes study efficiency through active recall and spaced learning principles.

---

### Tech Stack & System Architecture

| Tier | Component / Library | Purpose |
| :--- | :--- | :--- |
| **Frontend** | React 18, Vite, Tailwind CSS, Lucide React, Motion | Responsive single-page application rendering schedules, notes, flashcard trainers, and quizzes. |
| **Backend** | Node.js, Express, TypeScript (`tsx`), Dotenv | Secure REST API layer that handles prompt engineering and enforces Gemini API JSON schemas. |
| **AI Integration** | `@google/genai` (Gemini 3.6 Flash) | Generates structured JSON study plans, quizzes, flashcards, and streams real-time AI tutoring. |

---

### Folder Structure & File Separation

```text
vibrant-study-planner/
├── backend/                  # Express API Server & Gemini AI Engine
│   ├── server.ts             # Express REST endpoints & Gemini prompt schema handling
│   ├── package.json          # Backend runtime dependencies (express, @google/genai, tsx, dotenv)
│   ├── .env                  # Environment config (GEMINI_API_KEY, PORT=3000)
│   ├── tsconfig.json         # TypeScript configuration for Node environment
│   └── data/                 # Saved study plans and persistent local data
│
├── frontend/                 # React UI Client & Vite Application
│   ├── src/                  # Application components, styles, types, and helpers
│   │   ├── components/       # Core UI (QuizEngine, FlashcardTrainer, AITutorChat, FocusTimer, etc.)
│   │   ├── App.tsx           # Main application router and state manager
│   │   ├── main.tsx          # React DOM entry point
│   │   ├── index.css         # Global styling and Tailwind CSS directive
│   │   └── types.ts          # Shared TypeScript interfaces
│   ├── index.html            # SPA entry HTML
│   ├── vite.config.ts        # Vite configuration with API proxy setting
│   ├── package.json          # Frontend client dependencies (react, vite, tailwindcss, lucide-react)
│   └── tsconfig.json         # Client TypeScript configuration
│
└── README.md                 # Project root documentation
```

---

### Step-by-Step Guide to Run the Application

#### 1. Running the Backend Server
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Verify `.env` file contains your Gemini API Key:
   ```env
   GEMINI_API_KEY=your_gemini_api_key_here
   PORT=3000
   ```
3. Install backend packages:
   ```bash
   npm install
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *Expected Output:* `Server running at http://localhost:3000`

#### 2. Running the Frontend Application
1. Open a **new terminal window** and navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Ensure `package.json` contains the correct dev script:
   ```json
   "scripts": {
     "dev": "vite",
     "build": "vite build",
     "preview": "vite preview"
   }
   ```
3. Install frontend packages:
   ```bash
   npm install
   ```
4. Launch the frontend development server:
   ```bash
   npm run dev
   ```
   *Expected Output:* Access the application in your browser at `http://localhost:5173`

---

### Key Application Features

1. **AI Study Plan Generator (`/api/generate-plan`)**: Accepts subject, exam deadline, daily study hours, and target goals. Returns a day-by-day roadmap, Markdown notes, flashcard deck, and quiz set.
2. **Flashcard Trainer**: Interactive card-flipping interface with difficulty tagging (Easy, Medium, Hard) and progress tracking.
3. **Interactive Quiz Engine**: Practice multiple-choice tests with real-time scoring, hints, and detailed explanation breakdowns.
4. **AI Tutor Chat (`/api/tutor-chat`)**: Context-aware chat assistant for asking clarifying questions on study topics.
5. **Pomodoro Focus Timer**: Customizable work/break timer intervals with session logging.

---

### Troubleshooting & Bug Fixes Log

1. **Fix: `node_modules\.bin` is not recognized / TSX missing on Windows**
   - *Cause:* Running `npm run dev` before completing `npm install` inside the `backend/` directory.
   - *Fix:* Executed `npm install` inside `backend/` to build binaries.

2. **Fix: Displaying `0.0.0.0:3000` instead of `localhost:3000`**
   - *Cause:* Default network interface output log.
   - *Fix:* Updated `server.ts` logging output to explicitly indicate `http://localhost:3000`.

3. **Fix: Frontend failing with `ERR_MODULE_NOT_FOUND` for `server.ts`**
   - *Cause:* Frontend `package.json` contained `"dev": "tsx server.ts"` copied from backend.
   - *Fix:* Changed frontend `package.json` dev script to `"dev": "vite"`.

4. **Fix: Port Collision (`EADDRINUSE: address already in use 0.0.0.0:3000`)**
   - *Cause:* Concurrent process locking port 3000.
   - *Fix:* Terminated stuck node processes using `taskkill /F /IM node.exe` and separated frontend dev server to port 5173.

---

### Conclusion
The **Vibrant Study Planner & Prep Studio** is structured, optimized, and ready for deployment or academic submission.
