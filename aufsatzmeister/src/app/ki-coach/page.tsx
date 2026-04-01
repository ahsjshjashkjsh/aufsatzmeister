'use client'
import { useState } from 'react'
import { Nav } from '@/components/Nav'
import { KIFeedback } from '@/components/KIFeedback'
import { FeedbackItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Brain, Loader2, RotateCcw, Sparkles } from 'lucide-react'
import Link from 'next/link'

export default function KICoachPage() {
  const [text, setText] = useState('')
  const [feedback, setFeedback] = useState<FeedbackItem[] | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function analyzeEssay() {
    if (text.length < 50) {
      setError('Bitte schreibe mindestens 50 Zeichen.')
      return
    }
    setLoading(true)
    setError('')
    setFeedback(null)

    const res = await fetch('/api/analyze-essay', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text }),
    })
    const data = await res.json()

    if (res.status === 403 && data.error === 'LIMIT_REACHED') {
      setError('Du hast dein monatliches Feedback-Limit erreicht. Upgrade auf Premium für unbegrenzte Analysen.')
      setLoading(false)
      return
    }
    if (!res.ok) {
      setError(data.error || 'Analyse fehlgeschlagen.')
      setLoading(false)
      return
    }

    setFeedback(data.feedback)
    setLoading(false)
  }

  return (
    <div className="flex min-h-screen bg-[#FFFBF5]">
      <Nav />
      <main className="flex-1 p-6 pb-24 md:pb-8 max-w-2xl">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center">
              <Brain className="h-5 w-5 text-orange-600" />
            </div>
            <h1 className="text-2xl font-extrabold text-stone-900">KI-Coach</h1>
          </div>
          <p className="text-stone-500 ml-[52px]">Füge deinen Aufsatz ein und erhalte lehrreiches Feedback.</p>
        </div>

        {!feedback ? (
          <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-stone-50">
              <Textarea
                value={text}
                onChange={e => setText(e.target.value)}
                placeholder="Füge hier deinen Aufsatz ein (mindestens 50 Zeichen)..."
                className="min-h-56 resize-none border-0 shadow-none focus-visible:ring-0 p-0 text-stone-800 placeholder:text-stone-300 text-base"
              />
            </div>
            <div className="px-5 py-4 flex items-center justify-between bg-stone-50">
              <span className="text-sm text-stone-400">
                {text.length} Zeichen
                {text.length > 0 && text.length < 50 && (
                  <span className="text-orange-500 ml-1">· noch {50 - text.length} nötig</span>
                )}
              </span>
              <Button
                onClick={analyzeEssay}
                disabled={loading || text.length < 50}
                className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl"
              >
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analysiere...</>
                ) : (
                  <><Sparkles className="mr-2 h-4 w-4" /> Aufsatz analysieren</>
                )}
              </Button>
            </div>

            {error && (
              <div className="mx-5 mb-5 mt-1 p-4 bg-red-50 border border-red-100 rounded-xl">
                <p className="text-red-700 text-sm">{error}</p>
                {error.includes('Limit') && (
                  <Link href="/settings" className="text-red-600 underline text-sm font-semibold block mt-2">
                    Jetzt auf Premium upgraden →
                  </Link>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-5">
              <div>
                <h2 className="font-bold text-stone-900">Dein Feedback</h2>
                <p className="text-sm text-stone-400">{feedback.length} Verbesserungspunkte</p>
              </div>
              <Button variant="outline" size="sm" onClick={() => setFeedback(null)} className="rounded-xl gap-2">
                <RotateCcw className="h-4 w-4" />
                Neuer Aufsatz
              </Button>
            </div>
            <KIFeedback feedback={feedback} />
          </div>
        )}
      </main>
    </div>
  )
}
