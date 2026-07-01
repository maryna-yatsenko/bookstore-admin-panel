export interface RadioButtonProps {
  selected?: boolean;
  label?: string;
  disabled?: boolean;
  name?: string;
  value?: string;
  onChange?: (value: string) => void;
  className?: string;
}
