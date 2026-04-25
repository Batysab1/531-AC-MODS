import Link from 'next/link'

export default function SignupSuccessPage() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="w-full max-w-md text-center">
        <div className="mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/15 border border-primary/30 mb-4">
            <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h1 className="text-foreground font-bold text-2xl mb-2">Revisá tu email</h1>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Te enviamos un link de confirmación. Hacé click en el link para activar tu cuenta y poder acceder a los mods VIP.
          </p>
        </div>

        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <p className="text-muted-foreground text-xs">
            Si no ves el email, revisá tu carpeta de spam. El link expira en 24 horas.
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver al inicio
        </Link>
      </div>
    </div>
  )
}
