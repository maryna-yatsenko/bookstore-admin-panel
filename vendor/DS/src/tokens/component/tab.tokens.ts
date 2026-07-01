// =============================================================================
// COMPONENT TOKENS — tab (20 tokens, 5 states)
// =============================================================================

import { colorPrimitives as c } from '../primitives/colors.primitive';
import { spacingPrimitives as n } from '../primitives/spacing.primitive';

export const tabTokens = {

  default: {
    text:         c.gray[900],   // #454548
    icon:         c.gray[700],   // #929297
    cornerRadius: n[4],
  },

  hover: {
    bg:           c.primaryYellow[400],  // #FFE5A3
    text:         c.gray[900],           // #454548
    icon:         c.gray[700],           // #929297
    cornerRadius: n[4],
  },

  focused: {
    bg:           c.primaryYellow[300],  // #FFF1CC
    text:         c.gray[900],           // #454548
    icon:         c.gray[700],           // #929297
    cornerRadius: n[4],
  },

  selected: {
    bg:           c.primaryYellow[500],  // #FFD05C
    stroke:       c.primaryYellow[800],  // #A36D00
    text:         c.gray[1100],          // #0A0A0A
    icon:         c.gray[1000],          // #242425
    cornerRadius: n[4],
  },

  disabled: {
    bg:           c.gray[400],   // #DADADC
    text:         c.gray[500],   // #D3D3D5
    icon:         c.gray[500],   // #D3D3D5
    cornerRadius: n[4],
  },

} as const;

export type TabState = keyof typeof tabTokens;
