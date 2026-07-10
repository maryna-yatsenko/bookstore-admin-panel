import type { ReactNode } from 'react';

export type BadgeColor = 'blue' | 'lilac' | 'green' | 'orange' | 'red' | 'pink' | 'gray' | 'white';
export type BadgeType = 'outlined' | 'filled';

export interface BadgeProps {
  color?: BadgeColor;
  type?: BadgeType;
  labelText?: string;
  leftIcon?: boolean;
  rightIcon?: boolean;
  /** Custom icon to render in place of the default dot when leftIcon/rightIcon is set */
  icon?: ReactNode;
  className?: string;
}
