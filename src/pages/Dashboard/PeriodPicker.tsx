import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';

export type PeriodMode = 'week' | 'month' | 'year';

export interface PeriodValue {
  mode: PeriodMode;
  label: string;
  date: Date;
}

/* ── helpers ──────────────────────────────────────────────────────────────── */

function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = date.getDay();
  date.setDate(date.getDate() - (day === 0 ? 6 : day - 1));
  date.setHours(0, 0, 0, 0);
  return date;
}

const MONTHS_UA       = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MONTHS_UA_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const WEEKDAYS        = ['Mo','Tu','We','Th','Fr','Sa','Su'];

function weekLabel(monday: Date, todayMonday: Date): string {
  if (monday.getTime() === todayMonday.getTime()) return 'This week';
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const p = (n: number) => n.toString().padStart(2, '0');
  const ms = MONTHS_UA_SHORT[monday.getMonth()];
  const ss = MONTHS_UA_SHORT[sunday.getMonth()];
  if (monday.getMonth() === sunday.getMonth()) return `${p(monday.getDate())}–${p(sunday.getDate())} ${ms}`;
  return `${p(monday.getDate())} ${ms} – ${p(sunday.getDate())} ${ss}`;
}

/* ── component ────────────────────────────────────────────────────────────── */

export function PeriodPicker({ value, onChange, className }: {
  value: PeriodValue;
  onChange: (v: PeriodValue) => void;
  className?: string;
}) {
  const [open,       setOpen]       = useState(false);
  const [mode,       setMode]       = useState<PeriodMode>(value.mode);
  const [viewDate,   setViewDate]   = useState(() => new Date());
  const [hoveredWi,  setHoveredWi]  = useState<number | null>(null);
  const [popPos,     setPopPos]     = useState({ top: 0, right: 0 });

  const btnRef = useRef<HTMLButtonElement>(null);
  const popRef = useRef<HTMLDivElement>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayMonday = getMonday(today);

  /* close on outside click */
  useEffect(() => {
    if (!open) return;
    const h = (e: MouseEvent) => {
      if (
        popRef.current && !popRef.current.contains(e.target as Node) &&
        btnRef.current && !btnRef.current.contains(e.target as Node)
      ) setOpen(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, [open]);

  const handleOpen = () => {
    if (btnRef.current) {
      const r = btnRef.current.getBoundingClientRect();
      setPopPos({ top: r.bottom + 6, right: window.innerWidth - r.right });
    }
    setMode(value.mode);
    setViewDate(new Date());
    setOpen(v => !v);
  };

  /* navigation */
  const prevView = () => setViewDate(d => {
    const n = new Date(d);
    if (mode === 'week')  n.setMonth(n.getMonth() - 1);
    else if (mode === 'month') n.setFullYear(n.getFullYear() - 1);
    else n.setFullYear(n.getFullYear() - 12);
    return n;
  });

  const nextView = () => setViewDate(d => {
    const n = new Date(d);
    if (mode === 'week') {
      const next = new Date(d.getFullYear(), d.getMonth() + 1, 1);
      if (next > today) return d;
      n.setMonth(n.getMonth() + 1);
    } else if (mode === 'month') {
      if (d.getFullYear() >= today.getFullYear()) return d;
      n.setFullYear(n.getFullYear() + 1);
    } else {
      const s = Math.floor(d.getFullYear() / 12) * 12;
      if (s + 12 > today.getFullYear()) return d;
      n.setFullYear(n.getFullYear() + 12);
    }
    return n;
  });

  const viewLabel = () => {
    if (mode === 'week')  return `${MONTHS_UA[viewDate.getMonth()]} ${viewDate.getFullYear()}`;
    if (mode === 'month') return viewDate.getFullYear().toString();
    const s = Math.floor(viewDate.getFullYear() / 12) * 12;
    return `${s}–${s + 11}`;
  };

  /* ── week calendar ──────────────────────────────────────────────────────── */
  const renderWeekView = () => {
    const year  = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const startMonday = getMonday(new Date(year, month, 1));

    const weeks: Date[][] = [];
    const cur = new Date(startMonday);
    for (let w = 0; w < 7; w++) {
      const week = Array.from({ length: 7 }, () => { const d = new Date(cur); cur.setDate(cur.getDate() + 1); return d; });
      weeks.push(week);
      if (w >= 3 && week[0].getMonth() !== month && week[6].getMonth() !== month) break;
    }

    const selMonday = value.mode === 'week' ? getMonday(value.date) : null;

    return (
      <table style={{ borderCollapse: 'separate', borderSpacing: 0, width: '100%', tableLayout: 'fixed' }}>
        <thead>
          <tr>
            {WEEKDAYS.map(d => (
              <th key={d} style={{ fontSize: 11, fontWeight: 500, color: 'var(--text-tertiary)', textAlign: 'center', paddingBottom: 4, fontFamily: 'var(--font-family-sans)' }}>
                {d}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {weeks.map((week, wi) => {
            const monday = week[0];
            const isSelected  = selMonday !== null && monday.getTime() === selMonday.getTime();
            const isFutureRow = monday > today;
            const isHovered   = hoveredWi === wi && !isFutureRow;
            const rowBg = isSelected ? 'rgba(255,190,31,0.18)' : isHovered ? 'var(--container-secondary)' : 'transparent';

            return (
              <tr
                key={wi}
                style={{ cursor: isFutureRow ? 'not-allowed' : 'pointer' }}
                onMouseEnter={() => { if (!isFutureRow) setHoveredWi(wi); }}
                onMouseLeave={() => setHoveredWi(null)}
                onClick={() => {
                  if (isFutureRow) return;
                  onChange({ mode: 'week', label: weekLabel(monday, todayMonday), date: monday });
                  setOpen(false);
                }}
              >
                {week.map((day, di) => {
                  const isOtherMonth = day.getMonth() !== month;
                  const isFuture    = day > today;
                  const isToday     = day.toDateString() === today.toDateString();
                  return (
                    <td key={di} style={{
                      textAlign: 'center',
                      padding: '5px 0',
                      fontSize: 13,
                      fontFamily: 'var(--font-family-sans)',
                      color: isFuture ? 'var(--text-disabled)' : isOtherMonth ? 'var(--text-tertiary)' : 'var(--text-primary)',
                      fontWeight: isToday ? 700 : 400,
                      background: rowBg,
                      borderRadius: di === 0 ? '6px 0 0 6px' : di === 6 ? '0 6px 6px 0' : 0,
                    }}>
                      {day.getDate()}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  /* ── month grid ─────────────────────────────────────────────────────────── */
  const renderMonthView = () => {
    const year  = viewDate.getFullYear();
    const curY  = today.getFullYear();
    const curM  = today.getMonth();
    const selM  = value.mode === 'month' && value.date.getFullYear() === year ? value.date.getMonth() : null;

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
        {MONTHS_UA_SHORT.map((m, mi) => {
          const isFuture   = year > curY || (year === curY && mi > curM);
          const isSelected = mi === selM;
          const isCurrent  = year === curY && mi === curM;
          return (
            <button key={m} disabled={isFuture} onClick={() => {
              const d = new Date(year, mi, 1);
              onChange({ mode: 'month', label: isCurrent ? 'This month' : `${m} ${year}`, date: d });
              setOpen(false);
            }} style={{
              border: 'none', borderRadius: 6, padding: '8px 6px',
              fontSize: 13, fontFamily: 'var(--font-family-sans)',
              cursor: isFuture ? 'default' : 'pointer',
              background: isSelected ? '#ffbe1f' : 'transparent',
              color: isFuture ? 'var(--text-disabled)' : 'var(--text-primary)',
              fontWeight: isCurrent ? 600 : 400,
              transition: 'background 0.1s',
            }}
            onMouseEnter={e => { if (!isFuture && !isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'var(--container-secondary)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isSelected ? '#ffbe1f' : 'transparent'; }}
            >
              {m}
            </button>
          );
        })}
      </div>
    );
  };

  /* ── year grid ──────────────────────────────────────────────────────────── */
  const renderYearView = () => {
    const curY  = today.getFullYear();
    const rangeS = Math.floor(viewDate.getFullYear() / 12) * 12;
    const years  = Array.from({ length: 12 }, (_, i) => rangeS + i);
    const selY   = value.mode === 'year' ? value.date.getFullYear() : null;

    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 4 }}>
        {years.map(y => {
          const isFuture   = y > curY;
          const isSelected = y === selY;
          const isCurrent  = y === curY;
          return (
            <button key={y} disabled={isFuture} onClick={() => {
              const d = new Date(y, 0, 1);
              onChange({ mode: 'year', label: isCurrent ? 'This year' : y.toString(), date: d });
              setOpen(false);
            }} style={{
              border: 'none', borderRadius: 6, padding: '8px 4px',
              fontSize: 13, fontFamily: 'var(--font-family-sans)',
              cursor: isFuture ? 'default' : 'pointer',
              background: isSelected ? '#ffbe1f' : 'transparent',
              color: isFuture ? 'var(--text-disabled)' : 'var(--text-primary)',
              fontWeight: isCurrent ? 600 : 400,
            }}
            onMouseEnter={e => { if (!isFuture && !isSelected) (e.currentTarget as HTMLButtonElement).style.background = 'var(--container-secondary)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = isSelected ? '#ffbe1f' : 'transparent'; }}
            >
              {y}
            </button>
          );
        })}
      </div>
    );
  };

  /* ── render ─────────────────────────────────────────────────────────────── */
  return (
    <div className={className} style={{ position: 'relative', display: 'inline-block' }}>
      {/* Trigger button — mimics Dropdown size="s" appearance */}
      <button
        ref={btnRef}
        onClick={handleOpen}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          height: 32, padding: '0 10px',
          border: '1px solid var(--stroke-secondary)',
          borderRadius: 8,
          background: open ? 'var(--container-secondary)' : 'var(--container-primary)',
          cursor: 'pointer',
          fontSize: 13, color: 'var(--text-primary)',
          fontFamily: 'var(--font-family-sans)', fontWeight: 400,
          whiteSpace: 'nowrap',
          transition: 'background 0.12s',
        }}
      >
        {value.label}
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ flexShrink: 0, transform: open ? 'rotate(180deg)' : 'none', transition: 'transform 0.15s' }}>
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>

      {/* Popover */}
      {open && createPortal(
        <div ref={popRef} style={{
          position: 'fixed', top: popPos.top, right: popPos.right,
          width: 252,
          background: 'var(--container-primary)',
          borderRadius: 10,
          boxShadow: '0 8px 24px rgba(26, 1, 38, 0.12)',
          zIndex: 200,
          padding: '12px',
        }}>
          {/* Mode tabs */}
          <div style={{ display: 'flex', gap: 2, marginBottom: 12, background: 'var(--container-secondary)', borderRadius: 6, padding: 2 }}>
            {(['week', 'month', 'year'] as PeriodMode[]).map(m => (
              <button key={m}
                onClick={() => { setMode(m); setViewDate(new Date()); setHoveredWi(null); }}
                style={{
                  flex: 1, border: 'none', borderRadius: 4, padding: '5px 0',
                  fontSize: 12, fontFamily: 'var(--font-family-sans)',
                  cursor: 'pointer',
                  background: mode === m ? 'var(--container-primary)' : 'transparent',
                  color: mode === m ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: mode === m ? 500 : 400,
                  boxShadow: mode === m ? '0 1px 2px rgba(0,0,0,0.08)' : 'none',
                  transition: 'all 0.12s',
                }}
              >
                {m === 'week' ? 'Week' : m === 'month' ? 'Month' : 'Year'}
              </button>
            ))}
          </div>

          {/* Month/year nav */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <button onClick={prevView} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px 8px', borderRadius: 4, fontSize: 18, lineHeight: 1, color: 'var(--text-secondary)' }}>‹</button>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', fontFamily: 'var(--font-family-sans)' }}>
              {viewLabel()}
            </span>
            <button onClick={nextView} style={{ border: 'none', background: 'none', cursor: 'pointer', padding: '2px 8px', borderRadius: 4, fontSize: 18, lineHeight: 1, color: 'var(--text-secondary)' }}>›</button>
          </div>

          {/* Calendar body */}
          {mode === 'week'  && renderWeekView()}
          {mode === 'month' && renderMonthView()}
          {mode === 'year'  && renderYearView()}
        </div>,
        document.body
      )}
    </div>
  );
}
