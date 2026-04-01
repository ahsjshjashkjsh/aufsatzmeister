import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { MODULES } from '@/data/modules'
import Link from 'next/link'
import { CheckCircle, Lock, ChevronRight, Star, Trophy } from 'lucide-react'

const moduleThemes = [
  { iconBg: 'bg-blue-50',   iconText: 'text-blue-500',   hoverBorder: 'hover:border-blue-300' },
  { iconBg: 'bg-green-50',  iconText: 'text-green-500',  hoverBorder: 'hover:border-green-300' },
  { iconBg: 'bg-orange-50', iconText: 'text-orange-500', hoverBorder: 'hover:border-orange-300' },
  { iconBg: 'bg-purple-50', iconText: 'text-purple-500', hoverBorder: 'hover:border-purple-300' },
  { iconBg: 'bg-pink-50',   iconText: 'text-pink-500',   hoverBorder: 'hover:border-pink-300' },
]

export default async function LernpfadPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('is_premium').eq('id', user.id).single()
  const { data: progress } = await supabase.from('module_progress').select('*').eq('user_id', user.id)
  const isPremium = profile?.is_premium ?? false
  const completedCount = progress?.filter(p => p.completed).length ?? 0

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <Nav />
      <div className="md:ml-64">
        <main className="px-6 py-8 pb-28 md:pb-10 max-w-2xl">

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-stone-900 mb-1">Lernpfad</h1>
            <p className="text-stone-500">Schritt für Schritt zum besseren Aufsatz.</p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm mb-6 p-5">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <p className="font-bold text-stone-900 text-sm">Dein Fortschritt</p>
                  <p className="text-xs text-stone-400">{completedCount} von {MODULES.length} abgeschlossen</p>
                </div>
              </div>
              <span className="text-2xl font-extrabold text-stone-900">
                {completedCount}<span className="text-stone-300 font-normal text-lg">/{MODULES.length}</span>
              </span>
            </div>
            <div className="flex gap-1.5">
              {MODULES.map((_, i) => (
                <div key={i} className={`h-2.5 flex-1 rounded-full transition-all duration-500 ${i < completedCount ? 'bg-orange-500' : 'bg-stone-100'}`} />
              ))}
            </div>
          </div>

          <div className="space-y-3">
            {MODULES.map((modul, i) => {
              const isLocked = modul.isPremium && !isPremium
              const done = progress?.find(p => p.module_id === modul.id && p.completed)
              const theme = moduleThemes[i % moduleThemes.length]

              return (
                <Link key={modul.id} href={isLocked ? '/settings' : `/lernpfad/${modul.id}`}>
                  <div className={`
                    group bg-white rounded-2xl border-2 shadow-sm transition-all duration-200 cursor-pointer overflow-hidden
                    ${done ? 'border-green-200 hover:border-green-400'
                      : isLocked ? 'border-stone-100 opacity-70 hover:opacity-100 hover:border-stone-200'
                      : `border-stone-100 ${theme.hoverBorder}`}
                  `}>
                    <div className="p-5 flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 ${done ? 'bg-green-100' : isLocked ? 'bg-stone-100' : theme.iconBg}`}>
                        {done ? <CheckCircle className="h-6 w-6 text-green-500" />
                          : isLocked ? <Lock className="h-5 w-5 text-stone-400" />
                          : <span className={`text-lg font-extrabold ${theme.iconText}`}>{i + 1}</span>}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap mb-0.5">
                          <p className={`font-bold text-base ${isLocked ? 'text-stone-400' : 'text-stone-900'}`}>{modul.title}</p>
                          {modul.isPremium && (
                            <span className="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-0.5 rounded-full">
                              <Star className="h-3 w-3 fill-amber-500" /> Premium
                            </span>
                          )}
                        </div>
                        <p className={`text-sm line-clamp-1 ${isLocked ? 'text-stone-300' : 'text-stone-400'}`}>{modul.description}</p>
                      </div>
                      <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${done ? 'bg-green-100' : 'bg-stone-50 group-hover:bg-orange-50'}`}>
                        {done ? <CheckCircle className="h-4 w-4 text-green-500" />
                          : <ChevronRight className={`h-4 w-4 ${isLocked ? 'text-stone-300' : 'text-stone-400 group-hover:text-orange-500'}`} />}
                      </div>
                    </div>
                    {done && <div className="h-1 bg-green-400" />}
                  </div>
                </Link>
              )
            })}
          </div>

          {!isPremium && (
            <div className="mt-6 bg-gradient-to-r from-orange-500 to-amber-400 rounded-2xl p-6 text-white shadow-lg shadow-orange-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-extrabold text-lg mb-1">4 Module gesperrt</p>
                  <p className="text-orange-100 text-sm">Upgrade für Zugang zu allen Modulen.</p>
                </div>
                <Link href="/settings" className="flex-shrink-0">
                  <button className="bg-white text-orange-600 font-bold text-sm px-4 py-2 rounded-xl hover:bg-orange-50 transition-colors whitespace-nowrap">
                    9 CHF/Monat
                  </button>
                </Link>
              </div>
            </div>
          )}
        </main>

        <footer className="border-t border-stone-100 py-5 px-6 text-xs text-stone-400 bg-white">
          © 2025 AufsatzMeister · Für Schülerinnen und Schüler in der DACH-Region
        </footer>
      </div>
    </div>
  )
}
