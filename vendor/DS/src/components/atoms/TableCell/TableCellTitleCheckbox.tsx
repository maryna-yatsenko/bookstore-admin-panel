import { useRef, useEffect } from 'react';
import type { TableCellTitleCheckboxProps } from './TableCell.types';
import styles from './TableCell.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

export function TableCellTitleCheckbox({
  checked = false,
  indeterminate = false,
  onChange,
  className,
  style,
}: TableCellTitleCheckboxProps) {
  const ref = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current) ref.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <div className={cx(styles.cell, styles.titleCell, styles.checkboxCell, className)} style={style}>
      <input
        ref={ref}
        type="checkbox"
        className={styles.checkbox}
        checked={checked}
        onChange={(e) => onChange?.(e.target.checked)}
        aria-label="Select all rows"
      />
    </div>
  );
}
