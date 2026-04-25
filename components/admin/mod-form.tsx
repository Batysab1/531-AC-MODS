'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Mod } from '@/lib/types'

interface ModFormProps {
  mod?: Mod
  mode: 'create' | 'edit'
}

export default function ModForm({ mod, mode }: ModFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [title, setTitle] = useState(mod?.title ?? '')
  const [description, setDescription] = useState(mod?.description ?? '')
  const [category, setCategory] = useState<'free' | 'vip'>(mod?.category ?? 'free')
  const [downloadUrl, setDownloadUrl] = useState(mod?.download_url ?? '')
  const [discordUrl, setDiscordUrl] = useState(mod?.discord_url ?? '')
  const [imagesRaw, setImagesRaw] = useState(mod?.images?.join('\n') ?? '')
  const [tagsRaw, setTagsRaw] = useState(mod?.tags?.join(', ') ?? '')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    setLoading(true)

    const images = imagesRaw
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean)

    const tags = tagsRaw
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean)

    const payload = {
      title: title.trim(),
      description: description.trim(),
      category,
      download_url: downloadUrl.trim() || null,
      discord_url: discordUrl.trim() || null,
      images,
      tags,
    }

    const supabase = createClient()

    if (mode === 'create') {
      const { error: insertError } = await supabase.from('mods').insert(payload)
      if (insertError) {
        setError(`Error al crear: ${insertError.message}`)
      } else {
        setSuccess('Mod creado exitosamente!')
        router.push('/admin')
        router.refresh()
      }
    } else {
      const { error: updateError } = await supabase.from('mods').update(payload).eq('id', mod!.id)
      if (updateError) {
        setError(`Error al actualizar: ${updateError.message}`)
      } else {
        setSuccess('Mod actualizado!')
        router.push('/admin')
        router.refresh()
      }
    }

    setLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {/* Title */}
      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">Titulo *</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          placeholder="Ej: Toyota Supra A80 Widebody"
          className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary text-sm"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">Descripcion *</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={5}
          placeholder="Descripcion detallada del mod..."
          className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary text-sm resize-y"
        />
      </div>

      {/* Category */}
      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">Categoria *</label>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setCategory('free')}
            className={`flex-1 py-2.5 rounded-md text-sm font-medium border transition-all ${
              category === 'free'
                ? 'bg-free/20 border-free text-free'
                : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            Gratuito (Free)
          </button>
          <button
            type="button"
            onClick={() => setCategory('vip')}
            className={`flex-1 py-2.5 rounded-md text-sm font-medium border transition-all ${
              category === 'vip'
                ? 'bg-vip/20 border-vip text-vip'
                : 'bg-secondary border-border text-muted-foreground hover:text-foreground'
            }`}
          >
            VIP
          </button>
        </div>
      </div>

      {/* Download URL (free) */}
      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">
          Link de descarga
          <span className="ml-1 text-xs">(para mods free — Mediafire, MEGA, etc.)</span>
        </label>
        <input
          type="url"
          value={downloadUrl}
          onChange={(e) => setDownloadUrl(e.target.value)}
          placeholder="https://www.mediafire.com/file/..."
          className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary text-sm"
        />
      </div>

      {/* Discord URL (vip override) */}
      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">
          Link de Discord personalizado
          <span className="ml-1 text-xs">(opcional, si no se usa el global)</span>
        </label>
        <input
          type="url"
          value={discordUrl}
          onChange={(e) => setDiscordUrl(e.target.value)}
          placeholder="https://discord.gg/..."
          className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary text-sm"
        />
      </div>

      {/* Images */}
      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">
          URLs de imagenes
          <span className="ml-1 text-xs">(una por linea)</span>
        </label>
        <textarea
          value={imagesRaw}
          onChange={(e) => setImagesRaw(e.target.value)}
          rows={4}
          placeholder="https://ejemplo.com/imagen1.jpg&#10;https://ejemplo.com/imagen2.jpg"
          className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary text-sm font-mono resize-y"
        />
      </div>

      {/* Tags */}
      <div>
        <label className="block text-sm text-muted-foreground mb-1.5">
          Tags
          <span className="ml-1 text-xs">(separados por coma)</span>
        </label>
        <input
          type="text"
          value={tagsRaw}
          onChange={(e) => setTagsRaw(e.target.value)}
          placeholder="drift, skin, jdm, porsche"
          className="w-full bg-input border border-border rounded-md px-3 py-2.5 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary text-sm"
        />
      </div>

      {error && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive-foreground text-sm px-3 py-2 rounded">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-free/10 border border-free/30 text-free text-sm px-3 py-2 rounded">
          {success}
        </div>
      )}

      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-semibold py-2.5 px-6 rounded-md transition-colors text-sm"
        >
          {loading ? 'Guardando...' : mode === 'create' ? 'Crear Mod' : 'Guardar Cambios'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin')}
          className="bg-secondary hover:bg-border text-foreground py-2.5 px-5 rounded-md transition-colors text-sm border border-border"
        >
          Cancelar
        </button>
      </div>
    </form>
  )
}
