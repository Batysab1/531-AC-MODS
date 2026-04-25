import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Mod } from '@/lib/types'
import AdminModRow from '@/components/admin/mod-row'
import AdminUserRow from '@/components/admin/user-row'

interface Profile {
  id: string
  username: string
  is_banned: boolean
  created_at: string
}

interface SearchProps {
  searchParams: Promise<{ tab?: string }>
}

export default async function AdminDashboard({ searchParams }: SearchProps) {
  const { tab = 'mods' } = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.is_admin !== true) {
    redirect('/admin/login')
  }

  const [{ data: mods }, { data: profiles }] = await Promise.all([
    supabase.from('mods').select('*').order('created_at', { ascending: false }),
    supabase.from('profiles').select('id, username, is_banned, created_at').order('created_at', { ascending: false }),
  ])

  const allMods: Mod[] = (mods as Mod[]) ?? []
  const allProfiles: Profile[] = (profiles as Profile[]) ?? []
  const freeMods = allMods.filter((m) => m.category === 'free')
  const vipMods = allMods.filter((m) => m.category === 'vip')
  const bannedUsers = allProfiles.filter((p) => p.is_banned)

  const activeTab = tab === 'users' ? 'users' : 'mods'

  return (
    <div className="min-h-screen bg-background">
      {/* Admin header */}
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2">
              <span className="text-primary font-bold text-lg tracking-widest uppercase">531</span>
              <span className="text-foreground font-semibold tracking-wide">AC MODS</span>
            </Link>
            <span className="text-border">|</span>
            <span className="text-muted-foreground text-sm">Panel Admin</span>
          </div>
          <div className="flex items-center gap-4">
            <Link href="/" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
              Ver Sitio
            </Link>
            <form action="/auth/signout" method="POST">
              <button type="submit" className="text-muted-foreground hover:text-foreground text-sm transition-colors">
                Cerrar sesión
              </button>
            </form>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Total Mods</p>
            <p className="text-foreground text-3xl font-bold">{allMods.length}</p>
          </div>
          <div className="bg-card border border-free/20 rounded-lg p-4">
            <p className="text-free text-xs uppercase tracking-wider mb-1">Free</p>
            <p className="text-foreground text-3xl font-bold">{freeMods.length}</p>
          </div>
          <div className="bg-card border border-vip/20 rounded-lg p-4">
            <p className="text-vip text-xs uppercase tracking-wider mb-1">VIP</p>
            <p className="text-foreground text-3xl font-bold">{vipMods.length}</p>
          </div>
          <div className="bg-card border border-border rounded-lg p-4">
            <p className="text-muted-foreground text-xs uppercase tracking-wider mb-1">Usuarios</p>
            <p className="text-foreground text-3xl font-bold">{allProfiles.length}</p>
            {bannedUsers.length > 0 && (
              <p className="text-red-400 text-xs mt-1">{bannedUsers.length} baneados</p>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-1 mb-6 border-b border-border">
          <Link
            href="/admin?tab=mods"
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === 'mods'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Mods
          </Link>
          <Link
            href="/admin?tab=users"
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
              activeTab === 'users'
                ? 'border-primary text-foreground'
                : 'border-transparent text-muted-foreground hover:text-foreground'
            }`}
          >
            Usuarios
            {bannedUsers.length > 0 && (
              <span className="ml-2 bg-red-500/20 text-red-400 text-xs px-1.5 py-0.5 rounded">
                {bannedUsers.length}
              </span>
            )}
          </Link>
        </div>

        {/* Tab content */}
        {activeTab === 'mods' ? (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-foreground font-semibold text-base">Todos los Mods</h2>
              <Link
                href="/admin/mods/new"
                className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-medium px-4 py-2 rounded-md transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Agregar Mod
              </Link>
            </div>

            {allMods.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">
                <p>No hay mods todavía.</p>
                <Link href="/admin/mods/new" className="text-primary hover:underline text-sm mt-2 inline-block">
                  Crear el primer mod
                </Link>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="grid grid-cols-[1fr_80px_100px_120px] text-xs text-muted-foreground uppercase tracking-wider px-4 py-3 border-b border-border bg-secondary/50">
                  <span>Título</span>
                  <span className="text-center">Categoría</span>
                  <span className="text-center">Imágenes</span>
                  <span className="text-right">Acciones</span>
                </div>
                <div className="divide-y divide-border">
                  {allMods.map((mod) => (
                    <AdminModRow key={mod.id} mod={mod} />
                  ))}
                </div>
              </div>
            )}
          </>
        ) : (
          <>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-foreground font-semibold text-base">Usuarios registrados</h2>
              <span className="text-muted-foreground text-sm">{allProfiles.length} en total</span>
            </div>

            {allProfiles.length === 0 ? (
              <div className="bg-card border border-border rounded-lg p-12 text-center text-muted-foreground">
                <p>No hay usuarios registrados todavía.</p>
              </div>
            ) : (
              <div className="bg-card border border-border rounded-lg overflow-hidden">
                <div className="grid grid-cols-[1fr_140px_100px_80px] text-xs text-muted-foreground uppercase tracking-wider px-4 py-3 border-b border-border bg-secondary/50">
                  <span>Usuario</span>
                  <span>Registrado</span>
                  <span>Estado</span>
                  <span className="text-right">Acción</span>
                </div>
                <div className="divide-y divide-border">
                  {allProfiles.map((profile) => (
                    <AdminUserRow key={profile.id} profile={profile} />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}
