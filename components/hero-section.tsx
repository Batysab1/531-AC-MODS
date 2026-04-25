export default function HeroSection() {
  return (
    <section className="relative h-[60vh] min-h-[420px] flex items-center justify-center overflow-hidden">
      {/* Background images */}
      <div className="absolute inset-0 grid grid-cols-3 gap-0">
        <div
          className="col-span-1 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-uvcKh8bm3TCTY5WEflNDpKJdExgGo2.png)` }}
        />
        <div
          className="col-span-1 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-RXLgPho5gT1G4wvbnXunkVgqhuppOm.png)` }}
        />
        <div
          className="col-span-1 bg-cover bg-center opacity-40"
          style={{ backgroundImage: `url(https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mhosUSyQFIpbjdxO87yV9ACkFMebd8.png)` }}
        />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-background/70" />
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent_0%,var(--background)_100%)]" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl mx-auto">
        <div className="inline-block border border-primary/40 text-primary text-xs font-bold uppercase tracking-[0.3em] px-4 py-1.5 rounded mb-6">
          Assetto Corsa
        </div>
        <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 text-balance tracking-tight">
          Mods de <span className="text-primary">Alta Calidad</span>
        </h1>
        <p className="text-muted-foreground text-lg leading-relaxed max-w-xl mx-auto">
          Descarga skins, autos y pistas para Assetto Corsa. Contenido gratuito y VIP disponible.
        </p>
      </div>
    </section>
  )
}
