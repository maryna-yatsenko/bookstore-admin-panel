import { useState } from 'react';
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
  children,
  className,
}: TooltipProps) {
  const [hovered, setHovered] = useState(false);
  const visible = open !== undefined ? open : hovered;

  const isVertical = position === 'top' || position === 'bottom';

  return (
    <span
      className={cx(styles.wrapper, className)}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
      {visible && (
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
          {position === 'right'  && <Pointer direction="right"  />}
          <span className={styles.box}>{content}</span>
          {position === 'top'    && <Pointer direction="top"    />}
          {position === 'left'   && <Pointer direction="left"   />}
        </span>
      )}
    </span>
  );
}
