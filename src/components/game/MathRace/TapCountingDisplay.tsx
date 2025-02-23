import { Problem } from '@/types/game.types';
import { AnimatePresence, motion } from 'framer-motion';
import { useState } from 'react';
import styles from './TapCountingDisplay.module.css';

interface TapCountingDisplayProps {
  problem: Problem;
  onAnswer: (answer: number) => void;
  isChecking: boolean;
  streak: number;
}

export const TapCountingDisplay = ({
  problem,
  onAnswer,
  isChecking,
  streak,
}: TapCountingDisplayProps) => {
  const [tappedCount, setTappedCount] = useState(0);
  const [tappedItems, setTappedItems] = useState<boolean[]>([]);

  if (!problem.visualElements) return null;

  const handleTap = (index: number) => {
    if (isChecking) return;

    const newTappedItems = [...tappedItems];
    newTappedItems[index] = !newTappedItems[index];
    setTappedItems(newTappedItems);

    const newCount = newTappedItems.filter(Boolean).length;
    setTappedCount(newCount);

    // Auto-submit when all items are tapped
    if (newCount === problem.answer) {
      setTimeout(() => onAnswer(newCount), 500);
    }
  };

  // Reset state when problem changes
  if (tappedItems.length !== problem.visualElements.length) {
    setTappedItems(new Array(problem.visualElements.length).fill(false));
    setTappedCount(0);
  }

  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <div className={styles.questionText}>
        Touch each {problem.visualElements[0]} to count them!
      </div>

      <div className={styles.visualContainer}>
        <AnimatePresence mode="popLayout">
          {problem.visualElements.map((emoji, index) => (
            <motion.button
              key={index}
              className={styles.visualElement}
              initial={{ scale: 0, rotate: -180 }}
              animate={{ 
                scale: 1, 
                rotate: 0,
                opacity: tappedItems[index] ? 0.5 : 1,
                transform: tappedItems[index] ? 'translateY(-10px)' : 'translateY(0)'
              }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ 
                delay: index * 0.1,
                type: 'spring',
                stiffness: 200,
                damping: 15
              }}
              onClick={() => handleTap(index)}
              disabled={isChecking}
            >
              {emoji}
              {tappedItems[index] && (
                <motion.div
                  className={styles.countBadge}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  {tappedItems.slice(0, index + 1).filter(Boolean).length}
                </motion.div>
              )}
            </motion.button>
          ))}
        </AnimatePresence>
      </div>

      <div className={styles.countIndicator}>
        {tappedCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
          >
            Count: {tappedCount}
          </motion.div>
        )}
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