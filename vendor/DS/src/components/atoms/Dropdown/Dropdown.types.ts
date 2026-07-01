import type { ReactNode } from 'react';

export type DropdownSize = 'xl' | 'm' | 's';
export type DropdownState = 'default' | 'hover' | 'focused' | 'selected' | 'disabled';

export interface DropdownOption {
  value: string;
  /** Text label shown in trigger and panel (M / S type) */
  label?: string;
  /** Leading icon passed to DropdownItem (default type) */
  leadingIcon?: ReactNode;
  /** Trailing icon passed to DropdownItem (default type) */
  trailingIcon?: ReactNode;
  /** Badge rendered inside the DropdownItem panel row (default type) */
  badge?: ReactNode;
  /** Badge color: 'mint' (default) or 'gray' */
  badgeVariant?: 'mint' | 'gray';
  /** Name shown in trigger and panel (XL complex type) */
  name?: string;
  /** Subtitle shown below the name (XL complex type) */
  position?: string;
  /** Custom avatar content for XL complex type */
  avatar?: ReactNode;
  disabled?: boolean;
}

export interface DropdownProps {
  /** XL = 46px complex (avatar+name+position); M = 32px simple; S = 24px simple */
  size?: DropdownSize;
  /** Visual state override — used in Storybook to force hover/focused/selected/disabled */
  state?: DropdownState;
  /** Currently selected option value */
  value?: string;
  onChange?: (value: string) => void;
  options?: DropdownOption[];
  /** Placeholder shown when no option is selected */
  placeholder?: string;
  /** Label text above the trigger (M and S only) */
  label?: string;
  disabled?: boolean;
  /** Start with panel open (useful for storybook/testing) */
  defaultOpen?: boolean;
  className?: string;
}
