'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Brain, Dumbbell, BookMarked, LayoutDashboard, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard',      label: 'Dashboard',  icon: LayoutDashboard },
  { href: '/lernpfad',       label: 'Lernpfad',   icon: BookOpen },
  { href: '/ki-coach',       label: 'KI-Coach',   icon: Brain },
  { href: '/daily-practice', label: 'Tagesübung', icon: Dumbbell },
  { href: '/vokabular',      label: 'Wortschatz', icon: BookMarked },
]

export function Nav() {
  const pathname = usePathname()

  return (
    <>
      {/* ── Desktop top header ─────────────────────────────────── */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-stone-100 shadow-sm items-center px-6">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2.5 mr-8 flex-shrink-0">
          <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-extrabold text-sm">A</span>
          </div>
          <span className="font-extrabold text-stone-900 text-base">AufsatzMeister</span>
        </Link>

        {/* Center nav links */}
        <nav className="flex items-center gap-1 flex-1">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  'flex items-center gap-2 px-3.5 py-2 rounded-xl text-sm font-medium transition-all',
                  active
                    ? 'bg-orange-50 text-orange-600'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
                )}
              >
                <Icon className={cn('h-4 w-4', active ? 'text-orange-500' : 'text-stone-400')} />
                {label}
              </Link>
            )
          })}
        </nav>

        {/* Right: settings */}
        <Link
          href="/settings"
          className={cn(
            'w-9 h-9 rounded-xl flex items-center justify-center transition-colors flex-shrink-0',
            pathname.startsWith('/settings')
              ? 'bg-orange-50 text-orange-500'
              : 'text-stone-400 hover:bg-stone-50 hover:text-stone-700'
          )}
        >
          <Settings className="h-4 w-4" />
        </Link>
      </header>

      {/* ── Mobile bottom tab bar ──────────────────────────────── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-stone-100 safe-area-inset-bottom">
        <ul className="flex justify-around items-center px-2 py-2">
          {navItems.map(({ href, label, icon: Icon }) => {
            const active = pathname.startsWith(href)
            return (
              <li key={href}>
                <Link
                  href={href}
                  className="flex flex-col items-center gap-1 px-3 py-1.5"
                >
                  <div className={cn(
                    'w-8 h-8 rounded-xl flex items-center justify-center',
                    active ? 'bg-orange-100' : ''
                  )}>
                    <Icon className={cn('h-4 w-4', active ? 'text-orange-500' : 'text-stone-400')} />
                  </div>
                  <span className={cn(
                    'text-[10px] font-medium',
                    active ? 'text-orange-600' : 'text-stone-400'
                  )}>
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
