import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta = {
  title: 'Actions/Button',
  component: Button,
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'transparent', 'success', 'error', 'ghost', 'link'],
    },
    size: {
      control: 'select',
      options: ['l', 'm', 's'],
    },
    disabled: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
    children: { control: 'text' },
  },
  args: {
    children: 'label',
    variant: 'primary',
    size: 'l',
    disabled: false,
    iconOnly: false,
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

/* ── Single stories ─────────────────────────────────────────────────────────── */
export const Primary: Story = { args: { variant: 'primary' } };
export const Secondary: Story = { args: { variant: 'secondary' } };
export const Transparent: Story = { args: { variant: 'transparent' } };
export const Success: Story = { args: { variant: 'success' } };
export const Error: Story = { args: { variant: 'error' } };
export const Ghost: Story = { args: { variant: 'ghost' } };
export const Link: Story = { args: { variant: 'link' } };
export const Disabled: Story = { args: { variant: 'primary', disabled: true } };

/* ── Size matrix ────────────────────────────────────────────────────────────── */
export const Sizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
      <Button size="l">L / 40px</Button>
      <Button size="m">M / 32px</Button>
      <Button size="s">S / 24px</Button>
    </div>
  ),
};

/* ── All variants ───────────────────────────────────────────────────────────── */
export const AllVariants: Story = {
  render: () => (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
      {(['primary', 'secondary', 'transparent', 'success', 'error', 'ghost', 'link'] as const).map(
        (v) => (
          <Button key={v} variant={v}>{v}</Button>
        ),
      )}
    </div>
  ),
};

/* ── With icons ─────────────────────────────────────────────────────────────── */
const DotIcon = () => (
  <svg viewBox="0 0 20 20" width="100%" height="100%" fill="currentColor">
    <circle cx="10" cy="10" r="5" />
  </svg>
);

export const WithLeftIcon: Story = {
  args: { leftIcon: <DotIcon />, children: 'label' },
};

export const WithRightIcon: Story = {
  args: { rightIcon: <DotIcon />, children: 'label' },
};

export const IconOnly: Story = {
  args: {
    iconOnly: true,
    leftIcon: <DotIcon />,
    'aria-label': 'Action',
    children: undefined,
  },
};

/* ── Icon-only sizes ────────────────────────────────────────────────────────── */
export const IconOnlySizes: Story = {
  render: () => (
    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
      {(['l', 'm', 's'] as const).map((size) => (
        <Button key={size} size={size} iconOnly leftIcon={<DotIcon />} aria-label={`Size ${size}`} />
      ))}
    </div>
  ),
};
