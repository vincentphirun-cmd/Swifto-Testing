import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual style. `primary` solid blue is the default CTA. */
  variant?: 'primary' | 'white' | 'outlineWhite' | 'outline' | 'ghost';
  /** Control height. `md` (48px) matches inputs. */
  size?: 'sm' | 'md' | 'lg';
  /** Stretch to fill the container width. */
  fullWidth?: boolean;
  disabled?: boolean;
  children?: React.ReactNode;
}

/**
 * Swifto's primary action button.
 * @startingPoint section="Forms" subtitle="Brand-blue button with 5 variants" viewport="700x220"
 */
export function Button(props: ButtonProps): JSX.Element;
