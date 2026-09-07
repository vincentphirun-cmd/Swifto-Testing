'use client'

import { useEffect, useMemo, type ChangeEvent } from 'react'
import { COMPLETION_EVIDENCE_MAX_PHOTOS } from '@/lib/security-constants'
import { validateCompletionPhoto } from '@/lib/completion-evidence'

type Props = {
  files: File[]
  onChange: (files: File[]) => void
  disabled?: boolean
  error?: string | null
}

export function CompletionEvidencePicker({ files, onChange, disabled, error }: Props) {
  const previews = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files])

  useEffect(() => {
    return () => {
      previews.forEach((url) => URL.revokeObjectURL(url))
    }
  }, [previews])

  const onFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(e.target.files ?? [])
    const next = [...files]
    for (const file of incoming) {
      if (next.length >= COMPLETION_EVIDENCE_MAX_PHOTOS) break
      if (validateCompletionPhoto(file)) continue
      next.push(file)
    }
    onChange(next.slice(0, COMPLETION_EVIDENCE_MAX_PHOTOS))
    e.target.value = ''
  }

  return (
    <div className="space-y-3">
      <div>
        <p className="text-sm font-semibold text-ink">Photos of the finished job</p>
        <p className="text-sm text-ink-2 mt-1">
          Add at least one photo (up to {COMPLETION_EVIDENCE_MAX_PHOTOS}). On your phone you can take
          a photo now or choose from your camera roll. These stay private to you, the other party,
          and Swifto if there is a dispute.
        </p>
      </div>
      <label className="swifto-btn-outline-brand h-12 px-5 text-sm cursor-pointer w-full sm:w-auto">
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          disabled={disabled || files.length >= COMPLETION_EVIDENCE_MAX_PHOTOS}
          onChange={onFilesChange}
          className="sr-only"
        />
        {files.length >= COMPLETION_EVIDENCE_MAX_PHOTOS ? 'Maximum photos added' : 'Add photos'}
      </label>
      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {previews.map((src, i) => (
            <div key={`${files[i]?.name}-${i}`} className="relative aspect-square rounded-xl overflow-hidden border border-line bg-brand-soft">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" className="w-full h-full object-cover" />
              <button
                type="button"
                disabled={disabled}
                onClick={() => onChange(files.filter((_, idx) => idx !== i))}
                className="absolute top-1 right-1 w-7 h-7 rounded-full bg-ink/80 text-white text-sm leading-none"
                aria-label="Remove photo"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      {error && <p className="text-sm text-red-700">{error}</p>}
    </div>
  )
}
