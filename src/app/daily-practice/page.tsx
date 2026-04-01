'use client'
import { useState } from 'react'
import { Nav } from '@/components/Nav'
import { getTodaysExercises } from '@/data/daily-exercises'
import { DailyExercise } from '@/types'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { CheckCircle, XCircle, Flame } from 'lucide-react'

export default function DailyPracticePage() {
  const [exercises] = useState<DailyExercise[]>(getTodaysExercises())
  const [index, setIndex] = useState(0)
  const [selected, setSelected] = useState<string | null>(null)
  const [submitted, setSubmitted] = useState(false)
  const [correct, setCorrect] = useState(0)
  const [done, setDone] = useState(false)
  const supabase = createClient()

  const exercise = exercises[index]
  const progress = (index / exercises.length) * 100
  const isCorrect = selected?.trim().toLowerCase() === exercise?.correct_answer.toLowerCase()

  function handleSubmit() {
    setSubmitted(true)
    if (isCorrect) setCorrect(c => c + 1)
  }

  async function handleNext() {
    if (index < exercises.length - 1) {
      setIndex(i => i + 1)
      setSelected(null)
      setSubmitted(false)
    } else {
      setDone(true)
      await updateStreak()
    }
  }

  async function updateStreak() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const today = new Date().toISOString().slice(0, 10)
    const { data: streak } = await supabase
      .from('practice_streaks')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const newStreak = streak?.last_practice_date === yesterday ? (streak.current_streak + 1) : 1
    const longest = Math.max(newStreak, streak?.longest_streak ?? 0)

    await supabase.from('practice_streaks').upsert({
      user_id: user.id,
      current_streak: newStreak,
      longest_streak: longest,
      last_practice_date: today,
    })
  }

  if (done) {
    return (
      <div className="flex min-h-screen">
        <Nav />
        <main className="flex-1 p-6 pb-20 md:pb-6 flex items-center justify-center">
          <div className="text-center max-w-sm">
            <Flame className="h-16 w-16 text-orange-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Tagesübung abgeschlossen!</h2>
            <p className="text-zinc-600 mb-2">{correct}/{exercises.length} Aufgaben richtig</p>
            <p className="text-zinc-500 text-sm mb-6">Dein Streak wurde aktualisiert. Komm morgen wieder!</p>
            <Button onClick={() => window.location.href = '/dashboard'}>Zurück zum Dashboard</Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Nav />
      <main className="flex-1 p-6 pb-20 md:pb-6 max-w-lg">
        <h1 className="text-2xl font-bold mb-2">Tagesübung</h1>
        <p className="text-zinc-500 mb-6">Aufgabe {index + 1} von {exercises.length}</p>
        <Progress value={progress} className="mb-8" />

        <h2 className="text-lg font-semibold mb-6">{exercise.question}</h2>

        {exercise.options ? (
          <div className="space-y-3 mb-6">
            {exercise.options.map(opt => (
              <button
                key={opt}
                onClick={() => !submitted && setSelected(opt)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                  submitted
                    ? opt === exercise.correct_answer ? 'bg-green-50 border-green-500'
                    : opt === selected ? 'bg-red-50 border-red-400'
                    : 'border-zinc-200 text-zinc-400'
                    : selected === opt ? 'border-zinc-900 bg-zinc-50' : 'border-zinc-200 hover:bg-zinc-50'
                }`}
              >
                {opt}
              </button>
            ))}
          </div>
        ) : (
          <textarea
            value={selected ?? ''}
            onChange={e => !submitted && setSelected(e.target.value)}
            className="w-full border rounded-lg p-3 min-h-24 mb-4 focus:outline-none focus:ring-2 focus:ring-zinc-900"
            placeholder="Deine Antwort..."
          />
        )}

        {submitted && (
          <div className={`flex items-start gap-2 p-4 rounded-lg mb-4 ${isCorrect ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'}`}>
            {isCorrect ? <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" /> : <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />}
            <div>
              <p className="font-medium">{isCorrect ? 'Richtig!' : 'Nicht ganz.'}</p>
              <p className="text-sm mt-1">{exercise.explanation}</p>
              {!isCorrect && <p className="text-sm mt-1">Richtig: <strong>{exercise.correct_answer}</strong></p>}
            </div>
          </div>
        )}

        {!submitted ? (
          <Button onClick={handleSubmit} disabled={!selected} className="w-full">Antwort prüfen</Button>
        ) : (
          <Button onClick={handleNext} className="w-full">
            {index < exercises.length - 1 ? 'Weiter' : 'Abschliessen'}
          </Button>
        )}
      </main>
    </div>
  )
}
