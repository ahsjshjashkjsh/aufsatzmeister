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
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 md:static md:border-t-0 md:border-r md:h-full md:w-56 md:flex md:flex-col">
      <div className="hidden md:block px-4 py-6">
        <h1 className="text-xl font-bold text-zinc-900">AufsatzMeister</h1>
        <p className="text-xs text-zinc-500 mt-1">Deutsch besser schreiben</p>
      </div>
      <ul className="flex md:flex-col justify-around md:justify-start md:gap-1 md:px-2 py-2">
        {navItems.map(({ href, label, icon: Icon }) => (
          <li key={href}>
            <Link
              href={href}
              className={cn(
                'flex flex-col md:flex-row items-center md:gap-3 px-3 py-2 rounded-lg text-xs md:text-sm transition-colors',
                pathname.startsWith(href)
                  ? 'bg-zinc-900 text-white'
                  : 'text-zinc-600 hover:bg-zinc-100'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  )
}
