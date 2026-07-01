// =============================================================================
// COMPONENT TOKENS — status (4 tokens)
// Flat map: semantic color per status type (icon/dot color only).
// =============================================================================

import { colorPrimitives as c } from '../primitives/colors.primitive';

export const statusTokens = {
  success: c.green[700],    // #31A24C
  warning: c.orange[600],   // #FF7A00
  error:   c.red[700],      // #E50003
  disable: c.gray[600],     // #B6B6B9
} as const;

export type StatusVariant = keyof typeof statusTokens;
