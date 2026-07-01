// =============================================================================
// COMPONENT TOKENS — badge (40 tokens, 8 variants × 5 props)
// Variants: blue · lilac · mint · orange · red · pink · gray · white
// Props: bg · stroke · text · icon · cornerRadius
// Badge is a static display component — no interaction states.
// =============================================================================

import { colorPrimitives as c } from '../primitives/colors.primitive';
import { spacingPrimitives as n } from '../primitives/spacing.primitive';

export const badgeTokens = {

  blue: {
    bg:           c.blue[100],
    stroke:       c.blue[600],
    text:         c.blue[700],
    icon:         c.blue[700],
    cornerRadius: n[4],
  },

  lilac: {
    bg:           c.lilac[100],
    stroke:       c.lilac[600],
    text:         c.lilac[900],
    icon:         c.lilac[700],
    cornerRadius: n[4],
  },

  mint: {
    bg:           c.mint[100],
    stroke:       c.mint[500],
    text:         c.mint[800],
    icon:         c.mint[700],
    cornerRadius: n[4],
  },

  orange: {
    bg:           c.orange[100],
    stroke:       c.orange[500],
    text:         c.orange[600],
    icon:         c.orange[500],
    cornerRadius: n[4],
  },

  red: {
    bg:           c.red[100],
    stroke:       c.red[500],
    text:         c.red[700],
    icon:         c.red[700],
    cornerRadius: n[4],
  },

  pink: {
    bg:           c.accentPink[100],
    stroke:       c.accentPink[500],
    text:         c.accentPink[800],
    icon:         c.accentPink[600],
    cornerRadius: n[4],
  },

  gray: {
    bg:           c.gray[300],
    stroke:       c.gray[700],
    text:         c.gray[1000],
    icon:         c.gray[800],
    cornerRadius: n[4],
  },

  white: {
    bg:           c.gray[200],   // off-white — gray/200 not pure white
    stroke:       c.gray[700],
    text:         c.gray[900],
    icon:         c.gray[700],
    cornerRadius: n[4],
  },

} as const;

export type BadgeVariant = keyof typeof badgeTokens;
