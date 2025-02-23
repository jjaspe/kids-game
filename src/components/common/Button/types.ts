export type ButtonVariant = 'primary' | 'secondary' | 'success' | 'error' | 'warning';
export type ButtonSize = 'small' | 'medium' | 'large';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  isFullWidth?: boolean;
  children: React.ReactNode;
} 