// =============================================================================
// PRIMITIVE SPACING / NUMBER TOKENS
// Raw numeric scale from Figma "numbers" group (20 values).
// Values are in px. Use via semantic spacing tokens in components.
// =============================================================================

export const spacingPrimitives = {
  0: 0,
  2: 2,
  4: 4,
  6: 6,
  8: 8,
  12: 12,
  16: 16,
  20: 20,
  24: 24,
  32: 32,
  40: 40,
  48: 48,
  56: 56,
  64: 64,
  72: 72,
  80: 80,
  88: 88,
  92: 92,
  100: 100,
  1000: 1000,
} as const;

export type SpacingScale = keyof typeof spacingPrimitives;
