// =============================================================================
// SEMANTIC — state-overlay (3 tokens)
// Semi-transparent black overlays applied on top of interactive elements
// to communicate hover / focus / pressed states without changing the base color.
// Color: #040406  — Opacity: 4% / 6% / 8%
// =============================================================================

export const stateOverlayTokens = {
  hover:    'rgba(4, 4, 6, 0.04)',
  focused:  'rgba(4, 4, 6, 0.06)',
  pressed:  'rgba(4, 4, 6, 0.08)',
} as const;

export type StateOverlayToken = keyof typeof stateOverlayTokens;
