// =============================================================================
// COMPONENT TOKENS — dropdown item (15 tokens, 5 states)
// Note: default has no bg/stroke — transparent until interacted with.
// disabled uniquely has both bg and stroke (unlike other states).
// =============================================================================

import { colorPrimitives as c } from '../primitives/colors.primitive';

export const dropdownItemTokens = {

  default: {
    text: c.gray[1000],  // #242425
    icon: c.gray[700],   // #929297
  },

  hover: {
    bg:   c.primaryYellow[400],  // #FFE5A3
    text: c.gray[1000],
    icon: c.gray[700],
  },

  focused: {
    bg:   c.primaryYellow[300],  // #FFF1CC
    text: c.gray[1000],
    icon: c.gray[700],
  },

  selected: {
    bg:   c.primaryYellow[500],  // #FFD05C
    text: c.gray[1000],
    icon: c.gray[900],           // #454548 — darker icon on selected
  },

  disabled: {
    bg:     c.gray[400],   // #DADADC
    stroke: c.gray[400],
    text:   c.gray[800],   // #747479
    icon:   c.gray[500],   // #D3D3D5
  },

} as const;

export type DropdownItemState = keyof typeof dropdownItemTokens;
