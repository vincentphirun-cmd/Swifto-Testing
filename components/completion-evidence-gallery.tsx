'use client'

import type { CompletionPhotoRow } from '@/lib/completion-evidence'

type Props = {
  listerPhotos: CompletionPhotoRow[]
  studentPhotos: CompletionPhotoRow[]
  listerLabel?: string
  studentLabel?: string
}

function Strip({ title, photos }: { title: string; photos: CompletionPhotoRow[] }) {
  if (photos.length === 0) {
    return (
      <div>
        <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-2">{title}</p>
        <p className="text-sm text-ink/60">No photos uploaded.</p>
      </div>
    )
  }
  return (
    <div>
      <p className="text-xs font-semibold text-ink/60 uppercase tracking-wide mb-2">{title}</p>
      <div className="grid grid-cols-3 gap-2">
        {photos.map((photo) =>
          photo.url ? (
            <a
              key={photo.id}
              href={photo.url}
              target="_blank"
              rel="noreferrer"
              className="aspect-square rounded-xl overflow-hidden border border-line bg-brand-soft"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={photo.url} alt="" className="w-full h-full object-cover" />
            </a>
          ) : null
        )}
      </div>
    </div>
  )
}

export function CompletionEvidenceGallery({
  listerPhotos,
  studentPhotos,
  listerLabel = 'Lister photos',
  studentLabel = 'Student photos',
}: Props) {
  return (
    <div className="space-y-4">
      <Strip title={listerLabel} photos={listerPhotos} />
      <Strip title={studentLabel} photos={studentPhotos} />
    </div>
  )
}
