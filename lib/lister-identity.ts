export const LISTER_IDENTITY_DOC_TYPES = [
  'driver_licence',
  'passport',
  'birth_certificate',
] as const

export type ListerIdentityDocType = (typeof LISTER_IDENTITY_DOC_TYPES)[number]

export type ListerIdentityStatus = 'unverified' | 'pending' | 'verified' | 'rejected'

export const LISTER_ID_DOCS_BUCKET = 'lister-id-docs'
export const AVATARS_BUCKET = 'avatars'

export function identityDocTypeLabel(type: string): string {
  switch (type) {
    case 'driver_licence':
      return 'Driver licence'
    case 'passport':
      return 'Passport'
    case 'birth_certificate':
      return 'Birth certificate'
    default:
      return type
  }
}

export function isListerIdentityVerified(status: string | null | undefined): boolean {
  return status === 'verified'
}
