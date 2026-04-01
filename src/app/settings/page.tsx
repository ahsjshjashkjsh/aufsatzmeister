import { createClient } from '@/lib/supabase-server'
import { redirect } from 'next/navigation'
import { Nav } from '@/components/Nav'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CheckCircle } from 'lucide-react'

export default async function SettingsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/login')

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single()
  const isPremium = profile?.is_premium ?? false

  async function startCheckout() {
    'use server'
    const res = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/stripe/checkout`, {
      method: 'POST',
    })
    const { url } = await res.json()
    redirect(url)
  }

  return (
    <div className="flex min-h-screen">
      <Nav />
      <main className="flex-1 p-6 pb-20 md:pb-6 max-w-lg">
        <h1 className="text-2xl font-bold mb-8">Einstellungen</h1>

        <Card className="mb-6">
          <CardHeader><CardTitle>Dein Abo</CardTitle></CardHeader>
          <CardContent>
            {isPremium ? (
              <div>
                <div className="flex items-center gap-2 text-green-700 font-semibold mb-2">
                  <CheckCircle className="h-5 w-5" />
                  Premium aktiv
                </div>
                <p className="text-sm text-zinc-600">Du hast Zugang zu allen Modulen und unbegrenzt KI-Feedback.</p>
              </div>
            ) : (
              <div>
                <p className="text-zinc-600 mb-4">Du nutzt die Gratisversion. Upgrade für alle Features.</p>
                <ul className="space-y-2 text-sm text-zinc-600 mb-6">
                  {['Alle 5 Module', 'Unbegrenzt KI-Feedback', 'Fortschrittsreport (PDF)'].map(f => (
                    <li key={f} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />{f}</li>
                  ))}
                </ul>
                <form action={startCheckout}>
                  <Button type="submit" className="w-full">Upgrade — 9 CHF/Monat</Button>
                </form>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
