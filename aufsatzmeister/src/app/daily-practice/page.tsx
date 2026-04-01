'use client'
import { useState } from 'react'
import { Nav } from '@/components/Nav'
import { getTodaysExercises } from '@/data/daily-exercises'
import { DailyExercise } from '@/types'
import { createClient } from '@/lib/supabase-client'
import { Button } from '@/components/ui/button'
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

  function handleSubmit() { setSubmitted(true); if (isCorrect) setCorrect(c => c + 1) }

  async function handleNext() {
    if (index < exercises.length - 1) {
      setIndex(i => i + 1); setSelected(null); setSubmitted(false)
    } else {
      setDone(true); await updateStreak()
    }
  }

  async function updateStreak() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    const today = new Date().toISOString().slice(0, 10)
    const { data: streak } = await supabase.from('practice_streaks').select('*').eq('user_id', user.id).single()
    const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10)
    const newStreak = streak?.last_practice_date === yesterday ? (streak.current_streak + 1) : 1
    const longest = Math.max(newStreak, streak?.longest_streak ?? 0)
    await supabase.from('practice_streaks').upsert({ user_id: user.id, current_streak: newStreak, longest_streak: longest, last_practice_date: today })
  }

  if (done) {
    return (
      <div className="min-h-screen bg-[#FFFBF5]">
        <Nav />
        <main className="pt-20 pb-28 md:pb-12 px-4 md:px-6 flex items-center justify-center min-h-[80vh]">
          <div className="text-center max-w-sm">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Flame className="h-12 w-12 text-orange-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900 mb-2">Geschafft!</h2>
            <p className="text-stone-500 mb-1">{correct} von {exercises.length} richtig</p>
            <p className="text-2xl font-bold text-orange-500 mb-2">{Math.round((correct / exercises.length) * 100)}%</p>
            <p className="text-stone-400 text-sm mb-8">Dein Streak wurde aktualisiert. Komm morgen wieder!</p>
            <Button onClick={() => window.location.href = '/dashboard'} className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-8">
              Zurück zum Dashboard
            </Button>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <Nav />

      <main className="pt-20 pb-28 md:pb-12 px-4 md:px-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-extrabold text-stone-900">Tagesübung</h1>
            <p className="text-stone-400 text-sm">Frage {index + 1} von {exercises.length}</p>
          </div>
          <div className="flex items-center gap-1.5 bg-orange-50 text-orange-600 px-3 py-1.5 rounded-xl text-sm font-semibold">
            <Flame className="h-4 w-4" /> Streak
          </div>
        </div>

        <div className="w-full bg-stone-100 rounded-full h-2 mb-8">
          <div className="bg-orange-500 h-2 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
        </div>

        <div className="bg-white rounded-2xl p-6 border border-stone-100 shadow-sm mb-5">
          <p className="text-stone-900 font-semibold text-lg leading-relaxed">{exercise.question}</p>
        </div>

        {exercise.options ? (
          <div className="space-y-3 mb-5">
            {exercise.options.map(opt => {
              let cls = 'w-full text-left px-5 py-4 rounded-2xl border-2 transition-all font-medium text-sm'
              if (!submitted) {
                cls += selected === opt ? ' border-orange-500 bg-orange-50 text-orange-700' : ' border-stone-200 bg-white text-stone-700 hover:border-orange-300 hover:bg-orange-50/50'
              } else {
                if (opt === exercise.correct_answer) cls += ' border-green-500 bg-green-50 text-green-800'
                else if (opt === selected) cls += ' border-red-400 bg-red-50 text-red-700'
                else cls += ' border-stone-100 bg-stone-50 text-stone-400'
              }
              return <button key={opt} onClick={() => !submitted && setSelected(opt)} className={cls}>{opt}</button>
            })}
          </div>
        ) : (
          <textarea
            value={selected ?? ''}
            onChange={e => !submitted && setSelected(e.target.value)}
            className="w-full border-2 border-stone-200 rounded-2xl p-4 min-h-28 mb-5 focus:outline-none focus:border-orange-400 bg-white text-stone-800 resize-none"
            placeholder="Deine Antwort..."
          />
        )}

        {submitted && (
          <div className={`flex items-start gap-3 p-4 rounded-2xl mb-5 ${isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
            {isCorrect ? <CheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" /> : <XCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />}
            <div>
              <p className={`font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>{isCorrect ? 'Richtig!' : 'Nicht ganz.'}</p>
              <p className={`text-sm mt-1 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>{exercise.explanation}</p>
              {!isCorrect && <p className="text-sm mt-1 font-medium text-red-700">Richtige Antwort: {exercise.correct_answer}</p>}
            </div>
          </div>
        )}

        {!submitted ? (
          <Button onClick={handleSubmit} disabled={!selected} className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base disabled:opacity-40">
            Antwort prüfen
          </Button>
        ) : (
          <Button onClick={handleNext} className="w-full h-12 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold text-base">
            {index < exercises.length - 1 ? 'Weiter →' : 'Abschliessen'}
          </Button>
        )}
      </main>
    </div>
  )
}
