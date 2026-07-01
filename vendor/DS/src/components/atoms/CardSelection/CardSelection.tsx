import { useState, useEffect, useRef } from 'react';
import type { CardSelectionProps } from './CardSelection.types';
import styles from './CardSelection.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

const CheckIcon = () => (
  <svg width="10" height="8" viewBox="0 0 40 32" aria-hidden="true">
    <path d="M15 30 L40 5 L35 0 L15 20 L5 10 L0 15 Z" fill="white" />
  </svg>
);

export function CardSelection({
  titleText = 'title',
  subtitleText = 'subtitle',
  state = 'default',
  onChange,
  className,
}: CardSelectionProps) {
  const isDisabled = state === 'disabled';
  const [checked, setChecked] = useState(state === 'selected');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setChecked(state === 'selected');
  }, [state]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const next = e.target.checked;
    setChecked(next);
    onChange?.(next);
  };

  /*
   * After a mouse click the <input> receives focus, keeping :focus-within
   * active on the wrapper — so the hover overlay stays visible even after
   * the cursor leaves. Blur on mouse-leave removes it immediately.
   * Keyboard users are unaffected: tabbing away naturally blurs the input.
   */
  const handleMouseLeave = () => {
    inputRef.current?.blur();
  };

  return (
    <label
      className={cx(
        styles.wrapper,
        checked && styles.selected,
        isDisabled && styles.disabled,
        className,
      )}
      data-state={state}
      onMouseLeave={handleMouseLeave}
    >
      <div className={styles.thumbnail} />

      <div className={styles.textContent}>
        <p className={styles.title}>{titleText}</p>
        <p className={styles.subtitle}>{subtitleText}</p>
      </div>

      <span className={styles.indicator}>
        <input
          ref={inputRef}
          type="checkbox"
          className={styles.input}
          checked={checked}
          disabled={isDisabled}
          onChange={handleChange}
        />
        <span className={cx(styles.box, checked && styles.boxChecked)}>
          {checked && <CheckIcon />}
        </span>
      </span>
    </label>
  );
}
