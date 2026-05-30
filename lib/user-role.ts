import type { SupabaseClient, User } from '@supabase/supabase-js'

export type UserRole = 'lister' | 'student'

export function resolveRole(
  profileRole: string | null | undefined,
  metadataRole: string | null | undefined
): UserRole | null {
  if (profileRole === 'lister' || profileRole === 'student') return profileRole
  if (metadataRole === 'lister' || metadataRole === 'student') return metadataRole
  return null
}

export function dashboardPathForRole(role: UserRole | null): string {
  if (role === 'lister') return '/dashboard/lister'
  return '/dashboard/student'
}

/** True if this post-login redirect is safe for the user's role. */
export function redirectAllowedForRole(path: string, role: UserRole | null): boolean {
  if (!path.startsWith('/') || path.startsWith('//')) return false
  if (path.startsWith('/dashboard/lister')) return role === 'lister'
  if (path.startsWith('/dashboard/student')) return role === 'student'
  return true
}

export function pickPostLoginPath(role: UserRole | null, redirectTo: string | null): string {
  const fallback = dashboardPathForRole(role)
  if (!redirectTo) return fallback
  if (redirectAllowedForRole(redirectTo, role)) return redirectTo
  return fallback
}

export async function fetchUserRole(
  supabase: SupabaseClient,
  user: User
): Promise<UserRole | null> {
  const { data } = await supabase.from('profiles').select('role').eq('id', user.id).single()
  return resolveRole(data?.role, user.user_metadata?.role as string | undefined)
}
