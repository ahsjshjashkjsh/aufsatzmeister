'use client'
import { use, useState } from 'react'
import { createClient } from '@/lib/supabase-client'
import { Nav } from '@/components/Nav'
import { LernModul } from '@/components/LernModul'
import { getModule } from '@/data/modules'
import { notFound, useRouter } from 'next/navigation'
import { CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'

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
    <div className="flex min-h-screen">
      <Nav />
      <main className="flex-1 p-6 pb-20 md:pb-6">
        {completed ? (
          <div className="max-w-md mx-auto text-center py-16">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2">Modul abgeschlossen!</h2>
            <p className="text-zinc-600 mb-6">Quiz-Ergebnis: {score}%</p>
            <Button onClick={() => router.push('/lernpfad')}>Zurück zum Lernpfad</Button>
          </div>
        ) : (
          <div>
            <h1 className="text-2xl font-bold mb-6">{modul.title}</h1>
            <LernModul modul={modul} onComplete={handleComplete} />
          </div>
        )}
      </main>
    </div>
  )
}
