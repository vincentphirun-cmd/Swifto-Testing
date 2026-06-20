import * as React from 'react';

export interface JobCardProps {
  /** Job name, e.g. "Lawn mowing". */
  title: string;
  /** Short detail line, e.g. "Backyard, ~50 sq m" or duration. */
  detail?: string;
  /** Display pay, e.g. "$45". */
  pay: string;
  /** Suburb / area, e.g. "Ponsonby, Auckland". */
  location?: string;
  /** Shows the amber "Urgent rebook" badge. */
  urgent?: boolean;
  /** Shows the green "Applied" badge. */
  applied?: boolean;
  onClick?: () => void;
  /** Action buttons rendered in a divided footer. */
  actions?: React.ReactNode;
  style?: React.CSSProperties;
}

/**
 * Swifto job listing tile.
 * @startingPoint section="Product" subtitle="Job listing card with pay & location" viewport="700x200"
 */
export function JobCard(props: JobCardProps): JSX.Element;
