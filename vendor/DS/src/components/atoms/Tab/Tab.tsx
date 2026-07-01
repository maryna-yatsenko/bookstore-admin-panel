import {
  createContext,
  useContext,
  useRef,
  type KeyboardEvent,
  type ReactNode,
} from 'react';
import type { TabGroupProps, TabItemProps } from './Tab.types';
import styles from './Tab.module.css';

const cx = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(' ');

/* ── Internal context ────────────────────────────────────────────────────────── */
interface TabCtx {
  activeValue: string;
  onChange: (value: string) => void;
}

const TabContext = createContext<TabCtx | null>(null);

/* ── TabItem ─────────────────────────────────────────────────────────────────── */
export function TabItem({
  value,
  children,
  leadingIcon,
  trailingIcon,
  badge,
  disabled = false,
  state,
  onClick,
  className,
}: TabItemProps) {
  const ctx = useContext(TabContext);
  const effectiveSelected = ctx?.activeValue === value || state === 'selected';
  const effectiveDisabled = disabled || state === 'disabled';

  const handleClick = () => {
    if (effectiveDisabled) return;
    if (onClick) onClick();
    else ctx?.onChange(value);
  };

  return (
    <button
      role="tab"
      id={`tab-${value}`}
      aria-selected={effectiveSelected}
      aria-disabled={effectiveDisabled}
      disabled={effectiveDisabled}
      tabIndex={effectiveSelected ? 0 : -1}
      onClick={handleClick}
      className={cx(
        styles.tab,
        effectiveSelected && styles.selected,
        effectiveDisabled && styles.disabled,
        state === 'hover' && styles.stateHover,
        state === 'focused' && styles.stateFocused,
        className,
      )}
    >
      {leadingIcon && (
        <span className={styles.iconSlot} aria-hidden="true">
          {leadingIcon}
        </span>
      )}

      <span className={styles.label}>{children}</span>

      {trailingIcon && (
        <span className={styles.iconSlot} aria-hidden="true">
          {trailingIcon}
        </span>
      )}

      {badge !== undefined && (
        <span className={styles.badge} aria-label={`${badge} items`}>
          {badge}
        </span>
      )}
    </button>
  );
}

/* ── TabGroup ────────────────────────────────────────────────────────────────── */
export function TabGroup({ value, onChange, children, className, label }: TabGroupProps) {
  const listRef = useRef<HTMLDivElement>(null);

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const buttons = Array.from(
      listRef.current?.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)') ?? [],
    );
    if (!buttons.length) return;

    const focused = document.activeElement as HTMLButtonElement;
    const currentIndex = buttons.indexOf(focused);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight') {
      e.preventDefault();
      nextIndex = (currentIndex + 1) % buttons.length;
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
    } else if (e.key === 'Home') {
      e.preventDefault();
      nextIndex = 0;
    } else if (e.key === 'End') {
      e.preventDefault();
      nextIndex = buttons.length - 1;
    } else {
      return;
    }

    const nextBtn = buttons[nextIndex];
    const nextValue = nextBtn.id.replace('tab-', '');
    onChange(nextValue);
    nextBtn.focus();
  };

  return (
    <TabContext.Provider value={{ activeValue: value, onChange }}>
      <div
        ref={listRef}
        role="tablist"
        aria-label={label}
        className={cx(styles.tabList, className)}
        onKeyDown={handleKeyDown}
      >
        {children as ReactNode}
      </div>
    </TabContext.Provider>
  );
}
