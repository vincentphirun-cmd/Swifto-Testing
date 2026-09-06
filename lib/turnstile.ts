export async function verifyTurnstileToken(token: string | null | undefined): Promise<boolean> {
  const secret = process.env.TURNSTILE_SECRET_KEY?.trim()
  if (!secret) {
    // Not configured — skip in local/dev. Set TURNSTILE_SECRET_KEY in production.
    return true
  }
  if (!token) return false

  try {
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        secret,
        response: token,
      }),
    })
    const data = (await res.json()) as { success?: boolean }
    return data.success === true
  } catch {
    return false
  }
}

export function isTurnstileConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim())
}
