import * as React from 'react';

export interface CheckboxProps {
  /** Label shown to the right of the box. */
  label?: string;
  checked?: boolean;
  /** `(checked, event) => void`. */
  onChange?: (checked: boolean, event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

/** Swifto checkbox — brand-blue box with checkmark and inline label. */
export function Checkbox(props: CheckboxProps): JSX.Element;
