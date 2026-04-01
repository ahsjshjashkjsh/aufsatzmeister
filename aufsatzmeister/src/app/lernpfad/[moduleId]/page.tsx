'use client'
import { use, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Nav } from '@/components/Nav'
import { LernModul } from '@/components/LernModul'
import { getModule } from '@/data/modules'
import { notFound, useRouter } from 'next/navigation'
import { CheckCircle, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

type Props = { params: Promise<{ moduleId: string }> }

export default function ModulePage({ params }: Props) {
  const { moduleId } = use(params)
  const modul = getModule(moduleId)
  if (!modul) notFound()

  const [completed, setCompleted] = useState(false)
  const [score, setScore] = useState(0)
  const router = useRouter()
  const supabase = createClient()

  async function handleComplete(quizScore: number) {
    setScore(quizScore)
    setCompleted(true)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
    await supabase.from('module_progress').upsert({
      user_id: user.id,
      module_id: moduleId,
      completed: true,
      quiz_score: quizScore,
      completed_at: new Date().toISOString(),
    })
  }

  return (
    <div className="min-h-screen bg-[#FFFBF5]">
      <Nav />

      <main className="pt-20 pb-28 md:pb-12 px-4 md:px-6 max-w-2xl mx-auto">
        {completed ? (
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="h-12 w-12 text-green-500" />
            </div>
            <h2 className="text-3xl font-extrabold text-stone-900 mb-2">Modul abgeschlossen!</h2>
            <p className="text-stone-500 mb-2">Quiz-Ergebnis</p>
            <p className="text-4xl font-extrabold text-orange-500 mb-8">{score}%</p>
            <Button onClick={() => router.push('/lernpfad')} className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-8">
              Zurück zum Lernpfad
            </Button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-3 mb-6">
              <Link href="/lernpfad">
                <button className="w-9 h-9 bg-white rounded-xl border border-stone-200 flex items-center justify-center hover:bg-stone-50 transition-colors">
                  <ArrowLeft className="h-4 w-4 text-stone-500" />
                </button>
              </Link>
              <h1 className="text-xl font-extrabold text-stone-900">{modul.title}</h1>
            </div>
            <LernModul modul={modul} onComplete={handleComplete} />
          </div>
        )}
      </main>
    </div>
  )
}
