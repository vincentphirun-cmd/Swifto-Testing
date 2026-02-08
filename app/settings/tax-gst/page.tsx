'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SiteNav } from '@/components/site-nav'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'

export default function TaxGstPage() {
  const { user } = useAuth()
  const [role, setRole] = useState<'lister' | 'student' | null>(null)

  useEffect(() => {
    if (!user) {
      setRole(null)
      return
    }
    const supabase = createClient()
    supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()
      .then(({ data }) => {
        if (data?.role === 'lister' || data?.role === 'student') {
          setRole(data.role)
        } else {
          setRole(user.user_metadata?.role === 'lister' ? 'lister' : user.user_metadata?.role === 'student' ? 'student' : null)
        }
      })
  }, [user])

  const profileLink = role === 'lister' ? '/profile/lister' : role === 'student' ? '/profile/student' : null

  return (
    <>
      <SiteNav />
      <main>
        <section className="py-16 md:py-24 bg-primary">
          <div className="mx-auto w-full max-w-6xl px-4 md:px-8">
            <div className="text-center">
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white">
                Tax &amp; GST
              </h1>
              <p className="mt-4 text-lg text-white/90 max-w-2xl mx-auto">
                Information about tax and GST for Swifto providers
              </p>
            </div>
          </div>
        </section>

        <section className="py-16 md:py-24 bg-white">
          <div className="mx-auto w-full max-w-4xl px-4 md:px-8 space-y-12">
            <div>
              <h2 className="text-2xl font-semibold text-ink mb-4">GST</h2>
              <p className="text-base leading-7 text-ink/80">
                Only GST-registered providers charge GST. GST registration is based on total turnover across all work.
              </p>
            </div>

            <div className="border-t border-ink/20 pt-12">
              <h2 className="text-2xl font-semibold text-ink mb-4">Income tax</h2>
              <p className="text-base leading-7 text-ink/80">
                You may need to declare your earnings. Keep records of expenses.
              </p>
            </div>

            <div className="border-t border-ink/20 pt-12">
              <h2 className="text-2xl font-semibold text-ink mb-4">Reporting</h2>
              <p className="text-base leading-7 text-ink/80">
                Swifto may be required to report seller earnings to NZ tax authorities.
              </p>
            </div>

            <div className="border-t border-ink/20 pt-12 flex flex-wrap gap-4">
              {profileLink ? (
                <Link
                  href={profileLink}
                  className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back to your profile
                </Link>
              ) : (
                <>
                  <Link
                    href="/profile/student"
                    className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Student Profile
                  </Link>
                  <Link
                    href="/profile/lister"
                    className="inline-flex items-center gap-2 text-primary hover:text-accent transition-colors"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                    Lister Profile
                  </Link>
                </>
              )}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
