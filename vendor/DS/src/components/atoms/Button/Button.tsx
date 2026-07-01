import { forwardRef } from 'react';
import type { ButtonProps, ButtonVariant, ButtonSize } from './Button.types';
import styles from './Button.module.css';

const cx = (...classes: (string | undefined | false | null)[]) =>
  classes.filter(Boolean).join(' ');

const SIZE: Record<ButtonSize, string> = {
  l: styles.sizeL,
  m: styles.sizeM,
  s: styles.sizeS,
};

const VARIANT: Record<ButtonVariant, string> = {
  primary:     styles.variantPrimary,
  secondary:   styles.variantSecondary,
  transparent: styles.variantTransparent,
  success:     styles.variantSuccess,
  error:       styles.variantError,
  ghost:       styles.variantGhost,
  link:        styles.variantLink,
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'l',
      leftIcon,
      rightIcon,
      iconOnly = false,
      children,
      className,
      disabled,
      type = 'button',
      ...rest
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        type={type}
        className={cx(
          styles.button,
          SIZE[size],
          VARIANT[variant],
          iconOnly && styles.iconOnly,
          className,
        )}
        disabled={disabled}
        aria-disabled={disabled}
        {...rest}
      >
        {leftIcon && (
          <span className={styles.iconSlot} aria-hidden="true">
            {leftIcon}
          </span>
        )}

        {!iconOnly && children}

        {rightIcon && !iconOnly && (
          <span className={styles.iconSlot} aria-hidden="true">
            {rightIcon}
          </span>
        )}
      </button>
    );
  },
);

Button.displayName = 'Button';
