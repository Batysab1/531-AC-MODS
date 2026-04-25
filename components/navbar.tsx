import { createClient } from '@/lib/supabase/server'
import NavbarClient from './navbar-client'

export default async function Navbar() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let username: string | null = null
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('username')
      .eq('id', user.id)
      .single()
    username = profile?.username ?? null
  }

  return <NavbarClient user={user ? { id: user.id, username } : null} />
}
