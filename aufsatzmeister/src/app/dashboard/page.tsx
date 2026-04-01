import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { MODULES } from '@/data/modules'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Brain, Dumbbell, Flame, BookOpen, ArrowRight, Sparkles } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const { data: streak } = await supabase.from('practice_streaks').select('*').eq('user_id', user.id).single()
  const { data: progress } = await supabase.from('module_progress').select('*').eq('user_id', user.id)

  const completedModules = progress?.filter(p => p.completed).length ?? 0
  const currentStreak = streak?.current_streak ?? 0

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <Nav />
      <div className="md:ml-64">
        <main className="px-6 py-8 pb-28 md:pb-10 max-w-2xl">

          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-stone-900 mb-1">Hallo! 👋</h1>
            <p className="text-stone-500">Bereit für die heutige Lerneinheit?</p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
                  <Flame className="h-5 w-5 text-orange-500" />
                </div>
                <span className="text-sm text-stone-500 font-medium">Streak</span>
              </div>
              <p className="text-3xl font-extrabold text-stone-900">{currentStreak}</p>
              <p className="text-xs text-stone-400 mt-0.5">Tage am Stück</p>
            </div>
            <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                  <BookOpen className="h-5 w-5 text-blue-500" />
                </div>
                <span className="text-sm text-stone-500 font-medium">Module</span>
              </div>
              <p className="text-3xl font-extrabold text-stone-900">
                {completedModules}<span className="text-stone-300 font-normal text-lg">/{MODULES.length}</span>
              </p>
              <p className="text-xs text-stone-400 mt-0.5">abgeschlossen</p>
            </div>
          </div>

          {!profile?.is_premium && (
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-5 mb-6 text-white shadow-md shadow-orange-100">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <Sparkles className="h-4 w-4" />
                    <span className="font-bold text-sm">Upgrade auf Premium</span>
                  </div>
                  <p className="text-orange-100 text-sm">Alle 5 Module + unbegrenzt KI-Feedback</p>
                </div>
                <Link href="/settings">
                  <Button size="sm" className="bg-white text-orange-600 hover:bg-orange-50 rounded-xl font-semibold flex-shrink-0 shadow-sm">
                    9 CHF/Monat
                  </Button>
                </Link>
              </div>
            </div>
          )}

          <h2 className="font-bold text-stone-700 mb-3 text-sm uppercase tracking-wide">Heute</h2>
          <div className="space-y-3">
            {[
              { href: '/daily-practice', icon: Dumbbell, color: 'bg-green-100', iconColor: 'text-green-600', title: 'Tagesübung', sub: '5 Minuten · Streak aufrechterhalten' },
              { href: '/lernpfad', icon: BookOpen, color: 'bg-blue-100', iconColor: 'text-blue-600', title: 'Lernpfad fortsetzen', sub: MODULES[Math.min(completedModules, MODULES.length - 1)].title },
              { href: '/ki-coach', icon: Brain, color: 'bg-orange-100', iconColor: 'text-orange-600', title: 'Aufsatz analysieren', sub: 'KI-Feedback auf deinen Text' },
            ].map(({ href, icon: Icon, color, iconColor, title, sub }) => (
              <Link key={href} href={href}>
                <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all cursor-pointer flex items-center gap-4 group">
                  <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <Icon className={`h-5 w-5 ${iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-stone-900">{title}</p>
                    <p className="text-sm text-stone-400 truncate">{sub}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-stone-300 group-hover:text-orange-400 transition-colors flex-shrink-0" />
                </div>
              </Link>
            ))}
          </div>
        </main>

        <footer className="border-t border-stone-100 py-5 px-6 text-xs text-stone-400 bg-white">
          © 2025 AufsatzMeister · Für Schülerinnen und Schüler in der DACH-Region
        </footer>
      </div>
    </div>
  )
}
