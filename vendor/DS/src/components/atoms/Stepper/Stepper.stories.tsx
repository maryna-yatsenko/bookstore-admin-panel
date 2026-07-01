import type { Meta, StoryObj } from '@storybook/react';
import { Stepper } from './Stepper';
import type { StepConfig } from './Stepper.types';

const RICH_STEPS: StepConfig[] = [
  { badge: 'Status',  badgeColor: 'white', label: 'Order created',   actor: 'Customer' },
  { badge: 'Payment', badgeColor: 'gray',  label: 'Refund initiated', actor: 'Oleksandr Kovalenko' },
  { badge: 'Status',  badgeColor: 'white', label: 'Order cancelled', actor: 'Customer' },
];

const meta = {
  title: 'Content/Stepper',
  component: Stepper,
  tags: ['autodocs'],
  argTypes: {
    activeStep: {
      control: { type: 'range', min: 0, max: 3, step: 1 },
      description: '0-indexed active step. Value > last index = all passed.',
    },
    steps:     { table: { disable: true } },
    className: { table: { disable: true } },
    style:     { table: { disable: true } },
  },
  args: {
    steps: RICH_STEPS,
    activeStep: 1,
  },
} satisfies Meta<typeof Stepper>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};
