import Link from 'next/link'
import Image from 'next/image'
import type { Mod } from '@/lib/types'

interface ModCardProps {
  mod: Mod
}

export default function ModCard({ mod }: ModCardProps) {
  const isVip = mod.category === 'vip'
  const coverImage = mod.images?.[0]

  return (
    <Link href={`/mods/${mod.id}`} className="group block">
      <article className="bg-card border border-border rounded-lg overflow-hidden hover:border-primary/50 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary/10">
        <div className="relative aspect-video bg-muted overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={mod.title}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="flex items-center justify-center h-full bg-secondary">
              <svg className="w-12 h-12 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          )}
          <div className={`absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded uppercase tracking-widest ${
            isVip
              ? 'bg-vip/20 text-vip border border-vip/40'
              : 'bg-free/20 text-free border border-free/40'
          }`}>
            {isVip ? 'VIP' : 'FREE'}
          </div>
        </div>
        <div className="p-4">
          <h3 className="text-foreground font-semibold text-base mb-1 line-clamp-1 group-hover:text-primary transition-colors">
            {mod.title}
          </h3>
          <p className="text-muted-foreground text-sm line-clamp-2 leading-relaxed">
            {mod.description}
          </p>
          {mod.tags && mod.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-3">
              {mod.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="text-xs text-muted-foreground bg-secondary px-2 py-0.5 rounded">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
