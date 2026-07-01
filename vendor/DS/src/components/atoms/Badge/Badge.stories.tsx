import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Badge } from './Badge';
import type { BadgeColor } from './Badge.types';

const meta: Meta<typeof Badge> = {
  title: 'Content/Badge',
  component: Badge,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    actions: { disable: true },
  },
  argTypes: {
    color: {
      control: { type: 'select' },
      options: ['blue', 'lilac', 'green', 'orange', 'red', 'pink', 'gray', 'white'],
      description: 'Badge color',
      table: { defaultValue: { summary: 'blue' } },
    },
    type: {
      control: { type: 'select' },
      options: ['outlined', 'filled'],
      description: 'Badge type',
      table: { defaultValue: { summary: 'outlined' } },
    },
    labelText: {
      control: 'text',
      description: 'Label text',
      table: { defaultValue: { summary: 'label' } },
    },
    leftIcon: {
      control: 'boolean',
      description: 'Show dot icon on the left',
      table: { defaultValue: { summary: 'false' } },
    },
    rightIcon: {
      control: 'boolean',
      description: 'Show dot icon on the right',
      table: { defaultValue: { summary: 'false' } },
    },
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof Badge>;

/* ── Interactive ──────────────────────────────────────────────────────────── */
export const Interactive: Story = {
  args: {
    color: 'blue',
    type: 'outlined',
    labelText: 'label',
    leftIcon: false,
    rightIcon: false,
  },
};

/* ── All colors ───────────────────────────────────────────────────────────── */
const COLORS: BadgeColor[] = ['blue', 'lilac', 'green', 'orange', 'red', 'pink', 'gray', 'white'];

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 12,
  lineHeight: '14px',
  color: '#747479',
  fontFamily: 'var(--font-family-sans)',
  paddingLeft: 8,
  whiteSpace: 'nowrap',
  alignSelf: 'center',
};

export const AllColors: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>
      {COLORS.map((color) => (
        <div key={color} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, width: 100 }}>
            <Badge color={color} type="outlined" labelText="label" />
            <Badge color={color} type="filled" labelText="label" />
          </div>
          <span style={{ ...LABEL_STYLE, paddingLeft: 24 }}>{color}</span>
        </div>
      ))}
    </div>
  ),
};

/* ── With icons ───────────────────────────────────────────────────────────── */
export const WithIcons: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 12, paddingTop: 8 }}>
      {(['outlined', 'filled'] as const).map((type) => (
        <div key={type} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <Badge color="blue" type={type} labelText="label" leftIcon />
            <Badge color="blue" type={type} labelText="label" rightIcon />
            <Badge color="blue" type={type} labelText="label" leftIcon rightIcon />
          </div>
          <span style={{ ...LABEL_STYLE, paddingLeft: 0 }}>{type}</span>
        </div>
      ))}
    </div>
  ),
};
