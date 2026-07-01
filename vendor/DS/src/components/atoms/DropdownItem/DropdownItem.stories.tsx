import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { DropdownItem } from './DropdownItem';

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 12,
  color: '#747479',
  fontFamily: 'var(--font-family-sans)',
  paddingLeft: 8,
  whiteSpace: 'nowrap',
  display: 'flex',
  alignItems: 'center',
};

const BORDER_CONTAINER: React.CSSProperties = {
  border: '1px solid #eee',
  borderRadius: 4,
  overflow: 'hidden',
  width: 280,
};

const DotIcon = () => (
  <svg viewBox="0 0 20 20" width="100%" height="100%" fill="currentColor">
    <circle cx="10" cy="10" r="5" />
  </svg>
);

const STATES = ['default', 'hover', 'focused', 'selected', 'disabled'] as const;

const itemBorder = (i: number, total: number): React.CSSProperties => ({
  width: 280,
  borderLeft: '1px solid #eee',
  borderRight: '1px solid #eee',
  borderTop: i === 0 ? '1px solid #eee' : 'none',
  borderBottom: '1px solid #eee',
  borderTopLeftRadius: i === 0 ? 4 : 0,
  borderTopRightRadius: i === 0 ? 4 : 0,
  borderBottomLeftRadius: i === total - 1 ? 4 : 0,
  borderBottomRightRadius: i === total - 1 ? 4 : 0,
  overflow: 'hidden',
});

const meta: Meta<typeof DropdownItem> = {
  title: 'Actions/DropdownItem',
  component: DropdownItem,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    type: {
      control: { type: 'select' },
      options: ['default', 'complex'],
      description: 'Layout variant',
      table: { defaultValue: { summary: 'default' } },
    },
    state: {
      control: { type: 'select' },
      options: ['default', 'hover', 'focused', 'selected', 'disabled'],
      description: 'Visual state',
      table: { defaultValue: { summary: 'default' } },
    },
    children: {
      name: 'placeholder',
      control: 'text',
      description: 'Item label / name text',
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
      description: 'Show badge (replaces text)',
      table: { defaultValue: { summary: 'false' } },
    },
    badgeVariant: {
      control: { type: 'select' },
      options: ['mint', 'gray'],
      description: 'Badge color',
      table: { defaultValue: { summary: 'mint' } },
    },
    position: {
      control: 'text',
      description: 'Subtitle line (complex type only)',
    },
    isSelected: { table: { disable: true } },
    disabled: { table: { disable: true } },
    avatar: { table: { disable: true } },
    onClick: { table: { disable: true } },
    className: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof DropdownItem>;

/* ── Interactive — all Figma properties as controls ──────────────────────────── */
export const Interactive: Story = {
  args: {
    type: 'default',
    state: 'default',
    children: 'placeholder',
    leadingIcon: false,
    trailingIcon: false,
    badge: false,
    badgeVariant: 'mint',
    position: 'position',
  } as any,
  decorators: [
    (Story) => (
      <div style={BORDER_CONTAINER}>
        <Story />
      </div>
    ),
  ],
  render: (args: any) => {
    const { leadingIcon, trailingIcon, badge, badgeVariant, children, ...rest } = args;
    return (
      <DropdownItem
        {...rest}
        badge={badge ? 'label' : undefined}
        badgeVariant={badgeVariant}
        leadingIcon={leadingIcon ? <DotIcon /> : undefined}
        trailingIcon={trailingIcon ? <DotIcon /> : undefined}
      >
        {children}
      </DropdownItem>
    );
  },
};

/* ── All states — default type ───────────────────────────────────────────────── */
export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
      {STATES.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'stretch' }}>
          <div style={itemBorder(i, STATES.length)}>
            <DropdownItem state={s}>placeholder</DropdownItem>
          </div>
          <span style={LABEL_STYLE}>{s}</span>
        </div>
      ))}
    </div>
  ),
};

/* ── Complex type ────────────────────────────────────────────────────────────── */
export const Complex: Story = {
  render: () => (
    <div style={{ display: 'inline-flex', flexDirection: 'column' }}>
      {STATES.map((s, i) => (
        <div key={s} style={{ display: 'flex', alignItems: 'stretch' }}>
          <div style={itemBorder(i, STATES.length)}>
            <DropdownItem type="complex" state={s} position="Product Designer">Alice Johnson</DropdownItem>
          </div>
          <span style={LABEL_STYLE}>{s}</span>
        </div>
      ))}
    </div>
  ),
};

/* ── With icons ──────────────────────────────────────────────────────────────── */
export const WithIcons: Story = {
  render: () => (
    <div style={BORDER_CONTAINER}>
      <DropdownItem leadingIcon={<DotIcon />}>Leading icon</DropdownItem>
      <DropdownItem trailingIcon={<DotIcon />}>Trailing icon</DropdownItem>
      <DropdownItem leadingIcon={<DotIcon />} trailingIcon={<DotIcon />}>Both icons</DropdownItem>
      <DropdownItem leadingIcon={<DotIcon />} state="disabled">Disabled</DropdownItem>
    </div>
  ),
};

/* ── With badge ──────────────────────────────────────────────────────────────── */
export const WithBadge: Story = {
  render: () => (
    <div style={BORDER_CONTAINER}>
      <DropdownItem badge="new">placeholder</DropdownItem>
      <DropdownItem badge="archived" badgeVariant="gray">placeholder</DropdownItem>
      <DropdownItem badge="new" state="selected">placeholder</DropdownItem>
      <DropdownItem badge="new" state="disabled">placeholder</DropdownItem>
    </div>
  ),
};
