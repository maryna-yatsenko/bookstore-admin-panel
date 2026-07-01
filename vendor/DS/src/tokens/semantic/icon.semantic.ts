// =============================================================================
// SEMANTIC — icon (10 tokens)
// Icon fill color aliases.
// =============================================================================

import { colorPrimitives as c } from '../primitives/colors.primitive';

export const iconTokens = {
  primary:    c.gray[1100],          // #0A0A0A  — default icon
  secondary:  c.gray[900],           // #454548  — supporting icon
  tertiary:   c.gray[700],           // #929297  — muted icon
  white:      c.gray[100],           // #FFFFFF  — icon on dark bg
  success:    c.green[700],          // #28B420  — success icon
  warning:    c.orange[500],         // #FF8B5E  — warning icon
  error:      c.red[600],            // #FF575A  — error icon
  disable:    c.gray[600],           // #B6B6B9  — disabled icon
  accent:     c.accentPurple[700],   // #69388F  — accent icon
  brandColor: c.primaryYellow[600],  // #FFC229  — brand icon
} as const;

export type IconToken = keyof typeof iconTokens;
