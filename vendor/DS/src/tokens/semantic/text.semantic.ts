// =============================================================================
// SEMANTIC — text (52 tokens)
// Color aliases + full typography style definitions.
// =============================================================================

import { colorPrimitives as c } from '../primitives/colors.primitive';
import { typographyPrimitives as t } from '../primitives/typography.primitive';

// ---------------------------------------------------------------------------
// Text color aliases (8 tokens)
// ---------------------------------------------------------------------------
export const textColorTokens = {
  primary:   c.gray[1100],   // #0A0A0A  — body / heading default
  secondary: c.gray[900],    // #454548  — supporting text
  tertiary:  c.gray[800],    // #747479  — placeholder / meta
  white:     c.gray[100],    // #FFFFFF  — text on dark surfaces
  success:   c.mint[700],    // #23827B  — success message text
  warning:   c.orange[600],  // #FF5B1C  — warning message text
  error:     c.red[700],     // #E50003  — error / destructive text
  disable:   c.gray[600],    // #B6B6B9  — disabled label
} as const;

// ---------------------------------------------------------------------------
// Typography style tokens
// Each entry maps to { fontSize, lineHeight, fontWeight, fontFamily }
// ---------------------------------------------------------------------------
export const textStyles = {

  // ── title ─────────────────────────────────────────────────────────────────
  'title/h1': {
    fontSize:   t.fontSize[32],
    lineHeight: t.lineHeight[32],
    fontWeight: t.fontWeight.semibold,
    fontFamily: t.fontFamily.sans,
  },

  'title/h2-medium': {
    fontSize:   t.fontSize[24],
    lineHeight: t.lineHeight[30],
    fontWeight: t.fontWeight.medium,
    fontFamily: t.fontFamily.sans,
  },

  'title/h2-semibold': {
    fontSize:   t.fontSize[24],
    lineHeight: t.lineHeight[30],
    fontWeight: t.fontWeight.semibold,
    fontFamily: t.fontFamily.sans,
  },

  'title/h3-regular': {
    fontSize:   t.fontSize[16],
    lineHeight: t.lineHeight[20],
    fontWeight: t.fontWeight.regular,
    fontFamily: t.fontFamily.sans,
  },

  'title/h3-semibold': {
    fontSize:   t.fontSize[16],
    lineHeight: t.lineHeight[20],
    fontWeight: t.fontWeight.semibold,
    fontFamily: t.fontFamily.sans,
  },

  // ── body ──────────────────────────────────────────────────────────────────
  'body/body-regular': {
    fontSize:   t.fontSize[14],
    lineHeight: t.lineHeight[18],
    fontWeight: t.fontWeight.regular,
    fontFamily: t.fontFamily.sans,
  },

  'body/body-semibold': {
    fontSize:   t.fontSize[14],
    lineHeight: t.lineHeight[18],
    fontWeight: t.fontWeight.semibold,
    fontFamily: t.fontFamily.sans,
  },

  'body/body-paragraph': {
    fontSize:   t.fontSize[14],
    lineHeight: t.lineHeight[20],
    fontWeight: t.fontWeight.regular,
    fontFamily: t.fontFamily.sans,
  },

  // ── button ────────────────────────────────────────────────────────────────
  'button': {
    fontSize:   t.fontSize[14],
    lineHeight: t.lineHeight[14],
    fontWeight: t.fontWeight.medium,
    fontFamily: t.fontFamily.sans,
  },

  // ── caption ───────────────────────────────────────────────────────────────
  'caption/caption-semibold': {
    fontSize:   t.fontSize[12],
    lineHeight: t.lineHeight[14],
    fontWeight: t.fontWeight.semibold,
    fontFamily: t.fontFamily.sans,
  },

  'caption/caption-regular': {
    fontSize:   t.fontSize[12],
    lineHeight: t.lineHeight[14],
    fontWeight: t.fontWeight.regular,
    fontFamily: t.fontFamily.sans,
  },

} as const;

export type TextColorToken = keyof typeof textColorTokens;
export type TextStyleToken = keyof typeof textStyles;
