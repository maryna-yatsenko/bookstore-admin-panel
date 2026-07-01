import React, { useEffect, useId, useMemo, useRef, useState } from 'react';
import styles from './DonutChart.module.css';

// ── Types ────────────────────────────────────────────────────────────────────

interface DataItem {
  label: string;
  value: number;
  percent: number;
  color: string;
}

interface LabelLayout {
  anchor: { x: number; y: number };
  elbow:  { x: number; y: number };
  tip:    { x: number; y: number };
  side:   'left' | 'right';
  index:  number;
}

type TooltipState = {
  x: number;
  y: number;
  item: DataItem;
} | null;

// ── Constants ─────────────────────────────────────────────────────────────────

const RADIAL_EXIT    = 16;
const LABEL_COL_GAP  = 18;
const LABEL_H        = 42;
const MIN_GAP        = 24;
const ANIM_MS        = 700;

const SEGMENT_COLORS: string[] = [
  'var(--chart-yellow-600)',
  'var(--chart-purple-800)',
  'var(--chart-purple-600)',
  'var(--chart-pink-400)',
  'var(--chart-pink-200)',
];

const DEFAULT_DATA = [
  { label: 'Fiction',           value: 56000, percent: 45 },
  { label: 'Stationery',        value: 31125, percent: 25 },
  { label: "Children's books",  value: 16675, percent: 15 },
  { label: 'Business books',    value: 12450, percent: 10 },
  { label: 'Gifts',             value: 6250,  percent: 5  },
];

// ── Geometry helpers ──────────────────────────────────────────────────────────

const deg = (r: number) => (r * Math.PI) / 180;

function polarToXY(cx: number, cy: number, r: number, angleDeg: number) {
  const a = deg(angleDeg);
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) };
}

function ringArc(
  cx: number, cy: number, ro: number, ri: number,
  startDeg: number, endDeg: number,
  cr = 0,
): string {
  const si = polarToXY(cx, cy, ri, startDeg);
  const ei = polarToXY(cx, cy, ri, endDeg);
  const span = endDeg - startDeg;
  const large = span > 180 ? 1 : 0;

  if (cr < 0.5) {
    const s = polarToXY(cx, cy, ro, startDeg);
    const e = polarToXY(cx, cy, ro, endDeg);
    return [
      `M${s.x},${s.y}`,
      `A${ro},${ro} 0 ${large} 1 ${e.x},${e.y}`,
      `L${ei.x},${ei.y}`,
      `A${ri},${ri} 0 ${large} 0 ${si.x},${si.y}`,
      'Z',
    ].join(' ');
  }

  const dθ = (Math.asin(Math.min(cr / ro, 1)) * 180) / Math.PI;
  const outerLarge = span - 2 * dθ > 180 ? 1 : 0;
  const sArc = polarToXY(cx, cy, ro, startDeg + dθ);
  const eArc = polarToXY(cx, cy, ro, endDeg - dθ);
  const sRad = polarToXY(cx, cy, ro - cr, startDeg);
  const eRad = polarToXY(cx, cy, ro - cr, endDeg);

  return [
    `M${sRad.x},${sRad.y}`,
    `A${cr},${cr} 0 0 1 ${sArc.x},${sArc.y}`,
    `A${ro},${ro} 0 ${outerLarge} 1 ${eArc.x},${eArc.y}`,
    `A${cr},${cr} 0 0 1 ${eRad.x},${eRad.y}`,
    `L${ei.x},${ei.y}`,
    `A${ri},${ri} 0 ${large} 0 ${si.x},${si.y}`,
    `L${sRad.x},${sRad.y}`,
    'Z',
  ].join(' ');
}

function fmt(n: number) {
  return n.toLocaleString('en-US').replace(/\s/g, ' ');
}

// ── Label layout algorithm ───────────────────────────────────────────────────

function computeLayouts(
  segments: Array<{ startDeg: number; endDeg: number; index: number; segRo: number }>,
  cx: number, cy: number, ro: number,
  svgH: number,
): LabelLayout[] {
  const raw: LabelLayout[] = segments.map(({ startDeg, endDeg, index, segRo }) => {
    const mid    = (startDeg + endDeg) / 2;
    const side: 'left' | 'right' = Math.cos(deg(mid)) >= 0 ? 'right' : 'left';
    const anchor = polarToXY(cx, cy, segRo + 2, mid);
    const elbow  = polarToXY(cx, cy, segRo + RADIAL_EXIT, mid);
    const colX = side === 'right'
      ? cx + ro + RADIAL_EXIT + LABEL_COL_GAP
      : cx - ro - RADIAL_EXIT - LABEL_COL_GAP;
    const tip = { x: colX, y: elbow.y };
    return { anchor, elbow, tip, side, index };
  });

  (['left', 'right'] as const).forEach((side) => {
    const group = raw
      .filter((l) => l.side === side)
      .sort((a, b) => a.tip.y - b.tip.y);

    if (group.length <= 1) return;

    const step = LABEL_H + MIN_GAP;

    // Greedy downward pass — each label is at least `step` below the previous
    for (let i = 1; i < group.length; i++) {
      const minY = group[i - 1].tip.y + step;
      if (group[i].tip.y < minY) group[i].tip.y = minY;
    }

    // Center the resulting stack around the donut center (cy)
    const midY = (group[0].tip.y + group[group.length - 1].tip.y) / 2;
    const offset = cy - midY;
    group.forEach(l => { l.tip.y += offset; });

    // Clamp to viewport
    const half = LABEL_H / 2;
    group.forEach(l => { l.tip.y = Math.max(half, Math.min(svgH - half, l.tip.y)); });

    // Final downward pass in case clamping introduced overlaps
    for (let i = 1; i < group.length; i++) {
      const minY = group[i - 1].tip.y + step;
      if (group[i].tip.y < minY) group[i].tip.y = minY;
    }
  });

  return raw;
}

// ── Tooltip component ─────────────────────────────────────────────────────────

function DonutTooltip({ x, y, item, containerWidth }: {
  x: number; y: number; item: DataItem; containerWidth?: number;
}) {
  const TOOLTIP_W = 195;
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
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span style={{ width: 8, height: 8, borderRadius: 2, background: item.color, flexShrink: 0 }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{item.label}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <span style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Amount</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginLeft: 12 }}>{fmt(item.value)} ₴</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6 }}>
          <span style={{ flex: 1, fontSize: 12, color: 'var(--text-secondary)', whiteSpace: 'nowrap' }}>Share</span>
          <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', marginLeft: 12 }}>{item.percent}%</span>
        </div>
        {flipLeft ? (
          <span style={{ position: 'absolute', right: -5, top: '50%', transform: 'translateY(-50%)', display: 'block', width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderLeft: '5px solid var(--container-primary)' }} />
        ) : (
          <span style={{ position: 'absolute', left: -5, top: '50%', transform: 'translateY(-50%)', display: 'block', width: 0, height: 0, borderTop: '5px solid transparent', borderBottom: '5px solid transparent', borderRight: '5px solid var(--container-primary)' }} />
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function DonutChart({ rawData }: {
  rawData?: Array<{ label: string; value: number; percent: number }>;
}) {
  const svgRef    = useRef<SVGSVGElement>(null);
  const wrapRef   = useRef<HTMLDivElement>(null);
  const descId    = useId();

  const [hovered,    setHovered]    = useState<number | null>(null);
  const [tooltip,    setTooltip]    = useState<TooltipState>(null);
  const [animPct,    setAnimPct]    = useState(0);
  const [svgSize,    setSvgSize]    = useState({ w: 428, h: 315 });

  useEffect(() => {
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / ANIM_MS);
      const ease = 1 - Math.pow(1 - t, 3);
      setAnimPct(ease);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      if (width < 10 || height < 10) return;
      setSvgSize({ w: Math.round(width), h: Math.round(height) });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const allData: DataItem[] = useMemo(() =>
    (rawData ?? DEFAULT_DATA).map((d, i) => ({ ...d, color: SEGMENT_COLORS[i] })),
    [rawData],
  );
  const segmentTotal = useMemo(() => allData.reduce((s, d) => s + d.value, 0), [allData]);

  const { w: W, h: H } = svgSize;
  const LABEL_W = 100;
  const cx  = W / 2;
  const cy  = H / 2;
  const ro  = Math.min(Math.max(40, Math.min(W, H) / 2 - 8), 130);
  const ri  = ro * 0.50;
  const GAP = 1.5;

  const maxRawValue = Math.max(...allData.map((d) => d.value));
  const minRawValue = Math.min(...allData.map((d) => d.value));
  const rawRange    = Math.max(1, maxRawValue - minRawValue);

  type SegInfo = { startDeg: number; endDeg: number; dataIndex: number; pct: number; segRo: number };
  const segments: SegInfo[] = [];
  let cursor = -90;
  allData.forEach((d, i) => {
    const pct   = d.value / segmentTotal;
    const sweep = pct * 360 * animPct;
    const end   = cursor + sweep;
    const segRo = ri + (ro - ri) * (0.729 + 0.271 * (d.value - minRawValue) / rawRange);
    segments.push({ startDeg: cursor, endDeg: end, dataIndex: i, pct, segRo });
    cursor = end;
  });

  const isNarrow = W < 300;
  const CLAMP_H = H * 3;

  const staticSegs: Array<{ startDeg: number; endDeg: number; index: number; segRo: number }> = [];
  {
    let cur = -90;
    allData.forEach((d, i) => {
      const pct   = d.value / segmentTotal;
      const segRo = ri + (ro - ri) * (0.729 + 0.271 * (d.value - minRawValue) / rawRange);
      staticSegs.push({ startDeg: cur, endDeg: cur + pct * 360, index: i, segRo });
      cur += pct * 360;
    });
  }

  const staticLayouts = !isNarrow
    ? computeLayouts(staticSegs, cx, cy, ro, CLAMP_H)
    : [];

  const layouts = (!isNarrow && animPct >= 0.99)
    ? computeLayouts(
        segments.map((s) => ({ startDeg: s.startDeg, endDeg: s.endDeg, index: s.dataIndex, segRo: s.segRo })),
        cx, cy, ro, CLAMP_H,
      )
    : [];

  let vbX1 = cx - ro - 4;
  let vbY1 = cy - ro - 4;
  let vbX2 = cx + ro + 4;
  let vbY2 = cy + ro + 4;
  staticLayouts.forEach((l) => {
    const lx = l.side === 'right' ? l.tip.x : l.tip.x - LABEL_W;
    const ly = l.tip.y - LABEL_H / 2;
    vbX1 = Math.min(vbX1, lx - 4);
    vbX2 = Math.max(vbX2, lx + LABEL_W + 4);
    vbY1 = Math.min(vbY1, ly - 4);
    vbY2 = Math.max(vbY2, ly + LABEL_H + 4);
  });
  const vbW = vbX2 - vbX1;
  const vbH = vbY2 - vbY1;
  const viewBox = `${vbX1} ${vbY1} ${vbW} ${vbH}`;

  const svgScale = W > 0 && vbW > 0 ? Math.min(W / vbW, H / vbH) : 1;
  const invScale = svgScale > 0 ? 1 / svgScale : 1;

  const handleSegmentMouseMove = (
    e: React.MouseEvent<SVGPathElement>,
    idx: number,
  ) => {
    if (!wrapRef.current) return;
    const rect = wrapRef.current.getBoundingClientRect();
    setTooltip({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      item: allData[idx],
    });
    setHovered(idx);
  };

  const clearHover = () => {
    setHovered(null);
    setTooltip(null);
  };

  return (
    <div ref={wrapRef} className={styles.wrap}>
      <div className={styles.chartArea} style={{ position: 'relative' }}>
        <svg
          ref={svgRef}
          viewBox={viewBox}
          preserveAspectRatio="xMidYMid meet"
          width="100%"
          height="100%"
          className={styles.svg}
          aria-label="Revenue by category"
          aria-describedby={descId}
          role="img"
        >
          <desc id={descId}>
            Donut chart of revenue by category. Total: {fmt(segmentTotal)} ₴
          </desc>

          {/* Leader lines */}
          {layouts.map((l) => {
            const { anchor, elbow, tip } = l;
            const bx = elbow.x.toFixed(1);
            const ty = tip.y.toFixed(1);
            const d = `M ${anchor.x.toFixed(1)} ${anchor.y.toFixed(1)} L ${bx} ${ty} L ${tip.x.toFixed(1)} ${ty}`;
            return (
              <path
                key={`line-${l.index}`}
                d={d}
                fill="none"
                stroke="var(--stroke-secondary)"
                strokeWidth={1}
                strokeLinejoin="miter"
                opacity={hovered !== null && hovered !== l.index ? 0.5 : 1}
                style={{ transition: 'opacity 200ms ease' }}
              />
            );
          })}

          {/* Ring segments */}
          {segments.map((seg) => {
            const d = allData[seg.dataIndex];
            const isHov = hovered === seg.dataIndex;
            const isDimmed = hovered !== null && !isHov;
            const sweep = seg.endDeg - seg.startDeg;
            if (sweep < 0.01) return null;

            const path = ringArc(cx, cy, seg.segRo, ri, seg.startDeg + GAP / 2, seg.endDeg - GAP / 2, 2);

            return (
              <path
                key={`seg-${seg.dataIndex}`}
                d={path}
                fill={d.color}
                opacity={isDimmed ? 0.75 : 1}
                style={{
                  cursor: 'default',
                  transition: 'opacity 200ms ease',
                }}
                aria-label={`${d.label}: ${fmt(d.value)} ₴, ${d.percent}%`}
                onMouseMove={(e) => handleSegmentMouseMove(e, seg.dataIndex)}
                onMouseLeave={clearHover}
              />
            );
          })}

          {/* Center circle */}
          <circle cx={cx} cy={cy} r={ri} fill="var(--container-primary)" />

          {/* Center text */}
          <text
            x={cx} y={cy - 9 * invScale}
            textAnchor="middle" dominantBaseline="middle"
            className={styles.centerLabel}
            style={{ fontSize: `${12 * invScale}px` }}
          >
            Total
          </text>
          <text
            x={cx} y={cy + 9 * invScale}
            textAnchor="middle" dominantBaseline="middle"
            className={styles.centerValue}
            style={{ fontSize: `${14 * invScale}px` }}
          >
            {fmt(segmentTotal)} ₴
          </text>

          {/* Labels */}
          {!isNarrow && layouts.map((l) => {
            const d = allData[l.index];
            const isHov = hovered === l.index;
            const isDimmed = hovered !== null && !isHov;
            const labelH = LABEL_H;
            const x = l.side === 'right' ? l.tip.x : l.tip.x - LABEL_W;
            const y = l.tip.y - labelH / 2;

            return (
              <foreignObject
                key={`fo-${l.index}`}
                x={x} y={y}
                width={LABEL_W} height={labelH}
                style={{
                  opacity: isDimmed ? 0.85 : 1,
                  transition: 'opacity 250ms ease',
                  overflow: 'visible',
                }}
                onMouseEnter={() => setHovered(l.index)}
                onMouseLeave={clearHover}
              >
                <div className={styles.labelBlock} style={{ gap: `${4 * invScale}px` }}>
                  <span className={styles.catName} style={{ fontSize: `${12 * invScale}px`, lineHeight: `${16 * invScale}px` }}>{d.label}</span>
                  <div className={styles.valRow}>
                    <span className={styles.amount} style={{ fontSize: `${14 * invScale}px`, lineHeight: `${18 * invScale}px` }}>{fmt(d.value)} ₴</span>
                    <span className={styles.pctBadge} style={{ fontSize: `${12 * invScale}px`, lineHeight: `${16 * invScale}px` }}>{d.percent}%</span>
                  </div>
                </div>
              </foreignObject>
            );
          })}
        </svg>

        {tooltip && (
          <DonutTooltip x={tooltip.x} y={tooltip.y} item={tooltip.item} containerWidth={wrapRef.current?.clientWidth} />
        )}
      </div>
    </div>
  );
}
