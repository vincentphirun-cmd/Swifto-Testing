import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'
import type { EmailOtpType } from '@supabase/supabase-js'
import { createAdminClient } from '@/lib/supabase/admin'
import { sendWelcome } from '@/lib/email'
import { ensureAdminRoleForUser, isAdminAccess } from '@/lib/admin-auth'
import { dashboardPathForRole, resolveRole } from '@/lib/user-role'

function safeNextPath(raw: string | null): string | null {
  if (!raw) return null
  if (raw.startsWith('/') && !raw.startsWith('//') && !raw.includes('\\')) return raw
  return null
}

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get('code')
  const tokenHash = requestUrl.searchParams.get('token_hash')
  const type = requestUrl.searchParams.get('type') as EmailOtpType | null
  const errorParam = requestUrl.searchParams.get('error')
  const isRecovery = type === 'recovery' || safeNextPath(requestUrl.searchParams.get('next')) === '/reset-password'

  if (errorParam) {
    console.error('OAuth error:', errorParam)
    return NextResponse.redirect(
      new URL(`/login?error=auth_failed&reason=${errorParam}`, requestUrl.origin)
    )
  }

  if (!code && !(tokenHash && type)) {
    console.error('No code/token_hash in callback URL')
    return NextResponse.redirect(
      new URL(
        isRecovery ? '/forgot-password' : '/login?error=auth_failed&reason=no_code',
        requestUrl.origin
      )
    )
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
            } catch {
              // Ignored in Server Component contexts
            }
          },
          remove(name: string, options: any) {
            try {
              cookieStore.set({ name, value: '', ...options })
            } catch {
              // Ignored
            }
          },
        },
      }
    )

    let userId: string | null = null
    let userEmail: string | undefined
    let userMetadata: Record<string, any> = {}

    if (code) {
      const { data: sessionData, error: exchangeError } =
        await supabase.auth.exchangeCodeForSession(code)

      if (exchangeError) {
        console.error('Error exchanging code for session:', exchangeError)
        return NextResponse.redirect(
          new URL(
            isRecovery
              ? '/forgot-password'
              : `/login?error=auth_failed&reason=exchange_failed`,
            requestUrl.origin
          )
        )
      }

      const user = sessionData?.session?.user
      if (!user) {
        return NextResponse.redirect(
          new URL(
            isRecovery ? '/forgot-password' : `/login?error=auth_failed&reason=no_user`,
            requestUrl.origin
          )
        )
      }
      userId = user.id
      userEmail = user.email
      userMetadata = user.user_metadata || {}
    } else if (tokenHash && type) {
      const { data: otpData, error: otpError } = await supabase.auth.verifyOtp({
        type,
        token_hash: tokenHash,
      })
      if (otpError || !otpData.user) {
        console.error('verifyOtp error:', otpError)
        return NextResponse.redirect(
          new URL(
            type === 'recovery' ? '/forgot-password' : `/login?error=auth_failed&reason=otp_failed`,
            requestUrl.origin
          )
        )
      }
      userId = otpData.user.id
      userEmail = otpData.user.email
      userMetadata = otpData.user.user_metadata || {}
    }

    if (!userId) {
      return NextResponse.redirect(
        new URL(`/login?error=auth_failed&reason=no_user`, requestUrl.origin)
      )
    }

    let admin
    try {
      admin = createAdminClient()
    } catch (e) {
      console.error('Supabase admin client init failed:', e)
      return NextResponse.redirect(
        new URL(`/login?error=auth_failed&reason=missing_service_role`, requestUrl.origin)
      )
    }

    const { data: profile } = await admin.from('profiles').select('role').eq('id', userId).single()

    if (!profile) {
      const { error: insertError } = await admin.from('profiles').insert({
        id: userId,
        role: userMetadata.role || 'student',
        first_name: userMetadata.first_name ?? userEmail?.split('@')[0] ?? 'User',
        last_name: userMetadata.last_name ?? '',
        university: userMetadata.university ?? null,
        identity_status: 'unverified',
      })

      if (insertError) {
        console.error('Error creating profile on callback:', insertError)
        return NextResponse.redirect(
          new URL(`/login?error=auth_failed&reason=profile_create_failed`, requestUrl.origin)
        )
      }
      if (userEmail && type !== 'recovery') {
        sendWelcome(userEmail, userMetadata.first_name).catch((e) =>
          console.error('Welcome email error:', e)
        )
      }
    }

    if (type === 'recovery' || isRecovery) {
      return NextResponse.redirect(new URL('/reset-password', requestUrl.origin))
    }

    await ensureAdminRoleForUser(userId, userEmail)

    const { data: finalProfile } = await admin
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    let role = resolveRole(finalProfile?.role, userMetadata.role)
    if (!role && isAdminAccess({ email: userEmail, role: finalProfile?.role })) {
      role = 'admin'
    }
    if (!role) role = 'student'

    const nextPath = safeNextPath(requestUrl.searchParams.get('next'))
    if (role === 'admin') {
      const dest = nextPath?.startsWith('/admin') ? nextPath : '/admin'
      return NextResponse.redirect(new URL(dest, requestUrl.origin))
    }

    const defaultPath = dashboardPathForRole(role)
    const dest =
      nextPath && !nextPath.startsWith('/admin') ? nextPath : defaultPath
    return NextResponse.redirect(new URL(dest, requestUrl.origin))
  } catch (err) {
    console.error('Auth callback error:', err)
    return NextResponse.redirect(
      new URL(`/login?error=auth_failed&reason=exception`, requestUrl.origin)
    )
  }
}
