import { createClient } from '@/lib/supabase/server'
import Navbar from '@/components/navbar'
import HeroSection from '@/components/hero-section'
import ModCard from '@/components/mod-card'
import type { Mod } from '@/lib/types'

interface HomePageProps {
  searchParams: Promise<{ category?: string; q?: string }>
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const { category, q } = await searchParams
  const supabase = await createClient()

  let query = supabase.from('mods').select('*').order('created_at', { ascending: false })

  if (category === 'free' || category === 'vip') {
    query = query.eq('category', category)
  }
  if (q) {
    query = query.ilike('title', `%${q}%`)
  }

  const { data: mods } = await query
  const allMods: Mod[] = (mods as Mod[]) ?? []

  const freeMods = allMods.filter((m) => m.category === 'free')
  const vipMods = allMods.filter((m) => m.category === 'vip')

  const activeCategory = category === 'free' ? 'free' : category === 'vip' ? 'vip' : 'all'

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main>
        <HeroSection />

        <section className="max-w-7xl mx-auto px-4 py-12">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-10">
            <div className="flex items-center gap-2">
              <a
                href="/"
                className={`px-4 py-2 rounded-md text-sm font-medium uppercase tracking-wider transition-colors ${
                  activeCategory === 'all'
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                Todos
              </a>
              <a
                href="/?category=free"
                className={`px-4 py-2 rounded-md text-sm font-medium uppercase tracking-wider transition-colors ${
                  activeCategory === 'free'
                    ? 'bg-free text-white'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                Free
              </a>
              <a
                href="/?category=vip"
                className={`px-4 py-2 rounded-md text-sm font-medium uppercase tracking-wider transition-colors ${
                  activeCategory === 'vip'
                    ? 'bg-vip text-white'
                    : 'bg-secondary text-muted-foreground hover:text-foreground'
                }`}
              >
                VIP
              </a>
            </div>

            <form method="GET" action="/" className="flex items-center gap-2">
              {category && <input type="hidden" name="category" value={category} />}
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="Buscar mods..."
                  className="bg-input border border-border rounded-md pl-9 pr-4 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary w-48"
                />
              </div>
              <button type="submit" className="bg-secondary hover:bg-border text-foreground text-sm px-3 py-2 rounded-md transition-colors">
                Buscar
              </button>
            </form>
          </div>

          {/* Show all or filtered */}
          {activeCategory === 'all' ? (
            <>
              {/* VIP Section */}
              {vipMods.length > 0 && (
                <div className="mb-12">
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-vip font-bold text-xs uppercase tracking-[0.3em]">VIP</span>
                    <div className="flex-1 h-px bg-vip/20" />
                    <span className="text-muted-foreground text-xs">{vipMods.length} mods</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {vipMods.map((mod) => (
                      <ModCard key={mod.id} mod={mod} />
                    ))}
                  </div>
                </div>
              )}

              {/* Free Section */}
              {freeMods.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-free font-bold text-xs uppercase tracking-[0.3em]">Free</span>
                    <div className="flex-1 h-px bg-free/20" />
                    <span className="text-muted-foreground text-xs">{freeMods.length} mods</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                    {freeMods.map((mod) => (
                      <ModCard key={mod.id} mod={mod} />
                    ))}
                  </div>
                </div>
              )}

              {allMods.length === 0 && (
                <div className="text-center py-24 text-muted-foreground">
                  <p className="text-lg">No hay mods disponibles todavia.</p>
                  <p className="text-sm mt-2">Vuelve pronto para ver nuevo contenido.</p>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {allMods.map((mod) => (
                  <ModCard key={mod.id} mod={mod} />
                ))}
              </div>
              {allMods.length === 0 && (
                <div className="text-center py-24 text-muted-foreground">
                  <p className="text-lg">No se encontraron mods.</p>
                </div>
              )}
            </>
          )}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8 text-center text-muted-foreground text-sm">
        <p>531 AC MODS — Todos los mods son para uso personal en Assetto Corsa.</p>
        <a
          href="https://discord.gg/YOUR_DISCORD"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 mt-2 text-[#5865F2] hover:underline"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
            <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.102 18.08.114 18.102.12 18.123a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
          </svg>
          Unirse al Discord
        </a>
      </footer>
    </div>
  )
}
