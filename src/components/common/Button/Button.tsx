import { forwardRef } from 'react';
import styles from './Button.module.css';
import { ButtonProps } from './types';
import clsx from 'clsx';

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'medium',
      isLoading = false,
      isFullWidth = false,
      className,
      disabled,
      children,
      ...props
    },
    ref
  ) => {
    const buttonClasses = clsx(
      styles.button,
      styles[variant],
      styles[size],
      {
        [styles.fullWidth]: isFullWidth,
        [styles.loading]: isLoading,
        [styles.disabled]: disabled
      },
      className
    );

    return (
      <button
        ref={ref}
        className={buttonClasses}
        disabled={disabled || isLoading}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button'; 