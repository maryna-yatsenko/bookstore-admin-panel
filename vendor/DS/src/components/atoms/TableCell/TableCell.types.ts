import type { CSSProperties, ReactNode } from 'react';
import type { BadgeColor } from '../Badge/Badge.types';
import type { StatusStatus } from '../Status/Status.types';

export type { StatusStatus };

export interface TableCellTitleProps {
  labelText?:  string;
  showLabel?:  boolean;
  showSort?:   boolean;
  sortDir?:    'asc' | 'desc' | null;
  onSort?:     () => void;
  className?:  string;
  style?:      CSSProperties;
}

export interface TableCellTitleCheckboxProps {
  checked?:       boolean;
  indeterminate?: boolean;
  onChange?:      (checked: boolean) => void;
  className?:     string;
  style?:         CSSProperties;
}

export interface TableCellTextProps {
  titleText?:    string;
  subtitle?:     boolean;
  subtitleText?: string;
  status?:       boolean;
  statusText?:   string;
  statusType?:   StatusStatus;
  image?:        boolean;
  titleWrap?:      boolean;
  title?:          string;
  /** true — auto tooltip from titleText + subtitleText; or custom content */
  tooltipContent?: boolean | ReactNode;
  className?:      string;
  style?:          CSSProperties;
}

export interface TableCellCheckboxProps {
  checked?:       boolean;
  indeterminate?: boolean;
  onChange?:      (checked: boolean) => void;
  className?:     string;
  style?:         CSSProperties;
}

export interface TableCellBadgeProps {
  badges?:         string[];
  getBadgeColor?:  (label: string, index: number) => BadgeColor;
  /** Icon rendered at the start of each badge (e.g. a status check mark, a "#" for tags) */
  getBadgeIcon?:   (label: string, index: number) => ReactNode;
  /** 'outlined' (default) or 'filled' — filled matches the colored-pill badges used for status/tags */
  badgeType?:      'outlined' | 'filled';
  className?:      string;
  style?:          CSSProperties;
}

export interface TableCellActionsProps {
  onEdit?:     () => void;
  onDelete?:   () => void;
  onMore?:     () => void;
  showDelete?: boolean;
  showMore?:   boolean;
  className?:  string;
  style?:      CSSProperties;
}
