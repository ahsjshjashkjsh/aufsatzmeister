import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { MODULES } from '@/data/modules'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Brain, Dumbbell, Flame, BookOpen } from 'lucide-react'

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

  return (
    <div className="flex min-h-screen">
      <Nav />
      <main className="flex-1 p-6 pb-20 md:pb-6 max-w-2xl">
        <h1 className="text-2xl font-bold mb-1">Hallo!</h1>
        <p className="text-zinc-500 mb-8">Bereit zum Lernen?</p>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <Flame className="h-8 w-8 mx-auto mb-2 text-orange-500" />
              <p className="text-2xl font-bold">{streak?.current_streak ?? 0}</p>
              <p className="text-sm text-zinc-500">Tage Streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-blue-500" />
              <p className="text-2xl font-bold">{completedModules}/{MODULES.length}</p>
              <p className="text-sm text-zinc-500">Module</p>
            </CardContent>
          </Card>
          {!profile?.is_premium && (
            <Card className="col-span-2 md:col-span-1 bg-zinc-900 text-white">
              <CardContent className="pt-6 text-center">
                <p className="font-semibold mb-1">Upgrade auf Premium</p>
                <p className="text-xs text-zinc-400 mb-3">Alle Module + KI-Feedback</p>
                <Link href="/settings">
                  <Button size="sm" variant="secondary">9 CHF/Monat</Button>
                </Link>
              </CardContent>
            </Card>
          )}
        </div>

        <h2 className="font-semibold mb-3">Nächste Aufgaben</h2>
        <div className="space-y-3">
          <Link href="/daily-practice">
            <Card className="hover:bg-zinc-50 cursor-pointer transition-colors">
              <CardContent className="pt-4 pb-4 flex items-center gap-4">
                <Dumbbell className="h-6 w-6 text-zinc-600" />
                <div>
                  <p className="font-medium">Tagesübung</p>
                  <p className="text-sm text-zinc-500">5 Minuten täglich</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/lernpfad">
            <Card className="hover:bg-zinc-50 cursor-pointer transition-colors">
              <CardContent className="pt-4 pb-4 flex items-center gap-4">
                <BookOpen className="h-6 w-6 text-zinc-600" />
                <div>
                  <p className="font-medium">Lernpfad fortsetzen</p>
                  <p className="text-sm text-zinc-500">{MODULES[Math.min(completedModules, MODULES.length - 1)].title}</p>
                </div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/ki-coach">
            <Card className="hover:bg-zinc-50 cursor-pointer transition-colors">
              <CardContent className="pt-4 pb-4 flex items-center gap-4">
                <Brain className="h-6 w-6 text-zinc-600" />
                <div>
                  <p className="font-medium">Aufsatz analysieren</p>
                  <p className="text-sm text-zinc-500">KI-Feedback auf deinen Text</p>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>
      </main>
    </div>
  )
}
