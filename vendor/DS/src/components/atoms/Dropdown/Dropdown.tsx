import { useState, useRef, useEffect, useId } from 'react';
import type { DropdownProps, DropdownSize } from './Dropdown.types';
import { DropdownItem } from '../DropdownItem';
import styles from './Dropdown.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

const SIZE_CLASS: Record<DropdownSize, string> = {
  xl: styles.sizeXl,
  m: styles.sizeM,
  s: styles.sizeS,
};

const ChevronIcon = ({ up = false, size = 20 }: { up?: boolean; size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 20 20" fill="none" aria-hidden="true">
    {up ? (
      <path d="M15 13L10 8L5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    ) : (
      <path d="M5 8L10 13L15 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    )}
  </svg>
);

export function Dropdown({
  size = 'm',
  state,
  value,
  onChange,
  options = [],
  placeholder = 'placeholder',
  label,
  disabled = false,
  defaultOpen = false,
  className,
}: DropdownProps) {
  const effectiveDisabled = disabled || state === 'disabled';
  const [isOpen, setIsOpen] = useState(defaultOpen || state === 'selected');
  const rootRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLDivElement>(null);
  const panelId = useId();

  const selectedOption = options.find((o) => o.value === value);
  const chevronSize = size === 's' ? 16 : 20;
  const isXl = size === 'xl';

  const toggle = () => {
    if (!effectiveDisabled) setIsOpen((v) => !v);
  };

  const select = (val: string) => {
    onChange?.(val);
    setIsOpen(false);
    triggerRef.current?.focus();
  };

  useEffect(() => {
    if (!isOpen) return;
    const onOutside = (e: MouseEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setIsOpen(false);
    };
    document.addEventListener('mousedown', onOutside);
    return () => document.removeEventListener('mousedown', onOutside);
  }, [isOpen]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (effectiveDisabled) return;
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      toggle();
    } else if (e.key === 'Escape') {
      setIsOpen(false);
    } else if (e.key === 'ArrowDown' && !isOpen) {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  return (
    <div ref={rootRef} className={cx(styles.root, className)} data-dropdown="">
      {label && !isXl && <span className={styles.label}>{label}</span>}

      {/* Wrapper gives the panel a position:relative anchor matching the trigger width */}
      <div className={styles.triggerWrap}>
        <div
          ref={triggerRef}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-controls={isOpen ? panelId : undefined}
          aria-disabled={effectiveDisabled}
          tabIndex={effectiveDisabled ? -1 : 0}
          className={cx(
            styles.trigger,
            SIZE_CLASS[size],
            isOpen && styles.open,
            effectiveDisabled && styles.disabled,
            state === 'hover' && styles.stateHover,
            state === 'focused' && styles.stateFocused,
          )}
          onClick={toggle}
          onKeyDown={handleKeyDown}
        >
          {/* XL — complex: avatar + name + position */}
          {isXl && (
            <div className={styles.xlContent}>
              <div className={styles.avatar} aria-hidden="true">
                {selectedOption?.avatar}
              </div>
              <div className={styles.textColumn}>
                <span className={styles.name}>
                  {selectedOption?.name ?? placeholder}
                </span>
                <span className={styles.positionText}>
                  {selectedOption?.position ?? 'position'}
                </span>
              </div>
            </div>
          )}

          {/* M / S — badge replaces text when selected option has badge */}
          {!isXl && (
            <>
              {selectedOption?.badge ? (
                <span className={cx(styles.badge, selectedOption.badgeVariant === 'gray' && styles.badgeGray)}>
                  {selectedOption.badge}
                </span>
              ) : (
                <span className={styles.text}>
                  {selectedOption?.label ?? placeholder}
                </span>
              )}
            </>
          )}

          {/* Chevron — always present, margin-left: auto pushes it to the right */}
          <span className={styles.chevron}>
            <ChevronIcon up={isOpen} size={chevronSize} />
          </span>
        </div>

        {/* Panel — sibling of trigger, positioned via triggerWrap */}
        {isOpen && (
          <div
            id={panelId}
            role="listbox"
            className={styles.panel}
            onClick={(e) => e.stopPropagation()}
          >
            {options.map((opt) => (
              <DropdownItem
                key={opt.value}
                type={isXl ? 'complex' : 'default'}
                isSelected={opt.value === value}
                disabled={opt.disabled}
                avatar={opt.avatar}
                position={opt.position}
                leadingIcon={opt.leadingIcon}
                trailingIcon={opt.trailingIcon}
                badge={opt.badge}
                badgeVariant={opt.badgeVariant}
                onClick={() => !opt.disabled && select(opt.value)}
              >
                {isXl ? opt.name : opt.label}
              </DropdownItem>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
