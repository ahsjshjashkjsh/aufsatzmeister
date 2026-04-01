'use client'
import { useState } from 'react'
import { setPremium } from './actions'
import { Crown, Loader2 } from 'lucide-react'

export function PremiumToggle({ userId, isPremium }: { userId: string; isPremium: boolean }) {
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(isPremium)

  async function toggle() {
    setLoading(true)
    await setPremium(userId, !current)
    setCurrent(c => !c)
    setLoading(false)
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all disabled:opacity-50 ${
        current
          ? 'bg-amber-100 text-amber-700 hover:bg-amber-200'
          : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
      }`}
    >
      {loading
        ? <Loader2 className="h-3 w-3 animate-spin" />
        : <Crown className={`h-3 w-3 ${current ? 'fill-amber-500' : ''}`} />
      }
      {current ? 'Premium' : 'Gratis'}
    </button>
  )
}
