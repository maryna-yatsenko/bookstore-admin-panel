import type { ReactNode } from 'react';

export type TabItemState = 'default' | 'hover' | 'focused' | 'selected' | 'disabled';

export interface TabItemProps {
  value: string;
  children: ReactNode;
  /** Icon on the left side (20×20) */
  leadingIcon?: ReactNode;
  /** Icon on the right side (20×20) */
  trailingIcon?: ReactNode;
  /** Badge count shown after trailing icon */
  badge?: number | string;
  disabled?: boolean;
  /** Visual state override — used in Storybook to force hover/focused/selected/disabled */
  state?: TabItemState;
  /** External click handler — used when TabItem is rendered outside TabGroup (e.g. SegmentedControl) */
  onClick?: () => void;
  className?: string;
}

export interface TabGroupProps {
  value: string;
  onChange: (value: string) => void;
  children: ReactNode;
  className?: string;
  /** Accessible label for the tablist */
  label?: string;
}
