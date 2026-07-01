import type { CSSProperties } from 'react';

export type CalendarMode = 'single' | 'range';

export interface CalendarProps {
  mode?:           CalendarMode;
  value?:          Date | null;
  rangeStart?:     Date | null;
  rangeEnd?:       Date | null;
  onChange?:       (date: Date) => void;
  onRangeChange?:  (start: Date | null, end: Date | null) => void;
  onApply?:        () => void;
  className?:      string;
  style?:          CSSProperties;
}
