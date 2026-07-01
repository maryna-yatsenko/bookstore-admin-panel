import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { TabGroup, TabItem } from './Tab';

const DotIcon = () => (
  <svg viewBox="0 0 20 20" width="100%" height="100%" fill="currentColor">
    <circle cx="10" cy="10" r="5" />
  </svg>
);

const LABEL_STYLE: React.CSSProperties = {
  fontSize: 12,
  color: '#747479',
  marginBottom: 4,
  fontFamily: 'var(--font-family-sans)',
};

const meta: Meta<typeof TabItem> = {
  title: 'Actions/Tab',
  component: TabItem,
  tags: ['autodocs'],
  parameters: { layout: 'padded' },
  argTypes: {
    state: {
      control: { type: 'select' },
      options: ['default', 'hover', 'focused', 'selected', 'disabled'],
      description: 'Visual state',
      table: { defaultValue: { summary: 'default' } },
    },
    children: {
      name: 'placeholder',
      control: 'text',
      description: 'Tab label text',
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
      description: 'Show badge count',
      table: { defaultValue: { summary: 'false' } },
    },
    // hide internal props
    value: { table: { disable: true } },
    disabled: { table: { disable: true } },
  },
};

export default meta;
type Story = StoryObj<typeof TabItem>;

/* ── Interactive — all Figma properties as controls ──────────────────────── */
export const Interactive: Story = {
  args: {
    state: 'default',
    children: 'placeholder',
    leadingIcon: false,
    trailingIcon: false,
    badge: false,
  } as any,
  render: (args: any) => {
    const { state, children, leadingIcon, trailingIcon, badge } = args;
    return (
      <TabItem
        value="tab"
        state={state}
        leadingIcon={leadingIcon ? <DotIcon /> : undefined}
        trailingIcon={trailingIcon ? <DotIcon /> : undefined}
        badge={badge ? 0 : undefined}
      >
        {children}
      </TabItem>
    );
  },
};

/* ── All states ─────────────────────────────────────────────────────────────── */
const STATES = ['default', 'hover', 'focused', 'selected', 'disabled'] as const;

export const AllStates: Story = {
  render: () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {STATES.map((s) => (
        <div key={s}>
          <div style={LABEL_STYLE}>{s}</div>
          <TabItem value={s} state={s}>placeholder</TabItem>
        </div>
      ))}
    </div>
  ),
};

/* ── Group — real TabGroup usage ────────────────────────────────────────────── */
export const Group: Story = {
  render: () => {
    const [active, setActive] = useState('tab1');
    return (
      <TabGroup value={active} onChange={setActive} label="Demo tabs">
        <TabItem value="tab1">placeholder</TabItem>
        <TabItem value="tab2">placeholder</TabItem>
        <TabItem value="tab3">placeholder</TabItem>
        <TabItem value="tab4" disabled>placeholder</TabItem>
      </TabGroup>
    );
  },
};

/* ── With icons ──────────────────────────────────────────────────────────────── */
export const WithIcons: Story = {
  render: () => {
    const [active, setActive] = useState('tab1');
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <TabGroup value={active} onChange={setActive} label="Leading icon">
          <TabItem value="tab1" leadingIcon={<DotIcon />}>placeholder</TabItem>
          <TabItem value="tab2" leadingIcon={<DotIcon />}>placeholder</TabItem>
          <TabItem value="tab3" leadingIcon={<DotIcon />} disabled>placeholder</TabItem>
        </TabGroup>
        <TabGroup value={active} onChange={setActive} label="Trailing icon">
          <TabItem value="tab1" trailingIcon={<DotIcon />}>placeholder</TabItem>
          <TabItem value="tab2" trailingIcon={<DotIcon />}>placeholder</TabItem>
          <TabItem value="tab3" trailingIcon={<DotIcon />} disabled>placeholder</TabItem>
        </TabGroup>
      </div>
    );
  },
};

/* ── With badge ──────────────────────────────────────────────────────────────── */
export const WithBadge: Story = {
  render: () => {
    const [active, setActive] = useState('tab1');
    return (
      <TabGroup value={active} onChange={setActive} label="With badge">
        <TabItem value="tab1" badge={3}>placeholder</TabItem>
        <TabItem value="tab2" badge={12}>placeholder</TabItem>
        <TabItem value="tab3" badge={0} disabled>placeholder</TabItem>
      </TabGroup>
    );
  },
};
