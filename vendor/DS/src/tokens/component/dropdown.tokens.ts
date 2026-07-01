// =============================================================================
// COMPONENT TOKENS — dropdown (25 tokens, 5 states × 5 props)
// States: default · hover · focused · active · disabled
// =============================================================================

import { colorPrimitives as c } from '../primitives/colors.primitive';
import { spacingPrimitives as n } from '../primitives/spacing.primitive';

export const dropdownTokens = {

  default: {
    bg:           c.gray[100],   // #FFFFFF
    stroke:       c.gray[400],   // #DADADC
    text:         c.gray[1000],  // #242425
    icon:         c.gray[700],   // #929297
    cornerRadius: n[4],
  },

  hover: {
    bg:           c.primaryYellow[300],  // #FFF1CC
    stroke:       c.primaryYellow[700],  // #FFB600
    text:         c.gray[1000],
    icon:         c.primaryYellow[800],  // #A36D00
    cornerRadius: n[4],
  },

  focused: {
    bg:           c.primaryYellow[200],  // #FFF8E5
    stroke:       c.primaryYellow[700],  // #FFB600
    text:         c.gray[1000],
    icon:         c.primaryYellow[800],  // #A36D00
    cornerRadius: n[4],
  },

  active: {
    bg:           c.primaryYellow[400],  // #FFE5A3
    stroke:       c.primaryYellow[800],  // #A36D00
    text:         c.gray[1000],
    icon:         c.gray[900],           // #454548 — reverts to gray when open
    cornerRadius: n[4],
  },

  disabled: {
    bg:           c.gray[400],   // #DADADC
    stroke:       c.gray[600],   // #B6B6B9
    text:         c.gray[600],
    icon:         c.gray[600],
    cornerRadius: n[4],
  },

} as const;

export type DropdownState = keyof typeof dropdownTokens;
