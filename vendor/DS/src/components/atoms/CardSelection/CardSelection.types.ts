export interface CardSelectionProps {
  titleText?: string;
  subtitleText?: string;
  state?: 'default' | 'hover' | 'focused' | 'selected' | 'disabled';
  onChange?: (selected: boolean) => void;
  className?: string;
}
