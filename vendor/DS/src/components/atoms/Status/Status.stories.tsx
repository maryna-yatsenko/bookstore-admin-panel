import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Status } from './Status';

const meta = {
  title: 'Content/Status',
  component: Status,
  tags: ['autodocs'],
  argTypes: {
    status: {
      control: 'select',
      options: ['success', 'warning', 'error', 'disabled'] as const,
      description: 'Dot color and semantic meaning',
    },
    size: {
      control: 'select',
      options: ['small', 'big'] as const,
      description: 'small — 6 px dot + caption · big — 8 px dot + body',
    },
    labelText: { control: 'text' },
    className:  { table: { disable: true } },
  },
  args: {
    status:    'success',
    size:      'small',
    labelText: 'label',
  },
} satisfies Meta<typeof Status>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default — controlled via sidebar sliders ──────────────────────────────── */
export const Default: Story = {};

/* ── Overview — all statuses × both sizes ──────────────────────────────────── */
const LABEL: React.CSSProperties = {
  fontSize: 11, color: '#747479', fontFamily: 'var(--font-family-sans)',
  marginBottom: 8,
};

const STATUSES = ['success', 'warning', 'error', 'disabled'] as const;
const LABELS   = ['Active', 'Warning', 'Error', 'Disabled'];

export const Overview: Story = {
  name: 'Overview',
  render: () => (
    <div style={{ display: 'flex', gap: 48, alignItems: 'flex-start' }}>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span style={LABEL}>small</span>
        {STATUSES.map((s, i) => (
          <Status key={s} status={s} size="small" labelText={LABELS[i]} />
        ))}
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <span style={LABEL}>big</span>
        {STATUSES.map((s, i) => (
          <Status key={s} status={s} size="big" labelText={LABELS[i]} />
        ))}
      </div>

    </div>
  ),
};
