import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type FunctionalButtonState = 'default' | 'hover' | 'focused' | 'selected' | 'disabled';

export interface FunctionalButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  icon?: ReactNode;
  label?: string;
  state?: FunctionalButtonState;
  className?: string;
}
