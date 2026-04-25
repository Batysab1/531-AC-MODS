'use client'

import Link from 'next/link'
import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import type { Mod } from '@/lib/types'

interface AdminModRowProps {
  mod: Mod
}

export default function AdminModRow({ mod }: AdminModRowProps) {
  const router = useRouter()
  const [deleting, setDeleting] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const handleDelete = async () => {
    if (!confirm) {
      setConfirm(true)
      return
    }
    setDeleting(true)
    const supabase = createClient()
    await supabase.from('mods').delete().eq('id', mod.id)
    router.refresh()
  }

  return (
    <div className="grid grid-cols-[1fr_80px_100px_120px] items-center px-4 py-3 hover:bg-secondary/30 transition-colors">
      <div className="min-w-0">
        <p className="text-foreground text-sm font-medium line-clamp-1">{mod.title}</p>
        {mod.tags && mod.tags.length > 0 && (
          <p className="text-muted-foreground text-xs mt-0.5">{mod.tags.slice(0, 3).join(', ')}</p>
        )}
      </div>

      <div className="text-center">
        <span className={`text-xs font-bold px-2 py-0.5 rounded uppercase tracking-wider ${
          mod.category === 'vip'
            ? 'bg-vip/15 text-vip'
            : 'bg-free/15 text-free'
        }`}>
          {mod.category}
        </span>
      </div>

      <div className="text-center text-muted-foreground text-sm">
        {mod.images?.length ?? 0}
      </div>

      <div className="flex items-center justify-end gap-2">
        <Link
          href={`/mods/${mod.id}`}
          target="_blank"
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Ver mod"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        </Link>
        <Link
          href={`/admin/mods/${mod.id}/edit`}
          className="text-muted-foreground hover:text-foreground transition-colors"
          title="Editar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </Link>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className={`transition-colors ${
            confirm
              ? 'text-destructive-foreground hover:text-red-400'
              : 'text-muted-foreground hover:text-destructive-foreground'
          }`}
          title={confirm ? 'Confirmar eliminacion' : 'Eliminar'}
        >
          {deleting ? (
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : confirm ? (
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>
    </div>
  )
}
