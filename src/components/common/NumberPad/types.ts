export interface NumberPadProps {
  onNumberSelect: (number: number) => void;
  onDelete?: () => void;
  onSubmit?: (value: number) => void;
  disabled?: boolean;
  maxLength?: number;
  currentValue?: string;
}
