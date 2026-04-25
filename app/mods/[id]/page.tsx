import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import Navbar from '@/components/navbar'
import ImageGallery from '@/components/image-gallery'
import type { Mod } from '@/lib/types'

interface ModPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: ModPageProps): Promise<Metadata> {
  const { id } = await params
  const supabase = await createClient()
  const { data } = await supabase.from('mods').select('title, description').eq('id', id).single()
  if (!data) return { title: 'Mod no encontrado' }
  return {
    title: `${data.title} — 531 AC MODS`,
    description: data.description,
  }
}

const DISCORD_URL = 'https://discord.gg/YOUR_DISCORD'

export default async function ModPage({ params }: ModPageProps) {
  const { id } = await params
  const supabase = await createClient()

  const [{ data, error }, { data: { user } }] = await Promise.all([
    supabase.from('mods').select('*').eq('id', id).single(),
    supabase.auth.getUser(),
  ])

  if (error || !data) notFound()
  const mod = data as Mod
  const isVip = mod.category === 'vip'
  const discordLink = mod.discord_url || DISCORD_URL
  const isLoggedIn = !!user

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="max-w-5xl mx-auto px-4 pt-24 pb-16">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
          <Link href="/" className="hover:text-foreground transition-colors">Inicio</Link>
          <span>/</span>
          <Link href={`/?category=${mod.category}`} className={`hover:text-foreground transition-colors ${isVip ? 'text-vip' : 'text-free'}`}>
            {isVip ? 'VIP' : 'Free'}
          </Link>
          <span>/</span>
          <span className="text-foreground line-clamp-1">{mod.title}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Left: Gallery */}
          <div className="lg:col-span-2">
            <ImageGallery images={mod.images} title={mod.title} />
          </div>

          {/* Right: Info */}
          <div className="lg:col-span-1 flex flex-col gap-6">
            {/* Badge + Title */}
            <div>
              <div className={`inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.25em] px-3 py-1.5 rounded mb-3 ${
                isVip
                  ? 'bg-vip/15 text-vip border border-vip/30'
                  : 'bg-free/15 text-free border border-free/30'
              }`}>
                {isVip ? (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ) : (
                  <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                )}
                {isVip ? 'VIP' : 'Gratuito'}
              </div>
              <h1 className="text-2xl font-bold text-foreground leading-tight text-balance">
                {mod.title}
              </h1>
            </div>

            {/* Tags */}
            {mod.tags && mod.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {mod.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-secondary text-muted-foreground px-2.5 py-1 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Description */}
            <div className="bg-card border border-border rounded-lg p-4">
              <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-line">
                {mod.description}
              </p>
            </div>

            {/* Action buttons */}
            <div className="flex flex-col gap-3">
              {isVip ? (
                isLoggedIn ? (
                  /* Logged in → show Discord button */
                  <a
                    href={discordLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm tracking-wide"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.102 18.08.114 18.102.12 18.123a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                    </svg>
                    Obtener en Discord (VIP)
                  </a>
                ) : (
                  /* Not logged in → show login gate */
                  <div className="border border-vip/30 bg-vip/5 rounded-lg p-4 flex flex-col gap-3">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-vip flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
                      </svg>
                      <p className="text-sm text-foreground font-medium">Contenido VIP</p>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Necesitás iniciar sesión para acceder al link de Discord y obtener este mod.
                    </p>
                    <div className="flex flex-col gap-2">
                      <Link
                        href={`/auth/login?redirect=/mods/${mod.id}`}
                        className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-2.5 px-6 rounded-md transition-colors text-sm"
                      >
                        Iniciar sesión
                      </Link>
                      <Link
                        href={`/auth/signup?redirect=/mods/${mod.id}`}
                        className="flex items-center justify-center gap-2 bg-secondary hover:bg-border border border-border text-foreground text-sm py-2 px-6 rounded-md transition-colors"
                      >
                        Crear cuenta gratis
                      </Link>
                    </div>
                  </div>
                )
              ) : mod.download_url ? (
                <a
                  href={mod.download_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 px-6 rounded-lg transition-colors text-sm tracking-wide"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Descargar Gratis
                </a>
              ) : (
                <a
                  href={discordLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#5865F2] hover:bg-[#4752C4] text-white font-semibold py-3 px-6 rounded-lg transition-colors text-sm tracking-wide"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.102 18.08.114 18.102.12 18.123a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                  </svg>
                  Ir al Discord
                </a>
              )}

              <a
                href={discordLink}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 bg-secondary hover:bg-border text-foreground text-sm py-2.5 px-6 rounded-lg transition-colors border border-border"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057.102 18.08.114 18.102.12 18.123a19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
                </svg>
                Soporte en Discord
              </a>
            </div>

            <p className="text-xs text-muted-foreground text-center">
              {isVip
                ? isLoggedIn
                  ? 'Este mod es exclusivo para miembros VIP del Discord.'
                  : 'Creá una cuenta gratis para acceder al link VIP.'
                : 'Descarga directa disponible. Sin necesidad de cuenta.'}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
