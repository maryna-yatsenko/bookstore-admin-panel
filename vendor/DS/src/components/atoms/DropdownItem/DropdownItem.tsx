import type { DropdownItemProps } from './DropdownItem.types';
import styles from './DropdownItem.module.css';

const cx = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(' ');

export function DropdownItem({
  type = 'default',
  state,
  children,
  position,
  avatar,
  leadingIcon,
  trailingIcon,
  badge,
  badgeVariant = 'mint',
  isSelected = false,
  disabled = false,
  onClick,
  className,
}: DropdownItemProps) {
  const effectiveSelected = isSelected || state === 'selected';
  const effectiveDisabled = disabled || state === 'disabled';

  return (
    <div
      role="option"
      aria-selected={effectiveSelected}
      aria-disabled={effectiveDisabled}
      tabIndex={effectiveDisabled ? -1 : 0}
      onClick={!effectiveDisabled ? onClick : undefined}
      onKeyDown={(e) => {
        if (!effectiveDisabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick?.();
        }
      }}
      className={cx(
        styles.item,
        type === 'default' ? styles.typeDefault : styles.typeComplex,
        effectiveSelected && styles.selected,
        state === 'hover' && styles.stateHover,
        state === 'focused' && styles.stateFocused,
        className,
      )}
    >
      {type === 'default' ? (
        <>
          {leadingIcon && (
            <span className={styles.iconSlot} aria-hidden="true">
              {leadingIcon}
            </span>
          )}

          {badge !== undefined && badge !== '' ? (
            <span className={cx(styles.badge, badgeVariant === 'gray' && styles.badgeGray)}>
              {badge}
            </span>
          ) : (
            <span className={styles.text}>{children}</span>
          )}

          {trailingIcon && (
            <span className={styles.iconSlot} aria-hidden="true">
              {trailingIcon}
            </span>
          )}
        </>
      ) : (
        <div className={styles.complexContent}>
          <div className={styles.avatar} aria-hidden="true">
            {avatar}
          </div>
          <div className={styles.textColumn}>
            <span className={styles.name}>{children}</span>
            {position && (
              <span className={styles.positionText}>{position}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
