import { Problem } from "@/types/game.types";
import { ageGroups } from "./config";
import { GeneratorOptions, ProblemConfig, visualElements } from "./types";

// Helper function to get random number between min and max (inclusive)
const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// Helper function to get random item from array
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Get configuration based on age and difficulty
const getConfig = (options: GeneratorOptions): ProblemConfig | null => {
  const ageGroup = ageGroups.find(
    (group) => options.age >= group.minAge && options.age <= group.maxAge
  );

  if (!ageGroup) return null;
  return ageGroup.config[options.difficulty];
};

// Generate a counting problem
const generateCountingProblem = (config: ProblemConfig): Problem => {
  const count = getRandomNumber(config.minNumber, config.maxNumber);
  const element = getRandomItem(visualElements);

  return {
    id: Math.random().toString(36).substr(2, 9),
    question: `How many ${element.name}s do you see?`,
    visualElements: Array(count).fill(element.emoji),
    answer: count,
    difficulty: "easy",
    timeLimit: config.timeLimit,
  };
};

// Generate an arithmetic problem
const generateArithmeticProblem = (
  config: ProblemConfig,
  options: GeneratorOptions
): Problem => {
  const operation = getRandomItem(
    config.operations.filter((op) => !options.excludeOperations?.includes(op))
  );

  const num1 = getRandomNumber(config.minNumber, config.maxNumber);
  let num2 = getRandomNumber(config.minNumber, config.maxNumber);

  // For division, ensure we get whole numbers
  if (operation === "÷") {
    num2 = getRandomNumber(1, Math.min(10, config.maxNumber));
    const product = num1 * num2;
    return {
      id: Math.random().toString(36).substr(2, 9),
      question: `${product} ${operation} ${num2} = ?`,
      answer: num1,
      difficulty: options.difficulty,
      timeLimit: config.timeLimit,
    };
  }

  const answer = (() => {
    switch (operation) {
      case "+":
        return num1 + num2;
      case "-":
        return num1 - num2;
      case "×":
        return num1 * num2;
      default:
        return 0;
    }
  })();

  return {
    id: Math.random().toString(36).substr(2, 9),
    question: `${num1} ${operation} ${num2} = ?`,
    answer,
    difficulty: options.difficulty,
    timeLimit: config.timeLimit,
  };
};

// Main problem generation function
export const generateProblem = (options: GeneratorOptions): Problem | null => {
  const config = getConfig(options);
  if (!config) return null;

  // Use counting mode if specified in config or options
  if (config.mode === "counting" || options.mode === "counting") {
    return generateCountingProblem(config);
  }

  return generateArithmeticProblem(config, options);
};

// Generate multiple problems
export const generateProblems = (
  options: GeneratorOptions,
  count: number = 10
): Problem[] => {
  const problems: Problem[] = [];

  for (let i = 0; i < count; i++) {
    const problem = generateProblem(options);
    if (problem) problems.push(problem);
  }

  return problems;
};
