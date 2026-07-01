import type { ReactNode } from 'react';

export type DropdownItemType = 'default' | 'complex';
export type DropdownItemState = 'default' | 'hover' | 'focused' | 'selected' | 'disabled';

export interface DropdownItemProps {
  /** Visual state override — used in Storybook to force hover/focused/selected/disabled */
  state?: DropdownItemState;
  /** Layout variant: "default" = text+icons row; "complex" = avatar + name + position */
  type?: DropdownItemType;
  /** Main label (default type) or name (complex type) */
  children: ReactNode;
  /** Subtitle shown below the name (complex type only) */
  position?: string;
  /** Custom avatar content for complex type; falls back to a gray circle */
  avatar?: ReactNode;
  /** Leading icon (default type, 20×20) */
  leadingIcon?: ReactNode;
  /** Trailing icon (default type, 20×20) */
  trailingIcon?: ReactNode;
  /** Badge label — renders with mint styling by default */
  badge?: ReactNode;
  /** Badge color: 'mint' (default) or 'gray' */
  badgeVariant?: 'mint' | 'gray';
  /** Marks the item as the currently selected option */
  isSelected?: boolean;
  disabled?: boolean;
  onClick?: () => void;
  className?: string;
}
