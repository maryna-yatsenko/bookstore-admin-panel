import type { ReactNode } from 'react';
import type { IconName } from '../Icon';

export interface SidebarNavItem {
  id: string;
  icon: IconName;
  label: string;
  badge?: number;
  selected?: boolean;
  danger?: boolean;
  onClick?: () => void;
}

export interface SidebarUser {
  initials: string;
  name: string;
  role: string;
}

export interface SidebarProps {
  /** Collapsed (icon-only) mode */
  folded?: boolean;
  /** Called when fold/unfold button is clicked */
  onToggleFold?: () => void;
  /** Logo element — rendered as 40×40 image/icon */
  logo?: ReactNode;
  /** Application name shown in expanded mode */
  appName?: string;
  /** Primary navigation items */
  navItems?: SidebarNavItem[];
  /** Bottom utility items (Settings, Help…) */
  bottomItems?: SidebarNavItem[];
  /** Logged-in user info */
  user?: SidebarUser;
  /** Called when Log out is clicked */
  onLogout?: () => void;
  className?: string;
}
