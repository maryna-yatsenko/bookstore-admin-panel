import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SegmentedControl } from './SegmentedControl';

const DotIcon = () => (
  <svg viewBox="0 0 20 20" width="100%" height="100%" fill="currentColor">
    <circle cx="10" cy="10" r="5" />
  </svg>
);

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 12,
  color: '#747479',
  marginBottom: 4,
  fontFamily: 'var(--font-family-sans)',
};

const meta: Meta<typeof SegmentedControl> = {
  title: 'Actions/SegmentedControl',
  component: SegmentedControl,
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
    placeholder: {
      control: 'text',
      description: 'Segment label text',
    },
    leadingIcon: {
      control: 'boolean',
      description: 'Show leading icon',
      table: { defaultValue: { summary: 'false' } },
    },
    trailingIcon: {
      control: 'boolean',
      description: 'Show trailing icon',
      table: { defaultValue: { summary: 'false' } },
    },
    badge: {
      control: 'boolean',
      description: 'Show badge count',
      table: { defaultValue: { summary: 'false' } },
    },
    // hide internal props
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
    options: { table: { disable: true } },
    className: { table: { disable: true } },
    label: { table: { disable: true } },
  } as any,
};

export default meta;
type Story = StoryObj<typeof SegmentedControl>;

/* ── Interactive — all Figma properties as controls ──────────────────────── */
export const Interactive: Story = {
  parameters: {
    docs: { source: { type: 'code', code: '' } },
  },
  args: {
    state: 'default',
    placeholder: 'placeholder',
    leadingIcon: false,
    trailingIcon: false,
    badge: false,
  } as any,
  render: (args: any) => {
    const { state, placeholder, leadingIcon, trailingIcon, badge } = args;
    const [value, setValue] = useState(state === 'selected' ? 'a' : '');

    useEffect(() => {
      setValue(state === 'selected' ? 'a' : '');
    }, [state]);

    const segmentProps = {
      label: placeholder,
      leadingIcon: leadingIcon ? <DotIcon /> : undefined,
      trailingIcon: trailingIcon ? <DotIcon /> : undefined,
      badge: badge ? 0 : undefined,
    };

    return (
      <SegmentedControl
        value={value}
        onChange={setValue}
        options={[
          {
            value: 'a',
            ...segmentProps,
            stateOverride: state === 'hover' ? 'hover' as const
              : state === 'focused' ? 'focused' as const
              : undefined,
            disabled: state === 'disabled',
          },
          { value: 'b', ...segmentProps },
        ]}
      />
    );
  },
};

/* ── All states ─────────────────────────────────────────────────────────────── */
const STATES = [
  { key: 'default',  value: '_none', disabled: false, stateOverride: undefined },
  { key: 'hover',    value: '_none', disabled: false, stateOverride: 'hover' as const },
  { key: 'focused',  value: '_none', disabled: false, stateOverride: 'focused' as const },
  { key: 'selected', value: 'a',     disabled: false, stateOverride: undefined },
  { key: 'disabled', value: '_none', disabled: true,  stateOverride: undefined },
] as const;

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {STATES.map(({ key, value, disabled, stateOverride }) => (
        <div key={key}>
          <div style={LABEL_STYLE}>{key}</div>
          <SegmentedControl
            value={value}
            onChange={() => {}}
            options={[{ value: 'a', label: 'placeholder', disabled, stateOverride }]}
          />
        </div>
      ))}
    </div>
  ),
};

/* ── With icons ──────────────────────────────────────────────────────────────── */
export const WithIcons: Story = {
  render: () => {
    const [value, setValue] = useState('a');
    return (
      <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 12 }}>
        <SegmentedControl
          value={value}
          onChange={setValue}
          options={[
            { value: 'a', label: 'placeholder', leadingIcon: <DotIcon /> },
            { value: 'b', label: 'placeholder', leadingIcon: <DotIcon /> },
          ]}
        />
        <SegmentedControl
          value={value}
          onChange={setValue}
          options={[
            { value: 'a', label: 'placeholder', trailingIcon: <DotIcon /> },
            { value: 'b', label: 'placeholder', trailingIcon: <DotIcon /> },
          ]}
        />
      </div>
    );
  },
};

/* ── With badge ──────────────────────────────────────────────────────────────── */
export const WithBadge: Story = {
  render: () => {
    const [value, setValue] = useState('a');
    return (
      <SegmentedControl
        value={value}
        onChange={setValue}
        options={[
          { value: 'a', label: 'placeholder', badge: 3 },
          { value: 'b', label: 'placeholder', badge: 12 },
        ]}
      />
    );
  },
};
