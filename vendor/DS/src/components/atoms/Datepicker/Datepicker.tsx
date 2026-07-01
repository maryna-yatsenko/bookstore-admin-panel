import { useState, useRef, useEffect } from 'react';
import type { DatepickerProps, DateRange } from './Datepicker.types';
import styles from './Datepicker.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];

function formatDate(d: Date): string {
  return `${String(d.getDate()).padStart(2, '0')}.${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function isSameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate();
}

function startOfDay(d: Date) {
  return new Date(d.getFullYear(), d.getMonth(), d.getDate());
}

const CalendarIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3 8H17" stroke="currentColor" strokeWidth="1.5" />
    <path d="M7 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <path d="M13 2V5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const ChevronDoubleLeft = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="16" height="16">
    <path d="M9 11L6 8L9 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M13 11L10 8L13 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronLeft = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="16" height="16">
    <path d="M10 11L7 8L10 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronRight = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="16" height="16">
    <path d="M6 11L9 8L6 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ChevronDoubleRight = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true" width="16" height="16">
    <path d="M7 11L10 8L7 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M3 11L6 8L3 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

function getWeekRange(date: Date): { start: Date; end: Date } {
  const day = date.getDay();
  const monday = new Date(date);
  monday.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
  monday.setHours(0, 0, 0, 0);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  sunday.setHours(0, 0, 0, 0);
  return { start: monday, end: sunday };
}

function buildCalendarDays(year: number, month: number): (Date | null)[] {
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const prevMonthDays = new Date(year, month, 0).getDate();

  const cells: (Date | null)[] = [];

  // Trailing days from previous month
  for (let i = firstDay - 1; i >= 0; i--) {
    cells.push(new Date(year, month - 1, prevMonthDays - i));
  }
  // Current month
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(new Date(year, month, d));
  }
  // Leading days from next month — fill to complete weeks
  const remaining = cells.length % 7 === 0 ? 0 : 7 - (cells.length % 7);
  for (let d = 1; d <= remaining; d++) {
    cells.push(new Date(year, month + 1, d));
  }

  return cells;
}

export function Datepicker({
  value,
  onChange,
  label,
  placeholder = '00.00 — 00.00',
  disabled = false,
  defaultOpen = false,
  state,
  className,
  weekMode = false,
}: DatepickerProps) {
  const effectiveDisabled = disabled || state === 'disabled';
  const now = new Date();
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [displayYear, setDisplayYear] = useState(value?.start?.getFullYear() ?? now.getFullYear());
  const [displayMonth, setDisplayMonth] = useState(value?.start?.getMonth() ?? now.getMonth());
  const [pending, setPending] = useState<DateRange>(value ?? {});
  const [phase, setPhase] = useState<'start' | 'end'>('start');
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const onOutside = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [isOpen]);

  const toggle = () => {
    if (effectiveDisabled) return;
    if (!isOpen) {
      setPending(value ?? {});
      setPhase('start');
    }
    setIsOpen((v) => !v);
  };

  const handleDayClick = (date: Date) => {
    if (weekMode) {
      const { start, end } = getWeekRange(date);
      setPending({ start, end });
      return;
    }
    if (phase === 'start') {
      setPending({ start: startOfDay(date) });
      setPhase('end');
    } else {
      const start = pending.start!;
      const end = startOfDay(date);
      if (end < start) {
        setPending({ start: end, end: start });
      } else {
        setPending({ start, end });
      }
      setPhase('start');
    }
  };

  const apply = () => {
    onChange?.(pending);
    setIsOpen(false);
  };

  const prevYear = () => {
    if (displayMonth === 0) { setDisplayYear((y) => y - 1); setDisplayMonth(11); }
    else setDisplayMonth((m) => m - 1);
  };

  const prevMonth = () => prevYear();

  const nextMonth = () => {
    if (displayMonth === 11) { setDisplayYear((y) => y + 1); setDisplayMonth(0); }
    else setDisplayMonth((m) => m + 1);
  };

  const prevYearOnly = () => setDisplayYear((y) => y - 1);
  const nextYearOnly = () => setDisplayYear((y) => y + 1);

  const days = buildCalendarDays(displayYear, displayMonth);
  const weeks: (Date | null)[][] = [];
  for (let i = 0; i < days.length; i += 7) weeks.push(days.slice(i, i + 7));

  const getDayClass = (date: Date | null, colMonth: boolean) => {
    if (!date) return styles.day;
    if (!colMonth) return cx(styles.day, styles.dayOutside);

    const d = startOfDay(date);

    if (weekMode) {
      const selStart = pending.start ? startOfDay(pending.start) : null;
      const selEnd = pending.end ? startOfDay(pending.end) : null;

      if (selStart && selEnd) {
        if (isSameDay(d, selStart)) return cx(styles.day, styles.dayStart);
        if (isSameDay(d, selEnd)) return cx(styles.day, styles.dayEnd);
        if (d > selStart && d < selEnd) return cx(styles.day, styles.dayInRange);
      }

      if (hoverDate) {
        const { start: hStart, end: hEnd } = getWeekRange(hoverDate);
        if (isSameDay(d, hStart)) return cx(styles.day, styles.dayStart);
        if (isSameDay(d, hEnd)) return cx(styles.day, styles.dayEnd);
        if (d > hStart && d < hEnd) return cx(styles.day, styles.dayInRange);
      }

      return styles.day;
    }

    const start = pending.start ? startOfDay(pending.start) : null;
    const end = pending.end ? startOfDay(pending.end) : null;
    const hover = hoverDate ? startOfDay(hoverDate) : null;

    if (start && end) {
      if (isSameDay(d, start) && isSameDay(d, end)) return cx(styles.day, styles.dayStartEnd);
      if (isSameDay(d, start)) return cx(styles.day, styles.dayStart);
      if (isSameDay(d, end)) return cx(styles.day, styles.dayEnd);
      if (d > start && d < end) return cx(styles.day, styles.dayInRange);
    } else if (start && phase === 'end') {
      if (isSameDay(d, start)) return cx(styles.day, styles.dayStart);
      if (hover) {
        const rangeEnd = hover > start ? hover : start;
        const rangeStart = hover > start ? start : hover;
        if (isSameDay(d, hover) && hover > start) return cx(styles.day, styles.dayEnd);
        if (isSameDay(d, hover) && hover < start) return cx(styles.day, styles.dayStart);
        if (d > rangeStart && d < rangeEnd) return cx(styles.day, styles.dayInRange);
      }
    } else if (start && isSameDay(d, start)) {
      return cx(styles.day, styles.dayStartEnd);
    }

    return styles.day;
  };

  const displayValue = value?.start
    ? value.end
      ? `${formatDate(value.start)} — ${formatDate(value.end)}`
      : formatDate(value.start)
    : null;

  return (
    <div ref={rootRef} className={cx(styles.root, className)}>
      {label && <span className={styles.label}>{label}</span>}

      <div
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-disabled={effectiveDisabled}
        tabIndex={effectiveDisabled ? -1 : 0}
        className={cx(
          styles.trigger,
          isOpen && styles.open,
          effectiveDisabled && styles.disabled,
          !isOpen && state === 'hover' && styles.stateHover,
          !isOpen && state === 'focused' && styles.stateFocused,
        )}
        onClick={toggle}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
          if (e.key === 'Escape') setIsOpen(false);
        }}
      >
        <span className={cx(styles.dateText, !displayValue && styles.placeholder)}>
          {displayValue ?? placeholder}
        </span>
        <span className={styles.calIcon}>
          <CalendarIcon />
        </span>
      </div>

      {isOpen && (
        <div className={styles.panel} role="dialog" aria-label="Date picker">
          <div className={styles.calBody}>
            {/* Month navigation */}
            <div className={styles.monthHeader}>
              <div className={styles.navGroup}>
                <button className={styles.navBtn} onClick={prevYearOnly} aria-label="Previous year">
                  <ChevronDoubleLeft />
                </button>
                <button className={styles.navBtn} onClick={prevMonth} aria-label="Previous month">
                  <ChevronLeft />
                </button>
              </div>
              <span className={styles.monthTitle}>
                {MONTHS[displayMonth]} {displayYear}
              </span>
              <div className={styles.navGroup}>
                <button className={styles.navBtn} onClick={nextMonth} aria-label="Next month">
                  <ChevronRight />
                </button>
                <button className={styles.navBtn} onClick={nextYearOnly} aria-label="Next year">
                  <ChevronDoubleRight />
                </button>
              </div>
            </div>

            {/* Days grid */}
            <div className={styles.days}>
              {/* Weekday header */}
              <div className={styles.week}>
                {WEEKDAYS.map((wd) => (
                  <div key={wd} className={styles.weekday}>{wd}</div>
                ))}
              </div>

              {/* Day rows */}
              {weeks.map((week, wi) => (
                <div key={wi} className={styles.week}>
                  {week.map((date, di) => {
                    const inMonth = date?.getMonth() === displayMonth;
                    return (
                      <div
                        key={di}
                        className={getDayClass(date, !!inMonth)}
                        onClick={() => date && inMonth && handleDayClick(date)}
                        onMouseEnter={() => date && inMonth && setHoverDate(date)}
                        onMouseLeave={() => setHoverDate(null)}
                      >
                        {date?.getDate()}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>

          <button className={styles.applyBtn} onClick={apply}>
            Apply
          </button>
        </div>
      )}
    </div>
  );
}
