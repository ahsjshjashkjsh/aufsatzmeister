import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { MODULES } from '@/data/modules'
import Link from 'next/link'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle, Lock, ChevronRight } from 'lucide-react'

export default async function LernpfadPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('is_premium').eq('id', user.id).single()
  const { data: progress } = await supabase.from('module_progress').select('*').eq('user_id', user.id)
  const isPremium = profile?.is_premium ?? false

  return (
    <div className="flex min-h-screen">
      <Nav />
      <main className="flex-1 p-6 pb-20 md:pb-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">Lernpfad</h1>
        <p className="text-zinc-500 mb-8">Schritt für Schritt zum besseren Aufsatz.</p>
        <div className="space-y-3">
          {MODULES.map((modul, i) => {
            const isLocked = modul.isPremium && !isPremium
            const done = progress?.find(p => p.module_id === modul.id && p.completed)
            return (
              <Link key={modul.id} href={isLocked ? '/settings' : `/lernpfad/${modul.id}`}>
                <Card className="hover:bg-zinc-50 cursor-pointer transition-colors">
                  <CardContent className="pt-4 pb-4 flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${done ? 'bg-green-100 text-green-700' : 'bg-zinc-100 text-zinc-600'}`}>
                      {done ? <CheckCircle className="h-5 w-5" /> : i + 1}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{modul.title}</p>
                      <p className="text-sm text-zinc-500">{modul.description}</p>
                    </div>
                    {isLocked ? <Lock className="h-4 w-4 text-zinc-400" /> : <ChevronRight className="h-4 w-4 text-zinc-400" />}
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>
      </main>
    </div>
  )
}
