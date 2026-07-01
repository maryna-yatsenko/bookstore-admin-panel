import { useState } from 'react';
import type { CalendarProps } from './Calendar.types';
import styles from './Calendar.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

/* ── Constants ────────────────────────────────────────────────────────────── */
const WEEKDAYS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];
const MONTHS   = ['January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'];

/* ── Helpers ──────────────────────────────────────────────────────────────── */
const sod = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();

function sameDay(a: Date, b: Date) { return sod(a) === sod(b); }

function buildGrid(year: number, month: number): Date[][] {
  const startDay  = new Date(year, month, 1).getDay();
  const gridStart = new Date(year, month, 1 - startDay);
  const cells: Date[] = [];
  for (let i = 0; i < 42; i++) {
    cells.push(new Date(gridStart.getFullYear(), gridStart.getMonth(), gridStart.getDate() + i));
  }
  const weeks: Date[][] = [];
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7));
  if (weeks[5].every(d => d.getMonth() !== month)) weeks.pop();
  return weeks;
}

/* ── Navigation icons ─────────────────────────────────────────────────────── */
const IconPrevYear  = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M8.5 4.5L5 8l3.5 3.5M11.5 4.5L8 8l3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconPrevMonth = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M10 4.5L6.5 8 10 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconNextMonth = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M6 4.5L9.5 8 6 11.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconNextYear  = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <path d="M7.5 4.5L11 8l-3.5 3.5M4.5 4.5L8 8l-3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

/* ── Component ────────────────────────────────────────────────────────────── */
export function Calendar({
  mode        = 'range',
  value,
  rangeStart,
  rangeEnd,
  onChange,
  onRangeChange,
  onApply,
  className,
  style,
}: CalendarProps) {
  const today = new Date();
  const initDate = (mode === 'single' ? value : rangeStart) ?? today;
  const [viewYear,  setViewYear]  = useState(() => initDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(() => initDate.getMonth());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);

  const grid = buildGrid(viewYear, viewMonth);

  /* ── Navigation ─────────────────────────────────────────────────────────── */
  const prevYear  = () => setViewYear(y => y - 1);
  const nextYear  = () => setViewYear(y => y + 1);
  const prevMonth = () => {
    if (viewMonth === 0) { setViewYear(y => y - 1); setViewMonth(11); }
    else setViewMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewYear(y => y + 1); setViewMonth(0); }
    else setViewMonth(m => m + 1);
  };

  /* ── Click ───────────────────────────────────────────────────────────────── */
  const handleClick = (date: Date) => {
    if (mode === 'single') {
      onChange?.(date);
      return;
    }
    if (!rangeStart || (rangeStart && rangeEnd)) {
      onRangeChange?.(date, null);
    } else {
      const [lo, hi] = sod(date) < sod(rangeStart)
        ? [date, rangeStart]
        : [rangeStart, date];
      onRangeChange?.(lo, hi);
    }
  };

  /* ── Day state ───────────────────────────────────────────────────────────── */
  const getDayClass = (date: Date): string => {
    const inMonth = date.getMonth() === viewMonth && date.getFullYear() === viewYear;
    if (!inMonth) return styles.outside;

    if (mode === 'single') {
      if (value && sameDay(date, value)) return styles.selected;
      if (sameDay(date, today)) return cx(styles.today) as string;
      return '';
    }

    // range mode
    if (rangeStart && sameDay(date, rangeStart)) return styles.rangeStart;
    if (rangeEnd   && sameDay(date, rangeEnd))   return styles.rangeEnd;

    const previewEnd = rangeStart && !rangeEnd && hoverDate ? hoverDate : null;
    const effectiveEnd = rangeEnd ?? previewEnd;

    if (rangeStart && effectiveEnd) {
      const lo = sod(rangeStart) <= sod(effectiveEnd) ? rangeStart : effectiveEnd;
      const hi = sod(rangeStart) <= sod(effectiveEnd) ? effectiveEnd : rangeStart;
      if (sod(date) > sod(lo) && sod(date) < sod(hi)) return styles.inRange;
    }

    if (sameDay(date, today)) return styles.today;
    return '';
  };

  return (
    <div className={cx(styles.calendar, className)} style={style}>
      <div className={styles.body}>

        {/* ── Header ───────────────────────────────────────────────────────── */}
        <div className={styles.header}>
          <button className={styles.navBtn} onClick={prevYear}  aria-label="Previous year">
            <IconPrevYear />
          </button>
          <button className={styles.navBtn} onClick={prevMonth} aria-label="Previous month">
            <IconPrevMonth />
          </button>
          <span className={styles.monthLabel}>
            {MONTHS[viewMonth]} {viewYear}
          </span>
          <button className={styles.navBtn} onClick={nextMonth} aria-label="Next month">
            <IconNextMonth />
          </button>
          <button className={styles.navBtn} onClick={nextYear}  aria-label="Next year">
            <IconNextYear />
          </button>
        </div>

        {/* ── Grid ─────────────────────────────────────────────────────────── */}
        <div className={styles.grid}>

          {/* Weekday labels */}
          <div className={styles.week}>
            {WEEKDAYS.map(wd => (
              <div key={wd} className={cx(styles.day, styles.weekday)}>
                {wd}
              </div>
            ))}
          </div>

          {/* Day rows */}
          {grid.map((week, wi) => (
            <div key={wi} className={styles.week}>
              {week.map((date, di) => {
                const extraClass = getDayClass(date);
                const isOutside  = extraClass === styles.outside;
                return (
                  <button
                    key={di}
                    className={cx(styles.day, extraClass)}
                    onClick={() => !isOutside && handleClick(date)}
                    onMouseEnter={() => setHoverDate(date)}
                    onMouseLeave={() => setHoverDate(null)}
                    tabIndex={isOutside ? -1 : 0}
                    aria-label={date.toLocaleDateString('en-US', {
                      year: 'numeric', month: 'long', day: 'numeric',
                    })}
                  >
                    {date.getDate()}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      {/* ── Apply button ─────────────────────────────────────────────────────── */}
      <button className={styles.applyBtn} onClick={onApply}>
        Apply
      </button>
    </div>
  );
}
