'use client'

import Link from 'next/link'
import { useRouter, usePathname } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'
import { SwiftoWordmark } from '@/components/swifto-wordmark'

function NavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick?: () => void }) {
  const pathname = usePathname()
  const active = pathname === href || (href !== '/' && pathname?.startsWith(href))
  return (
    <Link
      href={href}
      onClick={onClick}
      className={active ? 'swifto-nav-link swifto-nav-link-active' : 'swifto-nav-link'}
    >
      {children}
    </Link>
  )
}

export function SiteNav() {
  const router = useRouter()
  const { user, loading, signOut } = useAuth()
  const [userRole, setUserRole] = useState<'lister' | 'student' | 'admin' | null>(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    async function loadRole() {
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
      if (data?.role === 'admin' || data?.role === 'lister' || data?.role === 'student') {
        setUserRole(data.role)
      } else if (
        user.user_metadata?.role === 'admin' ||
        user.user_metadata?.role === 'lister' ||
        user.user_metadata?.role === 'student'
      ) {
        setUserRole(user.user_metadata.role)
      }

      // Bootstrap: ADMIN_EMAILS may still be lister until ensure-role runs
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.access_token && data?.role !== 'admin') {
          const res = await fetch('/api/admin/check', {
            headers: { Authorization: `Bearer ${session.access_token}` },
          })
          const check = await res.json()
          if (check.admin) {
            await fetch('/api/admin/check', {
              method: 'POST',
              headers: { Authorization: `Bearer ${session.access_token}` },
            }).catch(() => null)
            setUserRole('admin')
          }
        }
      } catch {
        // ignore
      }
    }
    loadRole()
  }, [user])

  const handleLogout = async () => {
    await signOut()
    router.push('/login')
  }

  const closeMobile = () => setMobileMenuOpen(false)

  const dashboardHref =
    userRole === 'admin'
      ? '/admin'
      : userRole === 'lister'
        ? '/dashboard/lister'
        : '/dashboard/student'

  const navLinks = (
    <>
      <NavLink href="/" onClick={closeMobile}>Home</NavLink>
      {userRole !== 'admin' && (
        <NavLink href="/browse" onClick={closeMobile}>
          {userRole === 'lister' ? 'Jobs' : 'Find work'}
        </NavLink>
      )}
      <NavLink href="/mission" onClick={closeMobile}>Our mission</NavLink>
      {loading ? (
        <span className="text-[15px] text-ink-3 py-2 md:py-0">Loading…</span>
      ) : user ? (
        <>
          <NavLink href={dashboardHref} onClick={closeMobile}>
            {userRole === 'admin' ? 'Admin' : 'Dashboard'}
          </NavLink>
          <button
            type="button"
            onClick={() => { closeMobile(); handleLogout() }}
            className="swifto-btn-ghost h-10 px-4 text-sm min-h-[44px] w-full md:w-auto"
          >
            Log out
          </button>
          {userRole === 'admin' ? (
            <Link
              href="/admin/identity"
              className="swifto-btn-primary h-10 px-4 text-sm min-h-[44px] w-full md:w-auto"
              onClick={closeMobile}
            >
              Verify IDs
            </Link>
          ) : userRole === 'lister' ? (
            <Link
              href="/dashboard/lister/post-job"
              className="swifto-btn-primary h-10 px-4 text-sm min-h-[44px] w-full md:w-auto"
              onClick={closeMobile}
            >
              Post a job
            </Link>
          ) : (
            <Link
              href="/browse"
              className="swifto-btn-primary h-10 px-4 text-sm min-h-[44px] w-full md:w-auto"
              onClick={closeMobile}
            >
              Find work
            </Link>
          )}
        </>
      ) : (
        <>
          <NavLink href="/login" onClick={closeMobile}>Log in</NavLink>
          <Link
            href="/signup"
            className="swifto-btn-primary h-10 px-4 text-sm min-h-[44px] w-full md:w-auto"
            onClick={closeMobile}
          >
            Get started
          </Link>
        </>
      )}
    </>
  )

  return (
    <header className="swifto-nav">
      <nav className="swifto-content py-3.5 flex items-center justify-between gap-4">
        <SwiftoWordmark />
        <div className="hidden lg:flex items-center gap-6">
          <div className="flex items-center gap-5">{navLinks}</div>
        </div>
        <button
          type="button"
          onClick={() => setMobileMenuOpen((o) => !o)}
          className="lg:hidden p-2 -mr-2 rounded-lg text-ink hover:bg-brand-soft/50 min-h-[44px] min-w-[44px] flex items-center justify-center"
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
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-canvas/95 backdrop-blur-md border-b border-line shadow-lg lg:hidden">
            <div className="flex flex-col gap-2 px-6 py-4 max-h-[calc(100vh-4rem)] overflow-y-auto">
              {navLinks}
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
