import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Brain, BookOpen, Dumbbell } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-zinc-900">AufsatzMeister</h1>
        <div className="flex gap-3">
          <Link href="/auth/login">
            <Button variant="outline">Anmelden</Button>
          </Link>
          <Link href="/auth/register">
            <Button>Kostenlos starten</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 py-20 text-center max-w-3xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 mb-6">
          Bessere Noten in Deutsch.<br />
          <span className="text-zinc-500">In 30 Tagen.</span>
        </h2>
        <p className="text-lg text-zinc-600 mb-8">
          AufsatzMeister lehrt dich Aufsätze schreiben durch strukturierte Module,
          echtes KI-Feedback und tägliche Übungen. Kein ChatGPT, das für dich schreibt —
          du lernst es selbst.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/auth/register">
            <Button size="lg">Jetzt kostenlos starten</Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline">Anmelden</Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-16 bg-zinc-50">
        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="text-center">
            <BookOpen className="h-10 w-10 mx-auto mb-4 text-zinc-700" />
            <h3 className="font-semibold mb-2">Strukturierter Lernpfad</h3>
            <p className="text-zinc-600 text-sm">5 Module von Aufsatzarten bis Stil — Schritt für Schritt aufgebaut.</p>
          </div>
          <div className="text-center">
            <Brain className="h-10 w-10 mx-auto mb-4 text-zinc-700" />
            <h3 className="font-semibold mb-2">KI-Coach mit echtem Feedback</h3>
            <p className="text-zinc-600 text-sm">Lade deinen Aufsatz hoch. Die KI erklärt Fehler und du übst sie sofort.</p>
          </div>
          <div className="text-center">
            <Dumbbell className="h-10 w-10 mx-auto mb-4 text-zinc-700" />
            <h3 className="font-semibold mb-2">5 Min täglich reichen</h3>
            <p className="text-zinc-600 text-sm">Daily Practice hält deinen Fortschritt aufrecht — wie Duolingo für Aufsätze.</p>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-16 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold text-center mb-10">Einfache Preise</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="border rounded-xl p-6">
            <h3 className="font-bold text-lg mb-1">Gratis</h3>
            <p className="text-3xl font-bold mb-4">0 CHF</p>
            <ul className="space-y-2 text-sm text-zinc-600">
              {['Modul 1 komplett', '1 KI-Feedback pro Monat', 'Tägliche Übungen'].map(f => (
                <li key={f} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />{f}</li>
              ))}
            </ul>
            <Link href="/auth/register" className="block mt-6">
              <Button className="w-full" variant="outline">Kostenlos starten</Button>
            </Link>
          </div>
          <div className="border-2 border-zinc-900 rounded-xl p-6 relative">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-xs px-3 py-1 rounded-full">Empfohlen</span>
            <h3 className="font-bold text-lg mb-1">Premium</h3>
            <p className="text-3xl font-bold mb-4">9 CHF <span className="text-base font-normal text-zinc-500">/ Monat</span></p>
            <ul className="space-y-2 text-sm text-zinc-600">
              {['Alle 5 Module', 'Unbegrenzt KI-Feedback', 'Fortschrittsreport (PDF)', 'Wortschatz-Trainer'].map(f => (
                <li key={f} className="flex items-center gap-2"><CheckCircle className="h-4 w-4 text-green-500" />{f}</li>
              ))}
            </ul>
            <Link href="/auth/register" className="block mt-6">
              <Button className="w-full">Jetzt upgraden</Button>
            </Link>
          </div>
        </div>
        <p className="text-center text-sm text-zinc-500 mt-6">
          &quot;Wenn deine Note steigt, zahlt sich das Abo aus dem ersten besseren Zeugnis zurück.&quot;
        </p>
      </section>
    </div>
  )
}
