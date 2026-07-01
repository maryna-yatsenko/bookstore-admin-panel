import type { ReactNode } from 'react';

export type TooltipType     = 'hug' | 'manual';
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content:    string;
  type?:      TooltipType;
  position?:  TooltipPosition;
  open?:      boolean;
  children:   ReactNode;
  className?: string;
}
