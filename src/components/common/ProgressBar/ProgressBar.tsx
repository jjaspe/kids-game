import styles from './ProgressBar.module.css';
import { ProgressBarProps } from './types';
import clsx from 'clsx';

export const ProgressBar = ({
  value,
  max = 100,
  showLabel = false,
  color,
  height = '12px',
  animated = true,
  className,
}: ProgressBarProps) => {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  return (
    <div
      className={clsx(styles.container, className)}
      style={{ height }}
      role="progressbar"
      aria-valuenow={value}
      aria-valuemin={0}
      aria-valuemax={max}
    >
      <div
        className={clsx(styles.progress, {
          [styles.animated]: animated,
        })}
        style={{
          width: `${percentage}%`,
          backgroundColor: color,
        }}
      >
        {showLabel && (
          <span className={styles.label}>{Math.round(percentage)}%</span>
        )}
      </div>
    </div>
  );
}; 