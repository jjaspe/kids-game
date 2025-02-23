import { Difficulty } from "@/types/game.types";

export interface ProblemConfig {
  minNumber: number;
  maxNumber: number;
  operations: Operation[];
  questionCount?: number;
  timeLimit?: number;
  mode?: GameMode;
}

export type Operation = "+" | "-" | "×" | "÷";
export type GameMode = "arithmetic" | "counting";

export interface VisualElement {
  emoji: string;
  name: string;
  category: "fruits" | "animals" | "objects" | "nature";
}

export const visualElements: VisualElement[] = [
  // Animals (cute and friendly)
  { emoji: "🐶", name: "puppy", category: "animals" },
  { emoji: "🐱", name: "kitty", category: "animals" },
  { emoji: "🐰", name: "bunny", category: "animals" },
  { emoji: "🐼", name: "panda", category: "animals" },
  { emoji: "🦊", name: "fox", category: "animals" },
  { emoji: "🦁", name: "lion", category: "animals" },
  { emoji: "🐯", name: "tiger", category: "animals" },
  { emoji: "🐮", name: "cow", category: "animals" },
  { emoji: "🐷", name: "piggy", category: "animals" },
  { emoji: "🐸", name: "froggy", category: "animals" },

  // Objects (fun and playful)
  { emoji: "🎈", name: "balloon", category: "objects" },
  { emoji: "⭐", name: "star", category: "objects" },
  { emoji: "🎾", name: "ball", category: "objects" },
  { emoji: "🎨", name: "paint", category: "objects" },
  { emoji: "🎪", name: "circus", category: "objects" },

  // Nature (engaging and beautiful)
  { emoji: "🌸", name: "flower", category: "nature" },
  { emoji: "🌈", name: "rainbow", category: "nature" },
  { emoji: "⛅", name: "cloud", category: "nature" },
  { emoji: "🌟", name: "sparkle", category: "nature" },
  { emoji: "🦋", name: "butterfly", category: "nature" },
];

export interface AgeGroup {
  minAge: number;
  maxAge: number;
  config: Record<Difficulty, ProblemConfig>;
}

export interface GeneratorOptions {
  age: number;
  difficulty: Difficulty;
  excludeOperations?: Operation[];
  mode?: GameMode;
}

export interface ProblemTemplate {
  template: string;
  generateNumbers: () => number[];
  calculateAnswer: (numbers: number[]) => number;
}
