'use client'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import { LogOut } from 'lucide-react'

export function LogoutButton() {
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/auth/login')
    router.refresh()
  }

  return (
    <button
      onClick={handleLogout}
      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all w-full text-left text-stone-500 hover:bg-red-50 hover:text-red-600"
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-stone-100 group-hover:bg-red-100 transition-colors">
        <LogOut className="h-4 w-4 text-stone-400 group-hover:text-red-500" />
      </div>
      Abmelden
    </button>
  )
}
