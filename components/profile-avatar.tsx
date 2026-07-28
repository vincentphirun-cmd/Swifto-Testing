'use client'

import { useRef, useState, type ChangeEvent } from 'react'
import { createClient } from '@/lib/supabase/client'

type BaseProps = {
  avatarUrl?: string | null
  sizeClassName?: string
  iconClassName?: string
}

function Placeholder({ iconClassName = 'w-16 h-16 text-primary' }: { iconClassName?: string }) {
  return (
    <svg className={iconClassName} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
      />
    </svg>
  )
}

export function ProfileAvatar({
  avatarUrl,
  sizeClassName = 'w-32 h-32',
  iconClassName = 'w-16 h-16 text-primary',
}: BaseProps) {
  return (
    <div className={`${sizeClassName} rounded-full bg-primary/10 flex items-center justify-center border-4 border-primary/20 overflow-hidden`}>
      {avatarUrl ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={avatarUrl} alt="Profile picture" className="w-full h-full object-cover" />
      ) : (
        <Placeholder iconClassName={iconClassName} />
      )}
    </div>
  )
}

type UploadProps = BaseProps & {
  userId: string
  onUploaded: (url: string) => void
}

export function ProfileAvatarUpload({
  userId,
  avatarUrl,
  onUploaded,
  sizeClassName = 'w-32 h-32',
  iconClassName = 'w-16 h-16 text-primary',
}: UploadProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleAvatarChange = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setError(null)

    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setError('Please upload a JPG, PNG, or WEBP image.')
      e.target.value = ''
      return
    }

    const maxSize = 2 * 1024 * 1024
    if (file.size > maxSize) {
      setError('Image must be smaller than 2MB.')
      e.target.value = ''
      return
    }

    setUploading(true)

    try {
      const supabase = createClient()
      const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
      const filePath = `${userId}/avatar.${ext}`

      const { error: uploadError } = await supabase.storage.from('avatars').upload(filePath, file, {
        upsert: true,
      })
      if (uploadError) throw uploadError

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath)
      const publicUrl = `${data.publicUrl}?t=${Date.now()}`

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', userId)

      if (updateError) throw updateError

      onUploaded(publicUrl)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image.')
    } finally {
      setUploading(false)
      e.target.value = ''
    }
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative group"
        disabled={uploading}
      >
        <ProfileAvatar avatarUrl={avatarUrl} sizeClassName={sizeClassName} iconClassName={iconClassName} />
        <div className="absolute inset-0 rounded-full bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-medium px-4 text-center">
          {uploading ? 'Uploading...' : 'Change photo'}
        </div>
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        className="hidden"
        onChange={handleAvatarChange}
        disabled={uploading}
      />
      <p className="text-xs text-ink/60 text-center">JPG, PNG or WEBP. Max 2MB.</p>
      {error && <p className="text-sm text-red-600 text-center">{error}</p>}
    </div>
  )
}
