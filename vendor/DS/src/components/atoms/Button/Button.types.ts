import type { ButtonHTMLAttributes, ReactNode } from 'react';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'transparent'
  | 'success'
  | 'error'
  | 'ghost'
  | 'link';

export type ButtonSize = 'l' | 'm' | 's';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  /** Square icon-only mode — hides label, renders leftIcon centered */
  iconOnly?: boolean;
  children?: ReactNode;
}
