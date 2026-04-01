import { DailyExercise } from '@/types'

export const DAILY_EXERCISES: DailyExercise[] = [
  {
    id: 'e1',
    type: 'comma',
    question: 'Setze das Komma: "Ich lerne täglich weil ich die Prüfung bestehen möchte."',
    correct_answer: 'Ich lerne täglich, weil ich die Prüfung bestehen möchte.',
    explanation: 'Vor "weil" steht immer ein Komma, da es einen Nebensatz einleitet.',
  },
  {
    id: 'e2',
    type: 'word_choice',
    question: 'Welches Wort passt besser in einen formellen Aufsatz?',
    options: ['gut', 'hervorragend', 'super', 'toll'],
    correct_answer: 'hervorragend',
    explanation: '"Hervorragend" ist präzise und formal. "Super" und "toll" sind umgangssprachlich.',
  },
  {
    id: 'e3',
    type: 'improve_sentence',
    question: 'Verbessere diesen Satz: "Das ist gut und zeigt dass es klappt."',
    correct_answer: 'Dies ist überzeugend und belegt, dass die Methode wirksam ist.',
    explanation: 'Starke Verben (belegen statt zeigen) und präzise Adjektive (überzeugend statt gut) verbessern den Ausdruck.',
  },
  {
    id: 'e4',
    type: 'comma',
    question: 'Wo fehlt das Komma? "Er las das Buch obwohl er müde war."',
    options: [
      'Er las das Buch, obwohl er müde war.',
      'Er las, das Buch obwohl er müde war.',
      'Er las das Buch obwohl, er müde war.',
      'Kein Komma nötig',
    ],
    correct_answer: 'Er las das Buch, obwohl er müde war.',
    explanation: 'Vor "obwohl" steht immer ein Komma — es leitet einen Nebensatz ein.',
  },
  {
    id: 'e5',
    type: 'word_choice',
    question: 'Ersetze "sagen" durch ein stärkeres Verb: "Der Autor ___ seine Meinung."',
    options: ['sagt', 'erläutert', 'macht', 'findet'],
    correct_answer: 'erläutert',
    explanation: '"Erläutern" ist präziser als "sagen" — es bedeutet ausführlich und klar erklären.',
  },
]

export function getTodaysExercises(): DailyExercise[] {
  const today = new Date().toDateString()
  const seed = today.split('').reduce((a, c) => a + c.charCodeAt(0), 0)
  const shuffled = [...DAILY_EXERCISES].sort((a, b) => {
    const hashA = (seed * a.id.charCodeAt(0)) % 100
    const hashB = (seed * b.id.charCodeAt(0)) % 100
    return hashA - hashB
  })
  return shuffled.slice(0, 3)
}
