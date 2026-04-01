import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { MODULES } from '@/data/modules'
import Link from 'next/link'
import { CheckCircle, Lock, ChevronRight, Star } from 'lucide-react'

const moduleColors = [
  { bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-100 text-blue-600', num: 'bg-blue-500' },
  { bg: 'bg-green-50', border: 'border-green-200', icon: 'bg-green-100 text-green-600', num: 'bg-green-500' },
  { bg: 'bg-orange-50', border: 'border-orange-200', icon: 'bg-orange-100 text-orange-600', num: 'bg-orange-500' },
  { bg: 'bg-purple-50', border: 'border-purple-200', icon: 'bg-purple-100 text-purple-600', num: 'bg-purple-500' },
  { bg: 'bg-pink-50', border: 'border-pink-200', icon: 'bg-pink-100 text-pink-600', num: 'bg-pink-500' },
]

export default async function LernpfadPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('is_premium').eq('id', user.id).single()
  const { data: progress } = await supabase.from('module_progress').select('*').eq('user_id', user.id)
  const isPremium = profile?.is_premium ?? false

  return (
    <div className="flex min-h-screen bg-[#FFFBF5]">
      <Nav />
      <main className="flex-1 p-6 pb-24 md:pb-8 max-w-2xl">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-stone-900 mb-1">Lernpfad</h1>
          <p className="text-stone-500">Schritt für Schritt zum besseren Aufsatz.</p>
        </div>

        {/* Progress overview */}
        <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm mb-6 flex items-center gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-stone-600 mb-1">Dein Fortschritt</p>
            <div className="w-full bg-stone-100 rounded-full h-2.5">
              <div
                className="bg-orange-500 h-2.5 rounded-full transition-all"
                style={{ width: `${(progress?.filter(p => p.completed).length ?? 0) / MODULES.length * 100}%` }}
              />
            </div>
          </div>
          <div className="text-right flex-shrink-0">
            <p className="text-xl font-extrabold text-stone-900">
              {progress?.filter(p => p.completed).length ?? 0}/{MODULES.length}
            </p>
            <p className="text-xs text-stone-400">Module</p>
          </div>
        </div>

        <div className="space-y-3">
          {MODULES.map((modul, i) => {
            const isLocked = modul.isPremium && !isPremium
            const done = progress?.find(p => p.module_id === modul.id && p.completed)
            const colors = moduleColors[i % moduleColors.length]

            return (
              <Link key={modul.id} href={isLocked ? '/settings' : `/lernpfad/${modul.id}`}>
                <div className={`bg-white rounded-2xl p-5 border ${done ? 'border-green-200' : colors.border} shadow-sm hover:shadow-md transition-all cursor-pointer`}>
                  <div className="flex items-center gap-4">
                    {/* Number/Status */}
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 font-bold text-base ${done ? 'bg-green-100' : colors.icon}`}>
                      {done
                        ? <CheckCircle className="h-6 w-6 text-green-500" />
                        : isLocked
                          ? <Lock className="h-5 w-5" />
                          : <span className="text-stone-600 font-extrabold">{i + 1}</span>
                      }
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="font-semibold text-stone-900 truncate">{modul.title}</p>
                        {modul.isPremium && (
                          <span className="flex-shrink-0 inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-2 py-0.5 rounded-full">
                            <Star className="h-3 w-3 fill-amber-500" /> Premium
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-stone-400 truncate">{modul.description}</p>
                    </div>

                    <ChevronRight className="h-4 w-4 text-stone-300 flex-shrink-0" />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>

        {!isPremium && (
          <div className="mt-6 bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-5 text-white text-center">
            <p className="font-bold mb-1">4 Module gesperrt</p>
            <p className="text-orange-100 text-sm mb-4">Upgrade für Zugang zu allen Modulen</p>
            <Link href="/settings">
              <button className="bg-white text-orange-600 font-semibold text-sm px-5 py-2 rounded-xl hover:bg-orange-50 transition-colors">
                Jetzt upgraden — 9 CHF/Monat
              </button>
            </Link>
          </div>
        )}
      </main>
    </div>
  )
}
