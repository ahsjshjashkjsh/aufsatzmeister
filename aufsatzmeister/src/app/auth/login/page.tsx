'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('E-Mail oder Passwort falsch.')
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <div className="min-h-screen flex bg-[#FFFBF5]">
      {/* Left branding panel */}
      <div className="hidden lg:flex flex-1 bg-orange-500 flex-col items-center justify-center p-12 text-white">
        <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
          <span className="text-3xl font-extrabold">A</span>
        </div>
        <h1 className="text-3xl font-extrabold mb-3">AufsatzMeister</h1>
        <p className="text-orange-100 text-center text-lg max-w-xs leading-relaxed">
          Dein persönlicher Lerncoach für bessere Deutschnoten.
        </p>
        <div className="mt-12 space-y-4 w-full max-w-xs">
          {['Strukturierter Lernpfad', 'KI-Feedback auf deine Aufsätze', 'Tägliche 5-Minuten-Übungen'].map(f => (
            <div key={f} className="flex items-center gap-3 bg-white/10 rounded-xl px-4 py-3 text-sm">
              <span className="w-5 h-5 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-orange-500 text-xs font-bold">✓</span>
              </span>
              {f}
            </div>
          ))}
        </div>
      </div>

      {/* Right form panel */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <div className="lg:hidden flex items-center gap-2 mb-8">
            <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">A</span>
            </div>
            <span className="font-bold text-stone-900">AufsatzMeister</span>
          </div>

          <h2 className="text-3xl font-extrabold text-stone-900 mb-2">Willkommen zurück</h2>
          <p className="text-stone-500 mb-8">Melde dich an und lern weiter.</p>

          <form onSubmit={handleLogin} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-stone-700 font-medium">E-Mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="deine@email.ch"
                className="h-12 rounded-xl border-stone-200 bg-white focus-visible:ring-orange-400"
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-stone-700 font-medium">Passwort</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="h-12 rounded-xl border-stone-200 bg-white focus-visible:ring-orange-400"
                required
              />
            </div>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                {error}
              </div>
            )}
            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base"
              disabled={loading}
            >
              {loading ? 'Anmelden...' : 'Anmelden'}
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-stone-500">
            Noch kein Konto?{' '}
            <Link href="/auth/register" className="text-orange-600 font-semibold hover:underline">
              Kostenlos registrieren
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
