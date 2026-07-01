import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { SearchInput } from './SearchInput';

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 12,
  lineHeight: '14px',
  color: '#747479',
  fontFamily: 'var(--font-family-sans)',
  paddingLeft: 8,
  whiteSpace: 'nowrap',
  alignSelf: 'center',
};

const meta: Meta<typeof SearchInput> = {
  title: 'Text-inputs/SearchInput',
  component: SearchInput,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
    actions: { disable: true },
  },
  argTypes: {
    state: {
      control: { type: 'select' },
      options: ['default', 'hover', 'focused', 'typing', 'entered', 'disabled'],
      description: 'Visual state',
      table: { defaultValue: { summary: 'default' } },
    },
    placeholder: {
      control: 'text',
      description: 'Placeholder text',
      table: { defaultValue: { summary: 'input text' } },
    },
    value: { table: { disable: true } },
    onChange: { table: { disable: true } },
    disabled: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof SearchInput>;

/* ── Interactive ──────────────────────────────────────────────────────────── */
export const Interactive: Story = {
  args: {
    state: 'default',
    placeholder: 'input text',
  },
  render: (args) => {
    const [value, setValue] = useState('');
    const [focused, setFocused] = useState(false);

    // Derive visual state from actual interaction when no state is forced via controls
    const computedState =
      args.state !== 'default'
        ? (args.state as 'hover' | 'focused' | 'typing' | 'entered' | 'disabled')
        : focused
        ? value
          ? 'typing'
          : 'focused'
        : value
        ? 'entered'
        : 'default';

    return (
      <div style={{ width: 400 }}>
        <SearchInput
          state={computedState}
          value={value}
          placeholder={args.placeholder}
          onChange={setValue}
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
  { state: 'disabled' as const, value: '',             placeholder: 'input text' },
];

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 16, paddingTop: 8 }}>
      {ALL_STATES.map(({ state, value, placeholder }) => (
        <div key={state} style={{ display: 'flex', alignItems: 'center' }}>
          <div style={{ width: 320 }}>
            <SearchInput
              state={state}
              value={value}
              onChange={() => {}}
              placeholder={placeholder}
            />
          </div>
          <span style={LABEL_STYLE}>{state}</span>
        </div>
      ))}
    </div>
  ),
};
