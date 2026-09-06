/** UI shape for browse listing and modal */
export type BrowseJob = {
  id: string
  name: string
  category: string
  area: string
  date: string
  timeOfDay: string
  timeNeeded: string
  pay: string
  priceAmount: number
  urgentRebook?: boolean
}

/** Raw job row from Supabase */
export type JobRow = {
  id: string
  job_name: string
  category: string
  size_or_time: string
  address?: string | null
  area: string
  price: number
  completion_date: string | null
  is_flexible: boolean
  status: string
  created_at: string
  urgent_rebook_until?: string | null
}

export function mapJobRowToBrowseJob(row: JobRow): BrowseJob {
  const date = row.is_flexible
    ? 'Flexible'
    : row.completion_date
      ? new Date(row.completion_date).toLocaleDateString('en-NZ', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })
      : 'TBD'
  const timeOfDay = row.is_flexible ? 'Flexible' : 'To be confirmed'
  const urgentRebook = !!(row.urgent_rebook_until && new Date(row.urgent_rebook_until) > new Date())
  return {
    id: row.id,
    name: row.job_name,
    category: row.category,
    area: row.area,
    date,
    timeOfDay,
    timeNeeded: row.size_or_time,
    pay: `$${Number(row.price).toFixed(0)}`,
    priceAmount: Number(row.price),
    urgentRebook,
  }
}
