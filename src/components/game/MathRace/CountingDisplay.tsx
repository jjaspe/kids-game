import { Problem } from '@/types/game.types';
import { motion } from 'framer-motion';
import { NumberPad } from '../../common/NumberPad';
import styles from './CountingDisplay.module.css';

interface CountingDisplayProps {
  problem: Problem;
  onAnswer: (answer: number) => void;
  isChecking: boolean;
  streak: number;
}

export const CountingDisplay = ({
  problem,
  onAnswer,
  isChecking,
  streak,
}: CountingDisplayProps) => {
  if (!problem.visualElements) return null;

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className={styles.questionText}>{problem.question}</div>
      
      <div className={styles.visualContainer}>
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
      </div>

      <div className={styles.streakIndicator}>
        {streak > 1 && `${streak}x Streak!`}
      </div>

      <NumberPad
        onSubmit={onAnswer}
        disabled={isChecking}
        maxLength={2}
        onNumberSelect={() => {}}
      />
    </motion.div>
  );
}; 