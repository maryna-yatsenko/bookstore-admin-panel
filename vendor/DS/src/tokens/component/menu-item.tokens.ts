// =============================================================================
// COMPONENT TOKENS — menu-item (21 tokens, 6 states)
// Layer 3: scoped to MenuItem component. References semantic primitives.
// =============================================================================

import { colorPrimitives as c } from '../primitives/colors.primitive';
import { spacingPrimitives as n } from '../primitives/spacing.primitive';

export const menuItemTokens = {

  default: {
    text:         c.gray[1100],  // #0A0A0A
    icon:         c.gray[700],   // #929297
    cornerRadius: n[4],          // 4px
  },

  hover: {
    bg:           c.gray[300],   // #F2F2F3
    text:         c.gray[1000],  // #242425
    icon:         c.gray[800],   // #747479
    cornerRadius: n[4],
  },

  focused: {
    bg:           c.gray[400],   // #DADADC
    text:         c.gray[1000],  // #242425
    icon:         c.gray[800],   // #747479
    cornerRadius: n[4],
  },

  selected: {
    bg:           c.primaryYellow[400],  // #FFE5A3
    text:         c.gray[1100],          // #0A0A0A
    icon:         c.gray[1000],          // #242425
    cornerRadius: n[4],
  },

  danger: {
    text:         c.red[700],    // #E50003
    icon:         c.red[700],    // #E50003
    cornerRadius: n[4],
  },

  disabled: {
    text:         c.gray[500],   // #D3D3D5
    icon:         c.gray[500],   // #D3D3D5
    cornerRadius: n[4],
  },

} as const;

export type MenuItemState = keyof typeof menuItemTokens;
