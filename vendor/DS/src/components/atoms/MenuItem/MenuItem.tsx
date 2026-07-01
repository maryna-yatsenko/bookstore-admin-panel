import type { MenuItemProps } from './MenuItem.types';
import styles from './MenuItem.module.css';

const cx = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(' ');

export function MenuItem({
  type = 'complex',
  state = 'default',
  label = 'placeholder',
  icon,
  badge = false,
  badgeCount = 0,
  selected,
  disabled,
  onClick,
  className,
  ...rest
}: MenuItemProps) {
  const isSelected = selected || state === 'selected';
  const isDisabled = disabled || state === 'disabled';
  const isDanger = state === 'danger';
  const isComplex = type === 'complex';

  return (
    <div
      role="menuitem"
      tabIndex={isDisabled ? -1 : 0}
      aria-selected={isSelected || undefined}
      aria-disabled={isDisabled || undefined}
      onClick={!isDisabled ? onClick : undefined}
      onKeyDown={(e) => {
        if (!isDisabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cx(
        styles.item,
        type === 'icon-button' ? styles.iconButton : styles.complex,
        isSelected && styles.selected,
        isDisabled && styles.disabled,
        isDanger && styles.danger,
        state === 'hover' && styles.forceHover,
        state === 'focused' && styles.forceFocused,
        className,
      )}
      {...rest}
    >
      {icon && (
        <span className={styles.iconSlot} aria-hidden="true">
          {icon}
        </span>
      )}

      {isComplex && (
        <span className={styles.label}>{label}</span>
      )}

      {isComplex && badge && (
        <span className={styles.badge}>{badgeCount}</span>
      )}
    </div>
  );
}
