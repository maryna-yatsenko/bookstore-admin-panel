import { useRef, type KeyboardEvent } from 'react';
import type { SegmentedControlProps } from './SegmentedControl.types';
import styles from './SegmentedControl.module.css';

const cx = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(' ');

export function SegmentedControl({
  value = '',
  onChange = () => {},
  options = [],
  className,
  label,
}: SegmentedControlProps) {
  const groupRef = useRef<HTMLDivElement>(null);
  const activeIndex = options.findIndex((o) => o.value === value);

  const focusSegment = (index: number) => {
    const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>('[role="radio"]');
    buttons?.[index]?.focus();
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const enabledIndices = options
      .map((o, i) => (o.disabled ? null : i))
      .filter((i): i is number => i !== null);

    if (!enabledIndices.length) return;

    const currentPos = enabledIndices.indexOf(activeIndex);
    let nextIndex: number | undefined;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = enabledIndices[(currentPos + 1) % enabledIndices.length];
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = enabledIndices[(currentPos - 1 + enabledIndices.length) % enabledIndices.length];
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = enabledIndices[0];
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = enabledIndices[enabledIndices.length - 1];
    } else {
      return;
    }

    onChange(options[nextIndex].value);
    focusSegment(nextIndex);
  };

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={label}
      className={cx(styles.root, className)}
      onKeyDown={handleKeyDown}
    >
      {options.map((option) => {
        const isSelected = option.value === value;
        return (
          <button
            key={option.value}
            role="radio"
            aria-checked={isSelected}
            aria-disabled={option.disabled}
            disabled={option.disabled}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => !option.disabled && onChange(option.value)}
            className={cx(
              styles.segment,
              isSelected && styles.selected,
              option.disabled && styles.disabled,
              option.stateOverride === 'hover' && styles.stateHover,
              option.stateOverride === 'focused' && styles.stateFocused,
            )}
          >
            {option.leadingIcon && (
              <span className={styles.iconSlot} aria-hidden="true">
                {option.leadingIcon}
              </span>
            )}

            <span className={styles.label}>{option.label}</span>

            {option.trailingIcon && (
              <span className={styles.iconSlot} aria-hidden="true">
                {option.trailingIcon}
              </span>
            )}

            {option.badge !== undefined && (
              <span className={styles.badge}>
                {option.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
