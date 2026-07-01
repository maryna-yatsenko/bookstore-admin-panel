import type { Meta, StoryObj } from '@storybook/react';
import { MenuItem } from './MenuItem';
import { Icon } from '../Icon';

const DotIcon = () => (
  <Icon name="icon-basic" size={20} />
);

const STATES = ['default', 'hover', 'focused', 'selected', 'disabled', 'danger'] as const;

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 11,
  color: '#9898a0',
  fontFamily: 'var(--font-family-sans, sans-serif)',
  paddingLeft: 12,
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
};

const meta = {
  title: 'Navigation/MenuItem',
  component: MenuItem,
  tags: ['autodocs'],
  parameters: { layout: 'padded', actions: { disable: true } },
  argTypes: {
    type: {
      control: 'select',
      options: ['complex', 'icon-button'],
      description: 'Layout type',
    },
    state: {
      control: 'select',
      options: STATES,
      description: 'Visual state',
    },
    label:      { control: 'text',    description: 'Label text (complex only)' },
    badge:      { control: 'boolean', description: 'Show badge counter (complex only)' },
    badgeCount: { control: 'number',  description: 'Badge number' },
    icon:       { table: { disable: true } },
    selected:   { table: { disable: true } },
    disabled:   { table: { disable: true } },
    onClick:    { table: { disable: true } },
    className:  { table: { disable: true } },
  },
  args: {
    type: 'complex',
    state: 'default',
    label: 'placeholder',
    badge: false,
    badgeCount: 0,
  },
} satisfies Meta<typeof MenuItem>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Playground ───────────────────────────────────────────────────────────── */
export const Playground: Story = {
  name: 'Playground',
  render: (args) => (
    <MenuItem {...args} icon={<DotIcon />} />
  ),
};

/* ── All states — complex ─────────────────────────────────────────────────── */
export const AllStates: Story = {
  name: 'All states — complex',
  render: () => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 4 }}>
      {STATES.map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
          <MenuItem state={s} label="placeholder" icon={<DotIcon />} />
          <span style={LABEL_STYLE}>{s}</span>
        </div>
      ))}
    </div>
  ),
};

/* ── All states — icon-button ─────────────────────────────────────────────── */
export const AllStatesIconButton: Story = {
  name: 'All states — icon-button',
  render: () => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 4 }}>
      {STATES.map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
          <MenuItem type="icon-button" state={s} icon={<DotIcon />} />
          <span style={LABEL_STYLE}>{s}</span>
        </div>
      ))}
    </div>
  ),
};

/* ── With badge ───────────────────────────────────────────────────────────── */
export const WithBadge: Story = {
  name: 'With badge',
  render: () => (
    <div style={{ display: 'inline-flex', flexDirection: 'column', gap: 4 }}>
      {STATES.filter((s) => s !== 'danger').map((s) => (
        <div key={s} style={{ display: 'flex', alignItems: 'center' }}>
          <MenuItem state={s} label="placeholder" icon={<DotIcon />} badge badgeCount={3} />
          <span style={LABEL_STYLE}>{s}</span>
        </div>
      ))}
    </div>
  ),
};
