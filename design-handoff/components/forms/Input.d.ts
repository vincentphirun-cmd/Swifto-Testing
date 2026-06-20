import * as React from 'react';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  /** Field label rendered above the input. */
  label?: string;
  /** Muted helper text below the field. */
  helper?: string;
  /** Error message — turns the border/text red and overrides helper. */
  error?: string;
  /** Inline prefix (e.g. "$" for prices). */
  prefix?: React.ReactNode;
}

/** Swifto labelled text input with brand focus ring. */
export function Input(props: InputProps): JSX.Element;
