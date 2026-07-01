import type { IconProps } from './Icon.types';
import { ICON_PATHS } from './icons';

export function Icon({
  name,
  size = 24,
  color = 'currentColor',
  className,
  'aria-label': ariaLabel,
}: IconProps) {
  const d = ICON_PATHS[name];
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill={color}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden={ariaLabel ? undefined : true}
      aria-label={ariaLabel}
      className={className}
    >
      <path d={d} />
    </svg>
  );
}
