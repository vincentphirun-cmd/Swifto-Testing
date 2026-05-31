type ProfileRow = {
  first_name?: string | null
  last_name?: string | null
  university?: string | null
}

type AuthUserLike = {
  email?: string | null
  user_metadata?: {
    first_name?: string
    last_name?: string
    university?: string
  }
}

export type AccountIdentity = {
  firstName: string
  lastName: string
  email: string
  university: string
}

function pickFirst(...values: (string | null | undefined)[]): string {
  for (const value of values) {
    const trimmed = value?.trim()
    if (trimmed) return trimmed
  }
  return ''
}

/** Signup identity: profiles row first, then auth user_metadata. */
export function getAccountIdentity(
  user: AuthUserLike | null | undefined,
  profile: ProfileRow | null | undefined,
  options?: { includeUniversity?: boolean }
): AccountIdentity {
  const meta = user?.user_metadata
  return {
    firstName: pickFirst(profile?.first_name, meta?.first_name),
    lastName: pickFirst(profile?.last_name, meta?.last_name),
    email: user?.email?.trim() ?? '',
    university: options?.includeUniversity
      ? pickFirst(profile?.university, meta?.university)
      : '',
  }
}
