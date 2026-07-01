import type { CSSProperties } from 'react';

export type StepState = 'passed' | 'active' | 'next';

export interface StepConfig {
  label:        string;
  badge?:       string;
  badgeColor?:  'gray' | 'white';
  actor?:       string;
  date?:        string;
  time?:        string;
}

export interface StepperProps {
  steps:       StepConfig[];
  activeStep:  number;        // 0-indexed
  className?:  string;
  style?:      CSSProperties;
}
