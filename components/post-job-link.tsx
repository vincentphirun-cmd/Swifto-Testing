'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import { createClient } from '@/lib/supabase/client'

function usePostJobHref(): string {
  const { user, loading } = useAuth()
  const [href, setHref] = useState('/signup')

  useEffect(() => {
    if (loading) return
    if (!user?.id) {
      setHref('/signup')
      return
    }

    let cancelled = false
    void (async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('profiles')
        .select('role, identity_status')
        .eq('id', user.id)
        .single()

      if (cancelled) return

      if (data?.role === 'lister' || user.user_metadata?.role === 'lister') {
        setHref(
          data?.identity_status === 'verified'
            ? '/dashboard/lister/post-job'
            : '/dashboard/lister/verify-identity'
        )
      } else if (data?.role === 'student' || user.user_metadata?.role === 'student') {
        setHref('/dashboard/student')
      } else {
        setHref('/signup')
      }
    })()

    return () => {
      cancelled = true
    }
  }, [user?.id, user?.user_metadata?.role, loading])

  return href
}

type Props = {
  className?: string
  children: React.ReactNode
}

export function PostJobLink({ className, children }: Props) {
  const href = usePostJobHref()
  return (
    <Link href={href} className={className}>
      {children}
    </Link>
  )
}
