export type GameState = 'start' | 'playing' | 'feedback' | 'finished';

export type Prompt = {
  id: string;
  category: string;
  number: number;
  phrase: string; // e.g., "2020年"
  answer: number; // The numeric answer
  ttsText: string; // Chinese text for TTS
  startTime: number;
  endTime?: number;
  userAnswer?: number;
  isCorrect?: boolean;
  timeSpent?: number; // Time in milliseconds
  replayCount?: number; // Number of times the audio was replayed
};

export type GameStats = {
  prompts: Prompt[];
  averageTime: number;
  longestTime: number;
  shortestTime: number;
  totalTime: number;
  correctCount: number;
  totalCount: number;
};

export type NumberCategory = {
  name: string;
  suffix: string;
  min: number;
  max: number;
  format: 'year' | 'regular' | 'digit-by-digit';
};

