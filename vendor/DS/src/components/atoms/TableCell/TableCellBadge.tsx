import { Badge } from '../Badge/Badge';
import type { TableCellBadgeProps } from './TableCell.types';
import styles from './TableCell.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

const MAX_VISIBLE = 2;

export function TableCellBadge({
  badges = ['label'],
  getBadgeColor,
  getBadgeIcon,
  badgeType = 'outlined',
  className,
  style,
}: TableCellBadgeProps) {
  const visible  = badges.slice(0, MAX_VISIBLE);
  const overflow = badges.length - MAX_VISIBLE;

  return (
    <div className={cx(styles.cell, styles.dataCell, styles.badgeCell, className)} style={style}>
      {visible.map((label, i) => {
        const icon = getBadgeIcon?.(label, i);
        return (
          <Badge
            key={i}
            color={getBadgeColor ? getBadgeColor(label, i) : 'gray'}
            type={badgeType}
            labelText={label}
            leftIcon={Boolean(icon)}
            icon={icon}
          />
        );
      })}
      {overflow > 0 && (
        <span className={styles.badgeMore}>+{overflow}</span>
      )}
    </div>
  );
}
