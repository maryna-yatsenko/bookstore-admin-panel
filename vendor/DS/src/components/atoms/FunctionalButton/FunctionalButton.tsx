import type { FunctionalButtonProps } from './FunctionalButton.types';
import styles from './FunctionalButton.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

export function FunctionalButton({
  icon,
  label = 'label',
  state = 'default',
  disabled,
  className,
  ...rest
}: FunctionalButtonProps) {
  const effectiveDisabled = disabled || state === 'disabled';

  return (
    <button
      type="button"
      disabled={effectiveDisabled}
      aria-disabled={effectiveDisabled}
      className={cx(
        styles.root,
        state === 'hover'    && styles.stateHover,
        state === 'focused'  && styles.stateFocused,
        state === 'selected' && styles.stateSelected,
        effectiveDisabled    && styles.disabled,
        className,
      )}
      {...rest}
    >
      {icon && (
        <span className={styles.iconSlot} aria-hidden="true">
          {icon}
        </span>
      )}
      <span className={styles.label}>{label}</span>
    </button>
  );
}
