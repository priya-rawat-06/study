export type StudyIntensity = 'relaxed' | 'balanced' | 'intense' | 'cram';

export interface TaskItem {
  id: string;
  title: string;
  durationMinutes: number;
  completed: boolean;
  type: 'concept' | 'practice' | 'review' | 'quiz' | 'flashcards';
  notesSnippet?: string;
}

export interface DaySchedule {
  dayNumber: number;
  dateStr: string; // e.g. "2026-08-01"
  title: string;
  focusTopic: string;
  technique: string; // e.g. "Pomodoro + Active Recall"
  estimatedHours: number;
  completed: boolean;
  tasks: TaskItem[];
}

export interface Flashcard {
  id: string;
  front: string;
  back: string;
  hint?: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  status?: 'unseen' | 'mastered' | 'reviewing';
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  hint?: string;
  category?: string;
}

export interface KeyConcept {
  term: string;
  definition: string;
  exampleOrAnalogy: string;
  importance: 'high' | 'medium' | 'critical';
}

export interface StudyPlan {
  id: string;
  title: string;
  subject: string;
  deadline: string; // ISO date string
  dailyHours: number;
  intensity: StudyIntensity;
  createdAt: string;
  colorTheme: string; // hex or tailwind class pair
  
  // High level
  summary: string;
  motivationQuote: string;
  totalEstimatedHours: number;
  
  // Modules
  schedule: DaySchedule[];
  notesMarkdown: string;
  keyConcepts: KeyConcept[];
  flashcards: Flashcard[];
  quiz: QuizQuestion[];
  cheatSheet: string[];
}

export interface CreatePlanRequest {
  subject: string;
  deadline: string;
  dailyHours: number;
  intensity: StudyIntensity;
  targetGoal?: string;
  topicsOrNotes?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}
