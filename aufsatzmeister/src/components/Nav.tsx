'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BookOpen, Brain, Dumbbell, BookMarked, LayoutDashboard } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/lernpfad', label: 'Lernpfad', icon: BookOpen },
  { href: '/ki-coach', label: 'KI-Coach', icon: Brain },
  { href: '/daily-practice', label: 'Tagesübung', icon: Dumbbell },
  { href: '/vokabular', label: 'Wortschatz', icon: BookMarked },
]

export function Nav() {
  const pathname = usePathname()
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-100 z-50 md:static md:border-t-0 md:border-r md:border-stone-100 md:h-screen md:w-60 md:flex md:flex-col flex-shrink-0">
      {/* Logo */}
      <div className="hidden md:flex items-center gap-2.5 px-5 py-6">
        <div className="w-9 h-9 bg-orange-500 rounded-xl flex items-center justify-center flex-shrink-0">
          <span className="text-white font-extrabold text-base">A</span>
        </div>
        <div>
          <p className="font-bold text-stone-900 text-sm leading-tight">AufsatzMeister</p>
          <p className="text-xs text-stone-400">Deutsch besser schreiben</p>
        </div>
      </div>

      {/* Divider */}
      <div className="hidden md:block h-px bg-stone-100 mx-5 mb-3" />

      {/* Nav items */}
      <ul className="flex md:flex-col justify-around md:justify-start md:gap-1 md:px-3 py-2 md:py-0">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname.startsWith(href)
          return (
            <li key={href}>
              <Link
                href={href}
                className={cn(
                  'flex flex-col md:flex-row items-center md:gap-3 px-3 py-2.5 rounded-xl text-xs md:text-sm transition-all',
                  active
                    ? 'bg-orange-50 text-orange-600 font-semibold'
                    : 'text-stone-500 hover:bg-stone-50 hover:text-stone-800'
                )}
              >
                <div className={cn(
                  'w-8 h-8 rounded-lg flex items-center justify-center md:w-auto md:h-auto md:rounded-none md:bg-transparent',
                  active ? 'bg-orange-100 md:bg-transparent' : ''
                )}>
                  <Icon className={cn('h-4 w-4 md:h-5 md:w-5', active ? 'text-orange-500' : 'text-stone-400')} />
                </div>
                <span className="md:flex-1">{label}</span>
                {active && <div className="hidden md:block w-1.5 h-1.5 bg-orange-500 rounded-full ml-auto" />}
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
