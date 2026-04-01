import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, Crown, Flame, BookOpen, TrendingUp, Shield, ArrowLeft } from 'lucide-react'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  // Admin check — only the configured admin email can access this page
  const adminEmail = process.env.ADMIN_EMAIL
  if (!adminEmail || user.email !== adminEmail) redirect('/dashboard')

  // Fetch stats using service role via server client
  const [
    { count: totalUsers },
    { count: premiumUsers },
    { data: recentUsers },
    { data: streakData },
    { data: progressData },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('is_premium', true),
    supabase.from('profiles').select('id, created_at, is_premium').order('created_at', { ascending: false }).limit(10),
    supabase.from('practice_streaks').select('current_streak, longest_streak').order('current_streak', { ascending: false }).limit(5),
    supabase.from('module_progress').select('module_id, completed').eq('completed', true),
  ])

  const freeUsers = (totalUsers ?? 0) - (premiumUsers ?? 0)
  const conversionRate = totalUsers ? Math.round(((premiumUsers ?? 0) / totalUsers) * 100) : 0
  const estimatedMRR = (premiumUsers ?? 0) * 9

  // Module completion counts
  const moduleCounts: Record<string, number> = {}
  progressData?.forEach(p => {
    moduleCounts[p.module_id] = (moduleCounts[p.module_id] ?? 0) + 1
  })

  const stats = [
    { label: 'Registrierte Nutzer', value: totalUsers ?? 0, icon: Users, color: 'bg-blue-100 text-blue-600', change: 'Gesamt' },
    { label: 'Premium-Abonnenten', value: premiumUsers ?? 0, icon: Crown, color: 'bg-amber-100 text-amber-600', change: `${conversionRate}% Conversion` },
    { label: 'Gratis-Nutzer', value: freeUsers, icon: Users, color: 'bg-stone-100 text-stone-600', change: 'Potential Upgrades' },
    { label: 'Geschätzter MRR', value: `${estimatedMRR} CHF`, icon: TrendingUp, color: 'bg-green-100 text-green-600', change: 'Monatlich' },
  ]

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      {/* Admin header */}
      <header className="bg-stone-900 text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <div>
            <p className="font-extrabold text-sm">AufsatzMeister Admin</p>
            <p className="text-stone-400 text-xs">{user.email}</p>
          </div>
        </div>
        <Link href="/dashboard" className="flex items-center gap-2 text-stone-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="h-4 w-4" /> Zur App
        </Link>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-extrabold text-stone-900 mb-1">Admin Dashboard</h1>
          <p className="text-stone-500">Übersicht über alle Nutzer und Aktivitäten.</p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map(({ label, value, icon: Icon, color, change }) => (
            <div key={label} className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${color}`}>
                <Icon className="h-5 w-5" />
              </div>
              <p className="text-2xl font-extrabold text-stone-900">{value}</p>
              <p className="text-sm font-medium text-stone-600 mt-0.5">{label}</p>
              <p className="text-xs text-stone-400 mt-1">{change}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent signups */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-2">
              <Users className="h-4 w-4 text-stone-400" />
              <h2 className="font-bold text-stone-900 text-sm">Neueste Registrierungen</h2>
            </div>
            <div className="divide-y divide-stone-50">
              {recentUsers?.length ? recentUsers.map((u, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center text-xs font-bold text-orange-600">
                      {String(i + 1).padStart(2, '0')}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-stone-700 truncate max-w-[160px]">Nutzer #{u.id.slice(0, 8)}...</p>
                      <p className="text-xs text-stone-400">{new Date(u.created_at).toLocaleDateString('de-CH')}</p>
                    </div>
                  </div>
                  {u.is_premium ? (
                    <span className="text-xs bg-amber-100 text-amber-700 font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
                      <Crown className="h-3 w-3" /> Premium
                    </span>
                  ) : (
                    <span className="text-xs bg-stone-100 text-stone-500 px-2 py-0.5 rounded-full">Gratis</span>
                  )}
                </div>
              )) : (
                <div className="px-5 py-6 text-center text-stone-400 text-sm">Noch keine Nutzer</div>
              )}
            </div>
          </div>

          {/* Top streaks */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-2">
              <Flame className="h-4 w-4 text-orange-500" />
              <h2 className="font-bold text-stone-900 text-sm">Top Streaks</h2>
            </div>
            <div className="divide-y divide-stone-50">
              {streakData?.length ? streakData.map((s, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-extrabold ${i === 0 ? 'bg-amber-100 text-amber-600' : i === 1 ? 'bg-stone-100 text-stone-600' : 'bg-stone-50 text-stone-400'}`}>
                      #{i + 1}
                    </div>
                    <div>
                      <p className="text-xs font-medium text-stone-700">Aktuell: <span className="text-orange-500 font-bold">{s.current_streak} Tage</span></p>
                      <p className="text-xs text-stone-400">Längster: {s.longest_streak} Tage</p>
                    </div>
                  </div>
                  <Flame className="h-4 w-4 text-orange-400" />
                </div>
              )) : (
                <div className="px-5 py-6 text-center text-stone-400 text-sm">Keine Streak-Daten</div>
              )}
            </div>
          </div>

          {/* Module completions */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden md:col-span-2">
            <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-2">
              <BookOpen className="h-4 w-4 text-blue-500" />
              <h2 className="font-bold text-stone-900 text-sm">Modul-Abschlüsse</h2>
            </div>
            <div className="p-5">
              {Object.keys(moduleCounts).length ? (
                <div className="space-y-3">
                  {Object.entries(moduleCounts).map(([moduleId, count]) => {
                    const maxCount = Math.max(...Object.values(moduleCounts))
                    return (
                      <div key={moduleId} className="flex items-center gap-4">
                        <p className="text-sm font-medium text-stone-700 w-48 truncate">{moduleId}</p>
                        <div className="flex-1 bg-stone-100 rounded-full h-2.5">
                          <div className="bg-orange-500 h-2.5 rounded-full" style={{ width: `${(count / maxCount) * 100}%` }} />
                        </div>
                        <p className="text-sm font-bold text-stone-600 w-8 text-right">{count}</p>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="text-center text-stone-400 text-sm py-4">Noch keine Modul-Abschlüsse</p>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
