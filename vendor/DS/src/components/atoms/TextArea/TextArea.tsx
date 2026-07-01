import type { TextAreaProps } from './TextArea.types';
import styles from './TextArea.module.css';

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

export function TextArea({
  value = '',
  onChange,
  placeholder = 'input text',
  label = true,
  labelText = 'label',
  disclaimer = false,
  supporting = true,
  supportingText = 'supporting text',
  state = 'default',
  maxChars = 80,
  disabled,
  className,
  ...rest
}: TextAreaProps) {
  const effectiveDisabled = disabled || state === 'disabled';
  const showSupporting = supporting;
  const charCount = value.length;

  return (
    <div className={cx(styles.root, state !== 'default' && STATE_CLASS[state], className)}>
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

      <div className={cx(styles.field, state !== 'default' && STATE_CLASS[state])}>
        <textarea
          className={styles.textarea}
          value={value}
          onChange={(e) => onChange?.(e.target.value)}
          placeholder={placeholder}
          disabled={effectiveDisabled}
          maxLength={maxChars}
          {...rest}
        />
        <div className={styles.counter}>
          {charCount > 0 ? (
            <>
              <span className={styles.counterTyped}>{charCount}</span>
              <span>/{maxChars}</span>
            </>
          ) : (
            <span>0/{maxChars}</span>
          )}
        </div>
      </div>

      {showSupporting && (
        <span className={styles.supportingText}>{supportingText}</span>
      )}
    </div>
  );
}
