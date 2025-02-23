import { motion } from 'framer-motion';
import styles from './MathRace.module.css';
import { RaceTrackProps } from './types';

export const RaceTrack = ({ children, milestones = [25, 50, 75] }: RaceTrackProps) => {
  return (
    <motion.div
      className={styles.raceTrack}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ type: 'spring', damping: 20 }}
    >
      <div className={styles.milestones}>
        {milestones.map((milestone) => (
          <div
            key={milestone}
            className={styles.milestone}
            style={{ left: `${milestone}%` }}
          />
        ))}
      </div>
      {children}
    </motion.div>
  );
}; 