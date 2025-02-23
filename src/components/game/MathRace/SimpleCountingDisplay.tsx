import { Problem } from '@/types/game.types';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { NumberPad } from '../../common/NumberPad';
import styles from './SimpleCountingDisplay.module.css';

interface SimpleCountingDisplayProps {
  problem: Problem;
  onAnswer: (answer: number) => void;
  isChecking: boolean;
  streak: number;
}

export const SimpleCountingDisplay = ({
  problem,
  onAnswer,
  isChecking,
  streak,
}: SimpleCountingDisplayProps) => {
  const [currentAnswer, setCurrentAnswer] = useState('');

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      if (isChecking) return;

      // Handle number keys (both main keyboard and numpad)
      if (/^[0-9]$/.test(event.key)) {
        setCurrentAnswer(prev => {
          // Limit to 2 digits
          if (prev.length >= 2) return prev;
          return prev + event.key;
        });
      }
      // Handle backspace
      else if (event.key === 'Backspace') {
        setCurrentAnswer(prev => prev.slice(0, -1));
      }
      // Handle enter key
      else if (event.key === 'Enter' && currentAnswer) {
        handleSubmit(Number(currentAnswer));
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentAnswer, isChecking]);

  if (!problem.visualElements) return null;

  const handleSubmit = (value: number) => {
    onAnswer(value);
    setCurrentAnswer('');
  };

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className={styles.questionText}>
        How many do you see?
      </div>

      <div className={styles.visualContainer}>
        <AnimatePresence mode="popLayout">
          {problem.visualElements.map((emoji, index) => (
            <motion.div
              key={index}
              className={styles.visualElement}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {emoji}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className={styles.inputSection}>
        <NumberPad
          onNumberSelect={(num) => setCurrentAnswer(prev => {
            if (prev.length >= 2) return prev;
            return prev + num;
          })}
          onDelete={() => setCurrentAnswer(prev => prev.slice(0, -1))}
          onSubmit={handleSubmit}
          currentValue={currentAnswer}
          disabled={isChecking}
          maxLength={2}
        />
      </div>

      {streak > 1 && (
        <motion.div
          className={styles.streakIndicator}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
        >
          {streak}x Streak! 🔥
        </motion.div>
      )}
    </motion.div>
  );
}; 