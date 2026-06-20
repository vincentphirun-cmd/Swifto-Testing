import * as React from 'react';

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  helper?: string;
  error?: string;
  rows?: number;
}

/** Swifto multi-line text field, matching Input chrome. */
export function Textarea(props: TextareaProps): JSX.Element;
