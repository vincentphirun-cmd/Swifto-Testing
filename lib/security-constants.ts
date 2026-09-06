export const PUBLIC_PROFILES_TABLE = 'public_profiles'
export const PUBLIC_JOBS_TABLE = 'public_jobs'

export const AVATAR_MAX_BYTES = 2 * 1024 * 1024
export const AVATAR_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'] as const

export const IDENTITY_DOC_MAX_BYTES = 5 * 1024 * 1024
export const IDENTITY_DOC_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'application/pdf',
] as const

export const MAX_TEXT_LENGTH = 2000
export const MAX_BIO_LENGTH = 1000
export const MAX_NAME_LENGTH = 80
