import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '')
  .split(',')
  .map((e) => e.trim().toLowerCase())
  .filter(Boolean)

function isAdmin(email: string | undefined): boolean {
  if (!email) return false
  return ADMIN_EMAILS.includes(email.toLowerCase())
}

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get('Authorization')
    const token = authHeader?.replace(/^Bearer\s+/i, '').trim()
    if (!token) {
      return NextResponse.json({ admin: false }, { status: 200 })
    }
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser(token)
    return NextResponse.json({ admin: user ? isAdmin(user.email) : false })
  } catch {
    return NextResponse.json({ admin: false }, { status: 200 })
  }
}
