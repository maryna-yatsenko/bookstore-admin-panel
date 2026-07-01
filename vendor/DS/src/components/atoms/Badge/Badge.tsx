import type { BadgeProps } from './Badge.types';
import styles from './Badge.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

const DotIcon = () => (
  <svg viewBox="0 0 6 6" fill="none" aria-hidden="true">
    <circle cx="3" cy="3" r="3" fill="currentColor" />
  </svg>
);

const COLOR_CLASS: Record<string, string> = {
  blue:   styles.blue,
  lilac:  styles.lilac,
  green:  styles.green,
  orange: styles.orange,
  red:    styles.red,
  pink:   styles.pink,
  gray:   styles.gray,
  white:  styles.white,
};

export function Badge({
  color = 'blue',
  type = 'outlined',
  labelText = 'label',
  leftIcon = false,
  rightIcon = false,
  className,
}: BadgeProps) {
  return (
    <span
      className={cx(
        styles.badge,
        COLOR_CLASS[color],
        type === 'filled' ? styles.filled : styles.outlined,
        color === 'white' && type === 'filled' && styles.whiteFilled,
        className,
      )}
    >
      {leftIcon && (
        <span className={styles.iconSlot} aria-hidden="true">
          <DotIcon />
        </span>
      )}
      <span className={styles.label}>{labelText}</span>
      {rightIcon && (
        <span className={styles.iconSlot} aria-hidden="true">
          <DotIcon />
        </span>
      )}
    </span>
  );
}
