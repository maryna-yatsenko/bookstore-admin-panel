import type { ReactNode } from 'react';

export type SegmentState = 'default' | 'hover' | 'focused' | 'selected' | 'disabled';

export interface SegmentOption {
  value: string;
  label: ReactNode;
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  badge?: number | string;
  disabled?: boolean;
  /** Visual state override — used in Storybook to force hover/focused on a segment */
  stateOverride?: 'hover' | 'focused';
}

export interface SegmentedControlProps {
  value: string;
  onChange: (value: string) => void;
  options: SegmentOption[];
  className?: string;
  /** aria-label for the radiogroup */
  label?: string;
}
