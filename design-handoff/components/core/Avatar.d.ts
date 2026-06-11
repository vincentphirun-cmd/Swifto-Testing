import * as React from 'react';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Full name — used for initials and alt text. */
  name?: string;
  /** Optional image URL; falls back to initials. */
  src?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
}

/** Swifto circular avatar with initials fallback. */
export function Avatar(props: AvatarProps): JSX.Element;
