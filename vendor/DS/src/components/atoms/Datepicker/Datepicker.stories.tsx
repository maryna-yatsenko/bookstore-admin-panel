import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Datepicker } from './Datepicker';
import type { DateRange } from './Datepicker.types';

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 12,
  color: '#747479',
  fontFamily: 'var(--font-family-sans)',
  paddingLeft: 8,
  whiteSpace: 'nowrap',
  alignSelf: 'center',
};

const SELECTED_RANGE: DateRange = {
  start: new Date(2022, 10, 16),
  end: new Date(2022, 10, 25),
};

const meta: Meta<typeof Datepicker> = {
  title: 'Actions/Datepicker',
  component: Datepicker,
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
    showLabel: {
      control: 'boolean',
      description: 'Show label above the trigger',
      table: { defaultValue: { summary: 'false' } },
    },
    labelText: {
      control: 'text',
      description: 'Label text content',
      table: { defaultValue: { summary: 'label' } },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text when no date is selected',
      table: { defaultValue: { summary: '00.00 — 00.00' } },
    },
    // hide component internals
    label: { table: { disable: true } },
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
    disabled: { table: { disable: true } },
    defaultOpen: { table: { disable: true } },
    className: { table: { disable: true } },
  } as any,
};

export default meta;
type Story = StoryObj<typeof Datepicker>;

/* ── Interactive — all Figma properties as controls ──────────────────────────── */
export const Interactive: Story = {
  parameters: {
    docs: { source: { type: 'code', code: '' } },
  },
  args: {
    state: 'default',
    showLabel: false,
    labelText: 'label',
    placeholder: '00.00 — 00.00',
  } as any,
  render: (args: any) => {
    const { state, showLabel, labelText, placeholder } = args;
    const [v, setV] = useState<DateRange>(state === 'selected' ? SELECTED_RANGE : {});
    return (
      <div style={{ paddingBottom: 420 }}>
        <Datepicker
          key={state}
          state={state}
          value={v}
          onChange={setV}
          label={showLabel ? (labelText || 'label') : undefined}
          placeholder={placeholder}
          defaultOpen={state === 'selected'}
        />
      </div>
    );
  },
};

/* ── All states ───────────────────────────────────────────────────────────────── */
const STATES = [
  { key: 'default',  state: 'default'  as const, open: false },
  { key: 'hover',    state: 'hover'    as const, open: false },
  { key: 'focused',  state: 'focused'  as const, open: false },
  { key: 'selected', state: 'selected' as const, open: true  },
  { key: 'disabled', state: 'disabled' as const, open: false },
] as const;

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 8, paddingBottom: 420 }}>
      {STATES.map(({ key, state, open }) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center' }}>
          <Datepicker
            state={state}
            value={state === 'selected' ? SELECTED_RANGE : {}}
            onChange={() => {}}
            defaultOpen={open}
          />
          <span style={LABEL_STYLE}>{key}</span>
        </div>
      ))}
    </div>
  ),
};

/* ── With range ───────────────────────────────────────────────────────────────── */
export const WithRange: Story = {
  render: () => {
    const [v, setV] = useState<DateRange>(SELECTED_RANGE);
    return (
      <div style={{ paddingBottom: 420 }}>
        <Datepicker value={v} onChange={setV} label="Date range" />
      </div>
    );
  },
};
