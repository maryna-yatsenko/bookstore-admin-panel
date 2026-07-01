// =============================================================================
// SEMANTIC — chart (33 tokens)
// Data visualisation color palettes. 3 palettes × 11 steps = 33 tokens.
// =============================================================================

import { colorPrimitives as c } from '../primitives/colors.primitive';

export const chartTokens = {

  // ── yellow (maps to primary-yellow) ───────────────────────────────────────
  yellow: {
    100:  c.primaryYellow[100],
    200:  c.primaryYellow[200],
    300:  c.primaryYellow[300],
    400:  c.primaryYellow[400],
    500:  c.primaryYellow[500],
    600:  c.primaryYellow[600],
    700:  c.primaryYellow[700],
    800:  c.primaryYellow[800],
    900:  c.primaryYellow[900],
    1000: c.primaryYellow[1000],
    1100: c.primaryYellow[1100],
  },

  // ── purple (maps to accent-purple) ────────────────────────────────────────
  purple: {
    100:  c.accentPurple[100],
    200:  c.accentPurple[200],
    300:  c.accentPurple[300],
    400:  c.accentPurple[400],
    500:  c.accentPurple[500],
    600:  c.accentPurple[600],
    700:  c.accentPurple[700],
    800:  c.accentPurple[800],
    900:  c.accentPurple[900],
    1000: c.accentPurple[1000],
    1100: c.accentPurple[1100],
  },

  // ── pink (maps to accent-pink) ────────────────────────────────────────────
  pink: {
    100:  c.accentPink[100],
    200:  c.accentPink[200],
    300:  c.accentPink[300],
    400:  c.accentPink[400],
    500:  c.accentPink[500],
    600:  c.accentPink[600],
    700:  c.accentPink[700],
    800:  c.accentPink[800],
    900:  c.accentPink[900],
    1000: c.accentPink[1000],
    1100: c.accentPink[1100],
  },

} as const;

export type ChartPalette = keyof typeof chartTokens;
export type ChartScale = 100 | 200 | 300 | 400 | 500 | 600 | 700 | 800 | 900 | 1000 | 1100;
