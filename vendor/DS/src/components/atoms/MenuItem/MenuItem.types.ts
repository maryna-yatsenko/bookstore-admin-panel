import type { ReactNode, HTMLAttributes } from 'react';

export type MenuItemState = 'default' | 'hover' | 'focused' | 'selected' | 'disabled' | 'danger';
export type MenuItemType = 'complex' | 'icon-button';

export interface MenuItemProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Layout: complex = icon + label + badge; icon-button = icon only (40×40) */
  type?: MenuItemType;
  /** Visual state override — useful in Storybook; hover/focused also respond to CSS pseudo-classes */
  state?: MenuItemState;
  /** Label text (complex type only) */
  label?: string;
  /** Icon element rendered in the icon slot */
  icon?: ReactNode;
  /** Show a numeric badge (complex type only) */
  badge?: boolean;
  /** Number displayed inside the badge */
  badgeCount?: number;
  /** Persistent selection state */
  selected?: boolean;
  /** Disabled state */
  disabled?: boolean;
  onClick?: () => void;
}
