// =============================================================================
// SEMANTIC — spacing (19 tokens)
// Aliases to numbers primitives. Use these in components, never raw px.
// =============================================================================

import { spacingPrimitives as n } from '../primitives/spacing.primitive';

export const spacingTokens = {
  0:   n[0],
  2:   n[2],
  4:   n[4],
  6:   n[6],
  8:   n[8],
  12:  n[12],
  16:  n[16],
  20:  n[20],
  24:  n[24],
  32:  n[32],
  40:  n[40],
  48:  n[48],
  56:  n[56],
  64:  n[64],
  72:  n[72],
  80:  n[80],
  88:  n[88],
  92:  n[92],
  100: n[100],
} as const;

export type SpacingToken = keyof typeof spacingTokens;
