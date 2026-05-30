/** True for Supabase auth-js cancellations during navigation (harmless). */
export function isAbortError(err: unknown): boolean {
  if (!err) return false
  if (typeof err === 'string') {
    return err.toLowerCase().includes('abort')
  }
  if (err instanceof Error) {
    if (err.name === 'AbortError') return true
    if (err.message.toLowerCase().includes('abort')) return true
  }
  if (typeof err === 'object') {
    const e = err as { name?: string; message?: string }
    if (e.name === 'AbortError') return true
    if (typeof e.message === 'string' && e.message.toLowerCase().includes('abort')) {
      return true
    }
  }
  return false
}
