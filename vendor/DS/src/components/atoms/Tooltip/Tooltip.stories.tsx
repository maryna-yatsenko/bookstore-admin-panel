import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Tooltip } from './Tooltip';
import type { TooltipPosition } from './Tooltip.types';

const meta: Meta<typeof Tooltip> = {
  title: 'Content/Tooltip',
  component: Tooltip,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
    actions: { disable: true },
  },
  argTypes: {
    content: {
      control: 'text',
      description: 'Tooltip text content',
      table: { defaultValue: { summary: 'placeholder' } },
    },
    type: {
      control: { type: 'select' },
      options: ['hug', 'manual'],
      description: 'Width mode — hug: fits content, manual: wraps at ~120px',
      table: { defaultValue: { summary: 'hug' } },
    },
    position: {
      control: { type: 'select' },
      options: ['top', 'bottom', 'left', 'right'],
      description: 'Tooltip position relative to the trigger',
      table: { defaultValue: { summary: 'top' } },
    },
    open: {
      control: 'boolean',
      description: 'Force the tooltip to be visible (overrides hover)',
      table: { defaultValue: { summary: 'undefined' } },
    },
    children: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Tooltip>;

const Trigger = ({ label = 'Hover me' }: { label?: string }) => (
  <button
    style={{
      padding: '6px 14px',
      border: '1px solid #e0e0e0',
      borderRadius: 6,
      background: '#fff',
      cursor: 'default',
      fontSize: 14,
      fontFamily: 'var(--font-family-sans)',
      color: '#0a0a0a',
    }}
  >
    {label}
  </button>
);

/* ── Interactive ──────────────────────────────────────────────────────────── */
export const Interactive: Story = {
  args: {
    content:  'placeholder',
    type:     'hug',
    position: 'top',
  },
  render: (args) => (
    <div style={{ padding: 60 }}>
      <Tooltip {...args}>
        <Trigger />
      </Tooltip>
    </div>
  ),
};

/* ── All positions ────────────────────────────────────────────────────────── */
const POSITIONS: TooltipPosition[] = ['top', 'bottom', 'left', 'right'];

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 12,
  lineHeight: '14px',
  color: '#747479',
  fontFamily: 'var(--font-family-sans)',
  marginTop: 8,
};

export const AllPositions: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start', padding: 40 }}>
      {POSITIONS.map((pos) => (
        <div
          key={pos}
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            paddingTop:    pos === 'top'    ? 48 : 8,
            paddingBottom: pos === 'bottom' ? 8  : 8,
            paddingLeft:   pos === 'left'   ? 110 : 8,
            paddingRight:  pos === 'right'  ? 110 : 8,
          }}
        >
          <Tooltip content="placeholder" position={pos} open>
            <Trigger label={pos} />
          </Tooltip>
          <span style={{ ...LABEL_STYLE, marginTop: pos === 'bottom' ? 48 : 6 }}>{pos}</span>
        </div>
      ))}
    </div>
  ),
};

/* ── Types ────────────────────────────────────────────────────────────────── */
export const Types: Story = {
  render: () => (
    <div style={{ display: 'flex', gap: 80, alignItems: 'center', padding: 60 }}>
      {(['hug', 'manual'] as const).map((type) => (
        <div key={type} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <Tooltip
            content={type === 'manual' ? 'This text wraps inside the tooltip box' : 'placeholder'}
            type={type}
            position="top"
            open
          >
            <Trigger label={type} />
          </Tooltip>
          <span style={{ fontSize: 12, color: '#747479', fontFamily: 'var(--font-family-sans)', marginTop: 8 }}>
            {type}
          </span>
        </div>
      ))}
    </div>
  ),
};
