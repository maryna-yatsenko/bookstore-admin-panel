import type { InputHTMLAttributes } from 'react';

export type SearchInputState =
  | 'default'
  | 'hover'
  | 'focused'
  | 'typing'
  | 'entered'
  | 'disabled';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  /** Visual state override — used in Storybook */
  state?: SearchInputState;
  className?: string;
}
