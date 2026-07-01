import type { StatusProps } from './Status.types';
import styles from './Status.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

const DOT_CLASS = {
  success:  styles.dotSuccess,
  warning:  styles.dotWarning,
  error:    styles.dotError,
  disabled: styles.dotDisable,
} as const;

export function Status({
  status    = 'success',
  size      = 'small',
  labelText = 'label',
  className,
}: StatusProps) {
  const isBig = size === 'big';

  return (
    <div className={cx(styles.status, isBig ? styles.big : styles.small, className)}>
      <span
        className={cx(styles.dot, isBig ? styles.dotBig : styles.dotSmall, DOT_CLASS[status])}
        aria-hidden="true"
      />
      <span className={cx(styles.text, isBig ? styles.textBig : styles.textSmall)}>
        {labelText}
      </span>
    </div>
  );
}
