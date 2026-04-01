'use client'
import { useState } from 'react'
import { LernModul as LernModulType } from '@/types'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ChevronRight } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

type Props = {
  modul: LernModulType
  onComplete: (quizScore: number) => void
}

export function LernModul({ modul, onComplete }: Props) {
  const [step, setStep] = useState<'content' | 'quiz'>('content')
  const [sectionIndex, setSectionIndex] = useState(0)
  const [quizIndex, setQuizIndex] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [correct, setCorrect] = useState(0)
  const [showExplanation, setShowExplanation] = useState(false)

  const section = modul.sections[sectionIndex]
  const question = modul.quiz[quizIndex]
  const progress = step === 'content'
    ? (sectionIndex / modul.sections.length) * 50
    : 50 + ((quizIndex / modul.quiz.length) * 50)

  function nextSection() {
    if (sectionIndex < modul.sections.length - 1) {
      setSectionIndex(s => s + 1)
    } else {
      setStep('quiz')
    }
  }

  function handleAnswer(idx: number) {
    if (selected !== null) return
    setSelected(idx)
    setShowExplanation(true)
    if (idx === question.correct) setCorrect(c => c + 1)
  }

  function nextQuestion() {
    setSelected(null)
    setShowExplanation(false)
    if (quizIndex < modul.quiz.length - 1) {
      setQuizIndex(q => q + 1)
    } else {
      onComplete(Math.round((correct / modul.quiz.length) * 100))
    }
  }

  return (
    <div className="max-w-2xl">
      <Progress value={progress} className="mb-6" />

      {step === 'content' ? (
        <div>
          <p className="text-sm text-zinc-500 mb-1">Abschnitt {sectionIndex + 1} von {modul.sections.length}</p>
          <h2 className="text-xl font-bold mb-4">{section.title}</h2>
          <div className="prose prose-zinc max-w-none mb-4">
            <ReactMarkdown>{section.content}</ReactMarkdown>
          </div>
          <div className="bg-zinc-50 rounded-lg p-4 mb-6">
            <p className="text-xs font-semibold text-zinc-500 uppercase mb-2">Beispiel</p>
            <div className="prose prose-zinc max-w-none text-sm">
              <ReactMarkdown>{section.example}</ReactMarkdown>
            </div>
          </div>
          <Button onClick={nextSection}>
            {sectionIndex < modul.sections.length - 1 ? 'Weiter' : 'Zum Quiz'} <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div>
          <p className="text-sm text-zinc-500 mb-1">Frage {quizIndex + 1} von {modul.quiz.length}</p>
          <h2 className="text-lg font-semibold mb-6">{question.question}</h2>
          <div className="space-y-3 mb-4">
            {question.options.map((option, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                className={`w-full text-left px-4 py-3 rounded-lg border transition-colors ${
                  selected === null ? 'hover:bg-zinc-50 border-zinc-200' :
                  idx === question.correct ? 'bg-green-50 border-green-500 text-green-800' :
                  idx === selected ? 'bg-red-50 border-red-500 text-red-800' :
                  'border-zinc-200 text-zinc-400'
                }`}
              >
                {option}
              </button>
            ))}
          </div>
          {showExplanation && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-sm text-blue-800">{question.explanation}</p>
            </div>
          )}
          {selected !== null && (
            <Button onClick={nextQuestion}>
              {quizIndex < modul.quiz.length - 1 ? 'Nächste Frage' : 'Modul abschliessen'} <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
