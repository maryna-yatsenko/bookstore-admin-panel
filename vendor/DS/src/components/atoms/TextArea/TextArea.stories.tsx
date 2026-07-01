import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TextArea } from './TextArea';

const meta: Meta<typeof TextArea> = {
  title: 'Text-inputs/TextArea',
  component: TextArea,
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
    supporting: {
      control: 'boolean',
      description: 'Show supporting text below the field (success/error states)',
      table: { defaultValue: { summary: 'true' } },
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
    maxChars: {
      control: 'number',
      description: 'Max character count',
      table: { defaultValue: { summary: '80' } },
    },
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
    disabled: { table: { disable: true } },
    className: { table: { disable: true } },
  } as any,
};

export default meta;
type Story = StoryObj<typeof TextArea>;

/* ── Interactive ──────────────────────────────────────────────────────────── */
export const Interactive: Story = {
  args: {
    state: 'default',
    label: true,
    labelText: 'label',
    disclaimer: false,
    supporting: true,
    supportingText: 'supporting text',
    maxChars: 80,
  } as any,
  render: (args: any) => {
    const { state, label, labelText, disclaimer, supporting, supportingText, placeholder, maxChars } = args;
    const hasValue = ['typing', 'entered', 'success', 'error'].includes(state);
    const [value, setValue] = useState(hasValue ? 'entered text' : '');
    const [focused, setFocused] = useState(false);

    const computedState =
      state !== 'default'
        ? state
        : focused
        ? value ? 'typing' : 'focused'
        : value ? 'entered' : 'default';

    return (
      <div style={{ width: 400 }}>
        <TextArea
          state={computedState}
          value={value}
          onChange={setValue}
          placeholder={placeholder}
          label={label}
          labelText={labelText}
          disclaimer={disclaimer}
          supporting={supporting}
          supportingText={supportingText}
          maxChars={maxChars}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
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

const STATE_LABEL: React.CSSProperties = {
  fontSize: 12,
  lineHeight: '14px',
  color: '#747479',
  fontFamily: 'var(--font-family-sans)',
  paddingLeft: 8,
  whiteSpace: 'nowrap',
  marginTop: 26,
};

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 16 }}>
      {ALL_STATES.map(({ state, value, placeholder }) => (
        <div key={state} style={{ display: 'flex', alignItems: 'flex-start' }}>
          <div style={{ width: 320 }}>
            <TextArea
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
