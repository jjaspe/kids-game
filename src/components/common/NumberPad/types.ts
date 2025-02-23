export interface NumberPadProps {
  onNumberSelect: (number: number) => void;
  onDelete?: () => void;
  onSubmit?: () => void;
  disabled?: boolean;
  maxLength?: number;
  currentValue?: string;
} 