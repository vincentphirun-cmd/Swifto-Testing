type Props = {
  label: string
  value: string
  id?: string
}

export function ProfileReadOnlyField({ label, value, id }: Props) {
  return (
    <div className="space-y-1">
      <label htmlFor={id} className="block text-sm font-medium text-ink">
        {label}
      </label>
      <div
        id={id}
        className="w-full min-h-11 px-4 py-2.5 rounded-xl border border-ink/10 bg-canvas/50 text-ink"
      >
        {value || '—'}
      </div>
    </div>
  )
}

export function ProfileIdentityNote() {
  return (
    <p className="text-xs text-ink/60">
      Set at signup. Contact support if you need to change this.
    </p>
  )
}
