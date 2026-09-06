export async function passAuthGate(
  action: 'login' | 'signup' | 'reset',
  email: string,
  turnstileToken?: string | null
): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await fetch('/api/auth/gate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action,
        email: email.trim(),
        turnstileToken: turnstileToken || undefined,
      }),
    })
    if (res.ok) return { ok: true }
    const data = await res.json().catch(() => ({}))
    return {
      ok: false,
      error: typeof data.error === 'string' ? data.error : 'Too many attempts. Please try again.',
    }
  } catch {
    return { ok: false, error: 'Could not verify request. Please try again.' }
  }
}
