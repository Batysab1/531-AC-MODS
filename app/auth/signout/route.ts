import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  const origin = new URL(request.url).origin
  const referer = request.headers.get('referer') ?? ''
  // If signing out from admin, redirect to admin login; otherwise go home
  const dest = referer.includes('/admin') ? `${origin}/admin/login` : `${origin}/`
  return NextResponse.redirect(dest)
}

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  await supabase.auth.signOut()
  return NextResponse.redirect(new URL('/', request.url))
}
