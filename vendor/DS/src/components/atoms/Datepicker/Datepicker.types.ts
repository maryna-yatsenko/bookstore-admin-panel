export interface DateRange {
  start?: Date;
  end?: Date;
}

export type DatepickerState = 'default' | 'hover' | 'focused' | 'selected' | 'disabled';

export interface DatepickerProps {
  value?: DateRange;
  onChange?: (range: DateRange) => void;
  /** Label text above the trigger */
  label?: string;
  /** Placeholder when no date is selected */
  placeholder?: string;
  disabled?: boolean;
  /** Start with calendar open (for Storybook) */
  defaultOpen?: boolean;
  /** Selects a full Mon–Sun week on click instead of individual days */
  weekMode?: boolean;
  /** Visual state override — used in Storybook to force hover/focused/selected/disabled */
  state?: DatepickerState;
  className?: string;
}
