import type { InputProps } from './Input.types';
import styles from './Input.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

const InfoIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" aria-hidden="true">
    <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5" />
    <path d="M8 7v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    <circle cx="8" cy="5" r="0.75" fill="currentColor" />
  </svg>
);

const STATE_CLASS: Record<string, string> = {
  hover:    styles.stateHover,
  focused:  styles.stateFocused,
  typing:   styles.stateTyping,
  entered:  styles.stateEntered,
  success:  styles.stateSuccess,
  error:    styles.stateError,
  disabled: styles.stateDisabled,
};

export function Input({
  value = '',
  onChange,
  placeholder = 'input text',
  label = true,
  labelText = 'label',
  disclaimer = false,
  trailingIcon,
  supportingText = 'supporting text',
  state = 'default',
  disabled,
  className,
  ...rest
}: InputProps) {
  const effectiveDisabled = disabled || state === 'disabled';
  const showSupporting = state === 'success' || state === 'error';

  return (
    <div
      className={cx(
        styles.root,
        state !== 'default' && STATE_CLASS[state],
        className,
      )}
    >
      {label && (
        <div className={styles.labelRow}>
          <span className={cx(styles.label, disclaimer && styles.labelHug)}>{labelText}</span>
          {disclaimer && (
            <span className={styles.disclaimerIcon}>
              <InfoIcon />
            </span>
          )}
        </div>
      )}

      <div
        className={cx(
          styles.field,
          state !== 'default' && STATE_CLASS[state],
          Boolean(trailingIcon) && styles.fieldWithIcon,
        )}
      >
        <input
          className={styles.input}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={effectiveDisabled}
          {...rest}
        />
        {trailingIcon && (
          <span className={styles.trailingIcon} aria-hidden="true">
            {trailingIcon}
          </span>
        )}
      </div>

      {showSupporting && (
        <span className={styles.supportingText}>{supportingText}</span>
      )}
    </div>
  );
}
