import type { TableCellActionsProps } from './TableCell.types';
import styles from './TableCell.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

const DotIcon = () => (
  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="4" fill="currentColor" />
  </svg>
);

export function TableCellActions({
  onEdit,
  onDelete,
  onMore,
  showDelete = false,
  showMore   = false,
  className,
  style,
}: TableCellActionsProps) {
  return (
    <div className={cx(styles.cell, styles.dataCell, styles.actionsCell, className)} style={style}>
      <button
        className={styles.actionBtn}
        onClick={onEdit}
        aria-label="Edit"
        type="button"
      >
        <DotIcon />
      </button>

      {showDelete && (
        <button
          className={styles.actionBtn}
          onClick={onDelete}
          aria-label="Delete"
          type="button"
        >
          <DotIcon />
        </button>
      )}

      {showMore && (
        <button
          className={styles.actionBtn}
          onClick={onMore}
          aria-label="More actions"
          type="button"
        >
          <DotIcon />
        </button>
      )}
    </div>
  );
}
