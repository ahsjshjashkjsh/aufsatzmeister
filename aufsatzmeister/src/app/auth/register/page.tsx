'use client'
import { useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { CheckCircle } from 'lucide-react'

export default function RegisterPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 8) {
      setError('Passwort muss mindestens 8 Zeichen haben.')
      return
    }
    setLoading(true)
    setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setError('Registrierung fehlgeschlagen. Versuche es erneut.')
      setLoading(false)
      return
    }
    setSuccess(true)
  }

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#FFFBF5] p-6">
        <div className="bg-white rounded-3xl p-10 max-w-md w-full text-center shadow-sm border border-stone-100">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-5">
            <CheckCircle className="h-8 w-8 text-green-500" />
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 mb-2">Fast geschafft!</h2>
          <p className="text-stone-500">
            Wir haben einen Bestätigungslink an{' '}
            <strong className="text-stone-800">{email}</strong> gesendet.
            Bitte überprüfe dein Postfach.
          </p>
        </div>
      </div>
    )
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
          Starte kostenlos und verbessere deine Deutschnoten in 30 Tagen.
        </p>
        <div className="mt-12 space-y-4 w-full max-w-xs">
          {['Modul 1 gratis', 'KI-Feedback auf deinen Aufsatz', 'Tägliche Übungen & Streak'].map(f => (
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

          <h2 className="text-3xl font-extrabold text-stone-900 mb-2">Konto erstellen</h2>
          <p className="text-stone-500 mb-8">Kostenlos starten — kein Kreditkarte nötig.</p>

          <form onSubmit={handleRegister} className="space-y-5">
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
              <Label htmlFor="password" className="text-stone-700 font-medium">
                Passwort <span className="text-stone-400 font-normal">(min. 8 Zeichen)</span>
              </Label>
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
              {loading ? 'Registrieren...' : 'Kostenlos starten'}
            </Button>
          </form>

          <p className="mt-6 text-sm text-center text-stone-500">
            Bereits registriert?{' '}
            <Link href="/auth/login" className="text-orange-600 font-semibold hover:underline">
              Anmelden
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
