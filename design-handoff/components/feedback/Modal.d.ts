import * as React from 'react';

export interface ModalProps {
  open?: boolean;
  /** Close handler — fires on scrim click, Esc, and the X button. */
  onClose?: () => void;
  title?: string;
  subtitle?: string;
  children?: React.ReactNode;
  /** Footer node (usually action buttons). */
  footer?: React.ReactNode;
  width?: 'sm' | 'md' | 'lg';
}

/** Swifto centered dialog over a blurred scrim. */
export function Modal(props: ModalProps): JSX.Element | null;
