'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Brain, Dumbbell, BookMarked, LayoutDashboard, Settings, Shield } from 'lucide-react'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase-client'
import { useEffect, useState } from 'react'

const navItems = [
  { href: '/dashboard',      label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/lernpfad',       label: 'Lernpfad',   icon: BookOpen },
  { href: '/ki-coach',       label: 'KI-Coach',   icon: Brain },
  { href: '/daily-practice', label: 'Tagesübung', icon: Dumbbell },
  { href: '/vokabular',      label: 'Wortschatz', icon: BookMarked },
]

export function Nav() {
  const pathname = usePathname()
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email && user.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
        setIsAdmin(true)
      }
    })
  }, [])

  return (
    <>
      {/* ── Desktop sidebar ─────────────────────────────────────── */}
      <aside className="hidden md:flex flex-col fixed top-0 left-0 h-screen w-64 bg-white border-r border-stone-100 z-40 shadow-sm">
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-stone-50">
          <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0 shadow-sm shadow-orange-200">
            <span className="text-white font-extrabold text-base">A</span>
          </div>
          <div>
            <p className="font-extrabold text-stone-900 text-sm leading-tight">AufsatzMeister</p>
            <p className="text-[11px] text-stone-400 mt-0.5">Deutsch besser schreiben</p>
          </div>
        </div>

        {/* Nav links */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          <p className="text-[10px] font-bold text-stone-300 uppercase tracking-widest px-3 mb-2">Menü</p>
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link key={href} href={href} className={cn(
                'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                active ? 'bg-orange-50 text-orange-600' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
              )}>
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors',
                  active ? 'bg-orange-100' : 'bg-stone-100 group-hover:bg-stone-200'
                )}>
                  <Icon className={cn('h-4 w-4', active ? 'text-orange-500' : 'text-stone-400')} />
                </div>
                <span className="flex-1">{label}</span>
                {active && <div className="w-1.5 h-1.5 rounded-full bg-orange-500" />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom: settings + admin */}
        <div className="px-3 py-4 border-t border-stone-50 space-y-0.5">
          <Link href="/settings" className={cn(
            'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
            pathname.startsWith('/settings') ? 'bg-orange-50 text-orange-600' : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
          )}>
            <div className={cn(
              'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
              pathname.startsWith('/settings') ? 'bg-orange-100' : 'bg-stone-100 group-hover:bg-stone-200'
            )}>
              <Settings className={cn('h-4 w-4', pathname.startsWith('/settings') ? 'text-orange-500' : 'text-stone-400')} />
            </div>
            Einstellungen
          </Link>

          {isAdmin && (
            <Link href="/admin" className={cn(
              'group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all',
              pathname.startsWith('/admin') ? 'bg-red-50 text-red-600' : 'text-stone-500 hover:bg-red-50 hover:text-red-700'
            )}>
              <div className={cn(
                'w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0',
                pathname.startsWith('/admin') ? 'bg-red-100' : 'bg-stone-100 group-hover:bg-red-100'
              )}>
                <Shield className={cn('h-4 w-4', pathname.startsWith('/admin') ? 'text-red-500' : 'text-stone-400 group-hover:text-red-500')} />
              </div>
              Admin
            </Link>
          )}
        </div>
      </aside>

      {/* ── Mobile bottom tab bar ──────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-stone-100">
        <ul className="flex justify-around items-center px-2 py-1.5">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <li key={href}>
                <Link href={href} className="flex flex-col items-center gap-1 px-3 py-1.5">
                  <div className={cn('w-8 h-8 rounded-xl flex items-center justify-center', active ? 'bg-orange-100' : '')}>
                    <Icon className={cn('h-4 w-4', active ? 'text-orange-500' : 'text-stone-400')} />
                  </div>
                  <span className={cn('text-[10px] font-semibold', active ? 'text-orange-600' : 'text-stone-400')}>
                    {label}
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>
    </>
  )
}
