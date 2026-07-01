export type BadgeColor = 'blue' | 'lilac' | 'green' | 'orange' | 'red' | 'pink' | 'gray' | 'white';
export type BadgeType = 'outlined' | 'filled';

export interface BadgeProps {
  color?: BadgeColor;
  type?: BadgeType;
  labelText?: string;
  leftIcon?: boolean;
  rightIcon?: boolean;
  className?: string;
}
