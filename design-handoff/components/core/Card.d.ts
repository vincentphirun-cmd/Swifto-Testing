import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLElement> {
  /** Enables the signature hover lift (raise + scale + blue border). */
  interactive?: boolean;
  /** Inner padding preset. */
  padding?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  /** Element to render as (e.g. 'a', 'article'). */
  as?: keyof JSX.IntrinsicElements;
  children?: React.ReactNode;
}

/**
 * Swifto surface card.
 * @startingPoint section="Core" subtitle="White card with hover-lift" viewport="700x200"
 */
export function Card(props: CardProps): JSX.Element;
