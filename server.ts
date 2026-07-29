import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Initialize Gemini Client
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY || "",
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

// API Routes
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Generate Study Plan Endpoint
app.post("/api/generate-plan", async (req, res) => {
  try {
    const { subject, deadline, dailyHours = 2, intensity = "balanced", targetGoal = "", topicsOrNotes = "" } = req.body;

    if (!subject || !deadline) {
      return res.status(400).json({ error: "Subject and deadline are required fields." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY environment variable is missing." });
    }

    const todayStr = new Date().toISOString().split("T")[0];
    
    const prompt = `
You are an expert master educator and cognitive study strategy coach. 
Create a detailed, highly vibrant, encouraging, and complete study plan for a student studying "${subject}".

Context:
- Today's date: ${todayStr}
- Target Exam / Deadline: ${deadline}
- Daily Study Budget: ${dailyHours} hours/day
- Intensity Mode: ${intensity}
- Student's Target Goal: ${targetGoal || "Master all key concepts with top grade"}
- Syllabus Notes / Specific Topics: ${topicsOrNotes || "Cover core foundations, advanced applications, exam-style problems, and high-yield review."}

Generate a complete structured JSON response with:
1. Overall summary, strategy quote, motivation tip, estimated total study hours.
2. A day-by-day schedule from Day 1 leading up to the deadline day (generate between 3 to 10 logical study days based on the deadline span, or at least 4 structured day milestones). Each day must have specific actionable tasks (concepts, practice, review, quiz, flashcards), focus topic, and recommended study technique (e.g. Pomodoro, Feynman Method, Active Recall).
3. Comprehensive markdown study notes covering the key topics, organized with markdown headers (##, ###), bullet points, bold key terms, clear explanations, and code or formulas where applicable.
4. Key concepts list with term, definition, memorable analogy, and importance level.
5. Flashcards deck (at least 8-12 cards) with front question, back answer, hint, category, and difficulty.
6. Quiz questions (at least 5-8 multiple choice questions) with 4 options, 0-indexed correct answer, detailed explanation of why it's correct, hint, and category.
7. High-yield cheat sheet / formula summary (5-8 concise bullet points).
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING, description: "A high-level encouraging breakdown of the study plan strategy" },
            motivationQuote: { type: Type.STRING, description: "An inspiring academic motivation quote" },
            totalEstimatedHours: { type: Type.NUMBER, description: "Total estimated study hours calculated" },
            colorTheme: { type: Type.STRING, description: "Hex color code or primary color name like #6366f1, #ec4899, #10b981, #f59e0b" },
            
            schedule: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  dayNumber: { type: Type.NUMBER },
                  dateStr: { type: Type.STRING },
                  title: { type: Type.STRING },
                  focusTopic: { type: Type.STRING },
                  technique: { type: Type.STRING },
                  estimatedHours: { type: Type.NUMBER },
                  tasks: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        title: { type: Type.STRING },
                        durationMinutes: { type: Type.NUMBER },
                        type: { type: Type.STRING, description: "concept, practice, review, quiz, or flashcards" },
                        notesSnippet: { type: Type.STRING }
                      },
                      required: ["id", "title", "durationMinutes", "type"]
                    }
                  }
                },
                required: ["dayNumber", "title", "focusTopic", "technique", "estimatedHours", "tasks"]
              }
            },

            notesMarkdown: { type: Type.STRING, description: "Detailed Markdown study notes for the subject" },

            keyConcepts: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  term: { type: Type.STRING },
                  definition: { type: Type.STRING },
                  exampleOrAnalogy: { type: Type.STRING },
                  importance: { type: Type.STRING, description: "high, medium, or critical" }
                },
                required: ["term", "definition", "exampleOrAnalogy", "importance"]
              }
            },

            flashcards: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  front: { type: Type.STRING },
                  back: { type: Type.STRING },
                  hint: { type: Type.STRING },
                  category: { type: Type.STRING },
                  difficulty: { type: Type.STRING, description: "easy, medium, or hard" }
                },
                required: ["id", "front", "back", "category", "difficulty"]
              }
            },

            quiz: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING },
                  question: { type: Type.STRING },
                  options: { type: Type.ARRAY, items: { type: Type.STRING } },
                  correctIndex: { type: Type.NUMBER },
                  explanation: { type: Type.STRING },
                  hint: { type: Type.STRING },
                  category: { type: Type.STRING }
                },
                required: ["id", "question", "options", "correctIndex", "explanation"]
              }
            },

            cheatSheet: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["summary", "motivationQuote", "totalEstimatedHours", "schedule", "notesMarkdown", "keyConcepts", "flashcards", "quiz", "cheatSheet"]
        }
      }
    });

    const jsonText = response.text || "{}";
    const data = JSON.parse(jsonText);

    res.json(data);
  } catch (error: any) {
    console.error("Error generating study plan:", error);
    res.status(500).json({ error: error.message || "Failed to generate study plan with AI." });
  }
});

// AI Study Tutor Chat Endpoint
app.post("/api/study-chat", async (req, res) => {
  try {
    const { subject, topicContext, message, history = [] } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required." });
    }

    if (!process.env.GEMINI_API_KEY) {
      return res.status(500).json({ error: "GEMINI_API_KEY is not configured." });
    }

    const systemInstruction = `You are a friendly, upbeat, highly supportive AI Study Tutor specializing in ${subject || "general academic topics"}.
Context:
${topicContext ? `Current Topic Context:\n${topicContext}` : ""}

Goal: Help the student understand concepts deeply, solve practice problems step-by-step, explain complex topics with relatable analogies, or give tips to recall tricky formulas/definitions.
Keep your tone encouraging, clear, and easy to read with bullet points or formatted code/math snippets where helpful.`;

    const chatHistory = history.map((h: any) => ({
      role: h.sender === 'user' ? 'user' : 'model',
      parts: [{ text: h.text }]
    }));

    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: [
        ...chatHistory,
        { role: 'user', parts: [{ text: message }] }
      ],
      config: {
        systemInstruction
      }
    });

    res.json({ reply: response.text || "I'm here to help you study! What concept would you like to review?" });
  } catch (error: any) {
    console.error("Error in study chat:", error);
    res.status(500).json({ error: error.message || "Error processing tutor request." });
  }
});

// Start Express Server with Vite Middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  if (!process.env.VERCEL) {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${PORT} (or http://127.0.0.1:${PORT})`);
    });
  }
}

startServer();

export default app;
