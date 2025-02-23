import { GameMode } from "@/features/problemGen/types";
import { Difficulty, Problem } from "@/types/game.types";

export interface MathRaceProps {
  onComplete?: (score: number) => void;
  onExit?: () => void;
  difficulty?: Difficulty;
  problemCount?: number;
  mode?: GameMode;
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
  streak: number;
}
