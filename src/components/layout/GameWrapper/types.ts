export interface GameWrapperProps {
  children: React.ReactNode;
  title?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  onBack?: () => void;
  onExit?: () => void;
  isLoading?: boolean;
}
