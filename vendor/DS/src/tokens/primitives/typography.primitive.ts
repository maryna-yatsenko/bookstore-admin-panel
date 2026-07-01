// =============================================================================
// PRIMITIVE TYPOGRAPHY TOKENS
// Raw values from Figma "typography" group.
// =============================================================================

export const typographyPrimitives = {

  fontFamily: {
    sans: 'SF Pro Text',
  },

  // font-size in px (5 steps)
  fontSize: {
    12: 12,
    14: 14,
    16: 16,
    24: 24,
    32: 32,
  },

  // line-height in px (7 steps)
  lineHeight: {
    14: 14,
    16: 16,
    18: 18,
    20: 20,
    24: 24,
    30: 30,
    32: 32,
  },

  // font-weight numeric values
  fontWeight: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },

} as const;

export type FontFamily = keyof typeof typographyPrimitives.fontFamily;
export type FontSize = keyof typeof typographyPrimitives.fontSize;
export type LineHeight = keyof typeof typographyPrimitives.lineHeight;
export type FontWeight = keyof typeof typographyPrimitives.fontWeight;
