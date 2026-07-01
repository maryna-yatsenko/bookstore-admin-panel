import { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Sidebar } from './Sidebar';
import { BookStoreLogo } from './BookStoreLogo';
import type { SidebarNavItem, SidebarUser } from './Sidebar.types';

/* ── Shared fixture data ──────────────────────────────────────────────────── */

const LOGO = <BookStoreLogo />;

const NAV_ITEMS: SidebarNavItem[] = [
  { id: 'dashboard', icon: 'dashboard',    label: 'Dashboard' },
  { id: 'orders',    icon: 'shopping-bag', label: 'Orders', badge: 12, selected: true },
  { id: 'users',     icon: 'user',         label: 'Users' },
  { id: 'products',  icon: 'barcode',      label: 'Products' },
  { id: 'tasks',     icon: 'task-list',    label: 'Work tasks' },
  { id: 'blog',      icon: 'news',         label: 'Blog' },
];

const BOTTOM_ITEMS: SidebarNavItem[] = [
  { id: 'settings', icon: 'settings', label: 'Settings' },
  { id: 'help',     icon: 'question', label: 'Help' },
];

const USER: SidebarUser = {
  initials: 'OM',
  name: 'Oleksandr Melnyk',
  role: 'Warehouse manager',
};

/* ── Meta ─────────────────────────────────────────────────────────────────── */

const meta = {
  title: 'Navigation/Sidebar',
  component: Sidebar,
  tags: ['autodocs'],
  parameters: { layout: 'fullscreen', actions: { disable: true } },
  argTypes: {
    folded:      { table: { disable: true } },
    appName:     { table: { disable: true } },
    logo:        { table: { disable: true } },
    navItems:    { table: { disable: true } },
    bottomItems: { table: { disable: true } },
    user:        { table: { disable: true } },
    onToggleFold:{ table: { disable: true } },
    onLogout:    { table: { disable: true } },
    className:   { table: { disable: true } },
  },
} satisfies Meta<typeof Sidebar>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Interactive (toggle) ─────────────────────────────────────────────────── */
export const Interactive: Story = {
  name: 'Interactive',
  render: () => {
    const [folded, setFolded] = useState(false);
    return (
      <div style={{ height: '100vh', display: 'flex' }}>
        <Sidebar
          folded={folded}
          onToggleFold={() => setFolded((f) => !f)}
          logo={LOGO}
          appName="BookStore"
          navItems={NAV_ITEMS}
          bottomItems={BOTTOM_ITEMS}
          user={USER}
        />
        <div style={{ flex: 1, background: '#f8f8f8' }} />
      </div>
    );
  },
};

/* ── Both states side-by-side ─────────────────────────────────────────────── */
export const BothStates: Story = {
  name: 'Both states',
  render: () => (
    <div style={{ height: '100vh', display: 'flex', gap: 32, padding: 32, background: '#f8f8f8' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 11, color: '#9898a0', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Expanded</span>
        <div style={{ height: 700 }}>
          <Sidebar
            folded={false}
            logo={LOGO}
            appName="BookStore"
            navItems={NAV_ITEMS}
            bottomItems={BOTTOM_ITEMS}
            user={USER}
          />
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <span style={{ fontSize: 11, color: '#9898a0', fontFamily: 'sans-serif', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Folded</span>
        <div style={{ height: 700 }}>
          <Sidebar
            folded={true}
            logo={LOGO}
            appName="BookStore"
            navItems={NAV_ITEMS}
            bottomItems={BOTTOM_ITEMS}
            user={USER}
          />
        </div>
      </div>
    </div>
  ),
};
