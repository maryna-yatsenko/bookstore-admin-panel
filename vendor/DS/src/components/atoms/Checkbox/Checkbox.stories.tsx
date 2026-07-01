import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Checkbox } from './Checkbox';

const meta = {
  title: 'Selection/Checkbox',
  component: Checkbox,
  tags: ['autodocs'],
  parameters: { actions: { disable: true } },
  argTypes: {
    checked:       { control: 'boolean', description: 'Checked state' },
    indeterminate: { control: 'boolean', description: 'Indeterminate (overrides checked visually)' },
    label:         { control: 'text',    description: 'Label text (leave empty to hide label)' },
    disabled:      { control: 'boolean', description: 'Disabled state' },
    onChange:      { table: { disable: true } },
    className:     { table: { disable: true } },
  },
  args: {
    checked:       false,
    indeterminate: false,
    label:         'Label',
    disabled:      false,
  },
} satisfies Meta<typeof Checkbox>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default — shown only as top canvas, excluded from STORIES blocks ───── */
export const Default: Story = {
  tags: ['!autodocs'],
  render: (args) => {
    const [checked, setChecked] = useState(args.checked ?? false);
    useEffect(() => { setChecked(args.checked ?? false); }, [args.checked]);
    return <Checkbox {...args} checked={checked} onChange={setChecked} />;
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

const SECTION_TITLE: React.CSSProperties = {
  ...CAPTION,
  marginBottom: 16,
};

const TYPES = [
  { key: 'unchecked',     props: { checked: false, indeterminate: false } },
  { key: 'checked',       props: { checked: true,  indeterminate: false } },
  { key: 'indeterminate', props: { checked: false, indeterminate: true  } },
] as const;

export const NoLabel: Story = {
  name: 'No label',
  render: () => (
    <div style={{ display: 'flex', gap: 0 }}>
      {TYPES.map(({ key, props }) => (
        <div key={key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, minWidth: 90 }}>
          <span style={CAPTION}>{key}</span>
          <Checkbox {...props} />
          <Checkbox {...props} disabled />
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
          <Checkbox {...props} label="Label" />
          <Checkbox {...props} label="Label" disabled />
        </div>
      ))}
    </div>
  ),
};
