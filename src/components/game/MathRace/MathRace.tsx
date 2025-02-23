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
    age: mode === 'arithmetic' ? 7 : 4, // Use age 4 for counting modes
    difficulty,
    problemCount,
    mode,
    onComplete: (finalScore) => {
      if (onComplete) onComplete(finalScore);
    },
  });

  const handleAnswer = useCallback(async (answer: number) => {
    setIsChecking(true);
    
    // Call the onAnswer prop if provided
    if (onAnswer) {
      await onAnswer(answer);
    }
    
    // Check answer immediately but don't move yet
    checkAnswer(answer);
    
    // Wait for the animation to complete before moving
    setTimeout(() => {
      setIsMoving(true);
      
      // Stop moving animation after a delay
      setTimeout(() => {
        setIsMoving(false);
        setIsChecking(false);
      }, 500);
    }, 1000); // Wait for wrong animation if answer is incorrect
  }, [checkAnswer, onAnswer]);

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

      <RaceTrack>
        <Avatar 
          progress={progress} 
          isMoving={isMoving}
          character={getCharacter()}
        />
      </RaceTrack>

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