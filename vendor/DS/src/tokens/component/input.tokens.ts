// =============================================================================
// COMPONENT TOKENS — input (56 tokens, 8 states × 7 props)
// States: default · hover · focused · typing · entered · success · error · disabled
// Props:  bg · stroke · label-text · placeholder-text · supporting-text · icon · corner-radius
// =============================================================================

import { colorPrimitives as c } from '../primitives/colors.primitive';
import { spacingPrimitives as n } from '../primitives/spacing.primitive';

export const inputTokens = {

  default: {
    bg:              c.gray[100],   // #FFFFFF
    stroke:          c.gray[500],   // #D3D3D5
    labelText:       c.gray[900],   // #454548
    placeholderText: c.gray[800],   // #747479
    supportingText:  c.gray[800],
    icon:            c.gray[800],
    cornerRadius:    n[4],
  },

  hover: {
    bg:              c.gray[100],
    stroke:          c.primaryYellow[600],  // #FFC229
    labelText:       c.gray[900],
    placeholderText: c.gray[800],
    supportingText:  c.gray[800],
    icon:            c.gray[800],
    cornerRadius:    n[4],
  },

  focused: {
    bg:              c.gray[100],
    stroke:          c.primaryYellow[700],  // #FFB600
    labelText:       c.gray[900],
    placeholderText: c.gray[1000],          // #242425 — text appears darker when focused
    supportingText:  c.gray[800],
    icon:            c.gray[800],
    cornerRadius:    n[4],
  },

  typing: {
    bg:              c.gray[200],           // #FAFAFA — subtle bg shift
    stroke:          c.primaryYellow[700],  // #FFB600
    labelText:       c.gray[900],
    placeholderText: c.gray[1000],
    supportingText:  c.gray[800],
    icon:            c.gray[800],
    cornerRadius:    n[4],
  },

  entered: {
    bg:              c.gray[100],
    stroke:          c.gray[500],   // back to default stroke after value entered
    labelText:       c.gray[900],
    placeholderText: c.gray[1100],  // #0A0A0A — actual entered value color
    supportingText:  c.gray[800],
    icon:            c.gray[800],
    cornerRadius:    n[4],
  },

  success: {
    bg:              c.gray[100],
    stroke:          c.mint[600],   // #2BA399
    labelText:       c.gray[900],
    placeholderText: c.gray[1100],
    supportingText:  c.mint[700],   // #23827B
    icon:            c.mint[700],
    cornerRadius:    n[4],
  },

  error: {
    bg:              c.gray[100],
    stroke:          c.red[600],    // #FF575A
    labelText:       c.gray[900],
    placeholderText: c.gray[1100],
    supportingText:  c.red[700],    // #E50003
    icon:            c.red[700],
    cornerRadius:    n[4],
  },

  disabled: {
    bg:              c.gray[400],   // #DADADC
    stroke:          c.gray[400],
    labelText:       c.gray[500],   // #D3D3D5
    placeholderText: c.gray[500],
    supportingText:  c.gray[500],
    icon:            c.gray[500],
    cornerRadius:    n[4],
  },

} as const;

export type InputState = keyof typeof inputTokens;
