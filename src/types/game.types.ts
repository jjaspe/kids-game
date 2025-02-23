export type Difficulty = "easy" | "medium" | "hard";

export type GameMode = "arithmetic" | "counting" | "simple_counting" | "battle";

export interface Problem {
  id: string;
  question: string;
  answer: number;
  difficulty: Difficulty;
  timeLimit?: number; // in seconds
  visualElements?: string[]; // Array of emoji strings for counting mode
}

export interface GameState {
  score: number;
  streak: number;
  level: number;
  currentProblem: Problem | null;
  gameStatus: "idle" | "playing" | "paused" | "completed";
  startTime: Date | null;
  endTime: Date | null;
}

export interface PlayerStats {
  totalGames: number;
  totalScore: number;
  highestStreak: number;
  averageAccuracy: number;
  problemsSolved: number;
  timeSpent: number; // in seconds
}

export interface GameSession {
  id: string;
  userId: string;
  startTime: Date;
  endTime?: Date;
  score: number;
  problems: {
    problemId: string;
    question: string;
    answer: number;
    userAnswer: number;
    timeSpent: number;
    isCorrect: boolean;
  }[];
}

export interface GameSettings {
  soundEnabled: boolean;
  musicEnabled: boolean;
  difficulty: Difficulty;
  timeLimit: number; // in seconds
  problemCount: number;
}
