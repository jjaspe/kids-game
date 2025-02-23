import { useProblemGen } from '@/hooks/useProblemGen';
import { AnimatePresence } from 'framer-motion';
import { useCallback, useState } from 'react';
import { Avatar } from './Avatar';
import styles from './MathRace.module.css';
import { ProblemDisplay } from './ProblemDisplay';
import { RaceTrack } from './RaceTrack';
import { SimpleCountingDisplay } from './SimpleCountingDisplay';
import { MathRaceProps } from './types';

export const MathRace = ({
  onComplete,
  onExit,
  onAnswer,
  difficulty = 'easy',
  problemCount = 10,
  mode = 'arithmetic',
  hideTrack = false,
}: MathRaceProps) => {
  const [isMoving, setIsMoving] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  const {
    currentProblem,
    isLoading,
    progress,
    streak,
    checkAnswer,
    isCorrect,
  } = useProblemGen({
    age: mode === 'arithmetic' ? 7 : 4,
    difficulty,
    problemCount,
    onComplete: (finalScore) => {
      if (onComplete) onComplete(finalScore);
    },
  });

  const handleAnswer = useCallback(async (answer: number) => {
    setIsChecking(true);
    
    // Check answer locally
    const correct = answer === currentProblem?.answer;
    
    // Call the onAnswer prop with the result
    if (onAnswer) {
      await onAnswer(answer, correct);
    }
    
    // Check answer in the hook to update local state
    checkAnswer(answer);
    
    // Wait for the animation to complete before moving
    setTimeout(() => {
      setIsMoving(true);
      
      // Stop moving animation after a delay
      setTimeout(() => {
        setIsMoving(false);
        setIsChecking(false);
      }, 500);
    }, 1000);
  }, [checkAnswer, onAnswer, currentProblem]);

  if (isLoading || !currentProblem) {
    return <div>Loading...</div>;
  }

  const getCharacter = () => {
    switch (mode) {
      case 'counting':
        return '🦊'; // Fox for counting
      case 'arithmetic':
        return '🏃'; // Runner for arithmetic
      default:
        return '🦁'; // Lion for simple counting
    }
  };

  return (
    <div className={styles.container}>
      {onExit && (
        <button 
          onClick={onExit}
          className={styles.exitButton}
          aria-label="Exit game"
        >
          ← Exit
        </button>
      )}

      {!hideTrack && (
        <RaceTrack>
          <Avatar 
            progress={progress} 
            isMoving={isMoving}
            character={getCharacter()}
          />
        </RaceTrack>
      )}

      <AnimatePresence mode="wait">
        {currentProblem.visualElements ? (
          <SimpleCountingDisplay
            key={currentProblem.id}
            problem={currentProblem}
            onAnswer={handleAnswer}
            isChecking={isChecking}
            streak={streak}
            isCorrect={isCorrect}
          />
        ) : (
          <ProblemDisplay
            key={currentProblem.id}
            problem={currentProblem}
            onAnswer={handleAnswer}
            isChecking={isChecking}
            streak={streak}
            isCorrect={isCorrect}
          />
        )}
      </AnimatePresence>
    </div>
  );
}; 