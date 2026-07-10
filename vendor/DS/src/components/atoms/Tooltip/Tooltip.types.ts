import type { ReactNode } from 'react';

export type TooltipType     = 'hug' | 'manual';
export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

export interface TooltipProps {
  content:    ReactNode;
  type?:      TooltipType;
  position?:  TooltipPosition;
  open?:      boolean;
  portal?:    boolean;
  children:   ReactNode;
  className?: string;
}
