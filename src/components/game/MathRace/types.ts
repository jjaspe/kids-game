import { Difficulty, Problem } from "@/types/game.types";

export interface MathRaceProps {
  onComplete?: (score: number) => void;
  onExit?: () => void;
  onAnswer?: (answer: number, isCorrect: boolean) => void | Promise<void>;
  onNewProblem?: (problem: Problem) => void | Promise<void>;
  currentProblem?: Problem;
  difficulty?: Difficulty;
  problemCount?: number;
  mode?: "arithmetic" | "counting" | "simple_counting";
  hideTrack?: boolean;
}

export interface AvatarProps {
  progress: number;
  isMoving: boolean;
  character?: string;
}

export interface RaceTrackProps {
  children: React.ReactNode;
  milestones?: number[];
}

export interface ProblemDisplayProps {
  problem: Problem;
  onAnswer: (answer: number) => void;
  isChecking?: boolean;
  streak?: number;
  isCorrect: boolean | null;
}
