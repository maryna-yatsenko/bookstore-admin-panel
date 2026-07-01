import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { FunctionalButton } from './FunctionalButton';

/* Placeholder dot icon — matches Figma */
const DotIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <circle cx="12" cy="12" r="6" fill="currentColor" />
  </svg>
);

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 12,
  color: '#747479',
  fontFamily: 'var(--font-family-sans)',
  paddingLeft: 8,
  whiteSpace: 'nowrap',
  alignSelf: 'center',
};

const meta: Meta<typeof FunctionalButton> = {
  title: 'Actions/FunctionalButton',
  component: FunctionalButton,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    actions: { disable: true },
  },
  argTypes: {
    state: {
      control: { type: 'select' },
      options: ['default', 'hover', 'focused', 'selected', 'disabled'],
      description: 'Visual state',
      table: { defaultValue: { summary: 'default' } },
    },
    label: {
      control: 'text',
      description: 'Button label',
      table: { defaultValue: { summary: 'label' } },
    },
    icon: { table: { disable: true } },
    disabled: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof FunctionalButton>;

/* ── Interactive ──────────────────────────────────────────────────────────── */
export const Interactive: Story = {
  args: {
    state: 'default',
    label: 'label',
  },
  render: (args) => (
    <FunctionalButton {...args} icon={<DotIcon />} />
  ),
};

/* ── All states ───────────────────────────────────────────────────────────── */
const STATES = [
  'default',
  'hover',
  'focused',
  'selected',
  'disabled',
] as const;

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 8 }}>
      {STATES.map((state) => (
        <div key={state} style={{ display: 'flex', alignItems: 'center' }}>
          <FunctionalButton state={state} label="label" icon={<DotIcon />} />
          <span style={LABEL_STYLE}>{state}</span>
        </div>
      ))}
    </div>
  ),
};

