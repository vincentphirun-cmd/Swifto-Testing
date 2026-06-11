import * as React from 'react';

export interface StarRatingProps {
  /** Current rating (0–max). */
  value?: number;
  max?: number;
  /** Provide to make the rating an interactive input — `(star) => void`. */
  onChange?: (value: number) => void;
  size?: 'sm' | 'md' | 'lg';
  /** Show a caption line under the stars. */
  showValue?: boolean;
  /** Review count for the caption. */
  reviewCount?: number;
  style?: React.CSSProperties;
}

/** Swifto star rating — display or interactive input. */
export function StarRating(props: StarRatingProps): JSX.Element;
