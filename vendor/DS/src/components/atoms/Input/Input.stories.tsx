import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Input } from './Input';

const DotIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
    <circle cx="10" cy="10" r="5" fill="currentColor" />
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

const meta: Meta<typeof Input> = {
  title: 'Text-inputs/Input',
  component: Input,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    actions: { disable: true },
  },
  argTypes: {
    state: {
      control: { type: 'select' },
      options: ['default', 'hover', 'focused', 'typing', 'entered', 'success', 'error', 'disabled'],
      description: 'Visual state',
      table: { defaultValue: { summary: 'default' } },
    },
    label: {
      control: 'boolean',
      description: 'Show label above the field',
      table: { defaultValue: { summary: 'true' } },
    },
    labelText: {
      control: 'text',
      description: 'Label text',
      table: { defaultValue: { summary: 'label' } },
    },
    disclaimer: {
      control: 'boolean',
      description: 'Show info icon next to label',
      table: { defaultValue: { summary: 'false' } },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
      table: { defaultValue: { summary: 'input text' } },
    },
    supportingText: {
      control: 'text',
      description: 'Helper text shown in success/error states',
      table: { defaultValue: { summary: 'supporting text' } },
    },
    trailingIcon: { table: { disable: true } },
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
    disabled: { table: { disable: true } },
    className: { table: { disable: true } },
  } as any,
};

export default meta;
type Story = StoryObj<typeof Input>;

/* ── Interactive ──────────────────────────────────────────────────────────── */
export const Interactive: Story = {
  args: {
    state: 'default',
    label: true,
    labelText: 'label',
    disclaimer: false,
    placeholder: 'input text',
    supportingText: 'supporting text',
  } as any,
  render: (args: any) => {
    const { state, label, labelText, disclaimer, placeholder, supportingText } = args;
    const hasValue = ['typing', 'entered', 'success', 'error'].includes(state);
    const [value, setValue] = useState(hasValue ? 'entered text' : '');
    return (
      <div style={{ width: 400 }}>
        <Input
          state={state}
          value={value}
          onChange={setValue}
          label={label}
          labelText={labelText}
          disclaimer={disclaimer}
          placeholder={placeholder}
          supportingText={supportingText}
          trailingIcon={<DotIcon />}
        />
      </div>
    );
  },
};

/* ── All states ───────────────────────────────────────────────────────────── */
const ALL_STATES = [
  { state: 'default'  as const, value: '',             placeholder: 'input text' },
  { state: 'hover'    as const, value: '',             placeholder: 'input text' },
  { state: 'focused'  as const, value: '',             placeholder: '' },
  { state: 'typing'   as const, value: 'entered text', placeholder: '' },
  { state: 'entered'  as const, value: 'entered text', placeholder: '' },
  { state: 'success'  as const, value: 'entered text', placeholder: '' },
  { state: 'error'    as const, value: 'entered text', placeholder: '' },
  { state: 'disabled' as const, value: '',             placeholder: 'input text' },
];

/*
 * Label row = 18px line-height + 6px gap = 24px above the field.
 * Field height = 32px → center at 24 + 16 = 40px from top.
 * State label line-height = 14px → half = 7px.
 * paddingTop = 40 − 7 = 33px ≈ 32px
 */
const STATE_LABEL: React.CSSProperties = {
  fontSize: 12,
  lineHeight: '14px',
  color: '#747479',
  fontFamily: 'var(--font-family-sans)',
  paddingLeft: 8,
  whiteSpace: 'nowrap',
  marginTop: 32,
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 16 }}>
      {ALL_STATES.map(({ state, value, placeholder }) => (
        <div key={state} style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ width: 320 }}>
            <Input
              state={state}
              value={value}
              onChange={() => {}}
              placeholder={placeholder}
              label
              labelText="label"
              supportingText="supporting text"
            />
          </div>
          <span style={STATE_LABEL}>{state}</span>
        </div>
      ))}
    </div>
  ),
};

/* ── With trailing icon ───────────────────────────────────────────────────── */
export const WithTrailingIcon: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: 320 }}>
        <Input
          value={value}
          onChange={setValue}
          placeholder="input text"
          label
          labelText="label"
          trailingIcon={<DotIcon />}
        />
      </div>
    );
  },
};

/* ── With disclaimer ──────────────────────────────────────────────────────── */
export const WithDisclaimer: Story = {
  render: () => {
    const [value, setValue] = useState('');
    return (
      <div style={{ width: 320 }}>
        <Input
          value={value}
          onChange={setValue}
          placeholder="input text"
          label
          labelText="label"
          disclaimer
        />
      </div>
    );
  },
};
