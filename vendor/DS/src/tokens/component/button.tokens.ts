// =============================================================================
// COMPONENT TOKENS — button (129 tokens total)
// Variants: primary · secondary · transparent · success · (pending screenshots)
// Each variant × 5 states × 5 props = up to 25 tokens per variant
// =============================================================================

import { colorPrimitives as c } from '../primitives/colors.primitive';
import { spacingPrimitives as n } from '../primitives/spacing.primitive';

// ---------------------------------------------------------------------------
// primary  (24 tokens)
// ---------------------------------------------------------------------------
export const buttonPrimaryTokens = {

  default: {
    bg:           c.primaryYellow[500],  // #FFD05C
    stroke:       c.primaryYellow[800],  // #A36D00
    text:         c.gray[1100],          // #0A0A0A
    icon:         c.gray[1000],          // #242425
    cornerRadius: n[4],
  },

  hover: {
    bg:           c.primaryYellow[700],  // #FFB600
    stroke:       c.primaryYellow[800],  // #A36D00
    text:         c.gray[1100],
    icon:         c.gray[1000],
    cornerRadius: n[4],
  },

  focused: {
    bg:           c.primaryYellow[600],  // #FFC229
    stroke:       c.primaryYellow[900],  // #5B3D00
    text:         c.gray[1100],
    icon:         c.gray[1000],
    cornerRadius: n[4],
  },

  selected: {
    bg:           c.primaryYellow[700],   // #FFB600
    stroke:       c.primaryYellow[1000],  // #402B00
    text:         c.gray[1100],
    icon:         c.gray[1000],
    cornerRadius: n[4],
  },

  disabled: {
    bg:           c.gray[400],  // #DADADC
    text:         c.gray[500],  // #D3D3D5
    icon:         c.gray[500],
    cornerRadius: n[4],
  },

} as const;

// ---------------------------------------------------------------------------
// secondary  (24 tokens)
// ---------------------------------------------------------------------------
export const buttonSecondaryTokens = {

  default: {
    bg:           c.gray[100],   // #FFFFFF
    stroke:       c.gray[600],   // #B6B6B9
    text:         c.gray[1100],  // #0A0A0A
    icon:         c.gray[1000],  // #242425
    cornerRadius: n[4],
  },

  hover: {
    bg:           c.primaryYellow[500],  // #FFD05C
    stroke:       c.gray[700],           // #929297
    text:         c.gray[1100],
    icon:         c.gray[1000],
    cornerRadius: n[4],
  },

  focused: {
    bg:           c.primaryYellow[400],  // #FFE5A3
    stroke:       c.gray[800],           // #747479
    text:         c.gray[1100],
    icon:         c.gray[1000],
    cornerRadius: n[4],
  },

  selected: {
    bg:           c.primaryYellow[500],  // #FFD05C
    stroke:       c.gray[800],           // #747479
    text:         c.gray[1100],
    icon:         c.gray[1000],
    cornerRadius: n[4],
  },

  disabled: {
    bg:           c.gray[400],  // #DADADC
    text:         c.gray[500],  // #D3D3D5
    icon:         c.gray[500],
    cornerRadius: n[4],
  },

} as const;

// ---------------------------------------------------------------------------
// transparent  (19 tokens)
// No bg/stroke on default — appears ghost until interaction.
// ---------------------------------------------------------------------------
export const buttonTransparentTokens = {

  default: {
    text:         c.gray[1000],  // #242425
    icon:         c.gray[900],   // #454548
    cornerRadius: n[2],          // 2px — differs from other variants
  },

  hover: {
    bg:           c.primaryYellow[500],  // #FFD05C
    text:         c.gray[1100],          // #0A0A0A
    icon:         c.gray[900],           // #454548
    cornerRadius: n[4],
  },

  focused: {
    bg:           c.primaryYellow[400],  // #FFE5A3
    text:         c.gray[1100],
    icon:         c.gray[900],
    cornerRadius: n[4],
  },

  selected: {
    bg:           c.primaryYellow[500],  // #FFD05C
    text:         c.gray[1100],
    icon:         c.gray[900],
    cornerRadius: n[4],
  },

  disabled: {
    bg:           c.gray[400],  // #DADADC
    text:         c.gray[500],  // #D3D3D5
    icon:         c.gray[500],
    cornerRadius: n[4],
  },

} as const;

// ---------------------------------------------------------------------------
// success  (24 tokens)
// ---------------------------------------------------------------------------
export const buttonSuccessTokens = {

  default: {
    bg:           c.gray[100],   // #FFFFFF
    stroke:       c.green[700],  // #28B420
    text:         c.green[900],  // #186C13
    icon:         c.green[700],  // #28B420
    cornerRadius: n[4],
  },

  hover: {
    bg:           c.green[200],  // #D7F1D5
    stroke:       c.green[800],  // #20901A
    text:         c.green[900],  // #186C13
    icon:         c.green[800],  // #20901A
    cornerRadius: n[4],
  },

  focused: {
    bg:           c.green[100],  // #E9F7E8
    stroke:       c.green[500],  // #7AD175
    text:         c.green[900],  // #186C13
    icon:         c.green[700],  // #28B420
    cornerRadius: n[4],
  },

  selected: {
    bg:           c.green[200],  // #D7F1D5
    stroke:       c.green[600],  // #51C24A
    text:         c.green[900],  // #186C13
    icon:         c.green[700],  // #28B420
    cornerRadius: n[4],
  },

  disabled: {
    bg:           c.gray[400],  // #DADADC
    text:         c.gray[500],  // #D3D3D5
    icon:         c.gray[500],
    cornerRadius: n[4],
  },

} as const;

// ---------------------------------------------------------------------------
// error  (24 tokens)
// ---------------------------------------------------------------------------
export const buttonErrorTokens = {

  default: {
    bg:           c.gray[100],  // #FFFFFF
    stroke:       c.red[600],   // #FF575A
    text:         c.red[800],   // #B50003
    icon:         c.red[700],   // #E50003
    cornerRadius: n[4],
  },

  hover: {
    bg:           c.red[200],   // #FFDEDF
    stroke:       c.red[700],   // #E50003
    text:         c.red[800],   // #B50003
    icon:         c.red[700],
    cornerRadius: n[4],
  },

  focused: {
    bg:           c.red[100],   // #FFEEEE
    stroke:       c.red[500],   // #FF8789
    text:         c.red[800],
    icon:         c.red[700],
    cornerRadius: n[4],
  },

  selected: {
    bg:           c.red[200],   // #FFDEDF
    stroke:       c.red[500],   // #FF8789
    text:         c.red[800],
    icon:         c.red[700],
    cornerRadius: n[4],
  },

  disabled: {
    bg:           c.gray[400],  // #DADADC
    text:         c.gray[500],  // #D3D3D5
    icon:         c.gray[500],
    cornerRadius: n[4],
  },

} as const;

// ---------------------------------------------------------------------------
// transparent ghost  (10 tokens)
// No bg — purely text/icon color changes per state.
// Note: Figma spells it "transparent goast" — we normalise to "ghost".
// ---------------------------------------------------------------------------
export const buttonTransparentGhostTokens = {

  default: {
    text: c.gray[1100],  // #0A0A0A
    icon: c.gray[900],   // #454548
  },

  hover: {
    text: c.gray[900],   // #454548
    icon: c.gray[800],   // #747479
  },

  focused: {
    text: c.gray[800],   // #747479
    icon: c.gray[700],   // #929297
  },

  selected: {
    text: c.gray[800],   // #747479
    icon: c.gray[700],   // #929297
  },

  disabled: {
    text: c.gray[500],   // #D3D3D5
    icon: c.gray[500],
  },

} as const;

// ---------------------------------------------------------------------------
// link  (4 tokens, 2 states: default + visited)
// ---------------------------------------------------------------------------
export const buttonLinkTokens = {

  default: {
    text: c.blue[600],  // #212FE3
    icon: c.blue[500],  // #4B57E8
  },

  visited: {
    text: c.blue[500],  // #4B57E8
    icon: c.blue[400],  // #757EEE
  },

} as const;

// ---------------------------------------------------------------------------
// Unified export — 129 tokens total
// primary(24) + secondary(24) + transparent(19) + success(24)
// + error(24) + transparentGhost(10) + link(4) = 129
// ---------------------------------------------------------------------------
export type ButtonState = 'default' | 'hover' | 'focused' | 'selected' | 'disabled';
export type ButtonVariant = 'primary' | 'secondary' | 'transparent' | 'success' | 'error' | 'ghost' | 'link';

export const buttonTokens = {
  primary:          buttonPrimaryTokens,
  secondary:        buttonSecondaryTokens,
  transparent:      buttonTransparentTokens,
  success:          buttonSuccessTokens,
  error:            buttonErrorTokens,
  transparentGhost: buttonTransparentGhostTokens,
  link:             buttonLinkTokens,
} as const;
