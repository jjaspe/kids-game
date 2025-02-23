import clsx from 'clsx';
import { motion } from 'framer-motion';
import styles from './MathRace.module.css';
import { AvatarProps } from './types';

export const Avatar = ({ progress, isMoving, character = '🏃' }: AvatarProps) => {
  return (
    <motion.div
      className={clsx(styles.avatar, { [styles.isMoving]: isMoving })}
      style={{ left: `${progress}%` }}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', damping: 12 }}
    >
      <div className={styles.avatarContent}>
        {character}
      </div>
      <div className={clsx(styles.streakCounter, { [styles.hasStreak]: isMoving })}>
        🔥
      </div>
    </motion.div>
  );
}; 