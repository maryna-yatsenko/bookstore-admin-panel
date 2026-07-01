export interface CheckboxProps {
  checked?: boolean;
  indeterminate?: boolean;
  label?: string;
  disabled?: boolean;
  onChange?: (checked: boolean) => void;
  className?: string;
}
