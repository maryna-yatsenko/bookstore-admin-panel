// =============================================================================
// SEMANTIC — corner-radius (11 tokens)
// Border-radius aliases. `infinity` → pill / fully-rounded shape.
// =============================================================================

import { spacingPrimitives as n } from '../primitives/spacing.primitive';

export const cornerRadiusTokens = {
  0:        n[0],
  2:        n[2],
  4:        n[4],
  6:        n[6],
  8:        n[8],
  12:       n[12],
  16:       n[16],
  20:       n[20],
  24:       n[24],
  32:       n[32],
  infinity: n[1000],   // 1000px → visually pill-shaped
} as const;

export type CornerRadiusToken = keyof typeof cornerRadiusTokens;
