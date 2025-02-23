import { Button } from '@components/common';
import { motion } from 'framer-motion';
import styles from './GameModeSelect.module.css';

interface GameModeSelectProps {
  onSelectMode: (mode: 'single' | 'battle') => void;
  canBattle?: boolean;
}

export const GameModeSelect = ({ onSelectMode, canBattle = false }: GameModeSelectProps) => {
  return (
    <motion.div
      className={styles.container}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <h1 className={styles.title}>Choose Game Mode</h1>
      
      <div className={styles.buttons}>
        <Button
          variant="primary"
          size="large"
          onClick={() => onSelectMode('single')}
          className={styles.button}
        >
          <div className={styles.buttonContent}>
            <span className={styles.emoji}>🦊</span>
            <span>Single Player</span>
          </div>
        </Button>

        {canBattle && (
          <Button
            variant="secondary"
            size="large"
            onClick={() => onSelectMode('battle')}
            className={styles.button}
          >
            <div className={styles.buttonContent}>
              <span className={styles.emoji}>⚔️</span>
              <span>Battle Mode</span>
            </div>
          </Button>
        )}
      </div>
    </motion.div>
  );
}; 