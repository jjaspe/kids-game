import { motion, AnimatePresence } from 'framer-motion';
import styles from './GameWrapper.module.css';
import { GameWrapperProps } from './types';
import { ProgressBar } from '@components/common';

export const GameWrapper = ({
  children,
  title = 'Math Champions',
  showHeader = true,
  showFooter = true,
  onBack,
  isLoading = false,
}: GameWrapperProps) => {
  const currentYear = new Date().getFullYear();

  return (
    <div className={styles.wrapper}>
      {showHeader && (
        <motion.header
          className={styles.header}
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          {onBack && (
            <button
              onClick={onBack}
              className={styles.backButton}
              aria-label="Go back"
            >
              ←
            </button>
          )}
          <h1 className={styles.title}>{title}</h1>
          <div style={{ width: 40 }} /> {/* Spacer for alignment */}
        </motion.header>
      )}

      <main className={styles.main}>
        <AnimatePresence mode="wait">
          {isLoading ? (
            <motion.div
              key="loading"
              className={styles.loading}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <ProgressBar value={100} animated height="8px" />
            </motion.div>
          ) : (
            <motion.div
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {children}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {showFooter && (
        <motion.footer
          className={styles.footer}
          initial={{ y: 100 }}
          animate={{ y: 0 }}
          transition={{ type: 'spring', damping: 20 }}
        >
          <p>© {currentYear} Math Champions. All rights reserved.</p>
        </motion.footer>
      )}
    </div>
  );
}; 