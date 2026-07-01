// =============================================================================
// COMPONENT TOKENS — checkbox-radiobutton (9 tokens, 5 states)
// Shared token set for both Checkbox and RadioButton components.
// =============================================================================

import { colorPrimitives as c } from '../primitives/colors.primitive';

export const checkboxRadiobuttonTokens = {

  default: {
    bg:     c.primaryYellow[700],  // #FFB600
    stroke: c.gray[500],           // #D3D3D5
  },

  hover: {
    bg:     c.primaryYellow[700],  // #FFB600
    stroke: c.gray[600],           // #B6B6B9
  },

  focused: {
    bg:     c.primaryYellow[700],  // #FFB600
    stroke: c.gray[600],           // #B6B6B9
  },

  selected: {
    bg:     c.primaryYellow[700],  // #FFB600
    stroke: c.gray[600],           // #B6B6B9
  },

  disabled: {
    bg:     c.gray[300],           // #F2F2F3
  },

} as const;

export type CheckboxRadiobuttonState = keyof typeof checkboxRadiobuttonTokens;
