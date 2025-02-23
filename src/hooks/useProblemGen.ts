import { generateProblems } from "@/features/problemGen/problemGenerator";
import { GeneratorOptions } from "@/features/problemGen/types";
import { Problem } from "@/types/game.types";
import { useCallback, useEffect, useState } from "react";

interface UseProblemGenProps extends GeneratorOptions {
  problemCount?: number;
  onComplete?: (score: number) => void;
}

interface UseProblemGenReturn {
  currentProblem: Problem | null;
  isLoading: boolean;
  progress: number;
  score: number;
  streak: number;
  checkAnswer: (answer: number) => void;
}

export const useProblemGen = ({
  age,
  difficulty,
  problemCount = 10,
  excludeOperations,
  onComplete,
}: UseProblemGenProps): UseProblemGenReturn => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Generate problems on mount
  useEffect(() => {
    const newProblems = generateProblems(
      { age, difficulty, excludeOperations },
      problemCount
    );
    setProblems(newProblems);
    setIsLoading(false);
  }, [age, difficulty, excludeOperations, problemCount]);

  const checkAnswer = useCallback(
    (answer: number) => {
      const problem = problems[currentIndex];
      if (!problem) return;

      const isCorrect = answer === problem.answer;

      if (isCorrect) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        setScore((prev) => prev + 10 * newStreak); // Bonus points for streaks
      } else {
        setStreak(0);
      }

      // Move to next problem
      if (currentIndex < problems.length - 1) {
        setCurrentIndex((prev) => prev + 1);
      } else if (onComplete) {
        onComplete(score);
      }
    },
    [currentIndex, problems, streak, score, onComplete]
  );

  return {
    currentProblem: problems[currentIndex] || null,
    isLoading,
    progress: (currentIndex / problemCount) * 100,
    score,
    streak,
    checkAnswer,
  };
};
