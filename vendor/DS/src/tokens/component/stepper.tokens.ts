// =============================================================================
// COMPONENT TOKENS — stepper (9 tokens, 3 states × 3 props)
// States: default · hover · disabled
// Props:  bg · stroke · icon
// =============================================================================

import { colorPrimitives as c } from '../primitives/colors.primitive';

export const stepperTokens = {

  default: {
    bg:     c.primaryYellow[100],   // #FFFBF0
    stroke: c.primaryYellow[600],   // #FFC229
    icon:   c.primaryYellow[1100],  // #2A1C00
  },

  hover: {
    bg:     c.primaryYellow[500],   // #FFD05C
    stroke: c.primaryYellow[900],   // #7A5000
    icon:   c.primaryYellow[1000],  // #3D2A00
  },

  disabled: {
    bg:     c.gray[100],   // #FFFFFF
    stroke: c.gray[500],   // #D3D3D5
    icon:   c.gray[600],   // #B6B6B9
  },

} as const;

export type StepperState = keyof typeof stepperTokens;
