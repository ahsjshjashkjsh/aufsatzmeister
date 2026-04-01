// src/types/index.ts

export type UserProfile = {
  id: string
  email: string
  is_premium: boolean
  stripe_customer_id: string | null
  created_at: string
}

export type ModuleProgress = {
  id: string
  user_id: string
  module_id: string
  completed: boolean
  quiz_score: number | null
  completed_at: string | null
}

export type EssayAnalysis = {
  id: string
  user_id: string
  original_text: string
  feedback: FeedbackItem[]
  created_at: string
}

export type FeedbackItem = {
  type: 'grammar' | 'structure' | 'vocabulary' | 'style'
  original: string
  explanation: string
  rule: string
  exercises: Exercise[]
  better_words: BetterWord[]
}

export type Exercise = {
  id: string
  question: string
  correct_answer: string
  hint: string
}

export type BetterWord = {
  original: string
  alternatives: string[]
}

export type LernModul = {
  id: string
  title: string
  description: string
  isPremium: boolean
  sections: ModulSection[]
  quiz: QuizQuestion[]
}

export type ModulSection = {
  title: string
  content: string
  example: string
}

export type QuizQuestion = {
  id: string
  question: string
  options: string[]
  correct: number
  explanation: string
}

export type VocabWord = {
  id: string
  word: string
  definition: string
  example: string
  category: 'verb' | 'adjective' | 'connector' | 'noun'
  moduleId: string
}

export type UserStreak = {
  current: number
  longest: number
  last_practice_date: string | null
}

export type DailyExercise = {
  id: string
  type: 'comma' | 'word_choice' | 'improve_sentence' | 'vocabulary'
  question: string
  options?: string[]
  correct_answer: string
  explanation: string
}
