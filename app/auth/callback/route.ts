import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const errorParam = requestUrl.searchParams.get('error')
  const next = requestUrl.searchParams.get('next') || '/dashboard/student'

  // Handle OAuth errors
  if (errorParam) {
    console.error('OAuth error:', errorParam)
    return NextResponse.redirect(new URL(`/login?error=auth_failed&reason=${errorParam}`, requestUrl.origin))
  }

  if (!code) {
    console.error('No code parameter in callback URL')
    return NextResponse.redirect(new URL('/login?error=auth_failed&reason=no_code', requestUrl.origin))
  }

  try {
    const cookieStore = cookies()
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          get(name: string) {
            return cookieStore.get(name)?.value
          },
          set(name: string, value: string, options: any) {
            try {
              cookieStore.set({ name, value, ...options })
            } catch (error) {
              // The `set` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch (error) {
              // The `delete` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing
              // user sessions.
            }
          },
        },
      }
    )
    
    // Exchange code for session (this will also set cookies)
    const { data: sessionData, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
    
    if (exchangeError) {
      console.error('Error exchanging code for session:', exchangeError)
      return NextResponse.redirect(new URL(`/login?error=auth_failed&reason=exchange_failed`, requestUrl.origin))
    }

    if (!sessionData?.session) {
      console.error('No session returned from exchange')
      return NextResponse.redirect(new URL('/login?error=auth_failed&reason=no_session', requestUrl.origin))
    }

    // Get user from the session
    const user = sessionData.session.user
    if (!user) {
      console.error('No user in session')
      return NextResponse.redirect(new URL('/login?error=auth_failed&reason=no_user', requestUrl.origin))
    }

    const userMetadata = user.user_metadata || {}
    let admin
    try {
      admin = createAdminClient()
    } catch (e) {
      console.error('Supabase admin client init failed (missing SUPABASE_SERVICE_ROLE_KEY?):', e)
      return NextResponse.redirect(
        new URL(`/login?error=auth_failed&reason=missing_service_role`, requestUrl.origin)
      )
    }

    // Check if profile exists (service-role bypasses RLS)
    const { data: profile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // If no profile, create it using user_metadata from signup
    if (!profile) {
      const { error: insertError } = await admin.from('profiles').insert({
        id: user.id,
        role: userMetadata.role || 'student',
        first_name: userMetadata.first_name ?? user.email?.split('@')[0] ?? 'User',
        last_name: userMetadata.last_name ?? '',
        university: userMetadata.university ?? null,
      })

      if (insertError) {
        console.error('Error creating profile on callback:', insertError)
        return NextResponse.redirect(
          new URL(`/login?error=auth_failed&reason=profile_create_failed`, requestUrl.origin)
        )
      }
    }

    // Get profile again (or the newly created one) to determine redirect
    const { data: finalProfile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single()

    // Use DB role; fall back to user_metadata.role from signup when profile missing/failed
    const role = finalProfile?.role ?? userMetadata.role ?? 'student'
    const redirectPath = role === 'lister' ? '/dashboard/lister' : '/dashboard/student'
    return NextResponse.redirect(new URL(redirectPath, requestUrl.origin))
  } catch (err) {
    console.error('Auth callback error:', err)
    return NextResponse.redirect(new URL(`/login?error=auth_failed&reason=exception`, requestUrl.origin))
  }
}
