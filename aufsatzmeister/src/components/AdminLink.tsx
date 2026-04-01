import { createClient } from '@/lib/supabase-server'
import Link from 'next/link'
import { Shield } from 'lucide-react'

export async function AdminLink() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user || user.email !== process.env.ADMIN_EMAIL) return null

  return (
    <Link
      href="/admin"
      className="group flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-stone-500 hover:bg-red-50 hover:text-red-700"
    >
      <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-red-100 group-hover:bg-red-200 transition-colors">
        <Shield className="h-4 w-4 text-red-500" />
      </div>
      Admin
    </Link>
  )
}
