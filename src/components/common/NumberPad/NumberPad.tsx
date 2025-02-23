import clsx from 'clsx';
import { useCallback } from 'react';
import styles from './NumberPad.module.css';
import { NumberPadProps } from './types';

export const NumberPad = ({
  onNumberSelect,
  onDelete,
  onSubmit,
  disabled = false,
  maxLength = 10,
  currentValue = '',
}: NumberPadProps) => {
  const handleNumberClick = useCallback(
    (number: number) => {
      if (currentValue.length < maxLength) {
        onNumberSelect(number);
      }
    },
    [currentValue, maxLength, onNumberSelect]
  );

  return (
    <div className={styles.numberPad}>
      {/* Numbers 1-9 */}
      {Array.from({ length: 9 }, (_, i) => i + 1).map((number) => (
        <button
          key={number}
          className={styles.button}
          onClick={() => handleNumberClick(number)}
          disabled={disabled}
          type="button"
          aria-label={`Number ${number}`}
          style={{
            gridColumn: ((number - 1) % 3) + 1,
            gridRow: Math.ceil(number / 3)
          }}
        >
          {number}
        </button>
      ))}

      {/* Delete button */}
      {onDelete && (
        <button
          className={clsx(styles.button, styles.delete)}
          onClick={onDelete}
          disabled={disabled}
          type="button"
          aria-label="Delete"
        >
          ←
        </button>
      )}

      {/* Zero button */}
      <button
        className={clsx(styles.button, styles.zero)}
        onClick={() => handleNumberClick(0)}
        disabled={disabled}
        type="button"
        aria-label="Number 0"
      >
        0
      </button>

      {/* Submit button */}
      {onSubmit && (
        <button
          className={clsx(styles.button, styles.submit)}
          onClick={onSubmit}
          disabled={disabled || !currentValue}
          type="button"
          aria-label="Submit"
        >
          Enter
        </button>
      )}
    </div>
  );
}; 