'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

interface UserProfile {
  id: string
  username: string
  is_banned: boolean
  created_at: string
  email?: string
}

export default function AdminUserRow({ profile }: { profile: UserProfile }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [banned, setBanned] = useState(profile.is_banned)

  const toggleBan = async () => {
    if (!confirm(banned ? `¿Desbanear a ${profile.username}?` : `¿Banear a ${profile.username}? No podrá acceder a contenido VIP.`)) return
    setLoading(true)

    const res = await fetch('/api/admin/ban', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: profile.id, banned: !banned }),
    })

    if (res.ok) {
      setBanned(!banned)
      router.refresh()
    }
    setLoading(false)
  }

  return (
    <div className="grid grid-cols-[1fr_140px_100px_80px] items-center px-4 py-3 text-sm">
      {/* Username + email */}
      <div className="flex flex-col gap-0.5">
        <span className="text-foreground font-medium">{profile.username}</span>
        {profile.email && (
          <span className="text-muted-foreground text-xs">{profile.email}</span>
        )}
      </div>

      {/* Joined */}
      <span className="text-muted-foreground text-xs">
        {new Date(profile.created_at).toLocaleDateString('es-AR', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        })}
      </span>

      {/* Status badge */}
      <div>
        <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded ${
          banned
            ? 'bg-red-500/10 text-red-400 border border-red-500/20'
            : 'bg-free/10 text-free border border-free/20'
        }`}>
          <span className={`w-1.5 h-1.5 rounded-full ${banned ? 'bg-red-400' : 'bg-free'}`} />
          {banned ? 'Baneado' : 'Activo'}
        </span>
      </div>

      {/* Action */}
      <div className="flex justify-end">
        <button
          onClick={toggleBan}
          disabled={loading}
          className={`text-xs font-medium px-3 py-1.5 rounded transition-colors disabled:opacity-50 ${
            banned
              ? 'bg-free/10 text-free hover:bg-free/20 border border-free/20'
              : 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
          }`}
        >
          {loading ? '...' : banned ? 'Desbanear' : 'Banear'}
        </button>
      </div>
    </div>
  )
}
