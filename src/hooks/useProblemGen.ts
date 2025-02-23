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
  isCorrect: boolean | null;
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
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

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

      const correct = answer === problem.answer;
      setIsCorrect(correct);

      if (correct) {
        const newStreak = streak + 1;
        setStreak(newStreak);
        setScore((prev) => prev + 10 * newStreak); // Bonus points for streaks

        // Move forward on correct answer
        if (currentIndex < problems.length - 1) {
          setCurrentIndex((prev) => prev + 1);
        } else if (onComplete) {
          onComplete(score);
        }
      } else {
        setStreak(0);
        // Wait for wrong animation before moving back
        setTimeout(() => {
          // Move back on wrong answer if not at start
          if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
          }
          // Reset isCorrect after moving back
          setIsCorrect(null);
        }, 1000);
        return; // Early return to prevent the final timeout
      }

      // Reset isCorrect after a delay (only for correct answers)
      setTimeout(() => {
        setIsCorrect(null);
      }, 1000);
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
    isCorrect,
  };
};
