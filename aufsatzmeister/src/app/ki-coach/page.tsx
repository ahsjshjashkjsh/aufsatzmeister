'use client'
import { useState } from 'react'
import { Nav } from '@/components/Nav'
import { KIFeedback } from '@/components/KIFeedback'
import { FeedbackItem } from '@/types'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Brain, Loader2 } from 'lucide-react'
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
    <div className="flex min-h-screen">
      <Nav />
      <main className="flex-1 p-6 pb-20 md:pb-6 max-w-2xl">
        <div className="flex items-center gap-3 mb-2">
          <Brain className="h-6 w-6" />
          <h1 className="text-2xl font-bold">KI-Coach</h1>
        </div>
        <p className="text-zinc-500 mb-8">Füge deinen Aufsatz ein und erhalte lehrreiches Feedback mit Übungen.</p>

        {!feedback ? (
          <div>
            <Textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="Füge hier deinen Aufsatz ein (mindestens 50 Zeichen)..."
              className="min-h-48 mb-4"
            />
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-400">{text.length} Zeichen</span>
              <Button onClick={analyzeEssay} disabled={loading || text.length < 50}>
                {loading ? (
                  <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Analysiere...</>
                ) : (
                  <><Brain className="mr-2 h-4 w-4" /> Aufsatz analysieren</>
                )}
              </Button>
            </div>
            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700 text-sm">{error}</p>
                {error.includes('Limit') && (
                  <Link href="/settings" className="text-red-700 underline text-sm font-medium block mt-1">
                    Jetzt upgraden →
                  </Link>
                )}
              </div>
            )}
          </div>
        ) : (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">Dein Feedback ({feedback.length} Punkte)</h2>
              <Button variant="outline" size="sm" onClick={() => setFeedback(null)}>
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
