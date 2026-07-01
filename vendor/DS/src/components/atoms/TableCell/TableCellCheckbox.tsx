import { useRef, useEffect } from 'react';
import type { TableCellCheckboxProps } from './TableCell.types';
import styles from './TableCell.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

export function TableCellCheckbox({
  checked = false,
  indeterminate = false,
  onChange,
  className,
  style,
}: TableCellCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div className={cx(styles.cell, styles.dataCell, styles.checkboxCell, className)} style={style}>
      <input
        ref={ref}
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        aria-label="Select row"
      />
    </div>
  );
}
