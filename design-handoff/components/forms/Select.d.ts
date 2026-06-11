import * as React from 'react';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'children'> {
  label?: string;
  helper?: string;
  /** Options list — `[{ value, label }]`. */
  options: SelectOption[];
  /** Leading empty option text. */
  placeholder?: string;
}

/** Swifto native select styled to match Input, with brand chevron. */
export function Select(props: SelectProps): JSX.Element;
