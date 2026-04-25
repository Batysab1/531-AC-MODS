'use client'

import Link from 'next/link'
import { useState } from 'react'
import { usePathname } from 'next/navigation'

interface NavbarClientProps {
  user: { id: string; username: string | null } | null
}

export default function NavbarClient({ user }: NavbarClientProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const pathname = usePathname()

  const isLoggedIn = !!user

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="text-primary font-bold text-xl tracking-widest uppercase">531</span>
          <span className="text-foreground font-semibold text-lg tracking-wide">AC MODS</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors text-sm font-medium tracking-wide uppercase"
          >
            Inicio
          </Link>
          <Link
            href="/?category=free"
            className="text-free font-medium text-sm tracking-wide uppercase hover:opacity-80 transition-opacity"
          >
            Free
          </Link>
          <Link
            href="/?category=vip"
            className="text-vip font-medium text-sm tracking-wide uppercase hover:opacity-80 transition-opacity"
          >
            VIP
          </Link>
          <Link
            href="https://discord.gg/YOUR_DISCORD"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#5865F2] hover:bg-[#4752C4] text-white text-sm font-medium px-4 py-2 rounded-md transition-colors tracking-wide"
          >
            Discord
          </Link>

          {/* Auth section */}
          <div className="flex items-center gap-3 pl-2 border-l border-border">
            {isLoggedIn ? (
              <>
                <span className="text-muted-foreground text-sm">
                  <span className="text-foreground font-medium">{user.username}</span>
                </span>
                <form action="/auth/signout" method="POST">
                  <button
                    type="submit"
                    className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                  >
                    Salir
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
                  className="text-muted-foreground hover:text-foreground text-sm transition-colors"
                >
                  Iniciar sesión
                </Link>
                <Link
                  href={`/auth/signup?redirect=${encodeURIComponent(pathname)}`}
                  className="bg-secondary hover:bg-border border border-border text-foreground text-sm font-medium px-3 py-1.5 rounded-md transition-colors"
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </nav>

        {/* Mobile toggle */}
        <button
          className="md:hidden text-foreground"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-card border-t border-border px-4 py-4 flex flex-col gap-4">
          <Link href="/" className="text-muted-foreground text-sm font-medium uppercase tracking-wide" onClick={() => setMobileOpen(false)}>
            Inicio
          </Link>
          <Link href="/?category=free" className="text-free text-sm font-medium uppercase tracking-wide" onClick={() => setMobileOpen(false)}>
            Free
          </Link>
          <Link href="/?category=vip" className="text-vip text-sm font-medium uppercase tracking-wide" onClick={() => setMobileOpen(false)}>
            VIP
          </Link>
          <Link
            href="https://discord.gg/YOUR_DISCORD"
            target="_blank"
            rel="noopener noreferrer"
            className="bg-[#5865F2] text-white text-sm font-medium px-4 py-2 rounded-md text-center"
            onClick={() => setMobileOpen(false)}
          >
            Discord
          </Link>

          <div className="border-t border-border pt-3 flex flex-col gap-3">
            {isLoggedIn ? (
              <>
                <p className="text-sm text-muted-foreground">
                  Sesión: <span className="text-foreground font-medium">{user.username}</span>
                </p>
                <form action="/auth/signout" method="POST">
                  <button type="submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors w-full text-left">
                    Cerrar sesión
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link
                  href={`/auth/login?redirect=${encodeURIComponent(pathname)}`}
                  className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                  onClick={() => setMobileOpen(false)}
                >
                  Iniciar sesión
                </Link>
                <Link
                  href={`/auth/signup?redirect=${encodeURIComponent(pathname)}`}
                  className="bg-secondary border border-border text-foreground text-sm font-medium px-4 py-2 rounded-md text-center"
                  onClick={() => setMobileOpen(false)}
                >
                  Registrarse
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
