import React, { useState, useEffect } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { CardSelection } from './CardSelection';

const meta = {
  title: 'Selection/Card Selection',
  component: CardSelection,
  tags: ['autodocs'],
  parameters: { actions: { disable: true } },
  argTypes: {
    titleText:    { control: 'text',    description: 'Title text' },
    subtitleText: { control: 'text',    description: 'Subtitle text' },
    state:        { control: 'select',  options: ['default', 'hover', 'focused', 'selected', 'disabled'], description: 'Visual state' },
    onChange:     { table: { disable: true } },
    className:    { table: { disable: true } },
  },
  args: { titleText: 'title', subtitleText: 'subtitle', state: 'default' },
} satisfies Meta<typeof CardSelection>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default — shown only as top canvas, excluded from STORIES blocks ───── */
export const Default: Story = {
  tags: ['!autodocs'],
  render: (args) => {
    const [selected, setSelected] = useState(args.state === 'selected');
    useEffect(() => { setSelected(args.state === 'selected'); }, [args.state]);
    return <CardSelection {...args} onChange={() => setSelected((s) => !s)} />;
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

const STATES = [
  { key: 'default',  state: 'default' as const },
  { key: 'hover',    state: 'hover' as const },
  { key: 'focused',  state: 'focused' as const },
  { key: 'selected', state: 'selected' as const },
  { key: 'disabled', state: 'disabled' as const },
] as const;

export const AllStates: Story = {
  name: 'All states',
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {STATES.map(({ key, state }) => (
        <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <CardSelection state={state} titleText="Title" subtitleText="Subtitle" />
          <span style={CAPTION}>{key}</span>
        </div>
      ))}
    </div>
  ),
};
