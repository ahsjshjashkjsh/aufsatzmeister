import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Lock } from 'lucide-react'

export function PremiumGate() {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <Lock className="h-12 w-12 text-zinc-400 mb-4" />
      <h3 className="text-xl font-semibold mb-2">Premium-Inhalt</h3>
      <p className="text-zinc-600 mb-6 max-w-sm">
        Dieses Modul ist nur für Premium-Mitglieder verfügbar. Upgrade für 9 CHF/Monat und erhalte Zugang zu allen Modulen.
      </p>
      <Link href="/settings">
        <Button>Jetzt upgraden — 9 CHF/Monat</Button>
      </Link>
    </div>
  )
}
