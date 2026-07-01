import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import type { BadgeColor } from '../Badge/Badge.types';
import { TableCellTitle }         from './TableCellTitle';
import { TableCellTitleCheckbox } from './TableCellTitleCheckbox';
import { TableCellText }          from './TableCellText';
import { TableCellCheckbox }      from './TableCellCheckbox';
import { TableCellBadge }         from './TableCellBadge';
import { TableCellActions }       from './TableCellActions';

/* ── Shared helpers ────────────────────────────────────────────────────────── */
const BADGE_COLOR_MAP: Record<string, BadgeColor> = {
  Admin: 'blue', User: 'green', Editor: 'orange', Viewer: 'lilac',
};
const getBadgeColor = (label: string): BadgeColor => BADGE_COLOR_MAP[label] ?? 'gray';

const ROWS = [
  { name: 'John Smith',   sub: 'john@email.com', status: 'Active',   tags: ['Admin', 'User'] },
  { name: 'Anna Brown',   sub: 'anna@email.com', status: 'Inactive', tags: ['User'] },
  { name: 'Mark Johnson', sub: 'mark@email.com', status: 'Active',   tags: ['Admin', 'Editor', 'Viewer'] },
];

const COL: React.CSSProperties = {
  fontSize: 11, color: '#747479',
  fontFamily: 'var(--font-family-sans)',
  textAlign: 'center', paddingBottom: 4,
};

/* ── Meta — primary: TableCellText ─────────────────────────────────────────── */
const meta = {
  title: 'Content/TableCell',
  component: TableCellText,
  tags: ['autodocs'],
  parameters: { actions: { disable: true } },
  argTypes: {
    titleText:   { control: 'text' },
    subtitle:    { control: 'boolean', description: 'Show subtitle row' },
    subtitleText:{ control: 'text' },
    status:      { control: 'boolean', description: 'Show status dot' },
    statusText:  { control: 'text' },
    statusType:  {
      control: 'select',
      options: ['success', 'warning', 'error', 'disabled'],
    },
    image:       { control: 'boolean', description: 'Show avatar placeholder' },
    className:   { table: { disable: true } },
    style:       { table: { disable: true } },
  },
  args: {
    titleText:    'John Smith',
    subtitleText: 'john@email.com',
    statusText:   'Active',
    statusType:   'success' as const,
    subtitle:     false,
    status:       false,
    image:        false,
  },
} satisfies Meta<typeof TableCellText>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Default — TableCellText with controls ─────────────────────────────────── */
export const Default: Story = {};

/* ── TitleCell ─────────────────────────────────────────────────────────────── */
export const TitleCell: Story = {
  name: 'Title cell',
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      {[
        { label: 'label + sort', props: { showLabel: true, showSort: true } },
        { label: 'label only',  props: { showLabel: true, showSort: false } },
      ].map(({ label, props }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={COL}>{label}</span>
          <TableCellTitle labelText="Name" style={{ width: 160 }} {...props} />
        </div>
      ))}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span style={COL}>with checkbox</span>
        <TableCellTitleCheckbox style={{ width: 48 }} />
      </div>
    </div>
  ),
};

/* ── TextCell ──────────────────────────────────────────────────────────────── */
export const TextCell: Story = {
  name: 'Text cell',
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {[
        { label: 'title only',    props: { titleText: 'John Smith' } },
        { label: 'with subtitle', props: { titleText: 'John Smith', subtitle: true, subtitleText: 'john@email.com' } },
        { label: 'with status',   props: { titleText: 'Active', status: true, statusText: 'Active', statusType: 'success' as const } },
        { label: 'with image',    props: { titleText: 'John Smith', subtitle: true, subtitleText: 'john@email.com', image: true } },
      ].map(({ label, props }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={COL}>{label}</span>
          <TableCellText style={{ width: 180 }} {...props} />
        </div>
      ))}
    </div>
  ),
};

/* ── CheckboxCell ──────────────────────────────────────────────────────────── */
export const CheckboxCell: Story = {
  name: 'Checkbox cell',
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      {[
        { label: 'unchecked',     props: { checked: false } },
        { label: 'indeterminate', props: { checked: false, indeterminate: true } },
        { label: 'checked',       props: { checked: true } },
      ].map(({ label, props }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={COL}>{label}</span>
          <TableCellCheckbox style={{ width: 48 }} {...props} />
        </div>
      ))}
    </div>
  ),
};

/* ── BadgeCell ─────────────────────────────────────────────────────────────── */
export const BadgeCell: Story = {
  name: 'Badge cell',
  render: () => (
    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
      {[
        { label: '1 badge',       badges: ['Admin'] },
        { label: '2 badges',      badges: ['Admin', 'User'] },
        { label: 'overflow (+1)', badges: ['Admin', 'User', 'Editor'] },
        { label: 'overflow (+2)', badges: ['Admin', 'User', 'Editor', 'Viewer'] },
      ].map(({ label, badges }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={COL}>{label}</span>
          <TableCellBadge badges={badges} getBadgeColor={getBadgeColor} style={{ width: 160 }} />
        </div>
      ))}
    </div>
  ),
};

/* ── ActionsCell ───────────────────────────────────────────────────────────── */
export const ActionsCell: Story = {
  name: 'Actions cell',
  render: () => (
    <div style={{ display: 'flex', gap: 16 }}>
      {[
        { label: '1 action',  props: {} },
        { label: '2 actions', props: { showDelete: true } },
        { label: '3 actions', props: { showDelete: true, showMore: true } },
      ].map(({ label, props }) => (
        <div key={label} style={{ display: 'flex', flexDirection: 'column' }}>
          <span style={COL}>{label}</span>
          <TableCellActions style={{ width: 120 }} {...props} />
        </div>
      ))}
    </div>
  ),
};

/* ── Overview — full table example ─────────────────────────────────────────── */
export const Overview: Story = {
  name: 'Overview',
  render: () => {
    const [selected, setSelected] = useState<boolean[]>(ROWS.map(() => false));
    const allSelected  = selected.every(Boolean);
    const someSelected = selected.some(Boolean) && !allSelected;
    const toggle = (i: number) =>
      setSelected(prev => prev.map((v, idx) => (idx === i ? !v : v)));

    return (
      <div style={{ display: 'inline-table' }}>
        {/* Header */}
        <div style={{ display: 'flex' }}>
          <TableCellTitleCheckbox
            checked={allSelected}
            indeterminate={someSelected}
            onChange={(v) => setSelected(ROWS.map(() => v))}
          />
          <TableCellTitle labelText="Name"    showLabel showSort  style={{ width: 200 }} />
          <TableCellTitle labelText="Status"  showLabel showSort  style={{ width: 140 }} />
          <TableCellTitle labelText="Tags"    showLabel showSort={false} style={{ width: 200 }} />
          <TableCellTitle labelText="Actions" showLabel showSort={false} style={{ width: 120 }} />
        </div>
        {/* Rows */}
        {ROWS.map((row, i) => (
          <div key={i} style={{ display: 'flex' }}>
            <TableCellCheckbox checked={selected[i]} onChange={() => toggle(i)} />
            <TableCellText titleText={row.name} subtitle subtitleText={row.sub} style={{ width: 200 }} />
            <TableCellText
              status statusText={row.status}
              statusType={row.status === 'Active' ? 'success' : 'error'}
              style={{ width: 140 }}
            />
            <TableCellBadge badges={row.tags} getBadgeColor={getBadgeColor} style={{ width: 200 }} />
            <TableCellActions showDelete showMore style={{ width: 120 }} />
          </div>
        ))}
      </div>
    );
  },
};
