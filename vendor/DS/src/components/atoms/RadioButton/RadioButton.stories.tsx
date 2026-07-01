import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { RadioButton } from './RadioButton';

const meta = {
  title: 'Selection/Radiobutton',
  component: RadioButton,
  tags: ['autodocs'],
  parameters: { actions: { disable: true } },
  argTypes: {
    selected:  { control: 'boolean', description: 'Selected state' },
    label:     { control: 'text',    description: 'Label text (leave empty to hide label)' },
    disabled:  { control: 'boolean', description: 'Disabled state' },
    name:      { table: { disable: true } },
    value:     { table: { disable: true } },
    onChange:  { table: { disable: true } },
    className: { table: { disable: true } },
  },
  args: { selected: false, label: 'Label', disabled: false },
} satisfies Meta<typeof RadioButton>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default — shown only as top canvas, excluded from STORIES blocks ───── */
export const Default: Story = {
  tags: ['!autodocs'],
  render: (args) => {
    const [selected, setSelected] = useState(args.selected ?? false);
    useEffect(() => { setSelected(args.selected ?? false); }, [args.selected]);
    return <RadioButton {...args} selected={selected} onChange={() => setSelected((s) => !s)} />;
  },
};

/* ── Stories ────────────────────────────────────────────────────────────── */
const CAPTION: React.CSSProperties = {
  fontSize: 11,
  color: '#747479',
  fontFamily: 'var(--font-family-sans)',
  textAlign: 'center',
  lineHeight: 1,
};

const TYPES = [
  { key: 'unselected', props: { selected: false } },
  { key: 'selected',   props: { selected: true  } },
] as const;

export const NoLabel: Story = {
  name: 'No label',
  render: () => (
    <div style={{ display: 'flex', gap: 0 }}>
      {TYPES.map(({ key, props }) => (
        <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, minWidth: 90 }}>
          <span style={CAPTION}>{key}</span>
          <RadioButton {...props} />
          <RadioButton {...props} disabled />
        </div>
      ))}
    </div>
  ),
};

export const WithLabel: Story = {
  name: 'With label',
  render: () => (
    <div style={{ display: 'flex', gap: 0 }}>
      {TYPES.map(({ key, props }) => (
        <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, minWidth: 120 }}>
          <span style={CAPTION}>{key}</span>
          <RadioButton {...props} label="Label" />
          <RadioButton {...props} label="Label" disabled />
        </div>
      ))}
    </div>
  ),
};
