'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { SiteNav } from '@/components/site-nav'
import { PageHero } from '@/components/page-hero'
import { useAuth } from '@/lib/auth-context'
import { getAccessToken } from '@/lib/profile-api'

export default function AccountSettingsPage() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [confirmText, setConfirmText] = useState('')
  const [understood, setUnderstood] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    setError(null)
    if (!user) {
      setError('Please log in again.')
      return
    }
    if (confirmText.trim() !== 'DELETE' || !understood) {
      setError('Tick the box and type DELETE to confirm.')
      return
    }

    setLoading(true)
    try {
      const token = await getAccessToken()
      if (!token) {
        setError('Please log in again.')
        setLoading(false)
        return
      }
      const res = await fetch('/api/account', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ confirm: 'DELETE' }),
      })
      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof data.error === 'string' ? data.error : 'Could not delete account.')
        setLoading(false)
        return
      }
      await signOut()
      router.replace('/?deleted=1')
    } catch {
      setError('Could not delete account. Please try again or email hello@swifto.co.nz.')
      setLoading(false)
    }
  }

  return (
    <>
      <SiteNav />
      <main className="bg-canvas min-h-screen">
        <PageHero
          title="Account & privacy"
          subtitle="Download nothing extra — delete your account and uploaded files from here."
          centered
        />
        <section className="py-12 md:py-16">
          <div className="mx-auto w-full max-w-2xl px-4 md:px-8 space-y-8">
            <div className="rounded-2xl border border-ink/10 bg-white p-6 space-y-3">
              <h2 className="text-lg font-semibold text-ink">Your data</h2>
              <p className="text-sm text-ink/70 leading-relaxed">
                You can request access or correction by emailing{' '}
                <a href="mailto:hello@swifto.co.nz" className="text-primary hover:underline">
                  hello@swifto.co.nz
                </a>
                . Deleting your account removes your login, profile, job posts, applications, messages,
                profile photo, and identity documents we store. We may keep limited payment and
                dispute records where tax or legal rules require it.
              </p>
            </div>

            <div className="rounded-2xl border border-red-200 bg-red-50 p-6 space-y-4">
              <h2 className="text-lg font-semibold text-red-950">Delete account</h2>
              <p className="text-sm text-red-950/80 leading-relaxed">
                This is permanent. You will not be able to log in again with this email unless you
                create a new account.
              </p>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={understood}
                  onChange={(e) => setUnderstood(e.target.checked)}
                  className="mt-1 h-4 w-4 rounded border-ink/30"
                />
                <span className="text-sm text-red-950/90">
                  I understand my account, uploads, and job history on Swifto will be deleted.
                </span>
              </label>
              <div>
                <label htmlFor="confirm-delete" className="block text-sm font-medium text-red-950 mb-1.5">
                  Type DELETE to confirm
                </label>
                <input
                  id="confirm-delete"
                  value={confirmText}
                  onChange={(e) => setConfirmText(e.target.value)}
                  className="w-full h-12 px-4 rounded-xl border border-red-200 bg-white text-ink"
                  placeholder="DELETE"
                  autoComplete="off"
                />
              </div>
              {error && (
                <p className="text-sm text-red-800">{error}</p>
              )}
              <button
                type="button"
                onClick={() => void handleDelete()}
                disabled={loading || !understood || confirmText.trim() !== 'DELETE'}
                className="h-12 px-5 rounded-xl bg-red-700 text-white font-medium hover:bg-red-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Deleting…' : 'Delete my account'}
              </button>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
