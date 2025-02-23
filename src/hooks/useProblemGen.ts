import { generateProblem } from "@/features/problemGen/problemGenerator";
import { Difficulty, Problem } from "@/types/game.types";
import { useCallback, useEffect, useState } from "react";

interface UseProblemGenProps {
  age: number;
  difficulty: Difficulty;
  problemCount?: number;
  onComplete?: (score: number) => void;
}

export const useProblemGen = ({
  age,
  difficulty,
  problemCount = 10,
  onComplete,
}: UseProblemGenProps) => {
  const [currentProblem, setCurrentProblem] = useState<Problem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [progress, setProgress] = useState(0);
  const [streak, setStreak] = useState(0);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [problemsCompleted, setProblemsCompleted] = useState(0);

  const generateNewProblem = useCallback(() => {
    const problem = generateProblem({ age, difficulty });
    setCurrentProblem(problem);
  }, [age, difficulty]);

  useEffect(() => {
    generateNewProblem();
    setIsLoading(false);
  }, [generateNewProblem]);

  const checkAnswer = useCallback(
    (answer: number) => {
      if (!currentProblem) return;

      const correct = answer === currentProblem.answer;
      setIsCorrect(correct);

      if (correct) {
        setStreak((prev) => prev + 1);
        setScore((prev) => prev + 10);
        setProgress((prev) => Math.min(prev + 10, 100));
      } else {
        setStreak(0);
      }

      setProblemsCompleted((prev) => prev + 1);

      // Generate new problem after a delay
      setTimeout(() => {
        if (problemsCompleted + 1 >= problemCount) {
          if (onComplete) onComplete(score);
        } else {
          generateNewProblem();
          setIsCorrect(null);
        }
      }, 1000);
    },
    [
      currentProblem,
      problemCount,
      problemsCompleted,
      score,
      onComplete,
      generateNewProblem,
    ]
  );

  return {
    currentProblem,
    isLoading,
    progress,
    streak,
    checkAnswer,
    isCorrect,
  };
};
