import { createClient } from '@/lib/supabase/server'
import type { User } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export async function requireBearerUser(
  req: NextRequest
): Promise<{ user: User; token: string } | NextResponse> {
  const authHeader = req.headers.get('Authorization')
  const token = authHeader?.replace(/^Bearer\s+/i, '').trim()
  if (!token) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const supabase = createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser(token)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  return { user, token }
}
