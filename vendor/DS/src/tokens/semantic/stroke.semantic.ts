// =============================================================================
// SEMANTIC — stroke (14 tokens)
// Border / outline color aliases.
// =============================================================================

import { colorPrimitives as c } from '../primitives/colors.primitive';

export const strokeTokens = {
  primary:    c.gray[600],           // #B6B6B9  — default border
  secondary:  c.gray[400],           // #DADADC  — subtle border
  tertiary:   c.gray[300],           // #F2F2F3  — hairline / divider
  white:      c.gray[100],           // #FFFFFF  — white outline (on dark bg)
  black:      c.gray[1100],          // #0A0A0A  — black outline
  hover:      c.primaryYellow[300],  // #FFF1CC  — hover border
  focused:    c.primaryYellow[400],  // #FFE5A3  — focus ring border
  pressed:    c.primaryYellow[500],  // #FFD05C  — pressed border
  success:    c.green[700],          // #28B420  — success state border
  warning:    c.orange[500],         // #FF8B5E  — warning state border
  error:      c.red[600],            // #FF575A  — error state border
  disable:    c.gray[400],           // #DADADC  — disabled border
  accent:     c.accentPurple[700],   // #69388F  — accent border
  brandColor: c.primaryYellow[600],  // #FFC229  — brand border
} as const;

export type StrokeToken = keyof typeof strokeTokens;
