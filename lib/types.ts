/** UI shape for browse listing and modal */
export type BrowseJob = {
  id: string
  name: string
  area: string
  date: string
  timeOfDay: string
  timeNeeded: string
  pay: string
}

/** Raw job row from Supabase */
export type JobRow = {
  id: string
  job_name: string
  category: string
  size_or_time: string
  address: string
  area: string
  price: number
  completion_date: string | null
  is_flexible: boolean
  status: string
  created_at: string
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
  return {
    id: row.id,
    name: row.job_name,
    area: row.area,
    date,
    timeOfDay,
    timeNeeded: row.size_or_time,
    pay: `$${Number(row.price).toFixed(0)}`,
  }
}
