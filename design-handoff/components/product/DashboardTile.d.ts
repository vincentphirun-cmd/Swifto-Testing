import * as React from 'react';

export interface DashboardTileProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Icon element shown in the large disc. */
  icon?: React.ReactNode;
  title: string;
  /** Brand-blue highlight line, e.g. "3 active". */
  highlight?: string;
  /** Muted caption under the title. */
  caption?: string;
  /** Keep a 1:1 square (default true). */
  square?: boolean;
  onClick?: () => void;
}

/** Swifto dashboard navigation tile — big icon disc + title. */
export function DashboardTile(props: DashboardTileProps): JSX.Element;
