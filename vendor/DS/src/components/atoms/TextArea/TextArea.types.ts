import type { TextareaHTMLAttributes } from 'react';

export type TextAreaState =
  | 'default'
  | 'hover'
  | 'focused'
  | 'typing'
  | 'entered'
  | 'success'
  | 'error'
  | 'disabled';

export interface TextAreaProps extends Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  label?: boolean;
  labelText?: string;
  disclaimer?: boolean;
  supporting?: boolean;
  supportingText?: string;
  state?: TextAreaState;
  maxChars?: number;
  className?: string;
}
