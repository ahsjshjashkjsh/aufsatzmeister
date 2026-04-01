'use client'
import { useState } from 'react'
import { FeedbackItem } from '@/types'
import { MiniExercise } from './MiniExercise'
import { Badge } from '@/components/ui/badge'
import { ChevronDown, ChevronUp } from 'lucide-react'

const typeLabels: Record<string, string> = {
  grammar: 'Grammatik',
  structure: 'Struktur',
  vocabulary: 'Wortschatz',
  style: 'Stil',
}

const typeColors: Record<string, string> = {
  grammar: 'bg-red-100 text-red-800',
  structure: 'bg-blue-100 text-blue-800',
  vocabulary: 'bg-purple-100 text-purple-800',
  style: 'bg-orange-100 text-orange-800',
}

type Props = { feedback: FeedbackItem[] }

export function KIFeedback({ feedback }: Props) {
  const [expanded, setExpanded] = useState<number | null>(0)
  const [exerciseIndex, setExerciseIndex] = useState<Record<number, number>>({})
  const [completed, setCompleted] = useState<Set<number>>(new Set())

  function handleExerciseComplete(feedbackIdx: number, correct: boolean) {
    const current = exerciseIndex[feedbackIdx] ?? 0
    const item = feedback[feedbackIdx]
    if (current < item.exercises.length - 1) {
      setExerciseIndex(prev => ({ ...prev, [feedbackIdx]: current + 1 }))
    } else {
      setCompleted(prev => new Set(prev).add(feedbackIdx))
    }
  }

  return (
    <div className="space-y-3">
      {feedback.map((item, idx) => {
        const isDone = completed.has(idx)
        const currentExercise = exerciseIndex[idx] ?? 0
        return (
          <div key={idx} className={`border rounded-xl overflow-hidden ${isDone ? 'border-green-300 bg-green-50' : 'border-zinc-200'}`}>
            <button
              className="w-full text-left px-4 py-3 flex items-center justify-between"
              onClick={() => setExpanded(expanded === idx ? null : idx)}
            >
              <div className="flex items-center gap-3">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${typeColors[item.type]}`}>
                  {typeLabels[item.type]}
                </span>
                <span className="text-sm font-medium line-clamp-1">"{item.original}"</span>
              </div>
              {expanded === idx ? <ChevronUp className="h-4 w-4 text-zinc-400" /> : <ChevronDown className="h-4 w-4 text-zinc-400" />}
            </button>

            {expanded === idx && (
              <div className="px-4 pb-4 border-t border-zinc-100">
                <div className="py-3">
                  <p className="text-sm text-zinc-700 mb-2">{item.explanation}</p>
                  <div className="bg-zinc-100 rounded px-3 py-2 text-xs font-medium text-zinc-600">
                    Regel: {item.rule}
                  </div>
                </div>

                {item.better_words.length > 0 && (
                  <div className="mb-3">
                    <p className="text-xs font-semibold text-zinc-500 mb-2">Stärkere Alternativen:</p>
                    {item.better_words.map((bw, bwIdx) => (
                      <div key={bwIdx} className="flex flex-wrap gap-2 items-center">
                        <span className="text-sm line-through text-zinc-400">{bw.original}</span>
                        <span className="text-zinc-400">→</span>
                        {bw.alternatives.map(alt => (
                          <Badge key={alt} variant="secondary">{alt}</Badge>
                        ))}
                      </div>
                    ))}
                  </div>
                )}

                {!isDone && item.exercises.length > 0 && (
                  <div>
                    <p className="text-xs font-semibold text-zinc-500 mb-1">
                      Übung {currentExercise + 1} von {item.exercises.length}:
                    </p>
                    <MiniExercise
                      exercise={item.exercises[currentExercise]}
                      onComplete={(correct) => handleExerciseComplete(idx, correct)}
                    />
                  </div>
                )}
                {isDone && (
                  <p className="text-sm text-green-600 font-medium mt-2">Alle Übungen abgeschlossen!</p>
                )}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}
