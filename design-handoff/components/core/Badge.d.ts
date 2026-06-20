import * as React from 'react';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  /** Color tone. */
  tone?: 'neutral' | 'brand' | 'success' | 'warning' | 'danger';
  /** Solid fill instead of tinted background. */
  solid?: boolean;
  children?: React.ReactNode;
}

/** Swifto status pill — rounded-full, semibold, xs. */
export function Badge(props: BadgeProps): JSX.Element;
