import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Dropdown } from './Dropdown';
import type { DropdownOption } from './Dropdown.types';

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 12,
  color: '#747479',
  fontFamily: 'var(--font-family-sans)',
  paddingLeft: 8,
  whiteSpace: 'nowrap',
};

const OPTS_M: DropdownOption[] = [
  { value: 'a', label: 'Option A' },
  { value: 'b', label: 'Option B' },
  { value: 'c', label: 'Option C' },
  { value: 'd', label: 'Option D', disabled: true },
];

const OPTS_BADGE: DropdownOption[] = [
  { value: 'active', badge: 'new' },
  { value: 'archived', badge: 'archived', badgeVariant: 'gray' },
];

const OPTS_XL: DropdownOption[] = [
  { value: 'alice', name: 'Alice Johnson', position: 'Product Designer' },
  { value: 'bob', name: 'Bob Smith', position: 'Frontend Engineer' },
  { value: 'carol', name: 'Carol White', position: 'Product Manager' },
  { value: 'dave', name: 'Dave Kim', position: 'QA Engineer', disabled: true },
];

const meta: Meta<typeof Dropdown> = {
  title: 'Actions/Dropdown',
  component: Dropdown,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    size: {
      control: { type: 'select' },
      options: ['s', 'm', 'xl'],
      description: 'Trigger size',
      table: { defaultValue: { summary: 'm' } },
    },
    state: {
      control: { type: 'select' },
      options: ['default', 'hover', 'focused', 'selected', 'disabled'],
      description: 'Visual state',
      table: { defaultValue: { summary: 'default' } },
    },
    label: {
      control: 'boolean',
      description: 'Show label above the trigger (M and S only)',
      table: { defaultValue: { summary: 'false' } },
    },
    labelText: {
      control: 'text',
      description: 'Label text content',
      table: { defaultValue: { summary: 'label' } },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no option is selected',
      table: { defaultValue: { summary: 'placeholder' } },
    },
    badge: {
      control: 'boolean',
      description: 'Show badge in trigger (replaces text)',
      table: { defaultValue: { summary: 'false' } },
    },
    // hide functional props from controls
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
    options: { table: { disable: true } },
    disabled: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    className: { table: { disable: true } },
  } as any,
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

/* ── Interactive — all Figma properties as controls ──────────────────────────── */
export const Interactive: Story = {
  args: {
    size: 'm',
    state: 'default',
    placeholder: 'placeholder',
    label: false,
    labelText: 'label',
    badge: false,
  } as any,
  render: (args: any) => {
    const { size, state, label, labelText, placeholder, badge } = args;
    const isXl = size === 'xl';
    const opts = badge ? OPTS_BADGE : isXl ? OPTS_XL : OPTS_M;
    const [v, setV] = useState(() => badge ? OPTS_BADGE[0].value : state === 'selected' ? OPTS_M[0].value : '');

    useEffect(() => {
      setV(badge ? OPTS_BADGE[0].value : state === 'selected' ? opts[0].value : '');
    }, [badge, state, size]);

    return (
      <div style={{ paddingBottom: 240 }}>
        <Dropdown
          size={size}
          state={state}
          options={opts}
          value={v}
          onChange={setV}
          label={label ? (labelText || 'label') : undefined}
          placeholder={placeholder}
        />
      </div>
    );
  },
};

/* ── All states — M size ─────────────────────────────────────────────────────── */
const ALL_STATES = [
  { state: 'default'  as const, value: ''  },
  { state: 'hover'    as const, value: ''  },
  { state: 'focused'  as const, value: ''  },
  { state: 'selected' as const, value: 'a', defaultOpen: true },
  { state: 'disabled' as const, value: ''  },
] as const;

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 8, paddingBottom: 140 }}>
      {ALL_STATES.map(({ state, value, defaultOpen }) => (
        <div key={state} style={{ display: 'flex', alignItems: 'center' }}>
          <Dropdown
            state={state}
            size="m"
            options={OPTS_M}
            value={value}
            placeholder="placeholder"
            onChange={() => {}}
            defaultOpen={defaultOpen}
          />
          <span style={LABEL_STYLE}>{state}</span>
        </div>
      ))}
    </div>
  ),
};

/* ── All sizes — default state ───────────────────────────────────────────────── */
export const AllSizes: Story = {
  render: () => {
    const [v, setV] = useState('');
    return (
      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start', paddingBottom: 180 }}>
        <Dropdown size="s" options={OPTS_M} value={v} onChange={setV} placeholder="placeholder" />
        <Dropdown size="m" options={OPTS_M} value={v} onChange={setV} placeholder="placeholder" />
        <Dropdown size="xl" options={OPTS_XL} value={v} onChange={setV} placeholder="placeholder" />
      </div>
    );
  },
};

/* ── With label ──────────────────────────────────────────────────────────────── */
export const WithLabel: Story = {
  render: () => {
    const [v, setV] = useState('');
    return (
      <div style={{ paddingBottom: 160 }}>
        <Dropdown size="m" label="label" options={OPTS_M} value={v} onChange={setV} placeholder="placeholder" />
      </div>
    );
  },
};

/* ── With badge ──────────────────────────────────────────────────────────────── */
export const WithBadge: Story = {
  render: () => {
    const [v, setV] = useState('active');
    return (
      <div style={{ paddingBottom: 100 }}>
        <Dropdown size="m" options={OPTS_BADGE} value={v} onChange={setV} />
      </div>
    );
  },
};

/* ── Complex (XL) ────────────────────────────────────────────────────────────── */
export const Complex: Story = {
  render: () => {
    const [v, setV] = useState('');
    return (
      <div style={{ paddingBottom: 240 }}>
        <Dropdown size="xl" options={OPTS_XL} value={v} onChange={setV} placeholder="placeholder" />
      </div>
    );
  },
};
