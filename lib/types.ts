
export interface QuizSession {
  id: string;
  code: string;
  topic: string;
  status: 'waiting' | 'active' | 'completed';
  hostName: string;
  createdAt: Date;
  participants: Participant[];
  questions: Question[];
}

export interface Participant {
  id: string;
  name: string;
  score: number;
  joinedAt: Date;
  sessionId: string;
}

export interface Question {
  id: string;
  questionText: string;
  options: string[];
  correctAnswer: number;
  questionNumber: number;
  sessionId: string;
}

export interface Answer {
  id: string;
  selectedAnswer: number | null;
  isCorrect: boolean;
  answeredAt: Date;
  participantId: string;
  questionId: string;
}

export interface QuizQuestion {
  question: string;
  options: string[];
  correctAnswer: number;
}

export interface WebSocketMessage {
  type: 'participant-joined' | 'participant-left' | 'quiz-started' | 'next-question' | 'question-ended' | 'quiz-completed' | 'leaderboard-update';
  data: any;
}

export const QUIZ_TOPICS = [
  'Sports',
  'Entertainment', 
  'Music',
  'Science',
  'History',
  'Geography',
  'Technology',
  'Movies',
  'Food',
  'Travel'
] as const;

export type QuizTopic = typeof QUIZ_TOPICS[number];
