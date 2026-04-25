import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const supabase = await createClient()

  // Auth guard — only admins
  const { data: { user } } = await supabase.auth.getUser()
  if (!user || user.user_metadata?.is_admin !== true) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
  }

  const { userId, banned } = await request.json()
  if (!userId || typeof banned !== 'boolean') {
    return NextResponse.json({ error: 'Parámetros inválidos' }, { status: 400 })
  }

  const { error } = await supabase
    .from('profiles')
    .update({ is_banned: banned })
    .eq('id', userId)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
