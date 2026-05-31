'use client'

type Props = {
  title: string
  isEditing: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: () => void
  saving?: boolean
  error?: string | null
  success?: boolean
  editContent: React.ReactNode
  viewContent: React.ReactNode
  className?: string
}

export function ProfileEditableSection({
  title,
  isEditing,
  onEdit,
  onCancel,
  onSave,
  saving = false,
  error,
  success,
  editContent,
  viewContent,
  className = '',
}: Props) {
  return (
    <div className={`space-y-4 pt-4 border-t border-ink/10 ${className}`}>
      <div className="flex items-center justify-between gap-4">
        <h2 className="text-sm font-semibold text-ink uppercase tracking-wide">{title}</h2>
        {!isEditing ? (
          <button
            type="button"
            onClick={onEdit}
            className="shrink-0 text-sm font-semibold text-primary hover:text-accent transition-colors"
          >
            Edit
          </button>
        ) : (
          <div className="flex items-center gap-3 shrink-0">
            <button
              type="button"
              onClick={onCancel}
              disabled={saving}
              className="text-sm font-medium text-ink/70 hover:text-ink transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onSave}
              disabled={saving}
              className="text-sm font-semibold text-primary hover:text-accent transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        )}
      </div>

      {isEditing ? editContent : viewContent}

      {error && <p className="text-sm text-red-600">{error}</p>}
      {success && !isEditing && (
        <p className="text-sm text-green-600">Saved successfully.</p>
      )}
    </div>
  )
}
