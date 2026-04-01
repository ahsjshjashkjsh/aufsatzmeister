'use client'
import { useState } from 'react'
import { Exercise } from '@/types'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { CheckCircle, XCircle } from 'lucide-react'

type Props = {
  exercise: Exercise
  onComplete: (correct: boolean) => void
}

export function MiniExercise({ exercise, onComplete }: Props) {
  const [answer, setAnswer] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const isCorrect = answer.trim().toLowerCase() === exercise.correct_answer.toLowerCase()

  function handleSubmit() {
    setSubmitted(true)
    setTimeout(() => onComplete(isCorrect), 1500)
  }

  return (
    <div className="bg-blue-50 rounded-lg p-4 mt-3">
      <p className="font-medium text-sm mb-3">{exercise.question}</p>
      <Input
        value={answer}
        onChange={e => setAnswer(e.target.value)}
        disabled={submitted}
        placeholder="Deine Antwort..."
        className="mb-2"
        onKeyDown={e => e.key === 'Enter' && !submitted && answer.trim() && handleSubmit()}
      />
      {!submitted && (
        <Button size="sm" onClick={handleSubmit} disabled={!answer.trim()}>Prüfen</Button>
      )}
      {submitted && (
        <div className={`flex items-center gap-2 text-sm mt-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
          {isCorrect ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
          {isCorrect ? 'Richtig!' : `Richtig wäre: "${exercise.correct_answer}"`}
        </div>
      )}
      <p className="text-xs text-zinc-500 mt-2">Hinweis: {exercise.hint}</p>
    </div>
  )
}
