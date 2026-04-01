import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { CheckCircle, Brain, BookOpen, Dumbbell, Star, Flame, ArrowRight } from 'lucide-react'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-orange-500 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold text-sm">A</span>
          </div>
          <span className="text-lg font-bold text-stone-900">AufsatzMeister</span>
        </div>
        <div className="flex gap-3">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-stone-600 hover:text-stone-900">Anmelden</Button>
          </Link>
          <Link href="/auth/register">
            <Button className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-5">Kostenlos starten</Button>
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="px-6 pt-16 pb-20 text-center max-w-4xl mx-auto">
        <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
          <Star className="h-3.5 w-3.5 fill-orange-500" />
          Von Schülern für Schüler — Schweiz, Deutschland & Österreich
        </div>
        <h1 className="text-5xl md:text-6xl font-extrabold text-stone-900 mb-6 leading-tight tracking-tight">
          Bessere Noten<br />
          <span className="text-orange-500">in Deutsch.</span>
        </h1>
        <p className="text-xl text-stone-500 mb-10 max-w-2xl mx-auto leading-relaxed">
          Lerne Aufsätze schreiben mit strukturierten Modulen, echtem KI-Feedback
          und täglichen Übungen. Kein ChatGPT das für dich schreibt — du lernst es selbst.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link href="/auth/register">
            <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-8 py-6 text-lg font-semibold shadow-lg shadow-orange-200">
              Jetzt kostenlos starten
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="/auth/login">
            <Button size="lg" variant="outline" className="rounded-2xl px-8 py-6 text-lg border-stone-200 text-stone-600 hover:bg-stone-50">
              Bereits registriert
            </Button>
          </Link>
        </div>
        <p className="text-sm text-stone-400 mt-4">Kein Kreditkarte nötig · Modul 1 gratis</p>
      </section>

      {/* Stats */}
      <section className="py-10 bg-white border-y border-stone-100">
        <div className="max-w-4xl mx-auto px-6 grid grid-cols-3 gap-8 text-center">
          {[
            { value: '5', label: 'Lernmodule' },
            { value: '30+', label: 'Tagesübungen' },
            { value: '9 CHF', label: 'Pro Monat' },
          ].map(({ value, label }) => (
            <div key={label}>
              <p className="text-3xl font-extrabold text-orange-500">{value}</p>
              <p className="text-sm text-stone-500 mt-1">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-stone-900 mb-4">Alles was du brauchst</h2>
        <p className="text-center text-stone-500 mb-14 text-lg">Ein kompletter Kurs — direkt im Browser.</p>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              icon: BookOpen,
              color: 'bg-blue-100 text-blue-600',
              title: 'Strukturierter Lernpfad',
              desc: '5 Module von Aufsatzarten bis Stil — Schritt für Schritt aufgebaut, jedes mit Übungen.',
            },
            {
              icon: Brain,
              color: 'bg-orange-100 text-orange-600',
              title: 'KI-Coach mit echtem Feedback',
              desc: 'Lade deinen Aufsatz hoch. Die KI erklärt Fehler und du übst sie sofort — kein Ghostwriting.',
            },
            {
              icon: Dumbbell,
              color: 'bg-green-100 text-green-600',
              title: '5 Minuten täglich',
              desc: 'Daily Practice hält deinen Fortschritt aufrecht — wie Duolingo, aber für Aufsätze.',
            },
          ].map(({ icon: Icon, color, title, desc }) => (
            <div key={title} className="bg-white rounded-2xl p-7 border border-stone-100 shadow-sm hover:shadow-md transition-shadow">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-5 ${color}`}>
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-stone-900 mb-2 text-lg">{title}</h3>
              <p className="text-stone-500 text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Streak feature */}
      <section className="px-6 py-16 bg-orange-50">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="h-6 w-6 text-orange-500" />
              <span className="text-orange-600 font-semibold text-sm uppercase tracking-wide">Streak System</span>
            </div>
            <h2 className="text-3xl font-bold text-stone-900 mb-4">Bleib dran — täglich lernen macht den Unterschied</h2>
            <p className="text-stone-500 leading-relaxed">
              Jeder Tag den du übst baut deinen Streak auf. Sichtbarer Fortschritt motiviert mehr
              als jeder Vorsatz. Schon 5 Minuten täglich reichen.
            </p>
          </div>
          <div className="flex gap-2">
            {[7, 14, 21, 30].map((day, i) => (
              <div key={day} className={`flex flex-col items-center gap-1 p-3 rounded-2xl ${i < 3 ? 'bg-orange-500 text-white' : 'bg-white border border-stone-200 text-stone-400'}`}>
                <Flame className={`h-6 w-6 ${i < 3 ? 'text-white' : 'text-stone-300'}`} />
                <span className="text-xs font-bold">{day}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="px-6 py-20 max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold text-center text-stone-900 mb-4">Einfache Preise</h2>
        <p className="text-center text-stone-500 mb-12">Starte gratis — upgrade wenn du mehr willst.</p>
        <div className="grid md:grid-cols-2 gap-6">
          {/* Free */}
          <div className="bg-white border border-stone-200 rounded-3xl p-8">
            <h3 className="font-bold text-lg text-stone-900 mb-1">Gratis</h3>
            <p className="text-4xl font-extrabold text-stone-900 mb-1">0 <span className="text-xl font-normal text-stone-400">CHF</span></p>
            <p className="text-stone-400 text-sm mb-6">Für immer kostenlos</p>
            <ul className="space-y-3 text-sm text-stone-600 mb-8">
              {['Modul 1 komplett', '1 KI-Feedback pro Monat', 'Tägliche Übungen', 'Wortschatz-Trainer'].map(f => (
                <li key={f} className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/auth/register" className="block">
              <Button className="w-full rounded-xl" variant="outline">Kostenlos starten</Button>
            </Link>
          </div>

          {/* Premium */}
          <div className="bg-orange-500 rounded-3xl p-8 relative text-white shadow-xl shadow-orange-200">
            <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-xs font-bold px-4 py-1.5 rounded-full">EMPFOHLEN</span>
            <h3 className="font-bold text-lg mb-1">Premium</h3>
            <p className="text-4xl font-extrabold mb-1">9 <span className="text-xl font-normal text-orange-200">CHF / Monat</span></p>
            <p className="text-orange-200 text-sm mb-6">Alles inklusive</p>
            <ul className="space-y-3 text-sm mb-8">
              {['Alle 5 Module', 'Unbegrenzt KI-Feedback', 'Fortschrittsreport (PDF)', 'Wortschatz-Trainer', 'Neue Inhalte inklusive'].map(f => (
                <li key={f} className="flex items-center gap-3">
                  <CheckCircle className="h-4 w-4 text-white flex-shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
            <Link href="/auth/register" className="block">
              <Button className="w-full rounded-xl bg-white text-orange-600 hover:bg-orange-50 font-semibold">
                Jetzt upgraden
              </Button>
            </Link>
          </div>
        </div>
        <p className="text-center text-sm text-stone-400 mt-8">
          &quot;Wenn deine Note steigt, zahlt sich das Abo aus dem ersten besseren Zeugnis zurück.&quot;
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-100 py-8 text-center text-stone-400 text-sm">
        <p>© 2025 AufsatzMeister · Für Schülerinnen und Schüler in der DACH-Region</p>
      </footer>
    </div>
  )
}
