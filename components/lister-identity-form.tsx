'use client'

import { useState, type FormEvent, type ChangeEvent } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  LISTER_ID_DOCS_BUCKET,
  LISTER_IDENTITY_DOC_TYPES,
  identityDocTypeLabel,
  type ListerIdentityDocType,
} from '@/lib/lister-identity'

type Props = {
  onSubmitted?: () => void
}

export function ListerIdentityForm({ onSubmitted }: Props) {
  const [legalFullName, setLegalFullName] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [documentType, setDocumentType] = useState<ListerIdentityDocType>('driver_licence')
  const [documentNumber, setDocumentNumber] = useState('')
  const [addressLine, setAddressLine] = useState('')
  const [files, setFiles] = useState<File[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onFilesChange = (e: ChangeEvent<HTMLInputElement>) => {
    const list = Array.from(e.target.files ?? [])
    setFiles(list.slice(0, 3))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!legalFullName.trim() || !dateOfBirth || !files.length) {
      setError('Name, date of birth, and at least one document file are required.')
      return
    }

    setLoading(true)
    try {
      const supabase = createClient()
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (!session?.access_token || !session.user) {
        setError('Please log in again')
        setLoading(false)
        return
      }

      const userId = session.user.id
      const paths: string[] = []

      for (const file of files) {
        const allowed = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf']
        if (!allowed.includes(file.type)) {
          setError('Files must be JPG, PNG, WEBP, or PDF.')
          setLoading(false)
          return
        }
        if (file.size > 5 * 1024 * 1024) {
          setError('Each file must be under 5MB.')
          setLoading(false)
          return
        }

        const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const path = `${userId}/${Date.now()}-${safeName}`
        const { error: uploadErr } = await supabase.storage
          .from(LISTER_ID_DOCS_BUCKET)
          .upload(path, file, { upsert: false, contentType: file.type })

        if (uploadErr) {
          console.error(uploadErr)
          setError(uploadErr.message || 'Upload failed. Have you run the identity SQL migration?')
          setLoading(false)
          return
        }
        paths.push(path)
      }

      const res = await fetch('/api/lister/identity', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          legal_full_name: legalFullName.trim(),
          date_of_birth: dateOfBirth,
          document_type: documentType,
          document_number: documentNumber.trim() || null,
          address_line: addressLine.trim() || null,
          document_paths: paths,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Submission failed')
        setLoading(false)
        return
      }

      onSubmitted?.()
    } catch {
      setError('Something went wrong. Please try again.')
    }
    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="legal_full_name">
          Full legal name
        </label>
        <input
          id="legal_full_name"
          value={legalFullName}
          onChange={(e) => setLegalFullName(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="As shown on your ID"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="date_of_birth">
          Date of birth
        </label>
        <input
          id="date_of_birth"
          type="date"
          value={dateOfBirth}
          onChange={(e) => setDateOfBirth(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:outline-none focus:ring-2 focus:ring-primary"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="document_type">
          Document type
        </label>
        <select
          id="document_type"
          value={documentType}
          onChange={(e) => setDocumentType(e.target.value as ListerIdentityDocType)}
          className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:outline-none focus:ring-2 focus:ring-primary bg-white"
        >
          {LISTER_IDENTITY_DOC_TYPES.map((t) => (
            <option key={t} value={t}>
              {identityDocTypeLabel(t)}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="document_number">
          Document number (optional)
        </label>
        <input
          id="document_number"
          value={documentNumber}
          onChange={(e) => setDocumentNumber(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Licence / passport number"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="address_line">
          Address (optional)
        </label>
        <input
          id="address_line"
          value={addressLine}
          onChange={(e) => setAddressLine(e.target.value)}
          className="w-full px-4 py-3 rounded-xl border border-ink/20 focus:outline-none focus:ring-2 focus:ring-primary"
          placeholder="Street, suburb, city"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-ink mb-1.5" htmlFor="documents">
          Upload document (1–3 files)
        </label>
        <input
          id="documents"
          type="file"
          accept="image/jpeg,image/png,image/webp,application/pdf"
          multiple
          onChange={onFilesChange}
          className="w-full text-sm text-ink/80"
          required
        />
        <p className="text-xs text-ink/50 mt-1">JPG, PNG, WEBP, or PDF · max 5MB each</p>
        {files.length > 0 && (
          <ul className="mt-2 text-sm text-ink/70 list-disc pl-5">
            {files.map((f) => (
              <li key={f.name}>{f.name}</li>
            ))}
          </ul>
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3 rounded-xl bg-primary text-white font-semibold hover:bg-secondary disabled:opacity-70"
      >
        {loading ? 'Submitting…' : 'Submit for review'}
      </button>
    </form>
  )
}
