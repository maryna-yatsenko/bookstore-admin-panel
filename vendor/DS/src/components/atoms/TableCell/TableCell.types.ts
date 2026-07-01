import type { CSSProperties } from 'react';
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
  titleWrap?:    boolean;
  className?:    string;
  style?:        CSSProperties;
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
