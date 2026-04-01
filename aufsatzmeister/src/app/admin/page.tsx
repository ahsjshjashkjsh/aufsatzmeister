import { createClient } from '@/lib/supabase-server'
import { supabaseAdmin } from '@/lib/supabase-admin'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Users, Crown, Flame, BookOpen, TrendingUp, Shield, ArrowLeft, Star } from 'lucide-react'
import { PremiumToggle } from './PremiumToggle'

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')
  if (user.email !== process.env.ADMIN_EMAIL) redirect('/dashboard')

  // Fetch all data in parallel
  const [
    { count: totalUsers },
    { count: premiumUsers },
    { data: profiles },
    { data: streakData },
    { data: progressData },
    { data: { users: authUsers } },
  ] = await Promise.all([
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }),
    supabaseAdmin.from('profiles').select('*', { count: 'exact', head: true }).eq('is_premium', true),
    supabaseAdmin.from('profiles').select('id, is_premium, created_at').order('created_at', { ascending: false }).limit(50),
    supabaseAdmin.from('practice_streaks').select('current_streak, longest_streak').order('current_streak', { ascending: false }).limit(5),
    supabaseAdmin.from('module_progress').select('module_id').eq('completed', true),
    supabaseAdmin.auth.admin.listUsers({ perPage: 50 }),
  ])

  // Map emails onto profiles
  const emailMap: Record<string, string> = {}
  authUsers?.forEach(u => { emailMap[u.id] = u.email ?? '—' })

  const freeUsers = (totalUsers ?? 0) - (premiumUsers ?? 0)
  const conversionRate = totalUsers ? Math.round(((premiumUsers ?? 0) / totalUsers) * 100) : 0
  const estimatedMRR = (premiumUsers ?? 0) * 9

  const moduleCounts: Record<string, number> = {}
  progressData?.forEach(p => { moduleCounts[p.module_id] = (moduleCounts[p.module_id] ?? 0) + 1 })

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      {/* Admin top bar */}
      <header className="fixed top-0 left-0 right-0 z-50 h-14 bg-stone-900 flex items-center px-6 justify-between shadow-md">
        <div className="flex items-center gap-3">
          <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center">
            <Shield className="h-4 w-4 text-white" />
          </div>
          <span className="text-white font-extrabold text-sm">Admin Dashboard</span>
          <span className="text-stone-500 text-xs hidden md:block">· {user.email}</span>
        </div>
        <Link href="/dashboard" className="flex items-center gap-1.5 text-stone-400 hover:text-white text-sm transition-colors">
          <ArrowLeft className="h-4 w-4" /> Zur App
        </Link>
      </header>

      <main className="pt-20 pb-12 px-4 md:px-8 max-w-6xl mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Nutzer gesamt', value: totalUsers ?? 0,       icon: Users,      bg: 'bg-blue-50',   iconBg: 'bg-blue-100',   iconColor: 'text-blue-600',   sub: 'Registriert' },
            { label: 'Premium',       value: premiumUsers ?? 0,     icon: Crown,      bg: 'bg-amber-50',  iconBg: 'bg-amber-100',  iconColor: 'text-amber-600',  sub: `${conversionRate}% Conversion` },
            { label: 'Gratis',        value: freeUsers,             icon: Users,      bg: 'bg-stone-50',  iconBg: 'bg-stone-100',  iconColor: 'text-stone-500',  sub: 'Ohne Abo' },
            { label: 'MRR',           value: `${estimatedMRR} CHF`, icon: TrendingUp, bg: 'bg-green-50',  iconBg: 'bg-green-100',  iconColor: 'text-green-600',  sub: 'Monatlich' },
          ].map(({ label, value, icon: Icon, bg, iconBg, iconColor, sub }) => (
            <div key={label} className={`${bg} rounded-2xl p-5 border border-white shadow-sm`}>
              <div className={`w-9 h-9 ${iconBg} rounded-xl flex items-center justify-center mb-3`}>
                <Icon className={`h-4 w-4 ${iconColor}`} />
              </div>
              <p className="text-2xl font-extrabold text-stone-900">{value}</p>
              <p className="text-sm font-semibold text-stone-700 mt-0.5">{label}</p>
              <p className="text-xs text-stone-400 mt-0.5">{sub}</p>
            </div>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* User management — takes 2 cols */}
          <div className="md:col-span-2 bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-stone-50 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 text-stone-400" />
                <h2 className="font-bold text-stone-900 text-sm">Nutzerverwaltung</h2>
              </div>
              <span className="text-xs text-stone-400 bg-stone-50 px-2 py-1 rounded-lg">{totalUsers ?? 0} Nutzer</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-stone-50">
                    <th className="px-5 py-3 text-left text-xs font-bold text-stone-400 uppercase tracking-wide">E-Mail</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-stone-400 uppercase tracking-wide hidden md:table-cell">Registriert</th>
                    <th className="px-5 py-3 text-left text-xs font-bold text-stone-400 uppercase tracking-wide">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-50">
                  {profiles?.length ? profiles.map((profile) => (
                    <tr key={profile.id} className="hover:bg-stone-50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center text-xs font-extrabold text-orange-600 flex-shrink-0">
                            {(emailMap[profile.id]?.[0] ?? '?').toUpperCase()}
                          </div>
                          <span className="text-sm text-stone-700 font-medium truncate max-w-[180px]">
                            {emailMap[profile.id] ?? `...${profile.id.slice(-8)}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 hidden md:table-cell">
                        <span className="text-xs text-stone-400">
                          {new Date(profile.created_at).toLocaleDateString('de-CH')}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <PremiumToggle userId={profile.id} isPremium={profile.is_premium ?? false} />
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={3} className="px-5 py-8 text-center text-stone-400 text-sm">Noch keine Nutzer</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right column: streaks + modules */}
          <div className="space-y-6">
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
                      <span className={`text-xs font-extrabold w-5 ${i === 0 ? 'text-amber-500' : i === 1 ? 'text-stone-400' : 'text-stone-300'}`}>
                        #{i + 1}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-stone-700"><span className="text-orange-500">{s.current_streak}</span> Tage</p>
                        <p className="text-xs text-stone-400">Max: {s.longest_streak}</p>
                      </div>
                    </div>
                    <Flame className="h-4 w-4 text-orange-300" />
                  </div>
                )) : (
                  <div className="px-5 py-6 text-center text-stone-400 text-sm">Keine Daten</div>
                )}
              </div>
            </div>

            {/* Module completions */}
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-stone-50 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-blue-500" />
                <h2 className="font-bold text-stone-900 text-sm">Modul-Abschlüsse</h2>
              </div>
              <div className="p-5 space-y-3">
                {Object.keys(moduleCounts).length ? Object.entries(moduleCounts).map(([moduleId, count]) => {
                  const maxCount = Math.max(...Object.values(moduleCounts))
                  return (
                    <div key={moduleId}>
                      <div className="flex justify-between mb-1">
                        <p className="text-xs font-medium text-stone-600 truncate max-w-[120px]">{moduleId}</p>
                        <span className="text-xs font-bold text-stone-500">{count}</span>
                      </div>
                      <div className="w-full bg-stone-100 rounded-full h-1.5">
                        <div className="bg-orange-500 h-1.5 rounded-full" style={{ width: `${(count / maxCount) * 100}%` }} />
                      </div>
                    </div>
                  )
                }) : (
                  <p className="text-center text-stone-400 text-sm py-2">Keine Abschlüsse</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
