import { useRef, useEffect } from 'react';
import type { CheckboxProps } from './Checkbox.types';
import styles from './Checkbox.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

/* Filled polygon — exact Figma proportions (viewBox 0 0 40 30) */
const CheckIcon = () => (
  <svg width="10" height="8" viewBox="0 0 40 32" aria-hidden="true">
    <path d="M15 30 L40 5 L35 0 L15 20 L5 10 L0 15 Z" fill="white" />
  </svg>
);

/* Filled rectangle — 55% box width × 11% box height, matching Figma */
const DashIcon = () => (
  <svg width="8" height="2" viewBox="0 0 8 2" aria-hidden="true">
    <rect width="8" height="2" fill="white" />
  </svg>
);

export function Checkbox({
  checked = false,
  indeterminate = false,
  label,
  disabled = false,
  onChange,
  className,
}: CheckboxProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.indeterminate = indeterminate && !checked;
    }
  }, [indeterminate, checked]);

  const isIndeterminate = indeterminate && !checked;

  return (
    <label className={cx(styles.wrapper, disabled && styles.disabled, className)}>
      <span className={styles.hitArea}>
        <input
          ref={inputRef}
          type="checkbox"
          className={styles.input}
          checked={checked}
          disabled={disabled}
          onChange={(e) => onChange?.(e.target.checked)}
        />
        <span className={cx(
          styles.box,
          checked && !isIndeterminate && styles.boxChecked,
          isIndeterminate && styles.boxIndeterminate,
        )}>
          {checked && !isIndeterminate && <CheckIcon />}
          {isIndeterminate && <DashIcon />}
        </span>
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
