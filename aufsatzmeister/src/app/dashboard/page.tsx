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

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single()

  const { data: streak } = await supabase
    .from('practice_streaks')
    .select('*')
    .eq('user_id', user.id)
    .single()

  const { data: progress } = await supabase
    .from('module_progress')
    .select('*')
    .eq('user_id', user.id)

  const completedModules = progress?.filter(p => p.completed).length ?? 0
  const currentStreak = streak?.current_streak ?? 0

  return (
    <div className="flex min-h-screen bg-[#FFFBF5]">
      <Nav />
      <main className="flex-1 p-6 pb-24 md:pb-8 max-w-2xl">

        {/* Greeting */}
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-stone-900 mb-1">
            Hallo! 👋
          </h1>
          <p className="text-stone-500">Bereit für die heutige Lerneinheit?</p>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Streak */}
          <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-orange-100 rounded-xl flex items-center justify-center">
                <Flame className="h-5 w-5 text-orange-500" />
              </div>
              <span className="text-sm text-stone-500 font-medium">Streak</span>
            </div>
            <p className="text-3xl font-extrabold text-stone-900">{currentStreak}</p>
            <p className="text-xs text-stone-400 mt-0.5">
              {currentStreak === 1 ? 'Tag am Stück' : 'Tage am Stück'}
            </p>
          </div>

          {/* Modules */}
          <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 bg-blue-100 rounded-xl flex items-center justify-center">
                <BookOpen className="h-5 w-5 text-blue-500" />
              </div>
              <span className="text-sm text-stone-500 font-medium">Module</span>
            </div>
            <p className="text-3xl font-extrabold text-stone-900">{completedModules}<span className="text-lg text-stone-300">/{MODULES.length}</span></p>
            <p className="text-xs text-stone-400 mt-0.5">abgeschlossen</p>
          </div>
        </div>

        {/* Premium upsell */}
        {!profile?.is_premium && (
          <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-5 mb-6 text-white">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-4 w-4" />
                  <span className="font-bold text-sm">Upgrade auf Premium</span>
                </div>
                <p className="text-orange-100 text-sm">Alle 5 Module + unbegrenzt KI-Feedback</p>
              </div>
              <Link href="/settings">
                <Button size="sm" className="bg-white text-orange-600 hover:bg-orange-50 rounded-xl font-semibold flex-shrink-0">
                  9 CHF/Monat
                </Button>
              </Link>
            </div>
          </div>
        )}

        {/* Next tasks */}
        <h2 className="font-bold text-stone-900 mb-3">Deine Aufgaben heute</h2>
        <div className="space-y-3">
          <Link href="/daily-practice">
            <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm hover:shadow-md transition-all hover:border-orange-200 cursor-pointer flex items-center gap-4">
              <div className="w-11 h-11 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Dumbbell className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-stone-900">Tagesübung</p>
                <p className="text-sm text-stone-400">5 Minuten · Streak aufrechterhalten</p>
              </div>
              <ArrowRight className="h-4 w-4 text-stone-300" />
            </div>
          </Link>

          <Link href="/lernpfad">
            <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm hover:shadow-md transition-all hover:border-orange-200 cursor-pointer flex items-center gap-4">
              <div className="w-11 h-11 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <BookOpen className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-stone-900">Lernpfad fortsetzen</p>
                <p className="text-sm text-stone-400">{MODULES[Math.min(completedModules, MODULES.length - 1)].title}</p>
              </div>
              <ArrowRight className="h-4 w-4 text-stone-300" />
            </div>
          </Link>

          <Link href="/ki-coach">
            <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm hover:shadow-md transition-all hover:border-orange-200 cursor-pointer flex items-center gap-4">
              <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                <Brain className="h-5 w-5 text-orange-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-stone-900">Aufsatz analysieren</p>
                <p className="text-sm text-stone-400">KI-Feedback auf deinen Text</p>
              </div>
              <ArrowRight className="h-4 w-4 text-stone-300" />
            </div>
          </Link>
        </div>
      </main>
    </div>
  )
}
