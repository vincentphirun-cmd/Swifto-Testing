'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'

export function SiteNav() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [userRole, setUserRole] = useState<'lister' | 'student' | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    async function fetchUserRole() {
      if (!user) {
        setUserRole(null)
        return
      }
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()
      if (data?.role === 'lister' || data?.role === 'student') {
        setUserRole(data.role)
      } else if (user.user_metadata?.role === 'lister' || user.user_metadata?.role === 'student') {
        setUserRole(user.user_metadata.role)
      }
    }
    fetchUserRole()
  }, [user])

  const handleLogout = async () => {
    await signOut()
    router.push('/')
  }

  const navLinks = (
    <>
      <Link href="/" className="text-base text-ink hover:text-primary transition-colors py-2 md:py-0" onClick={() => setMobileMenuOpen(false)}>
        Home
      </Link>
      <Link href="/mission" className="text-base text-ink hover:text-primary transition-colors py-2 md:py-0" onClick={() => setMobileMenuOpen(false)}>
        Our Mission
      </Link>
      <Link href="/about" className="text-base text-ink hover:text-primary transition-colors py-2 md:py-0" onClick={() => setMobileMenuOpen(false)}>
        About Swifto
      </Link>
      <Link href="/contact" className="text-base text-ink hover:text-primary transition-colors py-2 md:py-0" onClick={() => setMobileMenuOpen(false)}>
        Contact
      </Link>
      {loading ? (
        <span className="text-base text-ink/50 py-2 md:py-0">Loading…</span>
      ) : user ? (
        <>
          <Link
            href={userRole === 'lister' ? '/dashboard/lister' : '/dashboard/student'}
            className="text-base text-ink hover:text-primary transition-colors py-2 md:py-0"
            onClick={() => setMobileMenuOpen(false)}
          >
            Dashboard
          </Link>
          {userRole === 'lister' && (
            <Link
              href="/dashboard/lister/post-job"
              className="h-12 px-6 rounded-xl bg-primary text-white font-medium hover:bg-secondary transition-colors flex items-center justify-center min-h-[44px] w-full md:w-auto"
              onClick={() => setMobileMenuOpen(false)}
            >
              Post a Job
            </Link>
          )}
          {userRole === 'student' && (
            <Link
              href="/browse"
              className="h-12 px-6 rounded-xl bg-primary text-white font-medium hover:bg-secondary transition-colors flex items-center justify-center min-h-[44px] w-full md:w-auto"
              onClick={() => setMobileMenuOpen(false)}
            >
              Find a Job
            </Link>
          )}
          <button
            onClick={() => { setMobileMenuOpen(false); handleLogout() }}
            className="h-12 px-6 rounded-xl border border-ink/20 text-ink font-medium hover:bg-ink/5 transition-colors flex items-center justify-center min-h-[44px] w-full md:w-auto"
          >
            Log out
          </button>
        </>
      ) : (
        <>
          <Link href="/login" className="text-base text-ink hover:text-primary transition-colors py-2 md:py-0" onClick={() => setMobileMenuOpen(false)}>
            Log in
          </Link>
          <Link
            href="/signup"
            className="h-12 px-6 rounded-xl bg-primary text-white font-medium hover:bg-secondary transition-colors flex items-center justify-center min-h-[44px] w-full md:w-auto"
            onClick={() => setMobileMenuOpen(false)}
          >
            Sign up
          </Link>
        </>
      )}
    </>
  )

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-ink/10 relative">
      <nav className="mx-auto w-full max-w-6xl px-4 md:px-8 py-3 md:py-4 flex items-center justify-between gap-4">
        <Link href="/" className="text-2xl md:text-4xl font-bold text-ink shrink-0">
          Swifto
        </Link>
        {/* Desktop nav */}
        <div className="hidden md:flex items-center gap-6">
          {navLinks}
        </div>
        {/* Mobile menu button */}
        <button
          type="button"
          onClick={() => setMobileMenuOpen((o) => !o)}
          className="md:hidden p-2 -mr-2 rounded-lg text-ink hover:bg-ink/5 min-h-[44px] min-w-[44px] flex items-center justify-center"
          aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileMenuOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>
        {/* Mobile dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-ink/10 shadow-lg md:hidden">
            <div className="flex flex-col gap-1 px-4 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navLinks}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
