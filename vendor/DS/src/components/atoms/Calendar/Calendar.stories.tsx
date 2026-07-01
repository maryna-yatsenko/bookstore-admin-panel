import React, { useState } from 'react';
import type { Meta, StoryObj } from '@storybook/react';
import { Calendar } from './Calendar';
import type { CalendarMode } from './Calendar.types';

const meta = {
  title: 'Content/Calendar',
  component: Calendar,
  tags: ['autodocs'],
  parameters: { actions: { disable: true } },
  argTypes: {
    mode: {
      control: 'select',
      options: ['single', 'range'] as CalendarMode[],
      description: 'single — pick one day · range — pick a period',
    },
    value:         { table: { disable: true } },
    rangeStart:    { table: { disable: true } },
    rangeEnd:      { table: { disable: true } },
    onChange:      { table: { disable: true } },
    onRangeChange: { table: { disable: true } },
    onApply:       { table: { disable: true } },
    className:     { table: { disable: true } },
    style:         { table: { disable: true } },
  },
  args: {
    mode: 'range',
  },
} satisfies Meta<typeof Calendar>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: ({ mode }) => {
    const [single, setSingle]     = useState<Date | null>(null);
    const [start,  setStart]      = useState<Date | null>(null);
    const [end,    setEnd]        = useState<Date | null>(null);

    if (mode === 'single') {
      return (
        <Calendar
          mode="single"
          value={single}
          onChange={setSingle}
          onApply={() => {}}
        />
      );
    }

    return (
      <Calendar
        mode="range"
        rangeStart={start}
        rangeEnd={end}
        onRangeChange={(s, e) => { setStart(s); setEnd(e); }}
        onApply={() => {}}
      />
    );
  },
};
