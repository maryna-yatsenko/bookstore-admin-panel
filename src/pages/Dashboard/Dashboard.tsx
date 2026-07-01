import { useState, useRef, useEffect, useMemo } from 'react';
import { DonutChart } from './DonutChart';
import { Sidebar } from '@components/atoms/Sidebar';
import { BookStoreLogo } from '@components/atoms/Sidebar/BookStoreLogo';
import { Button } from '@components/atoms/Button';
import { SearchInput } from '@components/atoms/SearchInput';
import { FunctionalButton } from '@components/atoms/FunctionalButton';
import { SegmentedControl } from '@components/atoms/SegmentedControl';
import { Datepicker } from '@components/atoms/Datepicker';
import { Badge } from '@components/atoms/Badge/Badge';
import { Icon } from '@components/atoms/Icon';
import { TableCellTitle } from '@components/atoms/TableCell/TableCellTitle';
import { TableCellText } from '@components/atoms/TableCell/TableCellText';
import { TableCellBadge } from '@components/atoms/TableCell/TableCellBadge';
import type { SidebarNavItem, SidebarUser } from '@components/atoms/Sidebar/Sidebar.types';
import type { DateRange } from '@components/atoms/Datepicker/Datepicker.types';
import type { BadgeColor } from '@components/atoms/Badge/Badge.types';
import type { StatusStatus } from '@components/atoms/Status/Status.types';
import styles from './Dashboard.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

/* ── Static data ──────────────────────────────────────────────────────────── */

function makeNavItems(onNavigate?: (page: string) => void): SidebarNavItem[] {
  return [
    { id: 'dashboard', icon: 'dashboard',    label: 'Dashboard', selected: true,  onClick: () => onNavigate?.('dashboard') },
    { id: 'orders',    icon: 'shopping-bag', label: 'Orders', badge: 12,          onClick: () => onNavigate?.('orders') },
    { id: 'users',     icon: 'user',         label: 'Users',                      onClick: () => onNavigate?.('users') },
    { id: 'products',  icon: 'barcode',      label: 'Products',                   onClick: () => onNavigate?.('products') },
    { id: 'tasks',     icon: 'task-list',    label: 'Work tasks',                 onClick: () => onNavigate?.('tasks') },
    { id: 'blog',      icon: 'news',         label: 'Blog',                       onClick: () => onNavigate?.('blog') },
  ];
}

const BOTTOM_ITEMS: SidebarNavItem[] = [
  { id: 'settings', icon: 'settings', label: 'Settings' },
  { id: 'help',     icon: 'question', label: 'Help' },
];

const USER: SidebarUser = {
  initials: 'OM',
  name: 'Oleksandr Melnyk',
  role: 'Warehouse manager',
};

const QUICK_ACTIONS = [
  { icon: <Icon name="barcode"      size={24} />, label: 'New product' },
  { icon: <Icon name="shopping-bag" size={24} />, label: 'New order' },
  { icon: <Icon name="refund"       size={24} />, label: 'Refund' },
  { icon: <Icon name="add"          size={24} />, label: 'New task' },
];

const SEGMENT_OPTIONS = [
  { value: 'today',    label: 'Today' },
  { value: 'week7',    label: '7 days' },
  { value: 'month30',  label: '30 days' },
  { value: 'months6',  label: '6 months' },
];

const RECENT_ORDERS: Array<{
  id: string; customer: string; phone: string;
  badgeLabel: string; badgeColor: BadgeColor;
  amount: string; paymentStatus: string; paymentType: StatusStatus;
}> = [
  { id: 'ORD-1234', customer: 'Oleksandr Kovalenko', phone: '+380 50 123 4924', badgeLabel: 'New',        badgeColor: 'green', amount: '1 250 ₴', paymentStatus: 'Paid',     paymentType: 'success'  },
  { id: 'ORD-1235', customer: 'Maria Petrenko',      phone: '+380 67 234 5678', badgeLabel: 'Processing', badgeColor: 'lilac', amount: '3 490 ₴', paymentStatus: 'Pending',  paymentType: 'warning'  },
  { id: 'ORD-1236', customer: 'Ivan Sydorenko',      phone: '+380 93 345 6789', badgeLabel: 'Completed',  badgeColor: 'gray',  amount: '780 ₴',   paymentStatus: 'Refunded', paymentType: 'disabled' },
];

const CRITICAL_STOCK: Array<{ title: string; rate: string; qty: string; orderStatus: string }> = [
  { title: 'Clean Code',            rate: '12 units/week', qty: '2 pcs.', orderStatus: 'Not ordered'   },
  { title: 'Parker Jotter Special', rate: '15 units/week', qty: '3 pcs.', orderStatus: 'Not ordered'   },
  { title: 'Moleskine Classic L',   rate: '8 units/week',  qty: '0 pcs.', orderStatus: 'Arriving 30.05' },
];


/* ── Line chart data ──────────────────────────────────────────────────────── */
const DAYS = ['01. 05', '02. 05', '03. 05', '04. 05', '05. 05', '06. 05', '07. 05'];
const PROFIT_PTS = [60, 28, 40, 40, 57, 60, 88];   // % of 100K
const ORDERS_PTS = [52, 35, 26, 48, 82, 50, 78];   // % of 100K

/* ── Top cities data ──────────────────────────────────────────────────────── */
const CITIES = [
  { name: 'Kyiv',    amount: 85000, pct: '38%', isKyiv: true,  barWidth: 100  },
  { name: 'Lviv',    amount: 42000, pct: '19%', isKyiv: false, barWidth: 80.6 },
  { name: 'Odesa',   amount: 38000, pct: '17%', isKyiv: false, barWidth: 66.1 },
  { name: 'Kharkiv', amount: 31000, pct: '14%', isKyiv: false, barWidth: 35.5 },
  { name: 'Dnipro',  amount: 25000, pct: '11%', isKyiv: false, barWidth: 11.3 },
];

/* ── Bar chart data ───────────────────────────────────────────────────────── */
/* Heights are % of barsContainer (205.5px = 240 - gap20.5 - label14), derived from Figma exact px heights */
const BAR_DATA = [
  { day: '01. 05', sales: 62.2,  returns: 32.4, exchanges: 18.8 },
  { day: '02. 05', sales: 50.2,  returns:  7.2, exchanges: 10.4 },
  { day: '03. 05', sales: 59.9,  returns: 11.9, exchanges:  7.0 },
  { day: '04. 05', sales: 61.5,  returns: 43.7, exchanges: 15.0 },
  { day: '05. 05', sales: 59.2,  returns: 31.6, exchanges:  2.9 },
  { day: '06. 05', sales: 68.2,  returns:  2.9, exchanges: 16.9 },
  { day: '07. 05', sales: 65.2,  returns: 29.8, exchanges: 24.7 },
];

/* ── Segment ↔ DateRange sync ─────────────────────────────────────────────── */
function sod(d: Date) { return new Date(d.getFullYear(), d.getMonth(), d.getDate()); }
function sameDay(a: Date, b: Date) {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function segmentToDateRange(seg: string): DateRange {
  const today = sod(new Date());
  switch (seg) {
    case 'today':    return { start: today, end: today };
    case 'week7':    { const s = new Date(today); s.setDate(today.getDate() - 6);   return { start: s, end: today }; }
    case 'month30':  { const s = new Date(today); s.setDate(today.getDate() - 29);  return { start: s, end: today }; }
    case 'months6':  { const s = new Date(today); s.setMonth(today.getMonth() - 6); return { start: s, end: today }; }
    default: return {};
  }
}

function matchSegment(range: DateRange): string {
  if (!range.start || !range.end) return '';
  const today = sod(new Date());
  const start = sod(range.start);
  const end   = sod(range.end);
  if (!sameDay(end, today)) return '';
  const diff = Math.round((today.getTime() - start.getTime()) / 86400000);
  if (diff === 0) return 'today';
  if (diff === 6) return 'week7';
  if (diff === 29) return 'month30';
  const sixMoAgo = new Date(today);
  sixMoAgo.setMonth(today.getMonth() - 6);
  if (sameDay(start, sixMoAgo)) return 'months6';
  return '';
}

/* ── Period-wide data generation ─────────────────────────────────────────── */
const UA_MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const DONUT_LABELS = ['Fiction', 'Stationery', "Children's books", 'Business books', 'Gifts'];

function buildPeriodLabels(segment: string, dateRange: DateRange): string[] {
  const end = dateRange.end ?? new Date();
  if (segment === 'today') {
    return ['10:00', '12:00', '14:00', '16:00', '18:00', '20:00', '22:00'];
  }
  if (segment === 'week7') {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(end); d.setDate(end.getDate() - 6 + i);
      return `${String(d.getDate()).padStart(2, '0')}. ${String(d.getMonth() + 1).padStart(2, '0')}`;
    });
  }
  if (segment === 'month30') {
    return Array.from({ length: 5 }, (_, i) => {
      const d = new Date(end); d.setDate(end.getDate() - 28 + i * 7);
      return `${String(d.getDate()).padStart(2, '0')}. ${String(d.getMonth() + 1).padStart(2, '0')}`;
    });
  }
  // months6 or custom
  return Array.from({ length: 6 }, (_, i) => {
    const d = new Date(end); d.setMonth(end.getMonth() - 5 + i);
    return UA_MONTHS[d.getMonth()];
  });
}

function generatePeriodData(segment: string, dateRange: DateRange) {
  const seed = (dateRange.start ? dateRange.start.getTime() / 86400000 | 0 : 0) ^ 0xface;
  const rand = seededRand(seed);
  const rng  = (min: number, max: number) => Math.round(min + rand() * (max - min));
  const rngF = (min: number, max: number) => +(min + rand() * (max - min)).toFixed(1);

  const [minO, maxO, minP, maxP] =
    segment === 'today'   ? [15,   50,   2,   10]  :
    segment === 'week7'   ? [120,  320,  10,  45]  :
    segment === 'month30' ? [450,  950,  35,  110] :
                            [2200, 5500, 120, 450];

  const statCards = [
    { label: 'New orders',       value: String(rng(minO, maxO)),          change: `+${rng(5,  35)}%`, positive: true  },
    { label: 'Pending orders',   value: String(rng(minP, maxP)),          change: `-${rng(1,  15)}%`, positive: false },
    { label: 'Completed orders', value: String(rng(minO * 3, maxO * 5)), change: `+${rng(5,  25)}%`, positive: true  },
    { label: 'Cancelled orders', value: String(rng(1, maxP)),             change: `-${rng(1,  10)}%`, positive: false },
  ];

  const labels = buildPeriodLabels(segment, dateRange);
  const n = labels.length;
  const lineProfit = Array.from({ length: n }, () => rng(18, 92));
  const lineOrders = Array.from({ length: n }, () => rng(12, 88));
  const bars = labels.map(day => ({
    day,
    sales:     rngF(38, 72),
    returns:   rngF(4,  46),
    exchanges: rngF(2,  26),
  }));

  const cityScale = segment === 'today' ? 0.03 : segment === 'week7' ? 0.2 : segment === 'month30' ? 0.8 : 4.5;
  const rawCities = [rng(60, 110), rng(30, 60), rng(22, 52), rng(15, 40), rng(8, 28)]
    .sort((a, b) => b - a)
    .map(v => Math.round(v * 1000 * cityScale));
  const cityTotal = rawCities.reduce((s, v) => s + v, 0);
  const cities = CITIES.map((c, i) => ({
    ...c,
    amount:   rawCities[i],
    pct:      `${Math.round(rawCities[i] / cityTotal * 100)}%`,
    barWidth: (rawCities[i] / rawCities[0]) * 100,
  }));

  const rawDonut = [rng(38, 80), rng(18, 42), rng(10, 22), rng(6, 16), rng(3, 9)]
    .sort((a, b) => b - a)
    .map(v => Math.round(v * 1000 * cityScale));
  const donutTotal = rawDonut.reduce((s, v) => s + v, 0);
  const donutData = rawDonut.map((v, i) => ({
    label:   DONUT_LABELS[i],
    value:   v,
    percent: Math.round(v / donutTotal * 100),
  }));

  return { statCards, lineLabels: labels, lineProfit, lineOrders, bars, cities, donutData };
}

/* ── Week data generation ─────────────────────────────────────────────────── */
function seededRand(seed: number) {
  let s = (seed >>> 0) || 1;
  return () => {
    s = (Math.imul(1664525, s) + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function getWeekDayLabels(monday: Date): string[] {
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return `${String(d.getDate()).padStart(2, '0')}. ${String(d.getMonth() + 1).padStart(2, '0')}`;
  });
}

function generateLineWeekData(monday: Date) {
  const rand = seededRand(monday.getTime() / 86400000 | 0);
  const rng = (min: number, max: number) => Math.round(min + rand() * (max - min));
  return {
    days:   getWeekDayLabels(monday),
    profit: Array.from({ length: 7 }, () => rng(20, 90)),
    orders: Array.from({ length: 7 }, () => rng(15, 85)),
  };
}

function generateBarWeekData(monday: Date) {
  const rand = seededRand((monday.getTime() / 86400000 | 0) ^ 0x5a5a5a5a);
  const rng = (min: number, max: number) => +(min + rand() * (max - min)).toFixed(1);
  return getWeekDayLabels(monday).map(day => ({
    day,
    sales:     rng(40, 70),
    returns:   rng(5,  45),
    exchanges: rng(2,  25),
  }));
}

/* ── SVG helpers ──────────────────────────────────────────────────────────── */
function buildLinePath(points: number[], w: number, h: number, yOffset = 0): string {
  const step = w / (points.length - 1);
  return points
    .map((pct, i) => {
      const x = i * step;
      const y = yOffset + h - (pct / 100) * h;
      return `${i === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(' ');
}

function buildAreaPath(points: number[], w: number, h: number, yOffset = 0): string {
  const step = w / (points.length - 1);
  const linePts = points.map((pct, i) => ({
    x: i * step,
    y: yOffset + h - (pct / 100) * h,
  }));
  const line = linePts.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const close = `L${linePts[linePts.length - 1].x.toFixed(1)},${yOffset + h} L0,${yOffset + h} Z`;
  return `${line} ${close}`;
}


/* ── Tooltip with triangular arrow ──────────────────────────────────────── */
function DashboardTooltip({ x, y, children, containerWidth }: {
  x: number; y: number; children: React.ReactNode; containerWidth?: number;
}) {
  const TOOLTIP_W = 215;
  const OFFSET    = 14;
  const flipLeft  = containerWidth ? x + OFFSET + TOOLTIP_W > containerWidth : false;

  return (
    <div style={{
      position: 'absolute',
      left: flipLeft ? x - OFFSET - TOOLTIP_W : x + OFFSET,
      top: y,
      transform: 'translateY(-50%)',
      pointerEvents: 'none',
      zIndex: 30,
    }}>
      <div style={{
        position: 'relative',
        background: 'var(--container-primary)',
        borderRadius: 8,
        padding: '10px 14px',
        boxShadow: '0 4px 12px rgba(26, 1, 38, 0.07)',
        fontFamily: 'var(--font-family-sans)',
        minWidth: TOOLTIP_W,
      }}>
        {children}
        {/* Triangle — flips side based on position */}
        {flipLeft ? (
          /* Points RIGHT (tooltip is left of cursor) */
          <span style={{
            position: 'absolute', right: -5, top: '50%',
            transform: 'translateY(-50%)', display: 'block',
            width: 0, height: 0,
            borderTop: '5px solid transparent',
            borderBottom: '5px solid transparent',
            borderLeft: '5px solid var(--container-primary)',
          }} />
        ) : (
          /* Points LEFT (tooltip is right of cursor) */
          <span style={{
            position: 'absolute', left: -5, top: '50%',
            transform: 'translateY(-50%)', display: 'block',
            width: 0, height: 0,
            borderTop: '5px solid transparent',
            borderBottom: '5px solid transparent',
            borderRight: '5px solid var(--container-primary)',
          }} />
        )}
      </div>
    </div>
  );
}

function TooltipRow({ color, label, value }: { color: string; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
      <span style={{ width: 8, height: 8, borderRadius: 2, background: color, flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>{label}</span>
      <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginLeft: 12 }}>{value}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
export function Dashboard({ onNavigate }: { onNavigate?: (page: string) => void } = {}) {
  const [sidebarFolded, setSidebarFolded] = useState(() => window.innerWidth < 768);
  const [search, setSearch]               = useState('');
  const [activeSegment, setActiveSegment] = useState('today');
  const [dateRange, setDateRange]         = useState<DateRange>(() => segmentToDateRange('today'));

  const handleSegmentChange = (value: string) => {
    setActiveSegment(value);
    setDateRange(segmentToDateRange(value));
    setProfitPeriod({});
    setSalesPeriod({});
  };

  const handleDateRangeChange = (range: DateRange) => {
    setDateRange(range);
    setActiveSegment(matchSegment(range));
    setProfitPeriod({});
    setSalesPeriod({});
  };

  const periodData = useMemo(
    () => generatePeriodData(activeSegment, dateRange),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [activeSegment, dateRange.start?.getTime(), dateRange.end?.getTime()],
  );
  const [profitPeriod, setProfitPeriod]   = useState<DateRange>({});
  const [salesPeriod, setSalesPeriod]     = useState<DateRange>({});
  const [rawMouseX, setRawMouseX] = useState<number | null>(null);
  const [lineTooltipPos, setLineTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const [barHoveredIdx, setBarHoveredIdx]   = useState<number | null>(null);
  const [barTooltipPos, setBarTooltipPos]   = useState<{ x: number; y: number } | null>(null);
  const [citiesHoveredIdx, setCitiesHoveredIdx] = useState<number | null>(null);
  const [citiesTooltipPos, setCitiesTooltipPos] = useState<{ x: number; y: number } | null>(null);

  /* Line chart SVG dimensions — chartW is dynamic so the chart fills its
   * container at any viewport width (ResizeObserver drives re-renders).
   * 42 = Y-axis column width, 8 = right bleed, 4 = left bleed (viewBox offset).
   */
  const lineChartWrapRef = useRef<HTMLDivElement>(null);
  const lineChartRef     = useRef<SVGSVGElement>(null);
  const barChartRef      = useRef<HTMLDivElement>(null);
  const citiesRef        = useRef<HTMLDivElement>(null);
  const [chartW, setChartW] = useState(580);

  const { days: chartDays, profit: chartProfit, orders: chartOrders } = useMemo(() => {
    if (profitPeriod.start) return generateLineWeekData(profitPeriod.start);
    return { days: periodData.lineLabels, profit: periodData.lineProfit, orders: periodData.lineOrders };
  }, [profitPeriod.start, periodData]);

  const chartBarData = useMemo(() => {
    if (salesPeriod.start) return generateBarWeekData(salesPeriod.start);
    return periodData.bars;
  }, [salesPeriod.start, periodData]);

  useEffect(() => {
    const el = lineChartWrapRef.current;
    if (!el) return;
    const obs = new ResizeObserver(([entry]) => {
      const w = Math.round(entry.contentRect.width);
      setChartW(Math.max(200, w - 42 - 4 - 8)); // subtract Y-axis + bleeds
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const chartH    = 268;
  const svgPadTop = 8;
  const svgPadBot = 20;
  const ySteps    = [100, 80, 60, 40, 20, 0];
  const xStep     = chartW / (chartDays.length - 1);

  // Snap to nearest data point
  const hoveredIdx = rawMouseX !== null
    ? Math.max(0, Math.min(chartDays.length - 1, Math.round(rawMouseX / xStep)))
    : null;

  // Proximity alpha: 1 when exactly on a point, 0 at the midpoint between points
  const hoverAlpha = rawMouseX !== null && hoveredIdx !== null
    ? Math.max(0, 1 - Math.abs(rawMouseX - hoveredIdx * xStep) / (xStep / 2))
    : 0;

  const hoverColumnX = hoveredIdx !== null ? (hoveredIdx / (DAYS.length - 1)) * chartW : 0;

  const handleChartMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    const svg = lineChartRef.current;
    if (!svg) return;
    const rect = svg.getBoundingClientRect();
    const mouseX = (e.clientX - rect.left) / rect.width * (chartW + 42 + 8) - 4 - 42;
    setRawMouseX(Math.max(0, Math.min(chartW, mouseX)));
    if (lineChartWrapRef.current) {
      const wrapR = lineChartWrapRef.current.getBoundingClientRect();
      setLineTooltipPos({ x: e.clientX - wrapR.left, y: e.clientY - wrapR.top });
    }
  };

  const handleChartMouseLeave = () => {
    setRawMouseX(null);
    setLineTooltipPos(null);
  };

  return (
    <div className={styles.layout}>
      {/* ══ SIDEBAR ══════════════════════════════════════════════════════════ */}
      {!sidebarFolded && (
        <div className={styles.sidebarBackdrop} onClick={() => setSidebarFolded(true)} />
      )}
      <Sidebar
        folded={sidebarFolded}
        onToggleFold={() => setSidebarFolded((f) => !f)}
        logo={<BookStoreLogo />}
        appName="BookStore"
        navItems={makeNavItems(onNavigate)}
        bottomItems={BOTTOM_ITEMS}
        user={USER}
        className={styles.sidebar}
      />

      {/* ══ MAIN CONTENT ═════════════════════════════════════════════════════ */}
      <div className={styles.main}>

        {/* ── HEADER ───────────────────────────────────────────────────────── */}
        <header className={styles.header}>
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by ID, name or phone number"
            className={styles.headerSearch}
          />
          <div className={styles.headerActions}>
            <Button variant="secondary" size="l" iconOnly leftIcon={<Icon name="download" size={24} />} aria-label="Download" />
            <Button variant="primary" size="l" leftIcon={<Icon name="add" size={20} />}>
              Create an order
            </Button>
          </div>
        </header>

        {/* ── PAGE BODY ────────────────────────────────────────────────────── */}
        <div className={styles.body}>

          {/* ── TOP ROW: stat cards + quick actions ─────────────────────────── */}
          <div className={styles.topRow}>
            {/* Stat cards (2×2) */}
            <div className={styles.statGrid}>
              {periodData.statCards.map((card, idx) => (
                <div key={idx} className={styles.statCard}>
                  <span className={styles.statLabel}>{card.label}</span>
                  <div className={styles.statBottom}>
                    <span className={styles.statValue}>{card.value}</span>
                    <div className={styles.statChangeWrap}>
                      <div className={styles.statDivider} />
                      <div className={styles.statChange}>
                        <div className={styles.statChangePct}>
                          <span className={card.positive ? styles.statPctPositive : styles.statPctNegative}>
                            {card.change}
                          </span>
                          <Icon
                            name={card.positive ? 'arrow-up-chevron' : 'arrow-down-chevron'}
                            size={16}
                            color={card.positive ? 'var(--text-success)' : 'var(--text-error)'}
                          />
                        </div>
                        <span className={styles.statSubtext}>to last month</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Quick-action functional buttons (2×2) */}
            <div className={styles.quickGrid}>
              {QUICK_ACTIONS.map((a) => (
                <FunctionalButton key={a.label} icon={a.icon} label={a.label} className={styles.quickBtn} />
              ))}
            </div>
          </div>

          {/* ── FILTER BAR ───────────────────────────────────────────────────── */}
          <div className={styles.filterBar}>
            <SegmentedControl
              value={activeSegment}
              onChange={handleSegmentChange}
              options={SEGMENT_OPTIONS}
              label="Period"
            />
            <div className={styles.filterRight}>
              <Datepicker
                value={dateRange}
                onChange={handleDateRangeChange}
                placeholder="01.05 — 07.05"
              />
              <Button variant="secondary" size="m" leftIcon={<Icon name="upload" size={16} />}>
                Export
              </Button>
            </div>
          </div>

          {/* ── SECTION 1: tables ────────────────────────────────────────────── */}
          <div className={styles.twoCol}>

            {/* Recent orders */}
            <div className={styles.card}>
              <div className={styles.cardHeading}>
                <span className={styles.cardTitle}>Recent orders</span>
                <Button variant="transparent" size="s">View all</Button>
              </div>
              <div className={styles.tableWrap}>
                <div className={styles.tableInnerBorder}>
                  <table className={styles.table}>
                    <tbody>
                      {RECENT_ORDERS.map((row, i) => (
                        <tr key={i}>
                          <TableCellText titleText={row.id} style={{ flex: '0 0 120px' }} />
                          <TableCellText
                            titleText={row.customer}
                            subtitle
                            subtitleText={row.phone}
                          />
                          <TableCellBadge
                            badges={[row.badgeLabel]}
                            getBadgeColor={() => row.badgeColor}
                            style={{ flex: '0 0 120px' }}
                          />
                          <TableCellText
                            titleText={row.amount}
                            status
                            statusText={row.paymentStatus}
                            statusType={row.paymentType}
                            style={{ flex: '0 0 140px' }}
                          />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Critical stock */}
            <div className={styles.card}>
              <div className={styles.cardHeading}>
                <span className={styles.cardTitle}>Critical stock</span>
                <Button variant="transparent" size="s">View all</Button>
              </div>
              <div className={styles.tableWrap}>
                <div className={styles.tableInnerBorder}>
                  <table className={styles.table}>
                    <tbody>
                      {CRITICAL_STOCK.map((row) => (
                        <tr key={row.title}>
                          <TableCellText
                            image
                            titleText={row.title}
                            subtitle
                            subtitleText={row.rate}
                            style={{ paddingLeft: 8 }}
                          />
                          <TableCellText titleText={row.qty} style={{ flex: '0 0 80px' }} />
                          <TableCellText titleText={row.orderStatus} titleWrap style={{ flex: '0 0 120px' }} />
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 2: line chart + donut ────────────────────────────────── */}
          <div className={styles.twoCol}>

            {/* Profit & orders line chart */}
            <div className={styles.card}>
              <div className={styles.cardHeadingChart} style={{ paddingTop: 'var(--spacing-12)' }}>
                <span className={styles.cardTitle}>Profit & orders trend</span>
                <Datepicker
                  value={profitPeriod}
                  onChange={setProfitPeriod}
                  placeholder="This week"
                  className={styles.chartDropdown}
                  weekMode
                />
              </div>
              <div className={styles.chartOuterWrap}>
                <div className={styles.chartInnerBox}>
                  {/* Legend — right-aligned inside chart box */}
                  <div className={styles.chartLegend}>
                    <div className={styles.legendItem}>
                      <span className={cx(styles.legendDot, styles.legendDotYellow)} />
                      <span className={styles.legendLabel}>Profit (₴)</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span className={cx(styles.legendDot, styles.legendDotGray)} />
                      <span className={styles.legendLabel}>Orders (units)</span>
                    </div>
                  </div>
                  {/* SVG chart */}
                  <div className={styles.lineChartWrap} ref={lineChartWrapRef} style={{ position: 'relative' }}>
                    {/* Line chart tooltip */}
                    {lineTooltipPos && hoveredIdx !== null && (
                      <DashboardTooltip x={lineTooltipPos.x} y={lineTooltipPos.y} containerWidth={lineChartWrapRef.current?.clientWidth}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                          {chartDays[hoveredIdx]}
                        </div>
                        <TooltipRow color="#ffbe1f" label="Profit (₴)"      value={`${chartProfit[hoveredIdx]}K ₴`} />
                        <TooltipRow color="#a09fa1" label="Orders (units)"   value={`${chartOrders[hoveredIdx]}K`}   />
                      </DashboardTooltip>
                    )}
                    <svg
                      ref={lineChartRef}
                      viewBox={`-4 0 ${chartW + 42 + 8} ${svgPadTop + chartH + svgPadBot}`}
                      width="100%"
                      overflow="visible"
                      className={styles.lineChartSvg}
                      aria-label="Profit and orders chart"
                      onMouseMove={handleChartMouseMove}
                      onMouseLeave={handleChartMouseLeave}
                    >
                      <defs>
                        <linearGradient id="gradYellow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%"   stopColor="#ffbe1f" stopOpacity={0.3} />
                          <stop offset="100%" stopColor="#ffbe1f" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>

                      {/* Y-axis labels + horizontal dashed grid lines */}
                      {ySteps.map((val, i) => {
                        const y = svgPadTop + (i / (ySteps.length - 1)) * chartH;
                        return (
                          <g key={val}>
                            <text
                              x={32} y={y}
                              textAnchor="end"
                              dominantBaseline="middle"
                              fontSize={12}
                              fill="var(--text-tertiary)"
                              style={{ fontFamily: 'var(--font-family-sans)', fontWeight: 400 }}
                            >
                              {val === 0 ? '0' : `${val}K`}
                            </text>
                            <line
                              x1={42} y1={y} x2={chartW + 42} y2={y}
                              stroke={val === 0 ? '#ffc229' : 'var(--stroke-secondary)'}
                              strokeWidth={1}
                              strokeDasharray="4 4"
                            />
                          </g>
                        );
                      })}

                      {/* Data area — x-offset 42 */}
                      <g transform="translate(42,0)">
                        {/* Vertical dashed grid lines at each X position (skip hovered) */}
                        {chartDays.map((_, i) => {
                          if (hoveredIdx === i) return null;
                          const x = (i / (chartDays.length - 1)) * chartW;
                          // 01.05 (i=0) → brand yellow; all others → stroke-secondary
                          const vStroke = i === 0 ? '#ffc229' : 'var(--stroke-secondary)';
                          return (
                            <line
                              key={`vg${i}`}
                              x1={x} y1={svgPadTop} x2={x} y2={svgPadTop + chartH}
                              stroke={vStroke}
                              strokeWidth={1}
                              strokeDasharray="4 4"
                            />
                          );
                        })}

                        {/* Hover indicator — always in DOM, fades based on proximity */}
                        {(() => {
                          const cx = hoverColumnX;
                          const colLeft  = Math.max(0, cx - 16);
                          const colRight = Math.min(chartW, cx + 16);
                          return (
                            <g style={{ opacity: hoverAlpha, transition: 'opacity 0.18s ease', pointerEvents: 'none' }}>
                              <rect
                                x={colLeft} y={svgPadTop}
                                width={colRight - colLeft} height={chartH}
                                fill="rgba(0,0,0,0.06)"
                              />
                              <line
                                x1={cx} y1={svgPadTop} x2={cx} y2={svgPadTop + chartH}
                                stroke="#0a0a0a" strokeWidth={1}
                              />
                            </g>
                          );
                        })()}

                        {/* Area fill — yellow under the profit line only (matches Figma) */}
                        <path d={buildAreaPath(chartProfit, chartW, chartH, svgPadTop)} fill="url(#gradYellow)" />

                        {/* Lines */}
                        <path
                          d={buildLinePath(chartProfit, chartW, chartH, svgPadTop)}
                          fill="none" stroke="#ffbe1f" strokeWidth={2}
                          strokeLinejoin="round" strokeLinecap="round"
                        />
                        <path
                          d={buildLinePath(chartOrders, chartW, chartH, svgPadTop)}
                          fill="none" stroke="#a09fa1" strokeWidth={2}
                          strokeLinejoin="round" strokeLinecap="round"
                        />

                        {/* Orders markers — white fill, gray stroke, smaller than profit dots */}
                        {chartOrders.map((pct, i) => (
                          <circle
                            key={`o${i}`}
                            cx={(i / (chartOrders.length - 1)) * chartW}
                            cy={svgPadTop + chartH - (pct / 100) * chartH}
                            r={hoveredIdx === i ? 4 : 3}
                            fill="white"
                            stroke="#a09fa1"
                            strokeWidth={1.5}
                          />
                        ))}

                        {/* Profit markers — white fill, yellow stroke, same size as orders */}
                        {chartProfit.map((pct, i) => (
                          <circle
                            key={`p${i}`}
                            cx={(i / (chartProfit.length - 1)) * chartW}
                            cy={svgPadTop + chartH - (pct / 100) * chartH}
                            r={hoveredIdx === i ? 4 : 3}
                            fill="white"
                            stroke="#ffbe1f"
                            strokeWidth={1.5}
                          />
                        ))}

                        {/* X-axis labels — edge labels anchored inward so they're never clipped */}
                        {chartDays.map((day, i) => {
                          const x = (i / (chartDays.length - 1)) * chartW;
                          const anchor =
                            i === 0 ? 'start' :
                            i === chartDays.length - 1 ? 'end' :
                            'middle';
                          return (
                            <text
                              key={day}
                              x={x}
                              y={svgPadTop + chartH + svgPadBot - 2}
                              textAnchor={anchor}
                              dominantBaseline="auto"
                              fontSize={12}
                              fill="var(--text-tertiary)"
                              style={{ fontFamily: 'var(--font-family-sans)', fontWeight: 400 }}
                            >
                              {day}
                            </text>
                          );
                        })}
                      </g>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Revenue by category donut (node 70:8382) */}
            <div className={styles.card}>
              <div className={styles.cardHeadingChart}>
                <span className={styles.cardTitle}>Revenue by category</span>
              </div>
              <div className={styles.chartOuterWrap}>
                <div className={styles.donutBox} style={{ overflow: 'visible' }}>
                  <DonutChart
                    key={dateRange.start?.getTime() ?? 0}
                    rawData={periodData.donutData}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ── SECTION 3: bar chart + top cities ────────────────────────────── */}
          <div className={styles.twoCol}>

            {/* Sales / returns / exchanges bar chart */}
            <div className={styles.card}>
              <div className={styles.cardHeadingChart} style={{ paddingTop: 'var(--spacing-12)' }}>
                <span className={styles.cardTitle}>Sales, returns & exchanges</span>
                <Datepicker
                  value={salesPeriod}
                  onChange={setSalesPeriod}
                  placeholder="This week"
                  className={styles.chartDropdown}
                  weekMode
                />
              </div>
              <div className={styles.chartOuterWrap}>
                <div className={styles.chartInnerBox} ref={barChartRef} style={{ position: 'relative' }}>
                  {/* Bar chart tooltip */}
                  {barTooltipPos && barHoveredIdx !== null && (
                    <DashboardTooltip x={barTooltipPos.x} y={barTooltipPos.y} containerWidth={barChartRef.current?.clientWidth}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                        {chartBarData[barHoveredIdx].day}
                      </div>
                      <TooltipRow color="#734588" label="Sales"     value={`${chartBarData[barHoveredIdx].sales.toFixed(1)}%`}    />
                      <TooltipRow color="#f6d0fe" label="Returns"   value={`${chartBarData[barHoveredIdx].returns.toFixed(1)}%`}   />
                      <TooltipRow color="#ffbe1f" label="Exchanges" value={`${chartBarData[barHoveredIdx].exchanges.toFixed(1)}%`} />
                    </DashboardTooltip>
                  )}
                  <div className={styles.chartLegend}>
                    <div className={styles.legendItem}>
                      <span className={cx(styles.legendDot, styles.legendDotSales)} />
                      <span className={styles.legendLabel}>Sales</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span className={cx(styles.legendDot, styles.legendDotReturns)} />
                      <span className={styles.legendLabel}>Returns</span>
                    </div>
                    <div className={styles.legendItem}>
                      <span className={cx(styles.legendDot, styles.legendDotExchanges)} />
                      <span className={styles.legendLabel}>Exchanges</span>
                    </div>
                  </div>
                  <div className={styles.barSurface}>
                    <div className={styles.barYAxis}>
                      {[50, 40, 30, 20, 10, 0].map((v) => (
                        <div key={v} className={styles.barYRow}>
                          <span className={styles.barYLabel}>{v}</span>
                        </div>
                      ))}
                    </div>
                    <div className={styles.barGroups}>
                      <div className={styles.barGrid} aria-hidden="true">
                        {[0,1,2,3,4,5].map((i) => (
                          <div key={i} className={styles.barGridRow}>
                            <div className={cx(styles.barGridLine, i === 5 && styles.barGridLineBaseline)} />
                          </div>
                        ))}
                      </div>
                      {chartBarData.map((row, i) => (
                        <div
                          key={row.day}
                          className={styles.barGroup}
                          onMouseEnter={(e) => {
                            if (!barChartRef.current) return;
                            const r = barChartRef.current.getBoundingClientRect();
                            setBarHoveredIdx(i);
                            setBarTooltipPos({ x: e.clientX - r.left, y: e.clientY - r.top });
                          }}
                          onMouseMove={(e) => {
                            if (!barChartRef.current) return;
                            const r = barChartRef.current.getBoundingClientRect();
                            setBarTooltipPos({ x: e.clientX - r.left, y: e.clientY - r.top });
                          }}
                          onMouseLeave={() => { setBarHoveredIdx(null); setBarTooltipPos(null); }}
                        >
                          <div className={styles.barsContainer}>
                            <div className={cx(styles.bar, styles.barSales)}     style={{ height: `${row.sales}%` }} />
                            <div className={cx(styles.bar, styles.barReturns)}   style={{ height: `${row.returns}%` }} />
                            <div className={cx(styles.bar, styles.barExchanges)} style={{ height: `${row.exchanges}%` }} />
                          </div>
                          <span className={styles.barLabel}>{row.day}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Top cities */}
            <div className={styles.card}>
              <div className={styles.cardHeadingChart}>
                <span className={styles.cardTitle}>Top cities by sales</span>
              </div>
              <div className={styles.chartOuterWrap}>
                <div className={styles.citiesInner} ref={citiesRef} style={{ position: 'relative' }}>
                  {/* Cities tooltip */}
                  {citiesTooltipPos && citiesHoveredIdx !== null && (
                    <DashboardTooltip x={citiesTooltipPos.x} y={citiesTooltipPos.y} containerWidth={citiesRef.current?.clientWidth}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: periodData.cities[citiesHoveredIdx].isKyiv ? '#734588' : '#f6d0fe', flexShrink: 0 }} />
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{periodData.cities[citiesHoveredIdx].name}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                        <span style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Sales</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginLeft: 12 }}>{periodData.cities[citiesHoveredIdx].amount.toLocaleString('en-US')} ₴</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
                        <span style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Share</span>
                        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginLeft: 12 }}>{periodData.cities[citiesHoveredIdx].pct}</span>
                      </div>
                    </DashboardTooltip>
                  )}
                  {periodData.cities.map((city, i) => (
                    <div
                      key={city.name}
                      className={styles.cityRow}
                      onMouseEnter={(e) => {
                        if (!citiesRef.current) return;
                        const r = citiesRef.current.getBoundingClientRect();
                        setCitiesHoveredIdx(i);
                        setCitiesTooltipPos({ x: e.clientX - r.left, y: e.clientY - r.top });
                      }}
                      onMouseMove={(e) => {
                        if (!citiesRef.current) return;
                        const r = citiesRef.current.getBoundingClientRect();
                        setCitiesTooltipPos({ x: e.clientX - r.left, y: e.clientY - r.top });
                      }}
                      onMouseLeave={() => { setCitiesHoveredIdx(null); setCitiesTooltipPos(null); }}
                    >
                      <span className={styles.cityName}>{city.name}</span>
                      <div className={styles.cityBarTrack}>
                        <div
                          className={cx(styles.cityBarFill, city.isKyiv ? styles.cityBarFillKyiv : styles.cityBarFillOther)}
                          style={{ width: `${city.barWidth}%` }}
                        />
                      </div>
                      <div className={styles.cityMeta}>
                        <span className={styles.cityAmount}>{city.amount.toLocaleString('en-US')} ₴</span>
                        <span className={styles.cityPct}>{city.pct}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>{/* /body */}
      </div>{/* /main */}
    </div>
  );
}
