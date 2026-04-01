import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { Button } from '@/components/ui/button'
import { CheckCircle, Sparkles, Crown, Mail, Calendar } from 'lucide-react'
import { stripe } from '@/lib/stripe'
import { LogoutButton } from '@/components/LogoutButton'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const isPremium = profile?.is_premium ?? false

  async function startCheckout() {
    'use server'
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/auth/login')
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription', payment_method_types: ['card'],
      line_items: [{ price: process.env.STRIPE_PREMIUM_PRICE_ID!, quantity: 1 }],
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?upgraded=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/settings`,
      customer_email: user.email, metadata: { user_id: user.id },
    })
    redirect(session.url!)
  }

  const joinedDate = user.created_at
    ? new Date(user.created_at).toLocaleDateString('de-CH', { year: 'numeric', month: 'long', day: 'numeric' })
    : null

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <Nav />
      <div className="md:ml-64">
        <main className="px-6 py-8 pb-28 md:pb-10 max-w-lg">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-stone-900 mb-1">Einstellungen</h1>
            <p className="text-stone-500">Dein Konto & Abo</p>
          </div>

          {/* Account card */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm mb-4 overflow-hidden">
            <div className="px-5 py-3 border-b border-stone-50">
              <p className="text-xs font-bold text-stone-300 uppercase tracking-widest">Konto</p>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 bg-gradient-to-br from-orange-400 to-amber-500 rounded-xl flex items-center justify-center font-extrabold text-white text-lg shadow-sm shadow-orange-200">
                  {user.email?.[0].toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-stone-900 text-sm">{user.email}</p>
                  {isPremium && (
                    <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full mt-0.5">
                      <Crown className="h-3 w-3" /> Premium
                    </span>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="bg-stone-50 rounded-xl p-3">
                  <div className="flex items-center gap-1.5 mb-1">
                    <Mail className="h-3.5 w-3.5 text-stone-400" />
                    <p className="text-xs font-bold text-stone-400 uppercase tracking-wide">E-Mail</p>
                  </div>
                  <p className="text-xs text-stone-600 font-medium truncate">{user.email}</p>
                </div>
                {joinedDate && (
                  <div className="bg-stone-50 rounded-xl p-3">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Calendar className="h-3.5 w-3.5 text-stone-400" />
                      <p className="text-xs font-bold text-stone-400 uppercase tracking-wide">Dabei seit</p>
                    </div>
                    <p className="text-xs text-stone-600 font-medium">{joinedDate}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Subscription */}
          {isPremium ? (
            <div className="bg-gradient-to-br from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-100 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <Crown className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-extrabold">Premium aktiv</p>
                  <p className="text-orange-200 text-xs">9 CHF / Monat</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {['Alle 5 Module', 'Unbegrenzt KI-Feedback', 'Fortschrittsreport', 'Neue Inhalte'].map(f => (
                  <div key={f} className="flex items-center gap-1.5 text-xs">
                    <CheckCircle className="h-3.5 w-3.5 text-white/80 flex-shrink-0" />{f}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden mb-4">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-5 py-3.5">
                <div className="flex items-center gap-2 text-white">
                  <Sparkles className="h-4 w-4" />
                  <p className="font-bold text-sm">Upgrade auf Premium</p>
                </div>
              </div>
              <div className="p-5">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-extrabold text-stone-900">9</span>
                  <span className="text-stone-400 font-medium">CHF / Monat</span>
                </div>
                <p className="text-stone-500 text-sm mb-5">Alles inklusive. Jederzeit kündbar.</p>
                <ul className="space-y-2.5 mb-5">
                  {['Alle 5 Module freischalten', 'Unbegrenzt KI-Feedback', 'Fortschrittsreport (PDF)', 'Neue Inhalte inklusive'].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-stone-700">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <form action={startCheckout}>
                  <Button type="submit" className="w-full h-11 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold">
                    Jetzt upgraden — 9 CHF/Monat
                  </Button>
                </form>
                <p className="text-xs text-center text-stone-400 mt-3">Sichere Zahlung über Stripe</p>
              </div>
            </div>
          )}

          {/* Logout */}
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-3">
            <p className="text-xs font-bold text-stone-300 uppercase tracking-widest px-3 mb-1">Sitzung</p>
            <LogoutButton />
          </div>
        </main>

        <footer className="border-t border-stone-100 py-5 px-6 text-xs text-stone-400 bg-white">
          © 2025 AufsatzMeister · Für Schülerinnen und Schüler in der DACH-Region
        </footer>
      </div>
    </div>
  )
}
