import type { InputHTMLAttributes, ReactNode } from 'react';

export type InputState =
  | 'default'
  | 'hover'
  | 'focused'
  | 'typing'
  | 'entered'
  | 'success'
  | 'error'
  | 'disabled';

export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Show label above the field */
  label?: boolean;
  labelText?: string;
  /** Show info icon next to label */
  disclaimer?: boolean;
  /** Icon on the right side of the field */
  trailingIcon?: ReactNode;
  /** Helper text shown below the field in success/error states */
  supportingText?: string;
  /** Visual state override — used in Storybook */
  state?: InputState;
  className?: string;
}
