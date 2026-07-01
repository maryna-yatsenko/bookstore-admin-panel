import type { RadioButtonProps } from './RadioButton.types';
import styles from './RadioButton.module.css';

const cx = (...c: (string | undefined | false | null)[]) => c.filter(Boolean).join(' ');

export function RadioButton({
  selected = false,
  label,
  disabled = false,
  name,
  value,
  onChange,
  className,
}: RadioButtonProps) {
  return (
    <label className={cx(styles.wrapper, disabled && styles.disabled, className)}>
      <span className={styles.hitArea}>
        <input
          type="radio"
          className={styles.input}
          checked={selected}
          disabled={disabled}
          name={name}
          value={value}
          onChange={() => onChange?.(value ?? '')}
        />
        <span className={cx(styles.box, selected && styles.boxSelected)} />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  );
}
