import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ModForm from '@/components/admin/mod-form'
import type { Mod } from '@/lib/types'

interface EditModPageProps {
  params: Promise<{ id: string }>
}

export default async function EditModPage({ params }: EditModPageProps) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.user_metadata?.is_admin !== true) {
    redirect('/admin/login')
  }

  const { data, error } = await supabase.from('mods').select('*').eq('id', id).single()
  if (error || !data) notFound()

  const mod = data as Mod

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border px-4 py-4">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/admin" className="text-muted-foreground hover:text-foreground text-sm transition-colors flex items-center gap-1.5">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Volver al panel
            </Link>
          </div>
          <Link href="/" className="flex items-center gap-2">
            <span className="text-primary font-bold tracking-widest uppercase">AC</span>
            <span className="text-foreground font-semibold tracking-wide">Mods</span>
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-foreground font-bold text-2xl mb-2">Editar mod</h1>
        <p className="text-muted-foreground text-sm mb-8">{mod.title}</p>
        <div className="bg-card border border-border rounded-lg p-6">
          <ModForm mode="edit" mod={mod} />
        </div>
      </main>
    </div>
  )
}
