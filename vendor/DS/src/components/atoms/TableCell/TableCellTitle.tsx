import type { TableCellTitleProps } from './TableCell.types';
import styles from './TableCell.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

const SortIcon = ({ dir }: { dir?: 'asc' | 'desc' | null }) => (
  <svg
    width="8.276" height="12.219"
    viewBox="0 0 8.27623 12.2191"
    fill="currentColor"
    aria-hidden="true"
  >
    <path
      d="M8.27623 4.13807L4.13817 0L0.0001 4.13807L0.942907 5.08087L4.13817 1.88562L7.33343 5.08087L8.27623 4.13807Z"
      opacity={dir === 'desc' ? 0.3 : 1}
    />
    <path
      d="M0 8.08101L4.1381 12.2191L8.27617 8.08101L7.3333 7.13821L4.1381 10.3335L0.942807 7.13821L0 8.08101Z"
      opacity={dir === 'asc' ? 0.3 : 1}
    />
  </svg>
);

export function TableCellTitle({
  labelText  = 'label',
  showLabel  = true,
  showSort   = true,
  sortDir,
  onSort,
  className,
  style,
}: TableCellTitleProps) {
  return (
    <div className={cx(styles.cell, styles.titleCell, className)} style={style}>
      {showLabel && (
        <div className={styles.labelContainer}>
          <span className={styles.titleLabel}>{labelText}</span>
        </div>
      )}
      {showSort && (
        <button
          className={styles.sortBtn}
          aria-label="Sort column"
          type="button"
          onClick={onSort}
        >
          <SortIcon dir={sortDir} />
        </button>
      )}
    </div>
  );
}
