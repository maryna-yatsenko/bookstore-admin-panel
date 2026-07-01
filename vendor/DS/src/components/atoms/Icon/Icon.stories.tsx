import type { Meta, StoryObj } from '@storybook/react';
import { Icon } from './Icon';
import { ICON_NAMES, ICON_COLOR_TOKENS } from './Icon.types';
import type { IconName } from './Icon.types';

const COLOR_OPTIONS = Object.keys(ICON_COLOR_TOKENS) as (keyof typeof ICON_COLOR_TOKENS)[];

const meta = {
  title: 'Icons/Icon',
  component: Icon,
  tags: ['autodocs'],
  parameters: { actions: { disable: true } },
  argTypes: {
    name:        { control: 'select', options: ICON_NAMES },
    color:       {
      control: 'select',
      options: COLOR_OPTIONS,
      mapping: ICON_COLOR_TOKENS,
    },
    size:        { table: { disable: true } },
    className:   { table: { disable: true } },
    'aria-label':{ table: { disable: true } },
  },
  args: { name: 'add', color: ICON_COLOR_TOKENS.primary },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  tags: ['!autodocs'],
};

/* ── Grouped grid ─────────────────────────────────────────────────── */

const GROUPS: { label: string; icons: IconName[] }[] = [
  {
    label: 'Arrows & Navigation',
    icons: [
      'arrow-left-long', 'arrow-right-long',
      'arrow-left-double', 'arrow-right-double',
      'arrow-left', 'arrow-right', 'arrow-up', 'arrow-down',
      'arrow-up-chevron', 'arrow-down-chevron',
      'expand-up-down',
    ],
  },
  {
    label: 'Actions',
    icons: [
      'add', 'check', 'close-small', 'close-large', 'more',
      'edit', 'copy', 'delete-bin',
      'search', 'filter', 'settings',
      'download', 'upload', 'upload-cloud',
      'logout', 'external-link',
    ],
  },
  {
    label: 'Text & Editor',
    icons: [
      'bold', 'italic', 'double-quotes',
      'link', 'list-check', 'list-ordered',
      'hashtag', 'globe',
    ],
  },
  {
    label: 'Content & Layout',
    icons: [
      'draft', 'task-list', 'news', 'table', 'grid',
      'sidebar-fold', 'sidebar-unfold', 'dashboard',
      'calendar', 'time',
    ],
  },
  {
    label: 'Media & System',
    icons: [
      'printer', 'barcode', 'barcode-02',
      'eye', 'mic', 'progress',
    ],
  },
  {
    label: 'Status & Info',
    icons: [
      'info', 'question', 'ai',
      'star-filled', 'star-outlined', 'icon-basic',
    ],
  },
  {
    label: 'Business & Domain',
    icons: [
      'money', 'refund', 'shopping-bag',
      'signpost', 'bike', 'user',
    ],
  },
];

const SECTION: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: 12,
  width: '100%',
};

const SECTION_TITLE: React.CSSProperties = {
  fontSize: 11,
  fontWeight: 600,
  color: '#747479',
  fontFamily: 'var(--font-family-sans, sans-serif)',
  textTransform: 'uppercase',
  letterSpacing: '0.06em',
  borderBottom: '1px solid #e8e8ea',
  paddingBottom: 4,
};

const GRID: React.CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: 8,
};

const CELL: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: 6,
  width: 72,
  padding: '8px 4px',
};

const LABEL: React.CSSProperties = {
  fontSize: 10,
  color: '#9898a0',
  fontFamily: 'var(--font-family-sans, sans-serif)',
  textAlign: 'center',
  lineHeight: 1.3,
  wordBreak: 'break-word',
};

export const AllIcons: Story = {
  name: 'All icons',
  argTypes: {
    name: { table: { disable: true } },
  },
  render: (args) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 32, padding: '8px 0' }}>
      {GROUPS.map((group) => (
        <div key={group.label} style={SECTION}>
          <div style={SECTION_TITLE}>{group.label}</div>
          <div style={GRID}>
            {group.icons.map((name) => (
              <div key={name} style={CELL}>
                <Icon name={name} size={24} color={args.color} />
                <span style={LABEL}>{name}</span>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  ),
};
