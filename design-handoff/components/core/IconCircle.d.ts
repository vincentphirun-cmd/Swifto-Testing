import * as React from 'react';

export interface IconCircleProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon element (inherits `currentColor`). */
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg';
  /** `brand` = primary/10 disc; `onBrand` = for use on blue bands; `ink`. */
  tone?: 'brand' | 'onBrand' | 'ink';
}

/** Swifto soft icon disc — the trust/feature motif. */
export function IconCircle(props: IconCircleProps): JSX.Element;
