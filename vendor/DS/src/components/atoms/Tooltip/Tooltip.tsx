import { useState, useRef } from 'react';
import { createPortal } from 'react-dom';
import type { TooltipProps, TooltipPosition } from './Tooltip.types';
import styles from './Tooltip.module.css';

const cx = (...c: (string | undefined | false | null)[]) =>
  c.filter(Boolean).join(' ');

function Pointer({ direction }: { direction: TooltipPosition }) {
  if (direction === 'top') {
    return (
      <svg className={styles.pointer} width="12" height="7" viewBox="0 0 12 7" fill="none" aria-hidden="true">
        <path d="M0 0 L6 7 L12 0 Z" fill="var(--container-primary)" />
      </svg>
    );
  }
  if (direction === 'bottom') {
    return (
      <svg className={styles.pointer} width="12" height="7" viewBox="0 0 12 7" fill="none" aria-hidden="true">
        <path d="M0 7 L6 0 L12 7 Z" fill="var(--container-primary)" />
      </svg>
    );
  }
  if (direction === 'left') {
    return (
      <svg className={styles.pointer} width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
        <path d="M7 0 L0 6 L7 12 Z" fill="var(--container-primary)" />
      </svg>
    );
  }
  return (
    <svg className={styles.pointer} width="7" height="12" viewBox="0 0 7 12" fill="none" aria-hidden="true">
      <path d="M0 0 L7 6 L0 12 Z" fill="var(--container-primary)" />
    </svg>
  );
}

export function Tooltip({
  content,
  type = 'hug',
  position = 'top',
  open,
  portal = false,
  children,
  className,
}: TooltipProps) {
  const [hovered, setHovered] = useState(false);
  const [rect, setRect]       = useState<DOMRect | null>(null);
  const wrapRef               = useRef<HTMLSpanElement>(null);

  const visible = open !== undefined ? open : hovered;
  const isVertical = position === 'top' || position === 'bottom';

  function handleEnter() {
    setHovered(true);
    if (portal && wrapRef.current) {
      setRect(wrapRef.current.getBoundingClientRect());
    }
  }
  function handleLeave() {
    setHovered(false);
    setRect(null);
  }

  /* ── Portal bubble (escapes overflow containers) ── */
  const portalBubble = portal && visible && rect ? createPortal(
    <span
      className={cx(
        styles.tooltip,
        styles[position],
        !isVertical && styles.horizontal,
        type === 'manual' && styles.manual,
        styles.portalBubble,
      )}
      role="tooltip"
      style={
        position === 'bottom' ? {
          top:  rect.bottom + 2,
          left: rect.left + rect.width / 2,
        } : position === 'top' ? {
          bottom: window.innerHeight - rect.top + 2,
          left:   rect.left + rect.width / 2,
        } : position === 'right' ? {
          top:  rect.top + rect.height / 2,
          left: rect.right + 2,
        } : {
          top:   rect.top + rect.height / 2,
          right: window.innerWidth - rect.left + 2,
        }
      }
    >
      {position === 'bottom' && <Pointer direction="bottom" />}
      {position === 'right'  && <Pointer direction="left"   />}
      <span className={styles.box}>{content}</span>
      {position === 'top'    && <Pointer direction="top"    />}
      {position === 'left'   && <Pointer direction="left"   />}
    </span>,
    document.body,
  ) : null;

  return (
    <span
      ref={wrapRef}
      className={cx(styles.wrapper, className)}
      onMouseEnter={handleEnter}
      onMouseLeave={handleLeave}
    >
      {children}
      {!portal && visible && (
        <span
          className={cx(
            styles.tooltip,
            styles[position],
            !isVertical && styles.horizontal,
            type === 'manual' && styles.manual,
          )}
          role="tooltip"
        >
          {position === 'bottom' && <Pointer direction="bottom" />}
          {position === 'right'  && <Pointer direction="left"   />}
          <span className={styles.box}>{content}</span>
          {position === 'top'    && <Pointer direction="top"    />}
          {position === 'left'   && <Pointer direction="left"   />}
        </span>
      )}
      {portalBubble}
    </span>
  );
}
