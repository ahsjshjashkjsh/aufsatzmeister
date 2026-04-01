import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { Button } from '@/components/ui/button'
import { CheckCircle, Sparkles, Crown } from 'lucide-react'
import { stripe } from '@/lib/stripe'

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

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <Nav />
      <div className="md:ml-64">
        <main className="px-6 py-8 pb-28 md:pb-10 max-w-lg">
          <div className="mb-8">
            <h1 className="text-2xl font-extrabold text-stone-900 mb-1">Einstellungen</h1>
            <p className="text-stone-500">Dein Konto & Abo</p>
          </div>

          <div className="bg-white rounded-2xl p-5 border border-stone-100 shadow-sm mb-4">
            <p className="text-xs font-bold text-stone-300 uppercase tracking-widest mb-3">Konto</p>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center font-extrabold text-orange-600 text-base">
                {user.email?.[0].toUpperCase()}
              </div>
              <p className="text-stone-700 font-medium text-sm">{user.email}</p>
            </div>
          </div>

          {isPremium ? (
            <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-2xl p-6 text-white shadow-lg shadow-orange-100">
              <div className="flex items-center gap-3 mb-3">
                <Crown className="h-6 w-6" />
                <p className="font-extrabold text-lg">Premium aktiv</p>
              </div>
              <p className="text-orange-100 text-sm mb-4">Zugang zu allen Modulen und unbegrenzt KI-Feedback.</p>
              <div className="space-y-2">
                {['Alle 5 Module', 'Unbegrenzt KI-Feedback', 'Fortschrittsreport (PDF)'].map(f => (
                  <div key={f} className="flex items-center gap-2 text-sm"><CheckCircle className="h-4 w-4 text-white/80" />{f}</div>
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 px-6 py-4">
                <div className="flex items-center gap-2 text-white">
                  <Sparkles className="h-5 w-5" />
                  <p className="font-bold">Upgrade auf Premium</p>
                </div>
              </div>
              <div className="p-6">
                <div className="flex items-baseline gap-1 mb-1">
                  <span className="text-4xl font-extrabold text-stone-900">9</span>
                  <span className="text-stone-400 font-medium">CHF / Monat</span>
                </div>
                <p className="text-stone-500 text-sm mb-5">Alles inklusive. Jederzeit kündbar.</p>
                <ul className="space-y-3 mb-6">
                  {['Alle 5 Module freischalten', 'Unbegrenzt KI-Feedback', 'Fortschrittsreport (PDF)', 'Neue Inhalte inklusive'].map(f => (
                    <li key={f} className="flex items-center gap-3 text-sm text-stone-700">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />{f}
                    </li>
                  ))}
                </ul>
                <form action={startCheckout}>
                  <Button type="submit" className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base">
                    Jetzt upgraden — 9 CHF/Monat
                  </Button>
                </form>
                <p className="text-xs text-center text-stone-400 mt-3">Sichere Zahlung über Stripe</p>
              </div>
            </div>
          )}
        </main>

        <footer className="border-t border-stone-100 py-5 px-6 text-xs text-stone-400 bg-white">
          © 2025 AufsatzMeister · Für Schülerinnen und Schüler in der DACH-Region
        </footer>
      </div>
    </div>
  )
}
