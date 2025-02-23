import { NumberPad } from '@components/common';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import styles from './MathRace.module.css';
import { ProblemDisplayProps } from './types';

export const ProblemDisplay = ({
  problem,
  onAnswer,
  isChecking = false,
  streak = 0,
}: ProblemDisplayProps) => {
  const [currentAnswer, setCurrentAnswer] = useState('');

  const handleSubmit = () => {
    onAnswer(Number(currentAnswer));
    setCurrentAnswer('');
  };

  return (
    <motion.div
      className={styles.problemDisplay}
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -50, opacity: 0 }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={problem.id}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 1.2, opacity: 0 }}
          className={styles.question}
        >
          {problem.question}
        </motion.div>
      </AnimatePresence>

      <div style={{ position: 'relative' }}>
        {streak > 1 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className={styles.streakCounter}
          >
            {streak} 🔥
          </motion.div>
        )}
        
        <NumberPad
          onNumberSelect={(num) => setCurrentAnswer(prev => prev + num)}
          onDelete={() => setCurrentAnswer(prev => prev.slice(0, -1))}
          onSubmit={handleSubmit}
          currentValue={currentAnswer}
          disabled={isChecking}
        />
      </div>
    </motion.div>
  );
}; 