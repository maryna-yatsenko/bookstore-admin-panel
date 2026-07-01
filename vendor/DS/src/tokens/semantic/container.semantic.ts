// =============================================================================
// SEMANTIC — container (9 tokens)
// Maps primitive color aliases to UI surface roles.
// These are LIGHT theme defaults; dark theme overrides live in dark.theme.ts
// =============================================================================

import { colorPrimitives as c } from '../primitives/colors.primitive';

export const containerTokens = {
  primary:   c.gray[100],           // #FFFFFF  — main page surface
  secondary: c.gray[200],           // #FAFAFA  — elevated card / panel
  tertiary:  c.gray[300],           // #F2F2F3  — sunken / input bg
  hover:     c.primaryYellow[400],  // #FFE5A3  — hover state bg
  focused:   c.primaryYellow[500],  // #FFD05C  — focus ring fill
  selected:  c.primaryYellow[600],  // #FFC229  — selected item bg
  disabled:  c.gray[400],           // #DADADC  — disabled surface
  accent:    c.accentPurple[200],   // #F5F2F8  — accent tinted surface
  pageBg:    c.gray[300],           // #F2F2F3  — page-level background
} as const;

export type ContainerToken = keyof typeof containerTokens;
