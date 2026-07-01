import type { SearchInputProps } from './SearchInput.types';
import styles from './SearchInput.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

/*
 * All icons use viewBox="0 0 20 20" so they render inside the 20px CSS slot correctly.
 * Each path is translated to match exact Figma insets:
 *   Search:  inner 16.928px → offset (20-16.928)/2 = 1.536
 *   Close:   inner 10.607px → offset (20-10.607)/2 = 4.697
 *   Mic:     inner 14.908×18.333 → offset x=(20-14.908)/2=2.546, y=(20-18.333)/2=0.834
 */

const SearchIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <g transform="translate(1.536, 1.536)">
      <path d="M13.3592 12.1807L16.9281 15.7496L15.7496 16.9281L12.1807 13.3592C10.8974 14.3858 9.27 15 7.5 15C3.36 15 0 11.64 0 7.5C0 3.36 3.36 0 7.5 0C11.64 0 15 3.36 15 7.5C15 9.27 14.3858 10.8974 13.3592 12.1807ZM11.6873 11.5623C12.7063 10.5122 13.3333 9.07967 13.3333 7.5C13.3333 4.27708 10.7229 1.66667 7.5 1.66667C4.27708 1.66667 1.66667 4.27708 1.66667 7.5C1.66667 10.7229 4.27708 13.3333 7.5 13.3333C9.07967 13.3333 10.5122 12.7063 11.5623 11.6873L11.6873 11.5623Z" fill="currentColor" />
    </g>
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <g transform="translate(4.697, 4.697)">
      <path d="M5.3033 4.12482L9.42813 0L10.6066 1.17851L6.4818 5.30332L10.6066 9.42807L9.42813 10.6066L5.3033 6.48182L1.17852 10.6066L0 9.42807L4.1248 5.30332L0 1.17851L1.17852 0L5.3033 4.12482Z" fill="currentColor" />
    </g>
  </svg>
);

const MicIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <g transform="translate(2.546, 0.834)">
      <path d="M7.45426 1.66667C6.07351 1.66667 4.95422 2.78596 4.95422 4.16667V7.5C4.95422 8.88075 6.07351 10 7.45426 10C8.83493 10 9.95426 8.88075 9.95426 7.5V4.16667C9.95426 2.78596 8.83493 1.66667 7.45426 1.66667ZM7.45426 0C9.75543 0 11.6209 1.86548 11.6209 4.16667V7.5C11.6209 9.80117 9.75543 11.6667 7.45426 11.6667C5.15303 11.6667 3.28756 9.80117 3.28756 7.5V4.16667C3.28756 1.86548 5.15303 0 7.45426 0ZM0 8.33333H1.67997C2.08433 11.1602 4.5155 13.3333 7.45426 13.3333C10.3929 13.3333 12.8241 11.1602 13.2285 8.33333H14.9084C14.5242 11.8097 11.7639 14.5699 8.28759 14.9542V18.3333H6.62092V14.9542C3.14454 14.5699 0.384292 11.8097 0 8.33333Z" fill="currentColor" />
    </g>
  </svg>
);

/* ── State class map ───────────────────────────────────────────────────────── */
const STATE_CLASS: Record<string, string> = {
  hover:    styles.stateHover,
  focused:  styles.stateFocused,
  typing:   styles.stateTyping,
  entered:  styles.stateEntered,
  disabled: styles.stateDisabled,
};

/* ── Component ────────────────────────────────────────────────────────────── */
export function SearchInput({
  value = '',
  onChange,
  placeholder = 'input text',
  state = 'default',
  disabled,
  className,
  ...rest
}: SearchInputProps) {
  const effectiveDisabled = disabled || state === 'disabled';
  const hasButtons = state === 'typing' || state === 'entered';

  return (
    <div
      className={cx(
        styles.field,
        state !== 'default' && STATE_CLASS[state],
        className,
      )}
    >
      {/* Search icon */}
      <span className={styles.iconSlot}>
        <SearchIcon />
      </span>

      {/* Text input */}
      <input
        type="text"
        className={styles.input}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        disabled={effectiveDisabled}
        aria-label="Search"
        {...rest}
      />

      {/* typing / entered: cross + mic group */}
      {hasButtons && (
        <div className={styles.buttons}>
          <button
            type="button"
            className={styles.iconSlot}
            onClick={() => onChange?.('')}
            aria-label="Clear"
          >
            <CloseIcon />
          </button>
          <span className={styles.iconSlot} aria-hidden="true">
            <MicIcon />
          </span>
        </div>
      )}

      {/* default / hover / focused / disabled: mic only */}
      {!hasButtons && (
        <span className={styles.iconSlot} aria-hidden="true">
          <MicIcon />
        </span>
      )}
    </div>
  );
}
