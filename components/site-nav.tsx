'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'

export function SiteNav() {
  const router = useRouter()
  const { user, signOut } = useAuth()
  const [userRole, setUserRole] = useState<'lister' | 'student' | null>(null)

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

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-ink/10">
      <nav className="mx-auto w-full max-w-6xl px-4 md:px-8 py-4 flex items-center justify-between">
        <Link href="/" className="text-4xl font-bold text-ink">
          Swifto
        </Link>
        <div className="flex items-center gap-6">
          <Link href="/" className="text-base text-ink hover:text-primary transition-colors">
            Home
          </Link>
          <Link href="/mission" className="text-base text-ink hover:text-primary transition-colors">
            Our Mission
          </Link>
          <Link href="/about" className="text-base text-ink hover:text-primary transition-colors">
            About Swifto
          </Link>
          <Link href="/contact" className="text-base text-ink hover:text-primary transition-colors">
            Contact
          </Link>
          {user ? (
            <>
              <Link
                href={userRole === 'lister' ? '/dashboard/lister' : '/dashboard/student'}
                className="text-base text-ink hover:text-primary transition-colors"
              >
                Dashboard
              </Link>
              {userRole === 'lister' && (
                <Link
                  href="/dashboard/lister/post-job"
                  className="h-12 px-6 rounded-xl bg-primary text-white font-medium hover:bg-secondary transition-colors flex items-center justify-center"
                >
                  Post a Job
                </Link>
              )}
              {userRole === 'student' && (
                <Link
                  href="/browse"
                  className="h-12 px-6 rounded-xl bg-primary text-white font-medium hover:bg-secondary transition-colors flex items-center justify-center"
                >
                  Find a Job
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="h-12 px-6 rounded-xl border border-ink/20 text-ink font-medium hover:bg-ink/5 transition-colors flex items-center justify-center"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-base text-ink hover:text-primary transition-colors">
                Log in
              </Link>
              <Link
                href="/signup"
                className="h-12 px-6 rounded-xl bg-primary text-white font-medium hover:bg-secondary transition-colors flex items-center justify-center"
              >
                Sign up
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  )
}
