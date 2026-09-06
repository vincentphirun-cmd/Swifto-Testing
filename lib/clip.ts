export function clipText(value: unknown, max: number): string | null {
  if (value == null) return null
  const text = String(value).trim()
  if (!text) return null
  return text.slice(0, max)
}

export function clipRequired(value: unknown, max: number): string {
  return clipText(value, max) ?? ''
}
